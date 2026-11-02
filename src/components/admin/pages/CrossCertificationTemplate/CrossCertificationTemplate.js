import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ViewCrossCertificationTemplate from './ViewCrossCertificationTemplate';

const CrossCertificationTemplate = () => {
    const navigate = useNavigate();

    const addTemplate = () => {
        navigate("/admin/crosscertificationarrangement/addcrosscertificationtemplate");
    };

    return (
        <Box component="div">
            <Grid container spacing={2} direction={'column'}>
                <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={addTemplate}>
                        <Typography variant="h6">Add Cross Certification Arrangement</Typography>
                    </Button>
                </Grid>
            </Grid>
            <ViewCrossCertificationTemplate />
        </Box>
    );
};

export default CrossCertificationTemplate;
