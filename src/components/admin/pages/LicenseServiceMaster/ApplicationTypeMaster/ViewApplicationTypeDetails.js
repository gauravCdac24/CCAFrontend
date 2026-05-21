import { Box, Grid, Typography } from "@mui/material";

const ViewApplicationTypeDetails = ({ applicationTypeObj }) => {
    console.log("View Application Type object in ViewApplicationTypeDetails:", applicationTypeObj); // Debugging log
    if (!applicationTypeObj) {
        return <Typography variant="h6">No Application Type data available.</Typography>;
    }

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Application Type:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{applicationTypeObj.appType}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{applicationTypeObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{applicationTypeObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{applicationTypeObj.status}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ViewApplicationTypeDetails;
