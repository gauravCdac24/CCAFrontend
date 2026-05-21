import ViewAuditCheck from "./ViewAuditCheck";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const AuditCheck = () => {

    const navigate = useNavigate();

    const addAuditCheck = () =>{

        navigate("/admin/check/addcheck");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addAuditCheck}>
                            <Typography variant="h6">Add Audit Check</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewAuditCheck />


            </Box>
        
    )

}

export default AuditCheck;