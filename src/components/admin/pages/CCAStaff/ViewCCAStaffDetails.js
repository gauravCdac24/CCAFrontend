import { Grid, Box, Typography } from "@mui/material";

const ViewCCAStaffDetails = ({ccaStaffObj}) =>{

    return(
        <>
        <Box sx={{width: '565px'}}>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Name:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{ccaStaffObj.salutation}{" "}{ccaStaffObj.firstName}{" "}{ccaStaffObj.middleName}{" "}{ccaStaffObj.lastName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Designation:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{ccaStaffObj.designation}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Email Id:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{ccaStaffObj.emailId}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Mobille Number:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{ccaStaffObj.mobileNo}</Typography>
                </Grid>
            </Grid>

            
        </Box>
        
        </>
    )


}

export default ViewCCAStaffDetails;