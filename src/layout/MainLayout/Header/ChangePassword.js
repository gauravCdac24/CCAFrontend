import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { Box, Grid, Button, Typography, InputLabel, TextField } from '@mui/material';
import Captcha from '../../../components/global/util/Captcha';
import LoaderProgress from '../../../components/global/common/LoaderProgress';
import showAlert from '../../../components/global/common/MessageBox/AlertService';
import FormWrapper from '../../../components/global/util/FormWrapper';
import ValidatePattern from '../../../components/global/util/ValidatePattern';
import AuthService from '../../../service/AuthService/AuthService';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../../../store/Auth/Reducer';
import DoneIcon from '@mui/icons-material/Done';

//Errors
const errorMsg = {
    
    currentpwd: {
        blank: "Please enter current password.",
        length: "The length must be between 8 and 20 characters.",
        format: "Please enter valid password."
    },

    newpwd: {
        blank: "Please enter new password.",
        length: "The length must be between 8 and 20 characters.",
        format: "Please enter valid password."
    },

    confirmpwd: {
        blank: "Please enter confirm password.",
        length: "The length must be between 8 and 20 characters.",
        format: "Please enter valid password.",
        check: "Confirm password do not match with new password"
    },


    captchaError: {
        blank: "Please enter captcha."
    },
};

const ChangePassword = forwardRef(({username}, ref) => {

    const [formValues, setFormValues] = useState({
        username:username,
        currentpwd: '',
        newpwd: '',
        confirmpwd: '',
    });
 
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    
    
    const dispatch = useDispatch();
   
    const handleReset = () => {
        setFormValues({
            currentpwd: '',
            newpwd: '',
            confirmpwd: '',
        });

        setCaptchaInput('');
        setFormErrors({});
    }

    


    const validateForm = () => {
        const errors = {};
    
        


        if (!formValues.currentpwd) {
            errors.currentpwd = errorMsg.currentpwd.blank;
        } else if (formValues.currentpwd.length < 8 || formValues.currentpwd.length > 20) {
            errors.currentpwd = errorMsg.currentpwd.length;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&!]).{8,20}$/.test(formValues.currentpwd)) {
            errors.currentpwd = errorMsg.currentpwd.format;
        }

        if (!formValues.newpwd) {
            errors.newpwd = errorMsg.newpwd.blank;
        } else if (formValues.newpwd.length < 8 || formValues.newpwd.length > 20) {
            errors.newpwd = errorMsg.newpwd.length;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&!]).{8,20}$/.test(formValues.newpwd)) {
            errors.newpwd = errorMsg.newpwd.format;
        }
        
        if (!formValues.confirmpwd) {
            errors.confirmpwd = errorMsg.confirmpwd.blank;
        } else if (formValues.confirmpwd.length < 8 || formValues.confirmpwd.length > 20) {
            errors.confirmpwd = errorMsg.confirmpwd.length;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&!]).{8,20}$/.test(formValues.confirmpwd)) {
            errors.confirmpwd = errorMsg.confirmpwd.format;
        } else if (formValues.newpwd !== formValues.confirmpwd){
            errors.confirmpwd = errorMsg.confirmpwd.check;
        }
    
        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }
    
        return errors;
    };
    const handleFormSubmit = () => {

        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});

            if (captchaInput === captchaText) {

                setLoading(true);

                AuthService.changePassword(formValues)
                    .then((response) => {
                        showAlert({
                            messageTitle: 'Password Change',
                            messageContent: 'Your password has successfully changed, please login again.',
                            confirmText: 'Ok',
                            closeParent: true,
                            onConfirm: () => {
                                dispatch(clearCredentials())
                                window.location.href= '/login';
                            },
                            enableHeaderCloseBtn:false,
                            disableOutsideKeyDown:true,
                            
                        })
                    })
                    .catch((err) => {
                        showAlert({
                            messageTitle: 'Error',
                            messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
                            confirmText: 'Ok',
                        })
                    })
                    .finally(() => {
                        setLoading(false);
                    });
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


    useImperativeHandle(ref, () => {
        return{
            handleReset,
            handleFormSubmit
        }
    })


    // Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormValues({
                ...formValues,
                [name]: value,
            });
        
        
    }; 

    return (
        <>
            <LoaderProgress open={isLoading} />
           
            <FormWrapper headingText="Change Password">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"currentpwd"}>
                                    <Typography variant='body1'>Current Password*</Typography>
                                </InputLabel>
                                <TextField
                                    id="currentpwd"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Current Password'
                                    name="currentpwd"
                                    variant='outlined'
                                    error={!!formErrors.currentpwd}
                                    helperText={formErrors.currentpwd || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9@#$%&!]+$/)}
                                    value={formValues.currentpwd}
                                    size="small"
                                    inputProps={{ maxLength: 20 }}
                                    onPaste={(e)=>e.preventDefault()}
                                />
                            </Grid>


                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"newpwd"}>
                                    <Typography variant='body1'>New Password*</Typography>
                                </InputLabel>
                                <TextField
                                    id="newpwd"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='New Password'
                                    name="newpwd"
                                    type="password"
                                    variant='outlined'
                                    error={!!formErrors.newpwd}
                                    helperText={formErrors.newpwd || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9@#$%&!]+$/)}
                                    value={formValues.newpwd}
                                    size="small"
                                    inputProps={{ maxLength: 20 }}
                                    onPaste={(e)=>e.preventDefault()}
                                />
                            </Grid>
                        


                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"confirmpwd"}>
                                    <Typography variant='body1'>Confirm Password*</Typography>
                                </InputLabel>
                                <TextField
                                    id="confirmpwd"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Confirm Password'
                                    name="confirmpwd"
                                    variant='outlined'
                                    error={!!formErrors.confirmpwd}
                                    helperText={formErrors.confirmpwd || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9@#$%&!]+$/)}
                                    value={formValues.confirmpwd}
                                    size="small"
                                    inputProps={{ maxLength: 20 }}
                                    onPaste={(e)=>e.preventDefault()}
                                />
                            </Grid>

                    </Grid> 

                    <Captcha setCaptcha={setCaptchaText}
                        setCaptchaInput={setCaptchaInput}
                        captchaInput={captchaInput}
                        captchaError={!!formErrors.captcha}
                        captchaErrorMsg={formErrors.captcha} />
                </Box>


                {/*Password policies: */}
                <Grid container direction="column">
                    <Grid item><Typography variant="label"><b>Password must meet the following policies:</b></Typography></Grid>
                    <Grid item sx={{color:  /[a-z]/.test(formValues.newpwd)?"green":''}}>
                        {/[a-z]/.test(formValues.newpwd) && <DoneIcon sx={{fontSize: '12px'}}/>}
                        <Typography variant="label" sx={{ml: 1}}>Lowercase letter (a-z)</Typography>
                    </Grid>
                    <Grid item sx={{color:  /[A-Z]/.test(formValues.newpwd)?"green":''}}>
                        {/[A-Z]/.test(formValues.newpwd) && <DoneIcon sx={{fontSize: '12px'}}/>}
                        <Typography variant="label" sx={{ml: 1}}>Uppercase letter (A-Z)</Typography>
                    </Grid>
                    <Grid item sx={{color:  /[0-9]/.test(formValues.newpwd)?"green":''}}>
                        {/[0-9]/.test(formValues.newpwd) && <DoneIcon sx={{fontSize: '12px'}}/>}  
                        <Typography variant="label" sx={{ml: 1}}>Digit (0-9)</Typography>
                    </Grid>
                    <Grid item sx={{color:  /[@#$%&!]/.test(formValues.newpwd)?"green":''}}>
                        {/[@#$%&!]/.test(formValues.newpwd) && <DoneIcon sx={{fontSize: '12px'}}/>}
                        <Typography variant="label" sx={{ml: 1}}>Special character (@#$%&!)</Typography>
                    </Grid>
                    <Grid item sx={{color:  (formValues.newpwd.length>=8 && formValues.newpwd.length<=20)?"green":''}}>
                        {(formValues.newpwd.length>=8 && formValues.newpwd.length<=20) && <DoneIcon sx={{fontSize: '12px'}}/>}
                        <Typography variant="label" sx={{ml: 1}}>Length 8-20 char</Typography>
                    </Grid>
                </Grid>
                {/*--------------------*/}


            </FormWrapper>
        </>
    );
});

export default ChangePassword;
