import { Grid, Box, Typography } from "@mui/material";

const ViewIntentUniqueCodeDetails = ({ intentUniqueCodeObj }) => {
    if (!intentUniqueCodeObj) {
        return (
            <Box sx={{ width: 'auto' }}>
                <Typography variant="h6">No record found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: 'auto' }}>
            
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Intent Code:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentUniqueCodeObj.uniqueCode}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Email Id:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentUniqueCodeObj.emailId}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Mobile:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentUniqueCodeObj.mobileNo}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentUniqueCodeObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentUniqueCodeObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentUniqueCodeObj.status}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ViewIntentUniqueCodeDetails;
