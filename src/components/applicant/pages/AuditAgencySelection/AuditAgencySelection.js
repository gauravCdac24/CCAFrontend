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
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import { useSelector } from 'react-redux';
import AnnexureA2Main from './AnnexureA2/AnnexureA2Main';
import AuditControls from './AuditControls';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import { canSelectAuditAgency } from '../../../global/util/licenseAcquisitionWorkflow';

// Error Messages
const errorMsg = {
    AuditAgencyName: {
        blank: 'Please select audit agency',
    },
    captchaError: {
        blank: 'Please enter captcha.',
    },
};

const AuditAgencySelection = forwardRef(({intentAppId}, ref) => {

    const userName = useSelector((state) => state.jwtAuthentication.username);
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);
    const navigate = useNavigate();
    const { id } = useParams();
    const intentAppIds = decrypt(id);
    console.log("intentAppIds",intentAppIds)
    const [audiAgencyFormValues, setAudiAgencyFormValues] = useState({ auditAgencyId: '' ,intentAppId:intentAppIds ,applicantUserName:userName});
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [allAuditAgencyList, setAllAuditAgencyList] = useState([]);
    const [isAccessAllowed, setIsAccessAllowed] = useState(null);

    // Reset form values
    const handleReset = () => {
        setAudiAgencyFormValues({ auditAgencyId: '',intentAppId:intentAppId });
        setCaptchaInput('');
        setFormErrors({});
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const normalizedValue = value === '' || value == null ? '' : String(value);
        const selectedAgency = allAuditAgencyList.find(
            (agency) => String(agency.auditAgencyId) === normalizedValue
        );

        setAudiAgencyFormValues((prev) => ({
            ...prev,
            [name]: normalizedValue,
            name: selectedAgency?.auditAgencyName || '',
            mobileNo: selectedAgency?.mobileNo || '',
            emailId: selectedAgency?.emailId || '',
        }));
    };
    

    useImperativeHandle(ref, ()=>{

        return{
            handleReset,
            handleSubmit
        }

    })

    // Fetch active audit agencies only (for applicant dropdown)
    const getAllAuditAgency = () => {
        setLoading(true);
        AuditAgency.getAllActiveAuditAgencyList()
            .then((response) => {
                setAllAuditAgencyList(response.data || []);
            })
            .catch(() =>
                // Fallback: filter Active from full list if active-only API is unavailable
                AuditAgency.getAllAuditAgencyList().then((response) => {
                    const list = Array.isArray(response.data)
                        ? response.data.filter((agency) => agency?.status === 'Active')
                        : [];
                    setAllAuditAgencyList(list);
                })
            )
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

    useEffect(() => {
        let isMounted = true;

        const verifyAuditAgencyAccess = async () => {
            setLoading(true);
            try {
                const response = await ApplicationForm.getApplicationDetailsFormByUsername(userName);
                const applicationStatus = response.data?.intentApp?.applicationStatus;

                if (!canSelectAuditAgency(applicationStatus)) {
                    if (isMounted) {
                        setIsAccessAllowed(false);
                    }
                    showAlert({
                        messageTitle: 'Submission Complete',
                        messageContent:
                            'Audit agency and Annexure A2 have already been submitted. Further edits are not allowed.',
                        confirmText: 'Ok',
                        onConfirm: () => navigate(`${rolePath}/applicationform`),
                    });
                    navigate(`${rolePath}/applicationform`);
                    return;
                }

                if (isMounted) {
                    setIsAccessAllowed(true);
                }
            } catch (err) {
                if (isMounted) {
                    setIsAccessAllowed(true);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (userName) {
            verifyAuditAgencyAccess();
        } else {
            setIsAccessAllowed(true);
        }

        return () => {
            isMounted = false;
        };
    }, [userName, rolePath, navigate]);

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
        const errors = validateForm();

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
                    onConfirm: () => handleConfrimSubmit()
                });
            } else {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Invalid Captcha',
                    confirmText: 'Ok',
                });
            }
        } else {
            setFormErrors(errors);
            if (errors.auditAgencyId) {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: errorMsg.AuditAgencyName.blank,
                    confirmText: 'Ok',
                });
            }
        }
    };


    const handleConfrimSubmit = () => {
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            setFormErrors({});

            if (captchaInput === captchaText) {
                setLoading(true);

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
            if (errors.auditAgencyId) {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: errorMsg.AuditAgencyName.blank,
                    confirmText: 'Ok',
                });
            }
        }
    };

    if (isAccessAllowed === false || isAccessAllowed === null) {
        return <LoaderProgress open={true} />;
    }

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
                    (agency) => String(agency.auditAgencyId) === String(e.target.value)
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
                    <MenuItem key={agency.auditAgencyId} value={String(agency.auditAgencyId)}>
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
  <AuditControls selectedAuditAgencyId={audiAgencyFormValues.auditAgencyId} />
</Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Typography variant="h6">
                <b>Note:</b>Certifying Authority is responsible to provide details present as below.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
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
