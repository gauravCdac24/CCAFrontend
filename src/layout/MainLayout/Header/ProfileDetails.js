import { Grid, Box, Typography } from "@mui/material";
import { buildFullName } from "./profileNameUtils";

const ProfileDetails = ({profileObj}) =>{
    const displayName = buildFullName(profileObj) || profileObj.userName || 'N/A';

    return(
        <>
        <Box sx={{width: '565px'}}>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Name:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{displayName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Username:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{profileObj.userName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Email Id:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{profileObj.emailId?.replace('@','[at]').replace('.','[dot]') ?? 'N/A'}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Mobille Number:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{`+91 - ${profileObj.mobile}`}</Typography>
                </Grid>
            </Grid>

            
        </Box>
        
        </>
    )


}

export default ProfileDetails;