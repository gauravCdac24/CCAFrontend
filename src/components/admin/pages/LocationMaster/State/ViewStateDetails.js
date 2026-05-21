import { Grid, Box, Typography } from "@mui/material";

const ViewCountryDetails = ({ countryObj }) => {
    if (!countryObj) {
        return (
            <Box sx={{ width: 'auto' }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: 'auto' }}>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Country Name:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{countryObj.countryName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Phone Code:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{countryObj.phoneCode}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{countryObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{countryObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{countryObj.status}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ViewCountryDetails;
