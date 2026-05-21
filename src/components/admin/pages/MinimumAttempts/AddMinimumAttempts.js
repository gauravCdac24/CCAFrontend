import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useState } from 'react';
import Captcha from '../../../global/util/Captcha';
import validatePattern from '../../../global/util/ValidatePattern';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../global/util/FormWrapper';
import MinimumAttempt from '../../../../service/AdminService/MinimumAttempt';

//Errors
const errorMsg = {
    applicationScrutiny: {
        blank: "Please enter application scrutiny attempts.",
         min: "Attempts should be in the range of 1 to 9.",
        format: "Only digits are allowed."
    },
    applicationReview: {
        blank: "Please enter application review attempts.",
        min: "Attempts should be in the range of 1 to 9.",
        format: "Only digits are allowed."
    },
    applicationAudit: {
        blank: "Please enter application audit attempts.",
        min: "Attempts should be in the range of 1 to 9.",
        format: "Only digits are allowed."
    },
    eSignApplicationReview: {
        blank: "Please enter eSignApplication review attempts.",
        min: "Attempts should be in the range of 1 to 9.",
        format: "Only digits are allowed."
    },
    annualAuditReview: {
        blank: "Please enter annual audit review attempts.",
        min: "Attempts should be in the range of 1 to 9.",
        format: "Only digits are allowed."
    },
    captchaError: {
        blank: "Please enter captcha."
    }
};

const AddAddMinimumAttempts = () => {
    const [minimumAttemptsFormValues, setMinimumAttemptsFormValues] = useState({
        applicationScrutiny:'',
        applicationReview:'',
        applicationAudit:'',
        esignApplicationReview:'',
        annualAuditReview:''
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();


    // reset
    const handleReset = () => {
        setMinimumAttemptsFormValues({
        applicationScrutiny:'',
        applicationReview:'',
        applicationAudit:'',
        esignApplicationReview:'',
        annualAuditReview:''
        }); 

        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setMinimumAttemptsFormValues({
                ...minimumAttemptsFormValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {
        const errors = {};

        if(!minimumAttemptsFormValues.annualAuditReview){
            errors.annualAuditReview = errorMsg.annualAuditReview.blank;
        }else if (!(minimumAttemptsFormValues.annualAuditReview > 0 && minimumAttemptsFormValues.annualAuditReview < 10)) {
            errors.annualAuditReview = errorMsg.annualAuditReview.min;
        } else if(! /^\d{1}$/.test(minimumAttemptsFormValues.annualAuditReview)){
            errors.annualAuditReview = errorMsg.annualAuditReview.format;
        }

        if(!minimumAttemptsFormValues.applicationAudit){
            errors.applicationAudit = errorMsg.applicationAudit.blank;
        } else if (!(minimumAttemptsFormValues.applicationAudit > 0 && minimumAttemptsFormValues.applicationAudit < 10)) {
            errors.applicationAudit = errorMsg.applicationAudit.min;
        } else if (! /^\d{1}$/.test(minimumAttemptsFormValues.applicationAudit)) {
            errors.applicationAudit = errorMsg.applicationAudit.format;
        }
        if(!minimumAttemptsFormValues.applicationReview){
            errors.applicationReview = errorMsg.applicationReview.blank;
        }else if (!(minimumAttemptsFormValues.applicationReview > 0 && minimumAttemptsFormValues.applicationReview < 10)) {
            errors.applicationReview = errorMsg.applicationReview.min;
        } else if(! /^\d{1}$/.test(minimumAttemptsFormValues.applicationReview)){
            errors.applicationReview = errorMsg.applicationReview.format;
        }

        if(!minimumAttemptsFormValues.applicationScrutiny){
            errors.applicationScrutiny = errorMsg.applicationScrutiny.blank;
        } else if (!(minimumAttemptsFormValues.applicationScrutiny > 0 && minimumAttemptsFormValues.applicationScrutiny < 10)) {
            errors.applicationScrutiny = errorMsg.applicationScrutiny.min;
        } else if (! /^\d{1}$/.test(minimumAttemptsFormValues.applicationScrutiny)) {
            errors.applicationScrutiny = errorMsg.applicationScrutiny.format;
        }

        if(!minimumAttemptsFormValues.esignApplicationReview){
            errors.esignApplicationReview = errorMsg.eSignApplicationReview.blank;
        } else if (!(minimumAttemptsFormValues.esignApplicationReview > 0 && minimumAttemptsFormValues.esignApplicationReview < 10)) {
            errors.esignApplicationReview = errorMsg.eSignApplicationReview.min;
        } else if (! /^\d{1}$/.test(minimumAttemptsFormValues.esignApplicationReview)) {
            errors.esignApplicationReview = errorMsg.eSignApplicationReview.format;
        }
  
        if(!captchaInput){
            errors.captcha = errorMsg.captchaError.blank;
        }


        return errors;
    };


    const handleFormSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            // Submit form

            if(captchaInput === captchaText){

                setLoading(true);

                //Save
                MinimumAttempt.addNewMinimumAttempt(minimumAttemptsFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add Minimum Attempts',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/minimumattempts")}
                    })

                })
                .catch((err)=>{

                        showAlert({
                            messageTitle: 'Error',
                            messageContent: err.response.data? typeof err.response.data === 'object'? 'Your request cannot be processed at this time. Please try again later.': err.response.data:'Your request cannot be processed at this time. Please try again later.',
                            confirmText: 'Ok',
                        })

                })
                .finally(()=>{
                    setLoading(false);
                   });
            }

        } else {
            setFormErrors(errors);
        }
    };

    const handleBack = () =>{
        navigate("/admin/minimumattempts", { replace: true })
    }

    return (
        <>

            <LoaderProgress open={isLoading} />

                <Box component="div">

                    <Grid container spacing={2} direction={'column'}>

                        <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                            <Button variant="contained"  onClick={handleBack}>
                                <Typography variant="h6">Back</Typography>
                            </Button>
                        </Grid>
                    </Grid>

                    


                </Box>

            
                <FormWrapper headingText="Add Minimum Attempts">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"applicationReview"}>
                                    <Typography variant='body1'>Application Review Attempt*</Typography>
                                </InputLabel>
                                <TextField
                                    id="applicationReview"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Application Review Attempt'
                                    name="applicationReview"
                                    variant='outlined'
                                    error={!!formErrors.applicationReview}
                                    helperText={formErrors.applicationReview || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) =>validatePattern(e, /^[0-9]+$/)}
                                    value={minimumAttemptsFormValues.applicationReview}
                                    size="small"
                                    inputProps={{ maxLength: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"annualAuditReview"}>
                                    <Typography variant='body1'>Annual Audit Review Attempt*</Typography>
                                </InputLabel>
                                <TextField
                                    id="annualAuditReview"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Annual Audit Review Attempt' 
                                    name="annualAuditReview"
                                    variant='outlined'
                                    error={!!formErrors.annualAuditReview}
                                    helperText={formErrors.annualAuditReview || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                    value={minimumAttemptsFormValues.annualAuditReview}
                                    size="small"
                                    inputProps={{ maxLength: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"applicationAudit"}>
                                    <Typography variant='body1'>Application Audit Attempt*</Typography>
                                </InputLabel>
                                <TextField
                                    id="applicationAudit"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Application Audit Attempt'
                                    name="applicationAudit"
                                    variant='outlined'
                                    error={!!formErrors.applicationAudit}
                                    helperText={formErrors.applicationAudit || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                    value={minimumAttemptsFormValues.applicationAudit}
                                    size="small"
                                    inputProps={{ maxLength: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"applicationScrutiny"}>
                                    <Typography variant='body1'>Application Scrutiny Attempt*</Typography>
                                </InputLabel>
                                <TextField
                                    id="applicationScrutiny"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Application Scrutiny Attempt'
                                    name="applicationScrutiny"
                                    variant='outlined'
                                    error={!!formErrors.applicationScrutiny}
                                    helperText={formErrors.applicationScrutiny || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) =>validatePattern(e, /^[0-9]+$/)}
                                    value={minimumAttemptsFormValues.applicationScrutiny}
                                    size="small"
                                    inputProps={{ maxLength: 1 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"esignApplicationReview"}>
                                    <Typography variant='body1'>esignApplication Review Attempt*</Typography>
                                </InputLabel>
                                <TextField
                                    id="esignApplicationReview"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='esign Application Review Attempt'
                                    name="esignApplicationReview"
                                    variant='outlined'
                                    error={!!formErrors.esignApplicationReview}
                                    helperText={formErrors.esignApplicationReview || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                    value={minimumAttemptsFormValues.esignApplicationReview}
                                    size="small"
                                    inputProps={{ maxLength: 1 }}
                                />
                            </Grid>

                        </Grid> 

                        <Captcha setCaptcha={setCaptchaText} 
                                setCaptchaInput={setCaptchaInput}
                                captchaInput={captchaInput}
                                captchaError={!!formErrors.captcha}
                                captchaErrorMsg={formErrors.captcha}/> 

                        <Grid container direction="row" sx={{ mt: 4}} spacing={2} justifyContent="center" alignItems="center">
                                    <Grid item  >
                                        <Button type="submit" fullWidth variant="contained" sx={{maxWidth: '120px' }}>
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item  >
                                        <Button type="button" onClick={handleReset} color="reset" fullWidth variant="contained" sx={{maxWidth: '120px', color: "#FFFFFF" }}>
                                            Reset
                                        </Button>
                                    </Grid>
                        </Grid>                          

                        </Box>


                </FormWrapper>
        
        </>
    );
};

export default AddAddMinimumAttempts;
