import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Link, Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import { timeStampToDate } from '../../../global/util/TimestampConverter';
import CustomTable from '../../../global/util/CustomTable';
import ViewESignAPIVersionDetails from './ViewESignAPIVersionDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';
import ESignAPIVersionMasterService from '../../../../service/AdminService/ESignAPIVersionMasterService';

const ViewESignAPIVersion = () => {
    const [esignAPIVersionList, setESignAPIVersionList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const getAllESignAPIVersion = () => {
        setLoading(true);

        ESignAPIVersionMasterService.getAllAPIVersion()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    obj['releaseDate'] = (obj.releaseDate!==null)?timeStampToDate(obj.releaseDate):'-';
                    obj['espReadinessBy'] = (obj.espReadinessBy!==null)?timeStampToDate(obj.espReadinessBy):'-';;
                    obj['deprecationDate'] = (obj.deprecationDate!==null)?timeStampToDate(obj.deprecationDate):'-';;

                    return obj;
                });
                setESignAPIVersionList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching API Version list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllESignAPIVersion();
    }, []);

    const changeESignAPIVersionStatus = (id) => {
        setLoading(true);
        ESignAPIVersionMasterService.changeAPIVersionStatus(id)
            .then((response) => {
                getAllESignAPIVersion(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing API Version status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewESignAPIVersion = (cid) => {
        const obj = esignAPIVersionList.find((obj) => obj.id === cid);
        if (obj) {
            showAlert({
                messageTitle: 'View API Version',
                messageContent: <ViewESignAPIVersionDetails apiVersionObj={obj} downloadDocument={downloadDocument}/>,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
                fullWidth: true,
                maxWidth: "md"
            });
        } else {
            showAlert({
                messageTitle: 'View API Version',
                messageContent: 'Error in getting API Version details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editESignAPIVersion = (cid) => {
        const obj = esignAPIVersionList.find((obj) => obj.id === cid);
        if (obj) {
            const encryptedId = encodeURIComponent(encrypt(obj.esignApiVerId));
            navigate(`${rolePath}/apiversion/editapiversion/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit API Version',
                messageContent: 'Error in updating API Version details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const downloadDocument = async (id, file_name) =>{

        try {
            
            const response = await ESignAPIVersionMasterService.viewFile(id);
            
            // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            
            // Create a link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            
            // Extract the filename from the Content-Disposition header
            const contentDisposition = response.headers['content-disposition'];

            const filename = file_name;
    
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }

    }
    

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'apiVersion', headerName: 'API Version', resizable: false, width: 150 },
            { field: 'esignApiSpecId', headerName: 'Esign API Specification', resizable: false, width: 150,
                renderCell: (params) => (
                    <>{params.row.esignApiSpecId.apiSpecification}</>
                ), },
            { field: 'releaseDate', headerName: 'Release date', resizable: false, width: 150 },
            { field: 'espReadinessBy', headerName: 'ESP readiness by', resizable: false, width: 150 },
            { field: 'deprecationDate', headerName: 'Deprecation date', resizable: false, width: 150 },
            { field: 'download', headerName: 'Download', resizable: false, width: 100,
                renderCell: (params) =>(
                    <Link href="#" onClick={()=>downloadDocument(params.row.esignApiVerId, params.row.fileName)}>Download</Link>
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
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeESignAPIVersionStatus(params.row.esignApiVerId)} />
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewESignAPIVersion(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editESignAPIVersion(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [esignAPIVersionList] 
    );

    return (
        <>
            <CustomTable customTitle = "API Version List" columns={columns} rows={esignAPIVersionList} hideColumnsForExport={['Action', 'Download']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewESignAPIVersion;
