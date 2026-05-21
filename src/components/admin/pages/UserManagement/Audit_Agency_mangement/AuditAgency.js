import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import ViewAuditAgency from "./ViewAuditAgency";
import AuditAgencys from '../../../../../service/AdminService/AuditAgency';

const AuditAgency = () => {

    const navigate = useNavigate();

    const addAuditAgency = () => {
        navigate("/admin/auditagency/addAuditAgency");
    }

    const downloadPdf = async () => {
        try {
            // Fetch the file from the server
            const response = await AuditAgencys.downloadFile();
            
            // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            
            // Create a link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            
            // Extract the filename from the Content-Disposition header
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'Audit_Report';
    
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <Box component="div">
            {/* <Grid container spacing={2} direction={'column'}>
                <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', mr: 2 }}>
                <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={downloadPdf}
                        sx={{ marginRight: 2 }}
                    >
                      <Typography variant="h6">Audit Agency Report</Typography>  
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={addAuditAgency}>
                        <Typography variant="h6">Add Audit Agency</Typography>
                    </Button>
                </Grid>
            </Grid> */}
            <ViewAuditAgency />
        </Box>
    )
}

export default AuditAgency;
