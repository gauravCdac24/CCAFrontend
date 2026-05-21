import { Grid, Box, Typography } from "@mui/material";

const ViewAuditParameterDetails = ({auditParameterObj}) =>{

    return(
        <>
        <Box sx={{width: '565px'}}>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Parameter:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditParameterObj.auditParameterTitle}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Sub Criteria:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{auditParameterObj.auditSubCriteriaId.auditSubCriteriaTitle}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditParameterObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditParameterObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditParameterObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewAuditParameterDetails;