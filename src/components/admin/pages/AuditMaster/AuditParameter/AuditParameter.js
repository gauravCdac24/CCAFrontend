import ViewAuditParameter from "./ViewAuditParameter";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const AuditParameter = () => {

    const navigate = useNavigate();

    const addAuditParameter = () =>{

        navigate("/admin/parameter/addparameter");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addAuditParameter}>
                            <Typography variant="h6">Add Audit Parameter</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewAuditParameter />


            </Box>
        
    )

}

export default AuditParameter;