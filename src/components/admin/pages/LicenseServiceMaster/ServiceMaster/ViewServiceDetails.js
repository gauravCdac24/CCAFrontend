import { Box, Grid, Typography } from "@mui/material";

const ViewServiceDetails = ({ serviceObj }) => {
    console.log("View Service object in ViewServiceDetails:", serviceObj); // Debugging log
    if (!serviceObj) {
        return <Typography variant="h6">No Service data available.</Typography>;
    }

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Service Name:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{serviceObj.serviceTitle}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{serviceObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{serviceObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{serviceObj.status}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ViewServiceDetails;
