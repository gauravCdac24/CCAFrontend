import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AuditCheckService from '../../../../../service/AdminService/AuditCheckService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewAuditCheckDetails from './ViewAuditCheckDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import DOMPurify from 'dompurify';

const ViewAuditCheck = () => {
    const [allAuditCheckList, setAllAuditCheckList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllAuditCheck = () => {
        setLoading(true);

        AuditCheckService.getAllAuditCheckList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllAuditCheckList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching audit check list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllAuditCheck();
    }, []);

    const changeAuditCheckStatus = (id) => {
        setLoading(true);
        AuditCheckService.changeAuditCheckStatus(id)
            .then((response) => {
                getAllAuditCheck(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing audit check status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewAuditCheck = (cid) => {
        const auditCheck = allAuditCheckList.find((obj) => obj.id === cid);
        if (auditCheck) {
            showAlert({
                messageTitle: 'View Audit Check',
                messageContent: <ViewAuditCheckDetails auditCheckObj={auditCheck} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Audit Check',
                messageContent: 'Error in getting audit check details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editAuditCheck = (cid) => {
        const auditCheck = allAuditCheckList.find((obj) => obj.id === cid);
        if (auditCheck) {
            const encryptedId = encodeURIComponent(encrypt(auditCheck.auditCheckId));
            navigate(`/admin/check/editcheck/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Audit Check',
                messageContent: 'Error in updating audit check details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const deleteAuditCheckById = (id) => {
        setLoading(true);
        AuditCheckService.deleteAuditCheck(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Audit Check',
                    messageContent: 'Audit Check has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllAuditCheck(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Audit Check',
                    messageContent: 'Error in deleting check.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteAuditCheck = (cid) => {
        const auditCheck = allAuditCheckList.find((obj) => obj.id === cid);
        if (auditCheck) {
            showAlert({
                messageTitle: 'Delete Audit Check',
                messageContent: 'Are you sure, you want to delete?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => deleteAuditCheckById(auditCheck.auditCheckId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
            });
        } else {
            showAlert({
                messageTitle: 'Delete Audit Check',
                messageContent: 'Error in deleting audit check, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const removeHtmlTags = (str) => {
        if (!str) return ''; 
            return str.replace(/<[^>]*>/g, ''); 
      }

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'auditCheckDesc', headerName: 'Audit Check', resizable: false, width: 200,
                valueGetter: (params) => {
                    const sanitizedHtml = DOMPurify.sanitize(params);
                    return removeHtmlTags(sanitizedHtml);
                  },
             },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 150,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeAuditCheckStatus(params.row.auditCheckId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewAuditCheck(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editAuditCheck(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [allAuditCheckList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allAuditCheckList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewAuditCheck;
