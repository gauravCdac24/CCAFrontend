import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ViewCPSDoc from './ViewCPSDoc';

const CPSDoc = () =>{

    const navigate = useNavigate();

    const addCPSDoc = () =>{

        navigate("/admin/cps/addcps");

    }

    return(
        <Box component="div">

            <Grid container spacing={2} direction={'column'}>

                <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                    <Button variant="contained"  startIcon={<AddIcon />} onClick={addCPSDoc}>
                        <Typography variant="h6">Add CPS</Typography>
                    </Button>
                </Grid>
            </Grid>
                <ViewCPSDoc />
            

        </Box>
    )
}

export default CPSDoc;