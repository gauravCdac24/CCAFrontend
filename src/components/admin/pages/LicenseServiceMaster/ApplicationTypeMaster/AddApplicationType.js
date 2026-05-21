import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';
import MinimumAttempt from '../../../../../service/AdminService/MinimumAttempt';
import ApplicationType from '../../../../../service/AdminService/ApplicationType';

//Errors
const errorMsg = {
    appType: {
        blank: "Please enter application type name.",
         min: "application type name should be in the range of 1 to 17.",
        format: "Only digits are allowed."
    },

    captchaError: {
        blank: "Please enter captcha."
    }
};

const AddApplicationType = () => {
    const [applicationTypeFormValues, setApplicationTypeFormValues] = useState({
        applicationTypeName:'',
      
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();


    // reset
    const handleReset = () => {
        setApplicationTypeFormValues({
            appType:'',
        }); 

        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setApplicationTypeFormValues({
                ...applicationTypeFormValues,
                [name]: value,
            });
        
    };

console.log(applicationTypeFormValues)
    const validateForm = () => {
        const errors = {};

        if(!applicationTypeFormValues.appType){
            errors.appType = errorMsg.appType.blank;
        }else if ((applicationTypeFormValues.appType > 0 && applicationTypeFormValues.appType < 17)) {
            errors.appType = errorMsg.appType.min;
        } else if(!/^[A-Za-z ]+$/.test(applicationTypeFormValues.appType)){
            errors.appType = errorMsg.appType.format;
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
                ApplicationType.addNewApplicationType(applicationTypeFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add Application Type',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/applicationtype")}
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
        navigate("/admin/applicationtype", { replace: true })
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

            
                <FormWrapper headingText="Add Application Type">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"appType"}>
                                    <Typography variant='body1'>Application Type Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="appType"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Application Type Name'
                                    name="appType"
                                    variant='outlined'
                                    error={!!formErrors.appType}
                                    helperText={formErrors.appType || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) =>validatePattern(e, /^[A-Za-z ]+$/)}
                                    value={applicationTypeFormValues.appType}
                                    size="small"
                                    inputProps={{ maxLength: 17 }}
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

export default AddApplicationType;
