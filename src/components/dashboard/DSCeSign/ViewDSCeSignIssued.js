import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DashboardService from '../../../service/DashboardService/DashboardService';
import showAlert from '../../global/common/MessageBox/AlertService';
import CustomTable from '../../global/util/CustomTable';
import ViewDSCeSignIssuedDetails from './ViewDSCeSignIssuedDetails';
import { useNavigate } from 'react-router-dom';
import { decrypt, encrypt } from '../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';

const ViewDSCeSignIssued = () => {
    const [dsceSignIssued, setDSCeSignIssued] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    

    const getAllDSCeSignIssued = async () => {
        setLoading(true);

            try{

                const response = await DashboardService.viewAllDSCeSignIssued();
                

                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    
                    return obj;
                });

                setDSCeSignIssued(list);

            }catch(err){

                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching DSC & eSign issued list. Please try again later.',
                    confirmText: 'OK',
                });

            }finally {
                setLoading(false)
            }

        

    };

    useEffect(() => {
        getAllDSCeSignIssued();
       
    }, []);

    const viewDSCeSignIssued = (month, year) => {
        
        
        
            showAlert({
                messageTitle: `DSC & eSign Issued for ${month}, ${year}`,
                messageContent: <ViewDSCeSignIssuedDetails year={year} month={month}/>,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
       
    };

    const editDSCeSignIssued = (month, year) => {

            const d = month + "," + year;

            const encryptedId = encodeURIComponent(encrypt(d));
            navigate(`${rolePath}/dscesignissued/editdscesignissued/${encryptedId}`);
    };

    
    

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'totalDSCIssued', headerName: 'Total DSC Issued', resizable: false, width: 150 },
            { field: 'totalEsignIssued', headerName: 'Total eSign Issued', resizable: false, width: 150 },
            { field: 'month', headerName: 'Month', resizable: false, width: 150 },
            { field: 'year', headerName: 'Year', resizable: false, width: 150 },
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewDSCeSignIssued(params.row.month, params.row.year)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editDSCeSignIssued(params.row.month, params.row.year)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [dsceSignIssued] 
    );

    return (
        <>
            <CustomTable customTitle = "DSC & eSign Issued List" columns={columns} rows={dsceSignIssued} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewDSCeSignIssued;
