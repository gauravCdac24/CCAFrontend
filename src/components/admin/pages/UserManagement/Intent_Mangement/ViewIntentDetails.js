import { Grid, Box, Typography } from "@mui/material";

const ViewIntentDetails = ({ intentObj }) => {
    if (!intentObj) {
        return (
            <Box sx={{ width: 'auto' }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    const { addressId } = intentObj;
    const {
        blockNo, village, postOffice, subDivision, pincode,
        countryId, stateId, cityId
    } = addressId || {};

    // Extracting the country, state, and city names
    const country = countryId?.countryName || 'Unknown Country';
    const state = stateId?.stateName || 'Unknown State';
    const city = cityId?.cityName || 'Unknown City';

    return (
        <Box>

            <Typography variant="h6" fontWeight="bold" color="primary.tabletext">
                1. Personal Details
            </Typography>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6} >
                    <Typography variant="h6" color="primary.tabletext">Full Name:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">
                        {intentObj.salutation} {intentObj.firstName} {intentObj.middleName} {intentObj.lastName}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Email Id:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.uniqueCodeId.emailId}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Mobile Number:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.uniqueCodeId.mobileNo}</Typography>
                </Grid>
            </Grid>


            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Application Type:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.uniqueCodeId.appTypeMasterId.appType}</Typography>
                </Grid>
            </Grid>

        { intentObj.uniqueCodeId.appTypeMasterId.organizationName !==undefined && (
            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Organization Name:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.uniqueCodeId.appTypeMasterId.organizationName}</Typography>
                </Grid>
            </Grid>
            )
        }

            <Typography variant="h6" mt={4} fontWeight="bold" color="primary.tabletext">
                2. Address
            </Typography>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item xs={3}>
                    <Typography variant="h6" color="primary.tabletext">Flat/Door:</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6">{blockNo}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6" color="primary.tabletext">Village:</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6">{village}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item xs={3}>
                    <Typography variant="h6" color="primary.tabletext">Road/Post Office:</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6">{postOffice}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6" color="primary.tabletext">Area/Sub-Division:</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6">{subDivision}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item xs={3}>
                    <Typography variant="h6" color="primary.tabletext">Country:</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6">{country}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6" color="primary.tabletext">State/Province:</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6">{state}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item xs={3}>
                    <Typography variant="h6" color="primary.tabletext">District:</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6">{city}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6" color="primary.tabletext">Pin:</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6">{pincode || 'N/A'}</Typography>
                </Grid>
            </Grid>

            <Typography variant="h6" mt={4} fontWeight="bold" color="primary.tabletext">
                3. Additional Information
            </Typography>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{intentObj.status==="Active"?"Verified": "Not Verified"}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ViewIntentDetails;
