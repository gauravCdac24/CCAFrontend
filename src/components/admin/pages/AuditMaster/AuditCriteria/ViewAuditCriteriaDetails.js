import { Grid, Box, Typography } from "@mui/material";

const ViewAuditCriteriaDetails = ({auditCriteriaObj}) =>{

    return(
        <>
        <Box sx={{width: '500px'}}>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Criteria Title:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditCriteriaObj.auditCriteriaTitle}</Typography>
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

export default ViewAuditCriteriaDetails;