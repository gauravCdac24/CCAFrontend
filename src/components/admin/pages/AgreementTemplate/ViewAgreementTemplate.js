import { useState, useEffect } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Tooltip, Switch } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import dateFormatter from '../../../global/util/DateFormatter';
import ViewAgreementTemplateDetails from './ViewAgreementTemplateDetails';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import AgreementTemplateService from '../../../../service/AdminService/AgreementTemplateService';
import CustomTable from '../../../global/util/CustomTable';
import { timeStampToDate } from '../../../global/util/TimestampConverter';

const ViewAgreementTemplate = () => {
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();
    const [allTemplateList, setAllTemplateList] = useState([]);
    const [, setLoading] = useState(false);

    const handleDownload = async (id, fileName) => {
        try {
            const response = await AgreementTemplateService.downloadFile(id);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            showAlert({
                messageTitle: 'Download Agreement Template',
                messageContent: 'Unable to download the agreement template. Please try again later.',
                confirmText: 'Ok',
            });
        }
    };

    const viewTemplate = (rowId) => {
        const template = allTemplateList.find((obj) => obj.id === rowId);
        showAlert({
            messageTitle: 'View Agreement Template',
            messageContent: (
                <ViewAgreementTemplateDetails
                    templateObj={template}
                    downloadTemplateFile={() => handleDownload(template.templateId, template.fileName)}
                />
            ),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true
        });
    };

    const changeStatus = (id) => {
        setLoading(true);
        AgreementTemplateService.changeStatus(id)
            .then(() => {
                getAllTemplates();
            })
            .catch((err) => {
                getAllTemplates();
                const message = err.response?.data && typeof err.response.data !== 'object'
                    ? err.response.data
                    : 'Unable to change agreement template status. Please try again.';
                showAlert({
                    messageTitle: message === 'Active agreement template already present.' ? 'Agreement Template' : 'Error',
                    messageContent: message,
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const editTemplate = (rowId) => {
        const template = allTemplateList.find((obj) => obj.id === rowId);
        if (template) {
            const encryptedId = encodeURIComponent(encrypt(template.templateId));
            navigate(`/admin/agreement/editagreementtemplate/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Agreement Template',
                messageContent: 'Error in updating agreement template details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const deleteTemplateById = (id) => {
        setLoading(true);
        AgreementTemplateService.deleteTemplate(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Agreement Template',
                    messageContent: response.data || 'Agreement template is successfully deleted.',
                    confirmText: 'OK',
                });
                getAllTemplates();
            })
            .catch((err) => {
                const message = err.response?.data && typeof err.response.data !== 'object'
                    ? err.response.data
                    : 'Error in deleting the agreement template.';
                showAlert({
                    messageTitle: 'Delete Agreement Template',
                    messageContent: message,
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteTemplate = (rowId) => {
        const template = allTemplateList.find((obj) => obj.id === rowId);
        if (template) {
            showAlert({
                messageTitle: 'Delete Agreement Template',
                messageContent: 'Are you sure, you want to delete?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => deleteTemplateById(template.templateId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
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
                        onClick={() => handleDownload(params.row.templateId, params.row.fileName)}
                    >
                        {params.value}
                    </Box>
                </Tooltip>
            )
        },
        { field: 'version', headerName: 'Version', resizable: false, width: 100 },
        { field: 'publishDate', headerName: 'Publish Date', resizable: false, width: 150 },
        {
            field: 'status', headerName: 'Status', resizable: false, width: 150,
            renderCell: (params) => (
                <Switch {...label} checked={params.row.status === "Active"} onChange={() => changeStatus(params.row.templateId)} />
            )
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
                            onClick={() => viewTemplate(params.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <GridActionsCellItem
                            icon={<EditIcon color="info" />}
                            label="Edit"
                            onClick={() => editTemplate(params.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <GridActionsCellItem
                            icon={<DeleteIcon color="error" />}
                            label="Delete"
                            onClick={() => deleteTemplate(params.id)}
                        />
                    </Tooltip>
                </>
            )
        },
    ];

    const getAllTemplates = () => {
        setLoading(true);
        AgreementTemplateService.getAllTemplates()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    obj['publishDate'] = timeStampToDate(obj.publishDate);
                    obj['document'] = "Agreement-" + obj.version;
                    return obj;
                });
                setAllTemplateList(list);
            })
            .catch(() => {
                setAllTemplateList([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllTemplates();
    }, []);

    return (
        <CustomTable
            rows={allTemplateList}
            columns={columns}
            hideColumnsForExport={['Action']}
            pageSizeOptions={[10, 25, 50, 100]}
        />
    );
};

export default ViewAgreementTemplate;
