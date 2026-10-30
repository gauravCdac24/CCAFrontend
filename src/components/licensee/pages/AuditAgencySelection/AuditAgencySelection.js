import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText, MenuItem, Select, Typography, InputLabel } from '@mui/material';
import react,{ forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Captcha from '../../../global/util/Captcha';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useParams, useLocation } from 'react-router-dom';
import FormWrapper from '../../../global/util/FormWrapper';
import AuditAgency from '../../../../service/AdminService/AuditAgency';
import AuditorCertificateTypeService from '../../../../service/AdminService/AuditorCertificateTypeService';
import AuditService from '../../../../service/AuditService/AuditService';
import AnnualAuditService from '../../../../service/AnnualAuditService/AnnualAuditService';
import { useSelector } from 'react-redux';
import AnnexureA2Main from './AnnexureA2/AnnexureA2Main';
import AuditControls from './AuditControls';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import {
    setAnnualAuditScheduleId,
    clearAnnualAuditScheduleId,
} from '../../../global/util/annualAuditSchedule';
import {
    setRenewalIntentAppId,
    clearRenewalIntentAppId,
} from '../../../global/util/renewalIntentApp';
import RenewApplicationForm from '../../../../service/RenewLicenseService/ApplicationForm';

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
    const location = useLocation();
    const isAnnualAuditFlow = location.pathname.includes('/agencyselection/');
    const isRenewalFlow = location.pathname.includes('/renewallicense/');
    const { id } = useParams();
    const routeId = decrypt(id);
    const routeParts = routeId ? routeId.split(',') : [];
    const routeUserName = routeParts[0] || userName;
    const auditScheduleId = routeParts[1] || '';
    console.log("routeId", routeId)
    const [audiAgencyFormValues, setAudiAgencyFormValues] = useState(
        isAnnualAuditFlow
            ? {
                auditAgencyId: '',
                auditAgencyName: '',
                applicantUserName: routeUserName,
                licenseeId: routeUserName,
                auditScheduleId,
            }
            : { auditAgencyId: '', intentAppId: routeId, applicantUserName: userName }
    );
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [allAuditAgencyList, setAllAuditAgencyList] = useState([]);
    const [agencyAlreadySelected, setAgencyAlreadySelected] = useState(false);
    const [annexureReady, setAnnexureReady] = useState(!isRenewalFlow);
    const [annexureError, setAnnexureError] = useState('');
    const readOnly = location.state?.readOnly === true;

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
            auditAgencyName: selectedAgency?.auditAgencyName || '',
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

    // Fetch active audit agencies only (for licensee dropdown)
    const getAllAuditAgency = () => {
        setLoading(true);
        AuditAgency.getAllActiveAuditAgencyList()
            .then((response) => {
                setAllAuditAgencyList(response.data || []);
            })
            .catch(() =>
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

    const loadExistingAgencySelection = () => {
        if (!isAnnualAuditFlow || !auditScheduleId) {
            return;
        }
        AnnualAuditService.getAuditAgencySelectionBySchedule(auditScheduleId)
            .then((response) => {
                const data = response.data;
                if (!data?.auditAgencyId) {
                    return;
                }
                const selectedAgency = allAuditAgencyList.find(
                    (agency) => String(agency.auditAgencyId) === String(data.auditAgencyId)
                );
                setAgencyAlreadySelected(true);
                setAudiAgencyFormValues((prev) => ({
                    ...prev,
                    auditAgencyId: selectedAgency?.auditAgencyId ?? data.auditAgencyId,
                    auditAgencyName: data.auditAgencyName || selectedAgency?.auditAgencyName || '',
                    name: data.auditAgencyName || selectedAgency?.auditAgencyName || '',
                    mobileNo: selectedAgency?.phoneRecord || selectedAgency?.mobileNo || prev.mobileNo,
                    emailId: selectedAgency?.emailId || prev.emailId,
                }));
            })
            .catch(() => {
                // No existing selection is valid for first-time agency selection.
            });
    };

    useEffect(() => {
        if (allAuditAgencyList.length > 0) {
            loadExistingAgencySelection();
        }
    }, [allAuditAgencyList, auditScheduleId, isAnnualAuditFlow]);

    useEffect(() => {
        if (isAnnualAuditFlow && auditScheduleId) {
            setAnnualAuditScheduleId(auditScheduleId);
        }
        return () => {
            if (isAnnualAuditFlow) {
                clearAnnualAuditScheduleId();
            }
        };
    }, [auditScheduleId, isAnnualAuditFlow]);

    useEffect(() => {
        if (!isRenewalFlow) {
            clearRenewalIntentAppId();
            setAnnexureReady(true);
            setAnnexureError('');
            return undefined;
        }

        let cancelled = false;
        setAnnexureReady(false);
        setAnnexureError('');
        clearRenewalIntentAppId();

        RenewApplicationForm.getApplicationDetailsFormByUsername(userName)
            .then((response) => {
                const renewalIntentAppId = response?.data?.intentApp?.intentAppId;
                if (cancelled) {
                    return;
                }
                if (!renewalIntentAppId) {
                    setAnnexureError('Unable to load the renewal application for Annexure A2.');
                    return;
                }
                setRenewalIntentAppId(renewalIntentAppId);
                setAnnexureReady(true);
            })
            .catch(() => {
                if (!cancelled) {
                    clearRenewalIntentAppId();
                    setAnnexureError('Unable to load the renewal application for Annexure A2.');
                }
            });

        return () => {
            cancelled = true;
            clearRenewalIntentAppId();
        };
    }, [isRenewalFlow, userName]);

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
                    messageContent: agencyAlreadySelected
                        ? 'Are you sure you want to update the selected audit agency?'
                        : 'Are you sure, you want to submit? You cannot select the audit agency again. Please verify before the submit audit agency.',
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

                const submitRequest = isAnnualAuditFlow
                    ? AnnualAuditService.addNewAuditAgencySlection(audiAgencyFormValues)
                    : AuditService.addNewAuditAgencySlection(audiAgencyFormValues);
                const successRedirect = isAnnualAuditFlow
                    ? '/licensee/agencyselection'
                    : '/licensee/renewallicense';

                submitRequest
                    .then((response) =>
                        showAlert({
                            messageTitle: 'Success',
                            messageContent: response.data,
                            confirmText: 'Ok',
                            onConfirm: () => { window.location.href = successRedirect; },
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
            <LoaderProgress open={isLoading || (isRenewalFlow && !annexureReady && !annexureError)} />
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
            disabled={readOnly}
            onChange={(e) => {
                handleInputChange(e);
                const selectedAgency = allAuditAgencyList.find(
                    (agency) => agency.auditAgencyId === e.target.value
                );
                setAudiAgencyFormValues((prev) => ({
                    ...prev,
                    auditAgencyName: selectedAgency?.auditAgencyName || '',
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
{annexureError ? (
  <Typography color="error" sx={{ mt: 2 }}>{annexureError}</Typography>
) : (
  annexureReady && <AnnexureA2Main />
)}
  

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
        disabled={readOnly}
    >
        {agencyAlreadySelected ? 'Update' : 'Submit'}
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
