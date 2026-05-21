import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RoleMasterService from '../../../../../service/AdminService/RoleMasterService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewRoleMasterDetails from './ViewRoleMasterDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';

const ViewRoleMaster = () => {
    const [allRoleMasterList, setAllRoleMasterList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllRoleMaster = () => {
        setLoading(true);

        RoleMasterService.getAllRoleList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllRoleMasterList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching role list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllRoleMaster();
    }, []);

    const changeRoleMasterStatus = (id) => {
        setLoading(true);
        RoleMasterService.changeRoleStatus(id)
            .then((response) => {
                getAllRoleMaster(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing role status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewRoleMaster = (cid) => {
        const roleMaster = allRoleMasterList.find((obj) => obj.id === cid);
        if (roleMaster) {
            showAlert({
                messageTitle: 'View Role',
                messageContent: <ViewRoleMasterDetails roleMasterObj={roleMaster} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Role',
                messageContent: 'Error in getting role details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editRoleMaster = (cid) => {
        const roleMaster = allRoleMasterList.find((obj) => obj.id === cid);
        if (roleMaster) {
            const encryptedId = encodeURIComponent(encrypt(roleMaster.roleId));
            navigate(`/admin/rolemaster/editrole/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Role',
                messageContent: 'Error in updating role details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };


    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'roleName', headerName: 'Role', resizable: false, width: 200},
            { field: 'description', headerName: 'Role Name', resizable: false, width: 200},
            { field: 'path', headerName: 'Path', resizable: false, width: 200},
            { field: 'homePage', headerName: 'Home Page', resizable: false, width: 200},
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 150,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeRoleMasterStatus(params.row.roleId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewRoleMaster(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editRoleMaster(params.id)} />
                        </Tooltip>
                    </>
                ),
            },
        ],
        [allRoleMasterList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allRoleMasterList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewRoleMaster;
