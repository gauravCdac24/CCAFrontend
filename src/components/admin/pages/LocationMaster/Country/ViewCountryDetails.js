import { Grid, Box, Typography } from "@mui/material";

const ViewCountryDetails = ({countryObj}) =>{

    return(
        <>
        <Box sx={{width: '500px'}}>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Country Name:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{countryObj.countryName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Phone Code:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{countryObj.phoneCode}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{countryObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{countryObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{countryObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewCountryDetails;