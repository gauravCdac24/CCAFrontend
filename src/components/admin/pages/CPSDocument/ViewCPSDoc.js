import {useState,useEffect} from 'react';
import {GridActionsCellItem} from '@mui/x-data-grid';
import {Box, Tooltip} from '@mui/material';
import  EditIcon  from '@mui/icons-material/Edit';
import  VisibilityIcon  from '@mui/icons-material/Visibility';
import  DeleteIcon  from '@mui/icons-material/Delete';
import { Switch } from '@mui/material';
import dateFormatter from '../../../global/util/DateFormatter';
import ViewCPSDocDetails from './ViewCPSDocDetails';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import CPSDocService from '../../../../service/AdminService/CPSDocService';
import CustomTable from '../../../global/util/CustomTable';
import {timeStampToDate} from '../../../global/util/TimestampConverter';

const ViewCPSDoc = () => {

    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const [allCPSDocList, setAllCPSDocList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const getAllCPSDoc = () =>{
        setLoading(true);
        CPSDocService.getAllCpsDocList()
        .then((response)=>{
            const list = response.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj['created'] = dateFormatter(obj.created);
                obj['updated'] = dateFormatter(obj.updated);
                obj['publishDate'] = timeStampToDate(obj.publishDate);
                obj['document'] = "CPS-" + obj.version;
                return obj;
              });
              setAllCPSDocList(list);
        })
        .catch((err)=>{
            showAlert({
                messageTitle: 'Error',
                messageContent: err.response?.data || 'Unable to load CPS documents.',
                confirmText: 'Ok',
            });
        })
        .finally(()=>{
            setLoading(false)
        })
    }

    useEffect(()=>{
        getAllCPSDoc();
    }, [])

    const changeCPSDocStatus = (id) => {
        setLoading(true);
        CPSDocService.changeCpsDocStatus(id)
            .then(() => {
                getAllCPSDoc();
            })
            .catch((err) => {
                getAllCPSDoc();
                const message = err.response?.data || 'Unable to change CPS document status.';
                showAlert({
                    messageTitle: message === 'Active cps already present.' ? 'CPS Status' : 'Error',
                    messageContent: message,
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const deleteCPSDocById = (cpsDocId) => {
        setLoading(true);
        CPSDocService.deleteCpsDoc(cpsDocId)
            .then(() => {
                showAlert({
                    messageTitle: 'Delete CPS',
                    messageContent: 'CPS document has been deleted successfully.',
                    confirmText: 'Ok',
                    onConfirm: () => getAllCPSDoc(),
                });
                getAllCPSDoc();
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete CPS',
                    messageContent: err.response?.data || 'Error in deleting CPS document.',
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const confirmDeleteCPSDoc = (cpsDocId) => {
        showAlert({
            messageTitle: 'Delete CPS',
            messageContent: 'Are you sure you want to delete this CPS document?',
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => deleteCPSDocById(cpsDocId),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: false,
        });
    };

    const ViewCPSDoc = (cid) =>{
        const intent = allCPSDocList.find((obj)=>obj.id===cid)
        
        showAlert({
            messageTitle: 'View CPS Document',
            messageContent: (<>
                <ViewCPSDocDetails
                    intentObj={intent}
                    downloadCPSDocFile={() => handleDownload(intent.cpsDocId, intent.fileName)}
                    onDelete={() => confirmDeleteCPSDoc(intent.cpsDocId)}
                />
            </>),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true
        })
    }

    const editCPSDoc = (cid) => {
        const intent = allCPSDocList.find((obj) => obj.id === cid);
        if (intent) {
            const encryptedId = encodeURIComponent(encrypt(intent.cpsDocId));
            navigate(`/admin/cps/editcps/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit CPS',
                messageContent: 'Error in updating CPS details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const handleDownload = async (id, file_name) => {
        try {
            const response = await CPSDocService.downloadFile(id);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            const filename = file_name;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            showAlert({
                messageTitle: 'Download Error',
                messageContent: 'Error downloading file.',
                confirmText: 'Ok',
            });
        }
    };

    const columns = [
        {field: 'id', headerName: 'Sl. No.',width: 100, resizable: false},
        {field: 'document', headerName: 'Document Name', resizable: false, width: 150,},
        {field: 'fileName', headerName: 'File Name', resizable: false, width: 150, renderCell: (params) => (
            <Tooltip title="Click here to download">
                <Box component="span"
                    sx={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onClick={() => handleDownload(params.row.cpsDocId, params.row.fileName)}
                >
                    {params.value}
                </Box>
            </Tooltip>
        )
    },
        {field: 'version', headerName: 'Version', resizable: false, width: 100,},
        {field: 'publishDate', headerName: 'Publish Date', resizable: false, width: 150,},
        {field: 'status', headerName: 'Status', resizable: false,  width: 150,
            renderCell: (params)=>(
                <Switch
                    {...label}
                    checked={params.row.status === 'Active'}
                    onChange={() => changeCPSDocStatus(params.row.cpsDocId)}
                />
            )
        },
        {field: 'created', headerName: 'Created', resizable: false,  width: 150,},
        {field: 'updated', headerName: 'Updated', resizable: false,  width: 150,},
        {field: 'action', headerName: 'Action', resizable: false, flex: 1, minWidth: 120, sortable: false,
            renderCell: (params)=>(
            <>
                <Tooltip title="View">
                    <GridActionsCellItem
                    icon={<VisibilityIcon color="success" />}
                    label="View"
                    onClick={() => ViewCPSDoc(params.id)}
                    />
                </Tooltip>
                <Tooltip title="Edit">
                    <GridActionsCellItem
                    icon={<EditIcon color="info" />}
                    label="Edit"
                    onClick={() => editCPSDoc(params.id)}
                    />
                </Tooltip>
                <Tooltip title="Delete">
                    <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    label="Delete"
                    onClick={() => confirmDeleteCPSDoc(params.row.cpsDocId)}
                    />
                </Tooltip>
            </>
         )},
    ]

    return(
        <>
            <CustomTable
                rows={allCPSDocList}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
                }}
                hideColumnsForExport={['Action']}
                pageSizeOptions={[5, 10, 15, 20]}
            />
        </>
    )

}

export default ViewCPSDoc;
