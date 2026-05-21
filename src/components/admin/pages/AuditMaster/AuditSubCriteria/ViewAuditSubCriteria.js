import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AuditSubCriteriaService from '../../../../../service/AdminService/AuditSubCriteriaService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewAuditSubCriteriaDetails from './ViewAuditSubCriteriaDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';

const ViewAuditSubCriteria = () => {
    const [allAuditSubCriteriaList, setAllAuditSubCriteriaList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllAuditSubCriteria = () => {
        setLoading(true);

        AuditSubCriteriaService.getAllAuditSubCriteriaList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllAuditSubCriteriaList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching audit sub criteria list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllAuditSubCriteria();
    }, []);

    const changeAuditSubCriteriaStatus = (id) => {
        setLoading(true);
        AuditSubCriteriaService.changeAuditSubCriteriaStatus(id)
            .then((response) => {
                getAllAuditSubCriteria(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing audit sub criteria status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewAuditSubCriteria = (cid) => {
        const auditcriteria = allAuditSubCriteriaList.find((obj) => obj.id === cid);
        if (auditcriteria) {
            showAlert({
                messageTitle: 'View Audit Sub Criteria',
                messageContent: <ViewAuditSubCriteriaDetails auditCriteriaObj={auditcriteria} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Audit Sub Criteria',
                messageContent: 'Error in getting audit sub criteria details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editAuditSubCriteria = (cid) => {
        const auditcriteria = allAuditSubCriteriaList.find((obj) => obj.id === cid);
        if (auditcriteria) {
            const encryptedId = encodeURIComponent(encrypt(auditcriteria.auditSubCriteriaId));
            navigate(`/admin/subaudit/editsubcriteria/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Audit Sub Criteria',
                messageContent: 'Error in updating audit sub criteria details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const deleteAuditSubCriteriaById = (id) => {
        setLoading(true);
        AuditSubCriteriaService.deleteAuditSubCriteria(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Audit Sub Criteria',
                    messageContent: 'Audit Sub Criteria has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllAuditSubCriteria(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Audit Sub Criteria',
                    messageContent: 'Error in deleting audit sub criteria.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteAuditSubCriteria = (cid) => {
        const auditcriteria = allAuditSubCriteriaList.find((obj) => obj.id === cid);
        if (auditcriteria) {
            showAlert({
                messageTitle: 'Delete Audit Sub Criteria',
                messageContent: 'Are you sure, you want to delete?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => deleteAuditSubCriteriaById(auditcriteria.auditSubCriteriaId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
            });
        } else {
            showAlert({
                messageTitle: 'Delete Audit Sub Criteria',
                messageContent: 'Error in deleting audit sub criteria, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'auditSubCriteriaTitle', headerName: 'Audit Sub Criteria', resizable: false, width: 200 },
            { field: 'auditCriteriaId', headerName: 'Audit Criteria', resizable: false, width: 200,
                valueGetter: (params) =>{
                    return params.auditCriteriaTitle;
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
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeAuditSubCriteriaStatus(params.row.auditSubCriteriaId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewAuditSubCriteria(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editAuditSubCriteria(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [allAuditSubCriteriaList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allAuditSubCriteriaList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewAuditSubCriteria;
