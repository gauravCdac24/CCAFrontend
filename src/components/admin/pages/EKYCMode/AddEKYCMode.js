import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useState } from 'react';
import Captcha from '../../../global/util/Captcha';
import validatePattern from '../../../global/util/ValidatePattern';
import EKYCModeService from '../../../../service/AdminService/EKYCModeService';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../global/util/FormWrapper';
import { useSelector } from 'react-redux';

//Errors
const errorMsg = {
    ekycModeTitle: {
        blank: "Please enter EKYC Mode.",
        length: "The length must be between 3 and 150 characters.",
        format: "Only alphabets and space are allowed."
    },

    isApprovalRequired:{
        blank: "Please select whether approval is required."
    },

    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const AddEKYCMode = () => {
    const [formValues, setFormValues] = useState({
        ekycModeTitle:'',
        isApprovalRequired: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);


    // reset
    const handleReset = () => {
        setFormValues({
            ekycModeTitle: '',
            isApprovalRequired: ''
        }); 

        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormValues({
                ...formValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {
        const errors = {};

        if(!formValues.ekycModeTitle){
            errors.ekycModeTitle = errorMsg.ekycModeTitle.blank;
        }

        if(!formValues.ekycModeTitle){
            errors.ekycModeTitle = errorMsg.ekycModeTitle.blank;
        } else if (formValues.ekycModeTitle.length < 3 || formValues.ekycModeTitle.length > 150) {
            errors.ekycModeTitle = errorMsg.ekycModeTitle.length;
        } else if(!/^[A-Za-z ]+$/.test(formValues.ekycModeTitle)){
            errors.ekycModeTitle = errorMsg.ekycModeTitle.format;
        }

        if(!formValues.isApprovalRequired){
            errors.isApprovalRequired = errorMsg.isApprovalRequired.blank;
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
                EKYCModeService.addNewEKYCMode(formValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add EKYC Mode',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate(`${rolePath}/ekycmode`)},
                        enableHeaderCloseBtn: false,
                        disableOutsideKeyDown: true
                    })

                })
                .catch((err)=>{

                        showAlert({
                            messageTitle: 'Error',
                            messageContent: err.response.data? typeof err.response.data === 'object'? 'Your request cannot be processed at this time. Please try again later.': err.response.data:'Your request cannot be processed at this time. Please try again later.',
                            confirmText: 'Ok',
                            enableHeaderCloseBtn: true,
                            disableOutsideKeyDown: false
                        })

                })
                .finally(()=>{
                    setLoading(false);
                   });
            }else{
                showAlert({
                    messageTitle: 'Error',
                    messageContent: "Invalid Captcha, try again!!",
                    confirmText: 'Ok',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false
                })
            }

        } else {
            setFormErrors(errors);
        }
    };

    const handleBack = () =>{
        navigate(`${rolePath}/ekycmode`, { replace: true })
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

            
                <FormWrapper headingText="Add EKYC Mode">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"ekycModeTitle"}>
                                    <Typography variant='body1'>EKYC Mode*</Typography>
                                </InputLabel>
                                <TextField
                                    id="ekycModeTitle"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='EKYC Mode'
                                    name="ekycModeTitle"
                                    variant='outlined'
                                    error={!!formErrors.ekycModeTitle}
                                    helperText={formErrors.ekycModeTitle || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                    value={formValues.ekycModeTitle}
                                    size="small"
                                    inputProps={{ maxLength: 150 }}
                                />
                            </Grid>



                            <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor="isApprovalRequired">
                                        <Typography variant='body1'>Is Approval Required*</Typography>
                                    </InputLabel>
                                    <FormControl component="fieldset" sx={{ mt: 1 }}>
                                        <Grid container direction="row" spacing={4}>
                                            <Grid item>
                                                <FormControlLabel
                                                    control={<Checkbox />}
                                                    label="Yes"
                                                    name="isApprovalRequired"
                                                    checked={formValues.isApprovalRequired === 'true'}
                                                    onChange={() => handleInputChange({ target: { name: 'isApprovalRequired', value: 'true' } })}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <FormControlLabel
                                                    control={<Checkbox />}
                                                    label="No"
                                                    name="isApprovalRequired"
                                                    checked={formValues.isApprovalRequired === 'false'}
                                                    onChange={() => handleInputChange({ target: { name: 'isApprovalRequired', value: 'false' } })}
                                                />
                                            </Grid>
                                        </Grid>
                                        {formErrors.isApprovalRequired && (
                                            <FormHelperText error sx={{ ml: 0 }}>{formErrors.isApprovalRequired}</FormHelperText>
                                        )}
                                    </FormControl>
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

export default AddEKYCMode;
