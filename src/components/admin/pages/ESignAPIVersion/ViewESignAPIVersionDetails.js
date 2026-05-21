import { Grid, Box, Typography, Link } from "@mui/material";

const ViewEsignAPIVersionDetails = ({apiVersionObj, downloadDocument}) =>{

    return(
     
        <Box>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">API Version</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{apiVersionObj.apiVersion}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">API Specification:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{apiVersionObj.esignApiSpecId.apiSpecification}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Release Date:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{apiVersionObj.releaseDate}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">ESP readiness by:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{apiVersionObj.espReadinessBy}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Deprecation date:</Typography> 
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{apiVersionObj.deprecationDate}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Download Document:</Typography> 
                </Grid>
                <Grid item sm={6}>
                    <Link href="#" onClick={()=>downloadDocument(apiVersionObj.esignApiVerId, apiVersionObj.fileName)}>Download</Link>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{apiVersionObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{apiVersionObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{apiVersionObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        

    )


}

export default ViewEsignAPIVersionDetails;