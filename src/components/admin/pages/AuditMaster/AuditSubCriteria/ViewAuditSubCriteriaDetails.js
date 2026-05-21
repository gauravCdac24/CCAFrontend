import { Grid, Box, Typography } from "@mui/material";

const ViewAuditSubCriteriaDetails = ({auditCriteriaObj}) =>{

    return(
        <>
        <Box sx={{width: '565px'}}>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Sub Criteria Title:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditCriteriaObj.auditSubCriteriaTitle}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Criteria:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{auditCriteriaObj.auditCriteriaId.auditCriteriaTitle}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Do you want to make it visible?:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{auditCriteriaObj.isVisible==="TRUE"?"Yes":"No"}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditCriteriaObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditCriteriaObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditCriteriaObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewAuditSubCriteriaDetails;