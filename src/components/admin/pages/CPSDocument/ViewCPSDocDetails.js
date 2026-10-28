import { Grid, Box, Typography, IconButton, Tooltip } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewCPSDocDetails = ({ intentObj, downloadCPSDocFile, onDelete }) => {

    if (!intentObj) {
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
                    <Typography variant="h6">
                        {intentObj.fileName}
                    </Typography>
                    <Tooltip title="Download CPS Document">
                        <IconButton onClick={downloadCPSDocFile} color="primary">
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                    {onDelete && (
                        <Tooltip title="Delete CPS Document">
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
                    <Typography variant="h6">{intentObj.version}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Publish Date:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.publishDate}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.status}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ViewCPSDocDetails;
