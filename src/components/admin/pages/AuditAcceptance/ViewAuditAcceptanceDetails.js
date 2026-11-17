import { Grid, Box, Typography, IconButton, Tooltip } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewAuditAcceptanceDetails = ({ documentObj, downloadFile, onDelete }) => {
    if (!documentObj) {
        return (
            <Box sx={{ width: 'auto' }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '500px' }}>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">File Name:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{documentObj.fileName}</Typography>
                    <Tooltip title="Download Audit Acceptance">
                        <IconButton onClick={downloadFile} color="primary">
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                    {onDelete && (
                        <Tooltip title="Delete Audit Acceptance">
                            <IconButton onClick={onDelete} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Version:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{documentObj.version}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Publish Date:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{documentObj.publishDate}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{documentObj.created}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{documentObj.updated}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{documentObj.status}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ViewAuditAcceptanceDetails;
