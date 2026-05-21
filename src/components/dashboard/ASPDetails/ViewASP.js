import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DashboardService from '../../../service/DashboardService/DashboardService';
import showAlert from '../../global/common/MessageBox/AlertService';
import dateFormatter from '../../global/util/DateFormatter';
import CustomTable from '../../global/util/CustomTable';
import ViewASPDetails from './ViewASPDetails';
import { useNavigate } from 'react-router-dom';
import { decrypt, encrypt } from '../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';
import { timeStampToDate } from '../../global/util/TimestampConverter';
import CountryService from '../../../service/AdminService/CountryService';
import StateService from '../../../service/AdminService/StateService';

const ViewASP = () => {
    const [aspList, setASPList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);


    const getAllASP = async () => {
        setLoading(true);

            try{

                const [aspResponse, countries, states] = await Promise.all([

                    DashboardService.getAllASP(),
                    CountryService.getAllCountryList(),
                    StateService.getAllStateList()


                ]);

                    setCountryList(countries.data);
                    setStateList(states.data);


                const list = aspResponse.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['onBoardingDate'] = timeStampToDate(obj.onBoardingDate)
                    obj['exitDate'] = obj.exitDate? timeStampToDate(obj.exitDate) : '-'
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                   
                    const decryptedCountryId = parseInt(decrypt(obj.countryId), 10);
                    const decryptedStateId = parseInt(decrypt(obj.stateId), 10);

                    const country = countries.data.find((e) => e.countryId === decryptedCountryId);
                    const state = states.data.find((e) => e.stateId === decryptedStateId);

                    obj['countryId'] = country ? country.countryName : '-'; 
                    obj['stateId'] = state ? state.stateName : '-'; 



                    return obj;
                });
                setASPList(list);



            }catch(err){

                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching Application Service Provider list. Please try again later.',
                    confirmText: 'OK',
                });

            }finally {
                setLoading(false)
            }

        

    };

    useEffect(() => {
        getAllASP();
       
    }, []);

    const viewASP = (cid) => {
        const obj = aspList.find((obj) => obj.id === cid);
        if (obj) {
            showAlert({
                messageTitle: 'View Application Service Provider',
                messageContent: <ViewASPDetails aspObj={obj} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Application Service Provider',
                messageContent: 'Error in getting Application Service Provider details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editASP = (cid) => {
        const obj = aspList.find((obj) => obj.id === cid);
        if (obj) {
            const encryptedId = encodeURIComponent(encrypt(obj.aspId));
            navigate(`${rolePath}/asplist/editasp/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Application Service Provider',
                messageContent: 'Error in updating Application Service Provider details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    
    

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'aspName', headerName: 'ASP Name', resizable: false, width: 200 },
            { field: 'emailId', headerName: 'Email Id', resizable: false, width: 150 },
            { field: 'countryId', headerName: 'Country Name', resizable: false, width: 150 },
            { field: 'stateId', headerName: 'State Name', resizable: false, width: 150 },
            { field: 'onBoardingDate', headerName: 'Onboarding Date', resizable: false, width: 150 },
            { field: 'exitDate', headerName: 'Exit Date', resizable: false, width: 150 },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                flex: 1,
                minWidth: 100,
                sortable: false,
                renderCell: (params) => (
                    <>
                        <Tooltip title="View">
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewASP(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editASP(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [aspList] 
    );

    return (
        <>
            <CustomTable customTitle = "Application Service Provider List" columns={columns} rows={aspList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewASP;
