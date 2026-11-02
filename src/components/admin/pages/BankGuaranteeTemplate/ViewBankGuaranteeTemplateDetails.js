import { Grid, Box, Typography, IconButton, Tooltip } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

const ViewBankGuaranteeTemplateDetails = ({ templateObj, downloadTemplateFile }) => {
    if (!templateObj) {
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
                    <Typography variant="h6">{templateObj.fileName}</Typography>
                    <Tooltip title="Download Bank Guarantee Template">
                        <IconButton onClick={() => downloadTemplateFile(templateObj.templateId, templateObj.fileName)} color="primary">
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Version:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{templateObj.version}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Publish Date:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{templateObj.publishDate}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{templateObj.created}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{templateObj.updated}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{templateObj.status}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ViewBankGuaranteeTemplateDetails;
