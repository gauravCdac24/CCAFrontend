import { useEffect, useState } from 'react';
import { GridActionsCellItem,DataGrid  } from '@mui/x-data-grid';
import { Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StateService from '../../../../../service/AdminService/StateService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import EditState from './EditState';
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import { useNavigate } from 'react-router-dom';

const ViewState = () => {
    const [allStateList, setAllStateList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const label = { inputProps: { 'aria-label': 'Switch' } };

    const getAllState = () => {
        setLoading(true);

        StateService.getAllStateList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                 
                    return obj;
                });
                setAllStateList(list);
            })
            .catch((err) => {
                showAlert('Error', err.message, 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const changeStateStatus = (id) => {
        setLoading(true);
        StateService.changeStateStatus(id)
            .then((response) => {
                getAllState(); // Refresh state list after status change
            })
            .catch((err) => {
                showAlert('Error', err.message, 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }

const navigate=useNavigate();

    const editState = (cid) => {
        const city = allStateList.find((obj) => obj.id === cid);
        console.log(city)
        if (city) {
            const encryptedId = encodeURIComponent(encrypt(city.stateId));
            navigate(`/admin/state/editstate/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit State',
                messageContent: 'Error in updating State details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    useEffect(() => {
        getAllState();
    }, []);

    const columns = [
        { field: 'id', headerName: 'Sl. No.', resizable: false, width: 70 },
        { field: 'stateName', headerName: 'State Name', resizable: false, width: 200 },
        {
            field: 'countryId',
            headerName: 'Country Name',
            width: 150,
            valueGetter: (params) =>
                `${params.countryName}`,
        },
        { field: 'created', headerName: 'Created', resizable: false, width: 150 },
        { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
        {
            field: 'status', headerName: 'Status', resizable: false, width: 150,
            renderCell: (params) => (
                <Switch {...label} checked={params.row.status === "Active"} onClick={() => changeStateStatus(params.row.stateId)} />
            )
        },
        {
            field: 'action', headerName: 'Action', resizable: false, flex: 1, minWidth: 150, sortable: false,
            renderCell: (params) => (
                <>
                    <GridActionsCellItem
                        icon={<VisibilityIcon color="success" />}
                        label="View"
                    />
                    <GridActionsCellItem
                        icon={<EditIcon color="info" />}
                        label="Edit"
                        onClick={() => editState(params.id)}
                    />
                   
                </>
            )
        },
    ];

    return (
        <>
            <CustomTable
                columns={columns}
                rows={allStateList}
                hideColumnsForExport={['action']}
                pageSizeOptions={[10, 25, 50, 100]}
            />
        </>
    )
}

export default ViewState;
