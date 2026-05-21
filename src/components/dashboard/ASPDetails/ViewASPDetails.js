import { Box, Grid2, Typography } from "@mui/material";

const ViewASPDetails = ({aspObj}) =>{

    return(
        <>
        <Box sx={{width: '520px'}}>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">ASP Name:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.aspName}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">Email Id:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.emailId}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">Country:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.countryId}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">State:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.stateId}</Typography>
                </Grid2>
            </Grid2>


            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">Onboarding Date:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.onBoardingDate}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">Exit Date:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.exitDate}</Typography>
                </Grid2>
            </Grid2>



            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.created}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.updated}</Typography>
                </Grid2>
            </Grid2>
        </Box>
        
        </>
    )


}

export default ViewASPDetails;