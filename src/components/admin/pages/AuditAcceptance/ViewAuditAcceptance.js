import { useState, useEffect } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Tooltip, Switch } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import dateFormatter from '../../../global/util/DateFormatter';
import ViewAuditAcceptanceDetails from './ViewAuditAcceptanceDetails';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import AuditAcceptanceService from '../../../../service/AdminService/AuditAcceptanceService';
import CustomTable from '../../../global/util/CustomTable';
import { timeStampToDate } from '../../../global/util/TimestampConverter';

const ViewAuditAcceptance = () => {
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();
    const [allDocumentList, setAllDocumentList] = useState([]);
    const [, setLoading] = useState(false);

    const getAllDocuments = () => {
        setLoading(true);
        AuditAcceptanceService.getAllDocuments()
            .then((response) => {
                const list = (response.data || []).map((obj, index) => {
                    obj.id = index + 1;
                    obj.created = dateFormatter(obj.created);
                    obj.updated = dateFormatter(obj.updated);
                    obj.publishDate = timeStampToDate(obj.publishDate);
                    obj.document = "AA-" + obj.version;
                    return obj;
                });
                setAllDocumentList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: err.response?.data || 'Unable to load audit acceptance documents.',
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllDocuments();
    }, []);

    const changeStatus = (id) => {
        setLoading(true);
        AuditAcceptanceService.changeStatus(id)
            .then(() => {
                getAllDocuments();
            })
            .catch((err) => {
                getAllDocuments();
                const message = err.response?.data || 'Unable to change audit acceptance status.';
                showAlert({
                    messageTitle: message === 'Active audit acceptance already present.' ? 'Audit Acceptance' : 'Error',
                    messageContent: message,
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteById = (auditAcceptanceId) => {
        setLoading(true);
        AuditAcceptanceService.deleteDocument(auditAcceptanceId)
            .then(() => {
                showAlert({
                    messageTitle: 'Delete Audit Acceptance',
                    messageContent: 'Audit acceptance has been deleted successfully.',
                    confirmText: 'Ok',
                    onConfirm: () => getAllDocuments(),
                });
                getAllDocuments();
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Audit Acceptance',
                    messageContent: err.response?.data || 'Error in deleting audit acceptance.',
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const confirmDelete = (auditAcceptanceId) => {
        showAlert({
            messageTitle: 'Delete Audit Acceptance',
            messageContent: 'Are you sure you want to delete this audit acceptance?',
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => deleteById(auditAcceptanceId),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: false,
        });
    };

    const handleDownload = async (id, fileName) => {
        try {
            const response = await AuditAcceptanceService.downloadFile(id);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            showAlert({
                messageTitle: 'Download Error',
                messageContent: 'Error downloading file.',
                confirmText: 'Ok',
            });
        }
    };

    const viewDocument = (rowId) => {
        const document = allDocumentList.find((obj) => obj.id === rowId);
        showAlert({
            messageTitle: 'View Audit Acceptance',
            messageContent: (
                <ViewAuditAcceptanceDetails
                    documentObj={document}
                    downloadFile={() => handleDownload(document.auditAcceptanceId, document.fileName)}
                    onDelete={() => confirmDelete(document.auditAcceptanceId)}
                />
            ),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
        });
    };

    const editDocument = (rowId) => {
        const document = allDocumentList.find((obj) => obj.id === rowId);
        if (document) {
            const encryptedId = encodeURIComponent(encrypt(document.auditAcceptanceId));
            navigate(`/admin/auditacceptance/editauditacceptance/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Audit Acceptance',
                messageContent: 'Error in updating audit acceptance details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const columns = [
        { field: 'id', headerName: 'Sl. No.', width: 100, resizable: false },
        { field: 'document', headerName: 'Document Name', resizable: false, width: 150 },
        {
            field: 'fileName', headerName: 'File Name', resizable: false, width: 150,
            renderCell: (params) => (
                <Tooltip title="Click here to download">
                    <Box component="span"
                        sx={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                        onClick={() => handleDownload(params.row.auditAcceptanceId, params.row.fileName)}
                    >
                        {params.value}
                    </Box>
                </Tooltip>
            ),
        },
        { field: 'version', headerName: 'Version', resizable: false, width: 100 },
        { field: 'publishDate', headerName: 'Publish Date', resizable: false, width: 150 },
        {
            field: 'status', headerName: 'Status', resizable: false, width: 150,
            renderCell: (params) => (
                <Switch
                    {...label}
                    checked={params.row.status === 'Active'}
                    onChange={() => changeStatus(params.row.auditAcceptanceId)}
                />
            ),
        },
        { field: 'created', headerName: 'Created', resizable: false, width: 150 },
        { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
        {
            field: 'action', headerName: 'Action', resizable: false, flex: 1, minWidth: 120, sortable: false,
            renderCell: (params) => (
                <>
                    <Tooltip title="View">
                        <GridActionsCellItem
                            icon={<VisibilityIcon color="success" />}
                            label="View"
                            onClick={() => viewDocument(params.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <GridActionsCellItem
                            icon={<EditIcon color="info" />}
                            label="Edit"
                            onClick={() => editDocument(params.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <GridActionsCellItem
                            icon={<DeleteIcon color="error" />}
                            label="Delete"
                            onClick={() => confirmDelete(params.row.auditAcceptanceId)}
                        />
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <CustomTable
            rows={allDocumentList}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
            }}
            hideColumnsForExport={['Action']}
            pageSizeOptions={[5, 10, 15, 20]}
        />
    );
};

export default ViewAuditAcceptance;
