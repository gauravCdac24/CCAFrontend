import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SubMenuMasterService from '../../../../../service/AdminService/SubMenuMasterService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewSubMenuMasterDetails from './ViewSubMenuMasterDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';

const ViewSubMenuMaster = () => {
    const [allSubMenuMasterList, setAllSubMenuMasterList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllSubMenuMaster = () => {
        setLoading(true);

        SubMenuMasterService.getAllSubMenuList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllSubMenuMasterList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching Sub Menu list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllSubMenuMaster();
    }, []);

    const changeSubMenuMasterStatus = (id) => {
        setLoading(true);
        SubMenuMasterService.changeSubMenuStatus(id)
            .then((response) => {
                getAllSubMenuMaster(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing Sub Menu status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewSubMenuMaster = (cid) => {
        const SubMenuMaster = allSubMenuMasterList.find((obj) => obj.id === cid);
        if (SubMenuMaster) {
            showAlert({
                messageTitle: 'View SubMenu',
                messageContent: <ViewSubMenuMasterDetails subMenuMasterObj={SubMenuMaster} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View SubMenu',
                messageContent: 'Error in getting SubMenu details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editSubMenuMaster = (cid) => {
        const subMenuMaster = allSubMenuMasterList.find((obj) => obj.id === cid);
        if (subMenuMaster) {
            const encryptedId = encodeURIComponent(encrypt(subMenuMaster.subMenuId));
            navigate(`/admin/submenu/editsubmenu/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Sub Menu',
                messageContent: 'Error in updating sub menu details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };


    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'subMenuName', headerName: 'Sub Menu Name', resizable: false, width: 200},
            { field: 'subMenuPath', headerName: 'Path', resizable: false, width: 200},
            { field: 'trackerHeading', headerName: 'Tracker Heading', resizable: false, width: 200},
            { field: 'subMenuOrder', headerName: 'Sub Menu Order', resizable: false, width: 120, align: 'center'},
            { field: 'menuId', headerName: 'Menu Name', resizable: false, width: 200,
                valueGetter: (params) =>{
                    return params.menuName;
                }
            },
            { field: 'role', headerName: 'Role', resizable: false, width: 200,
                renderCell: (params) => (
                    <>{params.row.menuId.roleId.roleName}</>
                )
            },
            
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 100,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeSubMenuMasterStatus(params.row.subMenuId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewSubMenuMaster(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editSubMenuMaster(params.id)} />
                        </Tooltip>
                    </>
                ),
            },
        ],
        [allSubMenuMasterList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allSubMenuMasterList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewSubMenuMaster;
