import { Grid, Box, Typography } from "@mui/material";

const ViewSubMenuInternalMasterDetails = ({SubMenuInternalMasterObj}) =>{

    return(
        <>
        <Box sx={{width: '500px'}}>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Sub Menu Internal Name:</Typography> 
                </Grid>
           
                <Grid item xs>
                <Typography variant="h6">{SubMenuInternalMasterObj.subMenuInternalName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Sub Menu Name:</Typography> 
                </Grid>
            
                <Grid item xs>
                    <Typography variant="h6">{SubMenuInternalMasterObj.subMenuId.subMenuName}</Typography>
                </Grid>
            </Grid>

            

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Tracker Heading:</Typography> 
                </Grid>
           
                <Grid item xs>
                    <Typography variant="h6">{SubMenuInternalMasterObj.trackerHeading}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{SubMenuInternalMasterObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{SubMenuInternalMasterObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{SubMenuInternalMasterObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewSubMenuInternalMasterDetails;