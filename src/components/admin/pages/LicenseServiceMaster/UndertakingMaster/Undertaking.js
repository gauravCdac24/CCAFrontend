import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ViewUndertaking from './ViewUndertaking';

const Undertaking = () => {

    const navigate = useNavigate();

    const addUndertaking= () =>{

        navigate("/admin/undertaking/addundertaking");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addUndertaking}>
                            <Typography variant="h6">Add Undertaking</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewUndertaking />


            </Box>
        
    )

}

export default Undertaking;