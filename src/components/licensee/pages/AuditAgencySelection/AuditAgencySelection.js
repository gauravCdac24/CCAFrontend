import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText, MenuItem, Select, Typography, InputLabel } from '@mui/material';
import react,{ forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Captcha from '../../../global/util/Captcha';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../../global/util/FormWrapper';
import AuditAgency from '../../../../service/AdminService/AuditAgency';
import AuditorCertificateTypeService from '../../../../service/AdminService/AuditorCertificateTypeService';
import AuditService from '../../../../service/AuditService/AuditService';
import { useSelector } from 'react-redux';
import AnnexureA2Main from './AnnexureA2/AnnexureA2Main';
import AuditControls from './AuditControls';
import { decrypt } from '../../../global/util/EncryptDecrypt';

// Error Messages
const errorMsg = {
    AuditAgencyName: {
        blank: 'Please select Audit Agency Name.',
    },
    captchaError: {
        blank: 'Please enter captcha.',
    },
};

const AuditAgencySelection = forwardRef(({intentAppId}, ref) => {

    const userName = useSelector((state) => state.jwtAuthentication.username);
    const { id } = useParams();
    const intentAppIds = decrypt(id);
    console.log("intentAppIds",intentAppIds)
    const [audiAgencyFormValues, setAudiAgencyFormValues] = useState({ auditAgencyId: '' ,intentAppId:intentAppIds ,applicantUserName:userName});
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [allAuditAgencyList, setAllAuditAgencyList] = useState([]);

    // Reset form values
    const handleReset = () => {
        setAudiAgencyFormValues({ auditAgencyId: '',intentAppId:intentAppId });
        setCaptchaInput('');
        setFormErrors({});
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const selectedAgency = allAuditAgencyList.find(
            (agency) => agency.auditAgencyId === value
        );
    
        console.log("Selected Agency:", selectedAgency); // Debugging selected agency
        console.log("Before Update:", audiAgencyFormValues); // Debugging state before update
    
        setAudiAgencyFormValues((prev) => ({
            ...prev,
            [name]: value,
            name: selectedAgency?.auditAgencyName || '',
            mobileNo: selectedAgency?.mobileNo || '',
            emailId: selectedAgency?.emailId || '',
        }));
    
        console.log("After Update:", audiAgencyFormValues); // Debugging state after update
    };
    

    useImperativeHandle(ref, ()=>{

        return{
            handleReset,
            handleSubmit
        }

    })

    // Fetch all audit agencies
    const getAllAuditAgency = () => {
        setLoading(true);
        AuditAgency.getAllAuditAgencyList()
            .then((response) => {
                console.log('Audit Agencies:', response.data); // Debugging API response
                setAllAuditAgencyList(response.data); // Handle null/undefined data gracefully
            })
            .catch(() => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Failed to fetch audit agencies.',
                });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getAllAuditAgency();
    }, []);

    // Validate form inputs
    const validateForm = () => {
        const errors = {};

        if (!audiAgencyFormValues.auditAgencyId) {
            errors.auditAgencyId = errorMsg.AuditAgencyName.blank;
        }

        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }

        return errors;
    };

    // Form Submission Handler


    const handleSubmit = () => {
       
       // const errors = validateForm();
       const errors = 0;

        if (Object.keys(errors).length === 0) {
            setFormErrors({});

            if (captchaInput === captchaText) {

                showAlert({
                    messageTitle: 'Confirm',
                    messageContent: 'Are you sure, you want to submit? You cannot select the audit agency again. Please verify before the submit audit agency.',
                    confirmText: 'Yes',
                    closeText: 'No',
                    fullWidth: true,
                    maxWidth: 'sm',
                    onConfirm: ()=>handleConfrimSubmit()
                })

                
            }else{
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Invalid Captcha',
                    confirmText: 'Ok',
                })
            }
        } else {
            setFormErrors(errors);
        }
    };


    const handleConfrimSubmit = () => {
       

        // const errors = validateForm();
        const errors = 0;
        if (Object.keys(errors).length === 0) {
            setFormErrors({});

            if (captchaInput === captchaText) {
                setLoading(true);


              console.log("sfgydgc=====>",audiAgencyFormValues)

                //alert(audiAgencyFormValues)

                AuditService.addNewAuditAgencySlection(audiAgencyFormValues)
                    .then((response) =>
                        showAlert({
                            messageTitle: 'Success',
                            messageContent: response.data,
                            confirmText: 'Ok',
                            onConfirm: () => window.location.href = '/applicant/applicationform',
                        })
                    )
                    .catch((err) =>
                        showAlert({
                            messageTitle: 'Error',
                            messageContent: err.response?.data || 'Request failed. Please try again later.',
                            confirmText: 'Ok',
                        })
                    )
                    .finally(() => setLoading(false));
            } else {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Invalid Captcha, try again!',
                    confirmText: 'Ok',
                });
            }
        } else {
            setFormErrors(errors);
        }
    };

    return (
        <>
            <LoaderProgress open={isLoading} />
            <FormWrapper headingText="Select Audit Agency Name">
            <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleSubmit}>
            <Grid container spacing={2} direction="column" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
    }}>
            <Grid item xs={12}  >
    <InputLabel htmlFor="auditAgencyName" >
        <Typography variant="body1">Audit Agency Name*</Typography>
    </InputLabel>
    <FormControl variant="outlined" size="small" fullWidth>
        <Select
            id="auditAgencyName"
            value={audiAgencyFormValues.auditAgencyId}
            onChange={(e) => {
                handleInputChange(e);
                const selectedAgency = allAuditAgencyList.find(
                    (agency) => agency.auditAgencyId === e.target.value
                );
                setAudiAgencyFormValues((prev) => ({
                    ...prev,
                    name: selectedAgency?.auditAgencyName || '',
                    mobileNo: selectedAgency?.phoneRecord || [],
                    emailId: selectedAgency?.emailId || [],
                }));
            }}
            displayEmpty
            name="auditAgencyId"
            error={!!formErrors.auditAgencyId}
        >
            <MenuItem disabled value="">
                Select Audit Agency Name
            </MenuItem>
            {allAuditAgencyList.length > 0 ? (
                allAuditAgencyList.map((agency) => (
                    <MenuItem key={agency.auditAgencyId} value={agency.auditAgencyId}>
                        {agency.auditAgencyName}
                    </MenuItem>
                ))
            ) : (
                <MenuItem disabled>No audit agencies available</MenuItem>
            )}
        </Select>
        <FormHelperText error>{formErrors.auditAgencyId}</FormHelperText>
    </FormControl>
</Grid>


{/* Render additional rows based on the selected agency */}
{audiAgencyFormValues.auditAgencyId && (
  <>
    <Grid container spacing={2} sx={{ mt: 1, ml: 0.5 }}>
      <Grid item xs={6}>
        <Typography variant="body2"><strong>Name:</strong></Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2">
          {audiAgencyFormValues.name || 'N/A'}
        </Typography>
      </Grid>
    </Grid>

    <Grid container spacing={2} sx={{ ml: 0.5 }}>
      <Grid item xs={6}>
        <Typography variant="body2"><strong>Mobile No.:</strong></Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2">
          {audiAgencyFormValues.mobileNo?.length > 0
            ? audiAgencyFormValues.mobileNo[0]?.mobile || 'N/A'
            : 'N/A'}
        </Typography>
      </Grid>
    </Grid>

    <Grid container spacing={2} sx={{ ml: 0.5 }}>
      <Grid item xs={6}>
        <Typography variant="body2"><strong>Email ID:</strong></Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2">
          {audiAgencyFormValues.emailId?.length > 0
            ? audiAgencyFormValues.emailId[0]?.email || 'N/A'
            : 'N/A'}
        </Typography>
      </Grid>
    </Grid>
  </>
)}
</Grid>


<Box mb={2}> {/* This adds margin bottom */}
  <AuditControls />
</Box>
<AnnexureA2Main />
  

    <Grid container sx={{mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Grid item >
                <Captcha setCaptcha={setCaptchaText}
                        setCaptchaInput={setCaptchaInput}
                        captchaInput={captchaInput}
                        captchaError={!!formErrors.captcha}
                        captchaErrorMsg={formErrors.captcha} />

</Grid>
             </Grid>  

              <Box display="flex" justifyContent="center" mt={3} sx={{ gap: 2 }}>
    <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
    >
        Submit
    </Button>
    {/* <Button
       variant="contained"
        color="black"
        onClick={handleReset}
    >
        Reset
    </Button> */}
</Box> 
          
            </Box>
            </FormWrapper>
        </>
    );
});

export default AuditAgencySelection;
