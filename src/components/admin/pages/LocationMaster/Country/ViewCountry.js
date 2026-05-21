import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Grid, Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CountryService from '../../../../../service/AdminService/CountryService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewCountryDetails from './ViewCountryDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';

const ViewCountry = () => {
    const [allCountryList, setAllCountryList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const getAllCountry = () => {
        setLoading(true);

        CountryService.getAllCountryList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setAllCountryList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching country list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllCountry();
    }, []);

    const changeCountryStatus = (id) => {
        setLoading(true);
        CountryService.changeCountryStatus(id)
            .then((response) => {
                getAllCountry(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing country status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewCountry = (cid) => {
        const country = allCountryList.find((obj) => obj.id === cid);
        if (country) {
            showAlert({
                messageTitle: 'View Country',
                messageContent: <ViewCountryDetails countryObj={country} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Country',
                messageContent: 'Error in getting country details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editCountry = (cid) => {
        const country = allCountryList.find((obj) => obj.id === cid);
        if (country) {
            const encryptedId = encodeURIComponent(encrypt(country.countryId));
            navigate(`/admin/country/editcountry/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Country',
                messageContent: 'Error in updating country details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const deleteCountryById = (id) => {
        setLoading(true);
        CountryService.deleteCountry(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Country',
                    messageContent: 'Country has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllCountry(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Country',
                    messageContent: 'Error in deleting country.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteCountry = (id) => {
        const country = allCountryList.find((obj) => obj.id === id);
        if (country) {
            showAlert({
                messageTitle: 'Delete Country',
                messageContent: 'Are you sure, you want to delete?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => deleteCountryById(country.countryId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
            });
        } else {
            showAlert({
                messageTitle: 'Delete Country',
                messageContent: 'Error in deleting country, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'countryName', headerName: 'Country Name', resizable: false, width: 200 },
            { field: 'phoneCode', headerName: 'Phone Code', resizable: false, width: 150 },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 150,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeCountryStatus(params.row.countryId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewCountry(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editCountry(params.id)} />
                        </Tooltip>
                       
                    </>
                ),
            },
        ],
        [allCountryList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allCountryList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewCountry;
