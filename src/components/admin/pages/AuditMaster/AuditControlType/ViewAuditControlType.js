import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AuditControlTypeService from '../../../../../service/AdminService/AuditControlTypeService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewAuditControlTypeDetails from './ViewAuditControlTypeDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';

const ViewAuditControlType = () => {
    const [allAuditControlTypeList, setAllAuditControlTypeList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllAuditControlType = () => {
        setLoading(true);

        AuditControlTypeService.getAllAuditControlTypeList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllAuditControlTypeList(list);
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
        getAllAuditControlType();
    }, []);

    const changeAuditControlTypeStatus = (id) => {
        setLoading(true);
        AuditControlTypeService.changeAuditControlTypeStatus(id)
            .then((response) => {
                getAllAuditControlType(); //Refresh
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

    const viewAuditControlType = (cid) => {
        const auditControlType = allAuditControlTypeList.find((obj) => obj.id === cid);
        if (auditControlType) {
            showAlert({
                messageTitle: 'View Audit Control Type',
                messageContent: <ViewAuditControlTypeDetails auditControlTypeObj={auditControlType} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Audit Control Type',
                messageContent: 'Error in getting audit criteria details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editAuditControlType = (cid) => {
        const AuditControlType = allAuditControlTypeList.find((obj) => obj.id === cid);
        if (AuditControlType) {
            const encryptedId = encodeURIComponent(encrypt(AuditControlType.auditControlTypeId));
            navigate(`/admin/ctype/editcontroltype/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Audit Control Type',
                messageContent: 'Error in updating audit criteria details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const deleteAuditControlTypeById = (id) => {
        setLoading(true);
        AuditControlTypeService.deleteAuditControlType(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Audit Control Type',
                    messageContent: 'Audit Control Type has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllAuditControlType(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Audit Control Type',
                    messageContent: 'Error in deleting control type.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteAuditControlType = (cid) => {
        const AuditControlType = allAuditControlTypeList.find((obj) => obj.id === cid);
        if (AuditControlType) {
            showAlert({
                messageTitle: 'Delete Audit Control Type',
                messageContent: 'Are you sure, you want to delete?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => deleteAuditControlTypeById(AuditControlType.auditControlTypeId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
            });
        } else {
            showAlert({
                messageTitle: 'Delete Audit Control Type',
                messageContent: 'Error in deleting audit control type, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'auditControlDesc', headerName: 'Audit Control Type', resizable: false, width: 200 },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 150,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeAuditControlTypeStatus(params.row.auditControlTypeId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewAuditControlType(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editAuditControlType(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [allAuditControlTypeList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allAuditControlTypeList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewAuditControlType;
