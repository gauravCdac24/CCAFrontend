import ViewAuditControlType from "./ViewAuditControlType";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const AuditControlType = () => {

    const navigate = useNavigate();

    const addAuditControlType = () =>{

        navigate("/admin/ctype/addcontroltype");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addAuditControlType}>
                            <Typography variant="h6">Add Audit Control Type</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewAuditControlType />


            </Box>
        
    )

}

export default AuditControlType;