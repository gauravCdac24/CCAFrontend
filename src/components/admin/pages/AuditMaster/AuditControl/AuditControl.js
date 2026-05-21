import ViewAuditControl from "./ViewAuditControl";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const AuditControl = () => {

    const navigate = useNavigate();

    const addAuditControl = () =>{

        navigate("/admin/control/addcontrol");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addAuditControl}>
                            <Typography variant="h6">Add Audit Control</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewAuditControl />


            </Box>
        
    )

}

export default AuditControl;