import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AuditCriteriaService from '../../../../../service/AdminService/AuditCriteriaService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewAuditCriteriaDetails from './ViewAuditCriteriaDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';

const ViewAuditCriteria = () => {
    const [allAuditCriteriaList, setAllAuditCriteriaList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllAuditCriteria = () => {
        setLoading(true);

        AuditCriteriaService.getAllAuditCriteriaList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllAuditCriteriaList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching audit criteria list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllAuditCriteria();
    }, []);

    const changeAuditCriteriaStatus = (id) => {
        setLoading(true);
        AuditCriteriaService.changeAuditCriteriaStatus(id)
            .then((response) => {
                getAllAuditCriteria(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing audit criteria status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewAuditCriteria = (cid) => {
        const auditcriteria = allAuditCriteriaList.find((obj) => obj.id === cid);
        if (auditcriteria) {
            showAlert({
                messageTitle: 'View Audit Criteria',
                messageContent: <ViewAuditCriteriaDetails auditCriteriaObj={auditcriteria} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Audit Criteria',
                messageContent: 'Error in getting audit criteria details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editAuditCriteria = (cid) => {
        const auditcriteria = allAuditCriteriaList.find((obj) => obj.id === cid);
        if (auditcriteria) {
            const encryptedId = encodeURIComponent(encrypt(auditcriteria.auditCriteriaId));
            navigate(`/admin/audit/editcriteria/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Audit Criteria',
                messageContent: 'Error in updating audit criteria details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const deleteAuditCriteriaById = (id) => {
        setLoading(true);
        AuditCriteriaService.deleteAuditCriteria(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Audit Criteria',
                    messageContent: 'Audit Criteria has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllAuditCriteria(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Audit Criteria',
                    messageContent: 'Error in deleting audit criteria.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteAuditCriteria = (cid) => {
        const auditcriteria = allAuditCriteriaList.find((obj) => obj.id === cid);
        if (auditcriteria) {
            showAlert({
                messageTitle: 'Delete Audit Criteria',
                messageContent: 'Are you sure, you want to delete?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => deleteAuditCriteriaById(auditcriteria.auditCriteriaId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
            });
        } else {
            showAlert({
                messageTitle: 'Delete Audit Criteria',
                messageContent: 'Error in deleting audit criteria, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'auditCriteriaTitle', headerName: 'Audit Criteria Title', resizable: false, width: 200 },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 150,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeAuditCriteriaStatus(params.row.auditCriteriaId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewAuditCriteria(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editAuditCriteria(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [allAuditCriteriaList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allAuditCriteriaList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewAuditCriteria;
