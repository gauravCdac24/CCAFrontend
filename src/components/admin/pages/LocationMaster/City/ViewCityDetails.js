import { Grid, Box, Typography } from "@mui/material";

const ViewCountryDetails = ({ cityObj }) => {
    if (!cityObj) {
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
                    <Typography variant="h6">City Name:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{cityObj.cityName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">State Name:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{cityObj.stateName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{cityObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{cityObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{cityObj.status}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ViewCountryDetails;
