import { Grid, Box, Typography } from "@mui/material";

const ViewAuditCriteriaDetails = ({auditControlTypeObj}) =>{

    return(
        <>
        <Box sx={{width: '500px'}}>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Control Type:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditControlTypeObj.auditControlDesc}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditControlTypeObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditControlTypeObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditControlTypeObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewAuditCriteriaDetails;