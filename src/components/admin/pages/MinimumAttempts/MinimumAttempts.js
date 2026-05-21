import ViewMinimumAttempts from "./ViewMinimumAttempts";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const MinimumAttempts = () => {

    const navigate = useNavigate();

    const addCountry = () =>{

        navigate("/admin/minimumattempts/addMinimumattempts");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addCountry}>
                            <Typography variant="h6">Add Minimum Attempts</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewMinimumAttempts />


            </Box>
        
    )

}

export default MinimumAttempts;