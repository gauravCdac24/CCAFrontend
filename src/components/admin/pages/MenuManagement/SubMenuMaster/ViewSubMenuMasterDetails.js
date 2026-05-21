import { Grid, Box, Typography } from "@mui/material";

const ViewSubMenuMasterDetails = ({subMenuMasterObj}) =>{

    return(
        <>
        <Box sx={{width: '500px'}}>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Sub Menu Name:</Typography> 
                </Grid>
           
                <Grid item xs>
                <Typography variant="h6">{subMenuMasterObj.subMenuName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Menu Name:</Typography> 
                </Grid>
            
                <Grid item xs>
                    <Typography variant="h6">{subMenuMasterObj.menuId.menuName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Tracker Heading:</Typography> 
                </Grid>
           
                <Grid item xs>
                    <Typography variant="h6">{subMenuMasterObj.trackerHeading}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Sub Menu Order:</Typography> 
                </Grid>
           
                <Grid item xs>
                    <Typography variant="h6">{subMenuMasterObj.subMenuOrder}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{subMenuMasterObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{subMenuMasterObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{subMenuMasterObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewSubMenuMasterDetails;