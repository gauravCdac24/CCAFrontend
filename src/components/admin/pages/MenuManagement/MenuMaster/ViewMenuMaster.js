import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuMasterService from '../../../../../service/AdminService/MenuMasterService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewMenuMasterDetails from './ViewMenuMasterDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import * as ReactIcons from '@mui/icons-material';

const ViewMenuMaster = () => {
    const [allMenuMasterList, setAllMenuMasterList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllMenuMaster = () => {
        setLoading(true);

        MenuMasterService.getAllMenuList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    obj['roleName'] = obj.roleId.roleName;
                    return obj;
                });
                setAllMenuMasterList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching menu list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllMenuMaster();
    }, []);

    const changeMenuMasterStatus = (id) => {
        setLoading(true);
        MenuMasterService.changeMenuStatus(id)
            .then((response) => {
                getAllMenuMaster(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing menu status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewMenuMaster = (cid) => {
        const menuMaster = allMenuMasterList.find((obj) => obj.id === cid);
        if (menuMaster) {
            showAlert({
                messageTitle: 'View Menu',
                messageContent: <ViewMenuMasterDetails menuMasterObj={menuMaster} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Menu',
                messageContent: 'Error in getting Menu details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editMenuMaster = (cid) => {
        const menuMaster = allMenuMasterList.find((obj) => obj.id === cid);
        if (menuMaster) {
            const encryptedId = encodeURIComponent(encrypt(menuMaster.menuId));
            navigate(`/admin/menumaster/editmenu/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Menu',
                messageContent: 'Error in updating Menu details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const DynamicIcon = ({ iconName }) => {
        const IconComponent = ReactIcons[iconName];
      
        if (IconComponent) {
          return <IconComponent />;
        } else {
          return <span>{""}</span>;
        }
      };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'menuName', headerName: 'Menu Name', resizable: false, width: 200},
            { field: 'roleName', headerName: 'Role', resizable: false, width: 200,
                
            },
            { field: 'menuIcon', headerName: 'Icon', resizable: false, width: 200,
                renderCell: (params) =>(
                    <><DynamicIcon iconName={params.row.menuIcon}/>{" "}{params.row.menuIcon}</>
                ),
            },
            { field: 'menuOrder', headerName: 'Menu Order', resizable: false, width: 200},
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 150,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeMenuMasterStatus(params.row.menuId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewMenuMaster(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editMenuMaster(params.id)} />
                        </Tooltip>
                    </>
                ),
            },
        ],
        [allMenuMasterList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allMenuMasterList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewMenuMaster;
