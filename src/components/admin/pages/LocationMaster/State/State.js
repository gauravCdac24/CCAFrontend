import ViewState from "./ViewState";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const State = () => {

    const navigate = useNavigate();

    const addState = () =>{

        navigate("/admin/state/addstate");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addState}>
                            <Typography variant="h6">Add State</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewState />


            </Box>
        
    )

}

export default State;