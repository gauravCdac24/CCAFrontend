import { Grid, Box, Typography } from "@mui/material";


const ViewRoleMasterDetails = ({roleMasterObj}) =>{

    return(
        <>
        <Box sx={{width: '500px'}}>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Role:</Typography> 
                </Grid>
                <Grid item xs>
                    <Typography variant="h6">{roleMasterObj.roleName}</Typography>
                </Grid>
            </Grid>

            

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Role Name:</Typography> 
                </Grid>
                <Grid item xs>
                    <Typography variant="h6">{roleMasterObj.description}</Typography>
                </Grid>
            </Grid>

            

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Path:</Typography> 
                </Grid>
                <Grid item xs>
                    <Typography variant="h6">{roleMasterObj.path}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Home Page:</Typography> 
                </Grid>
                <Grid item xs>
                    <Typography variant="h6">{roleMasterObj.homePage}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{roleMasterObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{roleMasterObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{roleMasterObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewRoleMasterDetails;