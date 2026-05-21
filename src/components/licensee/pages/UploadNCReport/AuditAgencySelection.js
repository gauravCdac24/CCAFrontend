import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText, MenuItem, Select, Typography, InputLabel } from '@mui/material';
import react,{ forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Captcha from '../../../global/util/Captcha';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../global/util/FormWrapper';
import AuditAgency from '../../../../service/AdminService/AuditAgency';
import AuditorCertificateTypeService from '../../../../service/AdminService/AuditorCertificateTypeService';
import AuditService from '../../../../service/AuditService/AuditService';
import { useSelector } from 'react-redux';
import AnnualAuditService from '../../../../service/AnnualAuditService/AnnualAuditService';

// Error Messages
const errorMsg = {
    AuditAgencyName: {
        blank: 'Please select Audit Agency Name.',
    },
    captchaError: {
        blank: 'Please enter captcha.',
    },
};

const AuditAgencySelection = forwardRef(({userName,licenseId}, ref) => {

    console.log("LicenseId",licenseId)
    console.log("userName",userName)

    const [audiAgencyFormValues, setAudiAgencyFormValues] = useState({auditAgencyId:'', auditAgencyName: '' ,licenseeId:licenseId ,applicantUserName:userName});
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [allAuditAgencyList, setAllAuditAgencyList] = useState([]);

    // Reset form values
    const handleReset = () => {
        setAudiAgencyFormValues({ auditAgencyName: '',licenseeId:licenseId });
        setCaptchaInput('');
        setFormErrors({});
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const selectedAgency = allAuditAgencyList.find(
            (agency) => agency.auditAgencyId === value
        );
    
        console.log("Selected Agency:", selectedAgency); 
        console.log("Before Update:", audiAgencyFormValues); 
    
        setAudiAgencyFormValues((prev) => ({
            ...prev,
            [name]: value,
            auditAgencyName:selectedAgency?.auditAgencyName,
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
     const getAllAuditAgencyFrom = () => {
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

        if (!audiAgencyFormValues.auditAgencyName) {
            errors.auditAgencyName = errorMsg.AuditAgencyName.blank;
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
       

        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});

            if (captchaInput === captchaText) {
                setLoading(true);


              console.log("sfgydgc=====>",audiAgencyFormValues)

                alert(audiAgencyFormValues)

                AnnualAuditService.addNewAuditAgencySlection(audiAgencyFormValues)
                    .then((response) =>
                        showAlert({
                            messageTitle: 'Success',
                            messageContent: response.data,
                            confirmText: 'Ok',
                            onConfirm: () => window.location.href = '/licensee/agencyselection',
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
            <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
    <InputLabel htmlFor="auditAgencyId">
        <Typography variant="body1">Audit Agency Name*</Typography>
    </InputLabel>
    <FormControl variant="outlined" size="small" fullWidth>
        <Select
            id="auditAgencyId"
            value={audiAgencyFormValues.auditAgencyName}
            onChange={(e) => {
                handleInputChange(e);
                const selectedAgency = allAuditAgencyList.find(
                    (agency) => agency.auditAgencyId === e.target.value
                );
                setAudiAgencyFormValues((prev) => ({
                    ...prev,
                    auditAgencyName:selectedAgency?.auditAgencyName,
                    name: selectedAgency?.auditAgencyName || '',
                    mobileNo: selectedAgency?.phoneRecord || [],
                    emailId: selectedAgency?.emailId || [],
                }));
            }}
            displayEmpty
            name="auditAgencyId"
            error={!!formErrors.auditAgencyName}
            MenuProps={{
                sx: { zIndex: 110015 },
            }}
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
        <FormHelperText error>{formErrors.auditAgencyName}</FormHelperText>
    </FormControl>
</Grid>

{/* Render additional rows based on the selected agency */}
{audiAgencyFormValues.auditAgencyName && (
    <>
        <Grid container spacing={2} sx={{ml:0.5}}>
            <Grid item sm>
                <Typography variant="body2"><strong>Name:</strong></Typography>
            </Grid>
            <Grid item sm>
                <Typography variant="body2">{audiAgencyFormValues.name || 'N/A'}</Typography>
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ml:0.5}}>
            <Grid item xs>
                <Typography variant="body2"><strong>Mobile No.:</strong></Typography>
            </Grid>
            <Grid item sm>
                <Typography variant="body2">
                    {audiAgencyFormValues.mobileNo?.length > 0 ? audiAgencyFormValues.mobileNo[0].mobile : 'N/A'}
                </Typography>
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ml:0.5}}>
            <Grid item xs>
                <Typography variant="body2"><strong>Email ID:</strong></Typography>
            </Grid>
            <Grid item sm>
                <Typography variant="body2">
                    {audiAgencyFormValues.emailId?.length > 0 ? audiAgencyFormValues.emailId[0].email : 'N/A'}
                </Typography>
            </Grid>
        </Grid>
    </>
)}


                <Grid item xs={12}>
                <Captcha setCaptcha={setCaptchaText}
                        setCaptchaInput={setCaptchaInput}
                        captchaInput={captchaInput}
                        captchaError={!!formErrors.captcha}
                        captchaErrorMsg={formErrors.captcha} />

</Grid>
                
            </Grid>
            </Box>
            </FormWrapper>
        </>
    );
});

export default AuditAgencySelection;
