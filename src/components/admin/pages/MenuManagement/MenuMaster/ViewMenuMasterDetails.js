import { Grid, Box, Typography } from "@mui/material";
import * as ReactIcons from '@mui/icons-material';

const ViewMenuMasterDetails = ({menuMasterObj}) =>{

    const DynamicIcon = ({ iconName }) => {
        const IconComponent = ReactIcons[iconName];
      
        if (IconComponent) {
          return <IconComponent />;
        } else {
          return <span>{""}</span>;
        }
      };

    return(
        <>
        <Box sx={{width: '500px'}}>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Menu Name:</Typography> 
                </Grid>
           
                <Grid item xs>
                <Typography variant="h6">{menuMasterObj.menuName}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Menu Icon:</Typography> 
                </Grid>
            
                <Grid item xs>
                    <Typography variant="h6"><DynamicIcon iconName={menuMasterObj.menuIcon}/>{" "}{menuMasterObj.menuIcon}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Menu Order:</Typography> 
                </Grid>
           
                <Grid item xs>
                <Typography variant="h6">{menuMasterObj.menuOrder}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{menuMasterObj.created}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{menuMasterObj.updated}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                <Typography variant="h6">{menuMasterObj.status}</Typography>
                </Grid>
            </Grid>

        </Box>
        
        </>
    )


}

export default ViewMenuMasterDetails;