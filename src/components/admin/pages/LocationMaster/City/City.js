import ViewCity from "./ViewCity";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const City = () => {

    const navigate = useNavigate();

    const addCity = () =>{

        navigate("/admin/city/addcity");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addCity}>
                            <Typography variant="h6">Add City</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewCity />


            </Box>
        
    )

}

export default City;