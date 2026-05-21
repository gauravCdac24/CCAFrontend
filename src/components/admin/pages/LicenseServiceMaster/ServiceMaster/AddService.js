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
import ServiceMaster from '../../../../../service/AdminService/ServiceMaster';

//Errors
const errorMsg = {
    serviceName: {
        blank: "Please enter service name.",
         min: "service name should be in the range of 1 to 17.",
        format: "please enter a valid format"
    },

    captchaError: {
        blank: "Please enter captcha."
    }
};

const AddService = () => {
    const [serviceFormValues, setServiceFormValues] = useState({
        serviceTitle:'',
      
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();


    // reset
    const handleReset = () => {
        setServiceFormValues({
            serviceTitle:'',
        }); 

        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setServiceFormValues({
                ...serviceFormValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {
        const errors = {};

        if(!serviceFormValues.serviceTitle){
            errors.serviceName = errorMsg.serviceName.blank;
        }else if ((serviceFormValues.serviceTitle > 0 && serviceFormValues.serviceTitle < 10)) {
            errors.serviceName = errorMsg.serviceName.min;
        } else if(!/^[A-Za-z ]+$/.test(serviceFormValues.serviceName)){
            errors.serviceName = errorMsg.serviceName.format;
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
                ServiceMaster.addNewService(serviceFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add Service',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/service")}
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
        navigate("/admin/service", { replace: true })
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

            
                <FormWrapper headingText="Add Service Name">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"serviceTitle"}>
                                    <Typography variant='body1'>Service Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="serviceTitle"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Service Name'
                                    name="serviceTitle"
                                    variant='outlined'
                                    error={!!formErrors.serviceName}
                                    helperText={formErrors.serviceName || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) =>validatePattern(e, /^[A-Za-z]+$/)}
                                    value={serviceFormValues.serviceName}
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

export default AddService;
