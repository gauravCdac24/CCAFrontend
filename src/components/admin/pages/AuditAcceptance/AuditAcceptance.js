import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ViewAuditAcceptance from './ViewAuditAcceptance';

const AuditAcceptance = () => {
    const navigate = useNavigate();

    const addDocument = () => {
        navigate("/admin/auditacceptance/addauditacceptance");
    };

    return (
        <Box component="div">
            <Grid container spacing={2} direction={'column'}>
                <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={addDocument}>
                        <Typography variant="h6">Add Audit Acceptance</Typography>
                    </Button>
                </Grid>
            </Grid>
            <ViewAuditAcceptance />
        </Box>
    );
};

export default AuditAcceptance;
