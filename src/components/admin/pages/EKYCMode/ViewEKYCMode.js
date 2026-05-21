import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EKYCModeService from '../../../../service/AdminService/EKYCModeService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import ViewEKYCModeDetails from './ViewEKYCModeDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';

const ViewEKYCMode = () => {
    const [ekycModeList, setEKYCModeList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const getAllEKYCMode = () => {
        setLoading(true);

        EKYCModeService.getAllEKYCMode()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setEKYCModeList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching EKYC Mode list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllEKYCMode();
    }, []);

    const changeEKYCModeStatus = (id) => {
        setLoading(true);
        EKYCModeService.changeEKYCModeStatus(id)
            .then((response) => {
                getAllEKYCMode(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing EKYC Mode status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewEKYCMode = (cid) => {
        const obj = ekycModeList.find((obj) => obj.id === cid);
        if (obj) {
            showAlert({
                messageTitle: 'View EKYC Mode',
                messageContent: <ViewEKYCModeDetails ekycModeObj={obj} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View EKYC Mode',
                messageContent: 'Error in getting EKYC Mode details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editEKYCMode = (cid) => {
        const obj = ekycModeList.find((obj) => obj.id === cid);
        if (obj) {
            const encryptedId = encodeURIComponent(encrypt(obj.ekycModeId));
            navigate(`${rolePath}/ekycmode/editekycmode/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit EKYC Mode',
                messageContent: 'Error in updating EKYC Mode details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    
    

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'ekycModeTitle', headerName: 'EKYC Mode', resizable: false, width: 150 },
            { field: 'isApprovalRequired', headerName: 'Approval Required', resizable: false, width: 150,
                renderCell: (params) => (
                    <>{params.row.isApprovalRequired?'Yes':'No'}</>
                ), },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 100,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeEKYCModeStatus(params.row.ekycModeId)} />
                ),
            },
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewEKYCMode(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editEKYCMode(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [ekycModeList] 
    );

    return (
        <>
            <CustomTable customTitle = "EKYC Modes" columns={columns} rows={ekycModeList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewEKYCMode;
