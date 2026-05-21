import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SubMenuInternalMasterService from '../../../../../service/AdminService/SubMenuInternalMasterService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewSubMenuInternalMasterDetails from './ViewSubMenuInternalMasterDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';

const ViewSubMenuInternalMaster = () => {
    const [allSubMenuInternalMasterList, setAllSubMenuInternalMasterList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllSubMenuInternalMaster = () => {
        setLoading(true);

        SubMenuInternalMasterService.getAllSubMenuInternalList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllSubMenuInternalMasterList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching Sub Menu Internal list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllSubMenuInternalMaster();
    }, []);

    const changeSubMenuInternalMasterStatus = (id) => {
        setLoading(true);
        SubMenuInternalMasterService.changeSubMenuInternalStatus(id)
            .then((response) => {
                getAllSubMenuInternalMaster(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing Sub Menu Internal status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewSubMenuInternalMaster = (cid) => {
        const subMenuInternalMaster = allSubMenuInternalMasterList.find((obj) => obj.id === cid);
        if (subMenuInternalMaster) {
            showAlert({
                messageTitle: 'View Sub Menu Internal',
                messageContent: <ViewSubMenuInternalMasterDetails SubMenuInternalMasterObj={subMenuInternalMaster} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Sub Menu Internal',
                messageContent: 'Error in getting Sub Menu Internal details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editSubMenuInternalMaster = (cid) => {
        const subMenuInternalMaster = allSubMenuInternalMasterList.find((obj) => obj.id === cid);
        if (subMenuInternalMaster) {
            const encryptedId = encodeURIComponent(encrypt(subMenuInternalMaster.subMenuInternalId));
            navigate(`/admin/internalsubmenu/editinternalsubmenu/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Sub Menu Internal',
                messageContent: 'Error in updating sub menu internal details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };


    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'subMenuInternalName', headerName: 'Name', resizable: false, width: 200},
            { field: 'subMenuInternalPath', headerName: 'Path', resizable: false, width: 200},
            { field: 'trackerHeading', headerName: 'Tracker Heading', resizable: false, width: 200},
            { field: 'subMenuId', headerName: 'Sub Menu Name', resizable: false, width: 200,
                valueGetter: (params) =>{
                    return params.subMenuName;
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
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeSubMenuInternalMasterStatus(params.row.subMenuInternalId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewSubMenuInternalMaster(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editSubMenuInternalMaster(params.id)} />
                        </Tooltip>
                    </>
                ),
            },
        ],
        [allSubMenuInternalMasterList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allSubMenuInternalMasterList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewSubMenuInternalMaster;
