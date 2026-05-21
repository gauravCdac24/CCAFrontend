import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ViewApplicationForm from './ViewApplicationForm';
import { useEffect, useState } from 'react';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useSelector } from 'react-redux';
import ApplicationForms from '../../../../service/NewLicenseService/ApplicationForm';

const ApplicationForm = () => {
    const navigate = useNavigate();

    const addApplicationForm = () => {
        navigate("/applicant/applicationform/addapplicationform");
    };

    const [isLoading, setLoading] = useState(false);
    const userName = useSelector((state) => state.jwtAuthentication.username);
    const [allApplicationFormList, setAllApplicationFormList] = useState(null); // Initialize as null or empty object

    const getAllApplicationForm = () => {
        setLoading(true);
        ApplicationForms.getApplicationDetailsFormByUsername(userName)
            .then((response) => {
                console.log(response.data);

                // Extracting the intentApp object
                const intentApp = response.data.intentApp;

                if (intentApp) {
                    // Set the state with the intentApp data
                    setAllApplicationFormList(intentApp);
                } else {
                    setAllApplicationFormList({});
                }
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching All Data list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllApplicationForm();
    }, []);

    return (
        <Box component="div">
            {/* <Grid container spacing={2} direction={'column'}>
                <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addApplicationForm}
                        disabled={allApplicationFormList && Object.keys(allApplicationFormList).length > 0} // Disable if data is found
                    >
                        <Typography variant="h6">Apply New Application</Typography>
                    </Button>
                </Grid>
            </Grid> */}
            <ViewApplicationForm />
        </Box>
    );
};

export default ApplicationForm;
