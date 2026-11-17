import {useState,useEffect} from 'react';
import {GridActionsCellItem} from '@mui/x-data-grid';
import {Box, Tooltip} from '@mui/material';
import  EditIcon  from '@mui/icons-material/Edit';
import  VisibilityIcon  from '@mui/icons-material/Visibility';
import  DeleteIcon  from '@mui/icons-material/Delete';
import { Switch } from '@mui/material';
import dateFormatter from '../../../global/util/DateFormatter';
import ViewCSRDocDetails from './ViewCSRDocDetails';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import CSRDocService from '../../../../service/AdminService/CSRDocService';
import CustomTable from '../../../global/util/CustomTable';
import {timeStampToDate} from '../../../global/util/TimestampConverter';

const ViewCSRDoc = () => {

    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const [allCSRDocList, setAllCSRDocList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const getAllCSRDoc = () =>{
        setLoading(true);
        CSRDocService.getAllCsrDocList()
        .then((response)=>{
            const list = response.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj['created'] = dateFormatter(obj.created);
                obj['updated'] = dateFormatter(obj.updated);
                obj['publishDate'] = timeStampToDate(obj.publishDate);
                obj['document'] = "CSR-" + obj.version;
                return obj;
              });
              setAllCSRDocList(list);
        })
        .catch((err)=>{
            showAlert({
                messageTitle: 'Error',
                messageContent: err.response?.data || 'Unable to load CSR documents.',
                confirmText: 'Ok',
            });
        })
        .finally(()=>{
            setLoading(false)
        })
    }

    useEffect(()=>{
        getAllCSRDoc();
    }, [])

    const changeCSRDocStatus = (id) => {
        setLoading(true);
        CSRDocService.changeCsrDocStatus(id)
            .then(() => {
                getAllCSRDoc();
            })
            .catch((err) => {
                getAllCSRDoc();
                const message = err.response?.data || 'Unable to change CSR document status.';
                showAlert({
                    messageTitle: message === 'Active csr already present.' ? 'CSR Status' : 'Error',
                    messageContent: message,
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const deleteCSRDocById = (csrDocId) => {
        setLoading(true);
        CSRDocService.deleteCsrDoc(csrDocId)
            .then(() => {
                showAlert({
                    messageTitle: 'Delete CSR',
                    messageContent: 'CSR document has been deleted successfully.',
                    confirmText: 'Ok',
                    onConfirm: () => getAllCSRDoc(),
                });
                getAllCSRDoc();
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete CSR',
                    messageContent: err.response?.data || 'Error in deleting CSR document.',
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const confirmDeleteCSRDoc = (csrDocId) => {
        showAlert({
            messageTitle: 'Delete CSR',
            messageContent: 'Are you sure you want to delete this CSR document?',
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => deleteCSRDocById(csrDocId),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: false,
        });
    };

    const ViewCSRDoc = (cid) =>{
        const intent = allCSRDocList.find((obj)=>obj.id===cid)
        
        showAlert({
            messageTitle: 'View CSR Document',
            messageContent: (<>
                <ViewCSRDocDetails
                    intentObj={intent}
                    downloadCSRDocFile={() => handleDownload(intent.csrDocId, intent.fileName)}
                    onDelete={() => confirmDeleteCSRDoc(intent.csrDocId)}
                />
            </>),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true
        })
    }

    const editCSRDoc = (cid) => {
        const intent = allCSRDocList.find((obj) => obj.id === cid);
        if (intent) {
            const encryptedId = encodeURIComponent(encrypt(intent.csrDocId));
            navigate(`/admin/csr/editcsr/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit CSR',
                messageContent: 'Error in updating CSR details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const handleDownload = async (id, file_name) => {
        try {
            const response = await CSRDocService.downloadFile(id);
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
                    onClick={() => handleDownload(params.row.csrDocId, params.row.fileName)}
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
                    onChange={() => changeCSRDocStatus(params.row.csrDocId)}
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
                    onClick={() => ViewCSRDoc(params.id)}
                    />
                </Tooltip>
                <Tooltip title="Edit">
                    <GridActionsCellItem
                    icon={<EditIcon color="info" />}
                    label="Edit"
                    onClick={() => editCSRDoc(params.id)}
                    />
                </Tooltip>
                <Tooltip title="Delete">
                    <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    label="Delete"
                    onClick={() => confirmDeleteCSRDoc(params.row.csrDocId)}
                    />
                </Tooltip>
            </>
         )},
    ]

    return(
        <>
            <CustomTable
                rows={allCSRDocList}
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

export default ViewCSRDoc;
