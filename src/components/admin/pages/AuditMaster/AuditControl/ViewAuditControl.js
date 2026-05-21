import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AuditControlService from '../../../../../service/AdminService/AuditControlService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewAuditControlDetails from './ViewAuditControlDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import DOMPurify from 'dompurify';


const ViewAuditControl = () => {
    const [allAuditControlList, setAllAuditControlList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllAuditControl = () => {
        setLoading(true);

        AuditControlService.getAllAuditControlList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllAuditControlList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching audit control list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllAuditControl();
    }, []);

    const changeAuditControlStatus = (id) => {
        setLoading(true);
        AuditControlService.changeAuditControlStatus(id)
            .then((response) => {
                getAllAuditControl(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing audit control status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewAuditControl = (cid) => {
        const auditcontrol = allAuditControlList.find((obj) => obj.id === cid);
        if (auditcontrol) {
            showAlert({
                messageTitle: 'View Audit Control',
                messageContent: <ViewAuditControlDetails auditControlObj={auditcontrol} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
                fullWidth: true,
                maxWidth: 'md'
            });
        } else {
            showAlert({
                messageTitle: 'View Audit Control',
                messageContent: 'Error in getting audit control details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editAuditControl = (cid) => {
        const auditcontrol = allAuditControlList.find((obj) => obj.id === cid);
        if (auditcontrol) {
            const encryptedId = encodeURIComponent(encrypt(auditcontrol.auditControlId));
            navigate(`/admin/control/editcontrol/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Audit Control',
                messageContent: 'Error in updating audit control details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const deleteAuditControlById = (id) => {
        setLoading(true);
        AuditControlService.deleteAuditControl(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Audit Control',
                    messageContent: 'Audit Control has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllAuditControl(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Audit Control',
                    messageContent: 'Error in deleting audit control.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteAuditControl = (cid) => {
        const auditcontrol = allAuditControlList.find((obj) => obj.id === cid);
        if (auditcontrol) {
            showAlert({
                messageTitle: 'Delete Audit Control',
                messageContent: 'Are you sure, you want to delete?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => deleteAuditControlById(auditcontrol.auditControlId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
            });
        } else {
            showAlert({
                messageTitle: 'Delete Audit Control',
                messageContent: 'Error in deleting audit control, try after some time.',
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
            { field: 'controlDesc', headerName: 'Audit Control', resizable: false, width: 200,
                valueGetter: (params) =>{
                    const sanitizedHtml = DOMPurify.sanitize(params);
                    return removeHtmlTags(sanitizedHtml);
                } },
            { field: 'references', headerName: 'Reference', resizable: false, width: 200 },
            { field: 'auditParameterId', headerName: 'Audit Parameter', resizable: false, width: 200,
                valueGetter: (params) =>{
                    return params?.auditParameterTitle || 'N/A';
                }
             },
             { field: 'auditCheckId', headerName: 'Audit Check', resizable: false, width: 200,
                valueGetter: (params) =>{
                    const sanitizedHtml = DOMPurify.sanitize(params?.auditCheckDesc || 'N/A');
                    return removeHtmlTags(sanitizedHtml);
                }
             },
             { field: 'auditControlTypeId', headerName: 'Audit Control Type', resizable: false, width: 200,
                valueGetter: (params) =>{
                    return params?.auditControlDesc || 'N/A';
                }
             },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 100,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeAuditControlStatus(params.row.auditControlId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewAuditControl(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editAuditControl(params.id)} />
                        </Tooltip>
                       
                    </>
                ),
            },
        ],
        [allAuditControlList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allAuditControlList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewAuditControl;
