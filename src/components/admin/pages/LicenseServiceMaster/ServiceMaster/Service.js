import ViewService from "./ViewService";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const Service = () => {

    const navigate = useNavigate();

    const addService= () =>{

        navigate("/admin/service/addservice");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addService}>
                            <Typography variant="h6">Add Service</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewService />


            </Box>
        
    )

}

export default Service;