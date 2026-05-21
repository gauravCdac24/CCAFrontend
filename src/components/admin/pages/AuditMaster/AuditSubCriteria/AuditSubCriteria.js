import ViewAuditSubCriteria from "./ViewAuditSubCriteria";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const AuditSubCriteria = () => {

    const navigate = useNavigate();

    const addAuditSubCriteria = () =>{

        navigate("/admin/subaudit/addsubcriteria");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addAuditSubCriteria}>
                            <Typography variant="h6">Add Audit Sub Criteria</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewAuditSubCriteria />


            </Box>
        
    )

}

export default AuditSubCriteria;