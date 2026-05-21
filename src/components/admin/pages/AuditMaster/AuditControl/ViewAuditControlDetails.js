import { Grid, Box, Typography } from "@mui/material";
import DOMPurify from 'dompurify';

const ViewAuditSubCriteriaDetails = ({auditControlObj}) =>{

    return(
        <>
        <Box sx={{width: '565px'}}>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Control:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(auditControlObj?.controlDesc || '') }} /></Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Reference:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditControlObj?.references || ''}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Parameter:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{auditControlObj?.auditParameterId?.auditParameterTitle || ''}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Check:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(auditControlObj?.auditCheckId?.auditCheckDesc|'') }} /></Typography>
                </Grid>
            </Grid>


            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Audit Control Type:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{auditControlObj?.auditControlTypeId?.auditControlDesc||''}</Typography>
                </Grid>
            </Grid>
          

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditControlObj?.created|| ''}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditControlObj?.updated|| ''}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{auditControlObj?.status|| ''}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewAuditSubCriteriaDetails;