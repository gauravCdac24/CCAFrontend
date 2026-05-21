import ViewCountry from "./ViewCountry";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const Country = () => {

    const navigate = useNavigate();

    const addCountry = () =>{

        navigate("/admin/country/addcountry");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addCountry}>
                            <Typography variant="h6">Add Country</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewCountry />


            </Box>
        
    )

}

export default Country;