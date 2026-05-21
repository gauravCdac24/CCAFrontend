import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AuditParameterService from '../../../../../service/AdminService/AuditParameterService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewAuditParameterDetails from './ViewAuditParameterDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';

const ViewAuditParameter = () => {
    const [allAuditParameterList, setAllAuditParameterList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllAuditParameter = () => {
        setLoading(true);

        AuditParameterService.getAllAuditParameterList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllAuditParameterList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching audit parameter list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllAuditParameter();
    }, []);

    const changeAuditParameterStatus = (id) => {
        setLoading(true);
        AuditParameterService.changeAuditParameterStatus(id)
            .then((response) => {
                getAllAuditParameter(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing audit parameter status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewAuditParameter = (cid) => {
        const auditParameterObj = allAuditParameterList.find((obj) => obj.id === cid);
        if (auditParameterObj) {
            showAlert({
                messageTitle: 'View Audit Parameter',
                messageContent: <ViewAuditParameterDetails auditParameterObj={auditParameterObj} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Audit Parameter',
                messageContent: 'Error in getting audit parameter details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editAuditParameter = (cid) => {
        const auditParameterObj = allAuditParameterList.find((obj) => obj.id === cid);
        if (auditParameterObj) {
            const encryptedId = encodeURIComponent(encrypt(auditParameterObj.auditParameterId));
            navigate(`/admin/parameter/editparameter/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Audit Parameter',
                messageContent: 'Error in updating audit parameter details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const deleteAuditParameterById = (id) => {
        setLoading(true);
        AuditParameterService.deleteAuditParameter(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Audit Parameter',
                    messageContent: 'Audit Parameter has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllAuditParameter(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Audit Parameter',
                    messageContent: 'Error in deleting parameter criteria.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteAuditParameter = (cid) => {
        const auditcriteria = allAuditParameterList.find((obj) => obj.id === cid);
        if (auditcriteria) {
            showAlert({
                messageTitle: 'Delete Audit Parameter',
                messageContent: 'Are you sure, you want to delete?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => deleteAuditParameterById(auditcriteria.auditParameterId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
            });
        } else {
            showAlert({
                messageTitle: 'Delete Audit Parameter',
                messageContent: 'Error in deleting audit parameter, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'auditParameterTitle', headerName: 'Audit Parameter', resizable: false, width: 200 },
            { field: 'auditSubCriteriaId', headerName: 'Audit Sub Criteria', resizable: false, width: 200,
                valueGetter: (params) =>{
                    return params.auditSubCriteriaTitle;
                }
             },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 150,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeAuditParameterStatus(params.row.auditParameterId)} />
                ),
            },
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewAuditParameter(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editAuditParameter(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [allAuditParameterList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allAuditParameterList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewAuditParameter;
