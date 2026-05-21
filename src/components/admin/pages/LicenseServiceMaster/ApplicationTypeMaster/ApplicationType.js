import ViewApplicationType from "./ViewApplicationType";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const ApplicationType = () => {

    const navigate = useNavigate();

    const addApplicationType = () =>{

        navigate("/admin/applicationtype/addapplicationtype");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addApplicationType}>
                            <Typography variant="h6">Add Application Type</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewApplicationType />


            </Box>
        
    )

}

export default ApplicationType;