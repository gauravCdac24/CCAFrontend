import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ViewAgreementTemplate from './ViewAgreementTemplate';

const AgreementTemplate = () => {
    const navigate = useNavigate();

    const addTemplate = () => {
        navigate("/admin/agreement/addagreementtemplate");
    };

    return (
        <Box component="div">
            <Grid container spacing={2} direction={'column'}>
                <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={addTemplate}>
                        <Typography variant="h6">Add Agreement template</Typography>
                    </Button>
                </Grid>
            </Grid>
            <ViewAgreementTemplate />
        </Box>
    );
};

export default AgreementTemplate;
