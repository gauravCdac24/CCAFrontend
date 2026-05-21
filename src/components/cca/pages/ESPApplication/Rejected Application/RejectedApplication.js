import { useEffect, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ESPApplicationService from '../../../../../service/ESPApplicationService/ESPApplicationService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { encrypt } from '../../../../global/util/EncryptDecrypt';

const RejectedApplication = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    const navigate = useNavigate();
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

    const getAllApplications = () => {
       
        ESPApplicationService.getEspApplicationRejected()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    
                    return obj;
                });
                setAllApplicationList(list);
            })
            .catch((err) => {
                
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching application list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            
    };

    
    
    const viewApplication = (id) => {

        const encryptedId = encodeURIComponent(encrypt(id));
        navigate(`${routeRootPath}/espappcrejected/viewcprevappdetails/${encryptedId}`);
    };
    

useEffect(() => {
    getAllApplications();
        
}, []);


    const columns =  [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'applicationNumber', headerName: 'Application Number', resizable: false, width: 200},
            { field: 'userName', headerName: 'Applicant Username', resizable: false, width: 200},
            { field: 'created', headerName: 'Application Start Date', resizable: false, width: 200},
            { field: 'applicationStatus', headerName: 'Application Status', resizable: false, width: 200},

            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                flex: 1,
                minWidth: 150,
                sortable: false,
                renderCell: (params) => (
                    <>
                        <Tooltip title="View">
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewApplication(params.row.esignLicenseeAppId)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ]
        
    

    return (
        <>
            <CustomTable columns={columns} rows={allApplicationList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default RejectedApplication;
