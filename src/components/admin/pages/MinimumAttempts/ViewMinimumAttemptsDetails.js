import { Box, Grid, Typography } from "@mui/material";

const ViewMinimumAttemptsDetails = ({ countryObj }) => {
    console.log("View Audit Agency object in ViewMinimumAttemptsDetails:", countryObj); // Debugging log
    if (!countryObj) {
        return <Typography variant="h6">No Minimum Attempt data available.</Typography>;
    }

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Application Scrutiny:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{countryObj.applicationScrutiny}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Application Review:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography  variant="h6">{countryObj.applicationReview}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Application Audit:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography  variant="h6">{countryObj.applicationAudit}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">eSignApplication Review:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography  variant="h6">{countryObj.esignApplicationReview}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">AnnualAudit Review:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography  variant="h6">{countryObj.annualAuditReview}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{countryObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{countryObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography color="primary.tabletext" variant="h6">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{countryObj.status}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ViewMinimumAttemptsDetails;
