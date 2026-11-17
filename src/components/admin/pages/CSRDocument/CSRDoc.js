import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ViewCSRDoc from './ViewCSRDoc';

const CSRDoc = () =>{

    const navigate = useNavigate();

    const addCSRDoc = () =>{

        navigate("/admin/csr/addcsr");

    }

    return(
        <Box component="div">

            <Grid container spacing={2} direction={'column'}>

                <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                    <Button variant="contained"  startIcon={<AddIcon />} onClick={addCSRDoc}>
                        <Typography variant="h6">Add CSR</Typography>
                    </Button>
                </Grid>
            </Grid>
                <ViewCSRDoc />
            

        </Box>
    )
}

export default CSRDoc;