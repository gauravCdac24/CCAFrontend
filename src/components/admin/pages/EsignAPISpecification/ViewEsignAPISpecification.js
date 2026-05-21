import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EsignAPISpecificationService from '../../../../service/AdminService/EsignAPISpecificationService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import ViewEsignAPISpecificationDetails from './ViewEsignAPISpecificationDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';

const ViewEsignAPISpecification = () => {
    const [apiSpecificationList, setApiSpecificationList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const getAllAPISpecification = () => {
        setLoading(true);

        EsignAPISpecificationService.getAllAPISpecification()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setApiSpecificationList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching api specification list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllAPISpecification();
    }, []);

    const changeEsignAPISpecificationStatus = (id) => {
        setLoading(true);
        EsignAPISpecificationService.changeAPISpecificationStatus(id)
            .then((response) => {
                getAllAPISpecification(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing Esign API Specification status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewEsignAPISpecification = (cid) => {
        const obj = apiSpecificationList.find((obj) => obj.id === cid);
        if (obj) {
            showAlert({
                messageTitle: 'View Esign API Specification',
                messageContent: <ViewEsignAPISpecificationDetails apiSpecificationObj={obj} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Esign API Specification',
                messageContent: 'Error in getting Esign API Specification details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editEsignAPISpecification = (cid) => {
        const obj = apiSpecificationList.find((obj) => obj.id === cid);
        if (obj) {
            const encryptedId = encodeURIComponent(encrypt(obj.esignApiSpecId));
            navigate(`${rolePath}/apispecification/editapispecification/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Esign API Specification',
                messageContent: 'Error in updating Esign API Specification details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    
    

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'apiSpecification', headerName: 'API Specification', resizable: false, width: 250 },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 100,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeEsignAPISpecificationStatus(params.row.esignApiSpecId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewEsignAPISpecification(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editEsignAPISpecification(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [apiSpecificationList] 
    );

    return (
        <>
            <CustomTable customTitle = "Esign API Specifications" columns={columns} rows={apiSpecificationList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewEsignAPISpecification;
