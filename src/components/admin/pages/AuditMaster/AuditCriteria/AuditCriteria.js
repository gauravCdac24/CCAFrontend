import ViewAuditCriteria from "./ViewAuditCriteria";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const AuditCriteria = () => {

    const navigate = useNavigate();

    const addAuditCriteria = () =>{

        navigate("/admin/audit/addcriteria");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addAuditCriteria}>
                            <Typography variant="h6">Add Audit Criteria</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewAuditCriteria />


            </Box>
        
    )

}

export default AuditCriteria;