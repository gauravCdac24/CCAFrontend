import { Grid, Box, Typography } from "@mui/material";
import DOMPurify from 'dompurify';

const ViewAuditCriteriaDetails = ({auditCheckObj}) =>{

    return(
        <>
        <Box sx={{width: '500px'}}>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Check:</Typography> 
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item xs>
                <Typography variant="h6"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(auditCheckObj.auditCheckDesc) }} /></Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditCheckObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditCheckObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditCheckObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewAuditCriteriaDetails;