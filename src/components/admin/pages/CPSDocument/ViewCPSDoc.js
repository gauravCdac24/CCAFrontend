import {useState,useEffect} from 'react';
import {GridActionsCellItem} from '@mui/x-data-grid';
import {Box, Tooltip} from '@mui/material';
import  EditIcon  from '@mui/icons-material/Edit';
import  VisibilityIcon  from '@mui/icons-material/Visibility';
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

    const ViewCPSDoc = (cid) =>{
        const intent = allCPSDocList.find((obj)=>obj.id===cid)
        
        showAlert({
            messageTitle: 'View Intent',
            messageContent: (<>
                <ViewCPSDocDetails intentObj={intent} downloadCPSDocFile={()=>handleDownload(intent.cpsDocId, intent.fileName)} />
            </>),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true
        })
    }

    const changeCPSDocStatus = (id) => {
        setLoading(true);
        CPSDocService.changeCpsDocStatus(id)
            .then((response) => {
                getAllCPSDoc(); // Refresh state list after status change
            })
            .catch((err) => {
                showAlert('Error', err.message, 'error');
            })
            .finally(() => {
                setLoading(false);
            });
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
            // Fetch the file from the server
            const response = await CPSDocService.downloadFile(id);
            
            // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            
            // Create a link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            
            // Extract the filename from the Content-Disposition header
            const contentDisposition = response.headers['content-disposition'];

            console.log(JSON.stringify(contentDisposition))

            const filename = file_name;
    
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
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
                <Switch {...label} checked={params.row.status==="Active"} onClick={()=>changeCPSDocStatus(params.row.cpsDocId)} />
            )
        },
        {field: 'created', headerName: 'Created', resizable: false,  width: 150,},
        {field: 'updated', headerName: 'Updated', resizable: false,  width: 150,},
        {field: 'action', headerName: 'Action', resizable: false, flex: 1, minWidth: 80,
            renderCell: (params)=>(
            <>
                <Tooltip title="View">
                    <GridActionsCellItem
                    icon={<VisibilityIcon color="success" />}
                    label="View"
                    onClick={() =>ViewCPSDoc(params.id)}
                    />
                </Tooltip>
                {/* <Tooltip title="Edit">
                    <GridActionsCellItem
                    icon={<EditIcon color="info" />}
                    label="Edit"
                    onClick={() =>editCPSDoc(params.id)}
                    /> 
                </Tooltip> */}
                
              
            </>
         )},
    ]
    
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

        })
        .finally(()=>{
            setLoading(false)
        })

    }

    useEffect(()=>{

        getAllCPSDoc();

    }, [])

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