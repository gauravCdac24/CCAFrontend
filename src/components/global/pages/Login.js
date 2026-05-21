import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Captcha from '../util/Captcha';
import {  IconButton, Typography } from '@mui/material';
import { useState, } from 'react';
import {VisibilityOff, Visibility} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import CustomSnackBar from '../util/CustomSanckBar';
import { InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import OTP from '../util/OTP';
import AuthService from '../../../service/AuthService/AuthService';
import {decrypt} from "../util/EncryptDecrypt" ;
import LoaderProgress from '../common/LoaderProgress';
import validatePattern from '../util/ValidatePattern';
import FormWrapper from '../util/FormWrapper';

const errorMsg = {
    captchaError: {
        blank: "Captcha field cannot be empty."
    },
    passwordError:{
        blank: "Password field cannot be empty.",
        length: "Minimum password length is 3 and maximum 75."
    },
    usernameError:{
        blank: "Username field cannot be empty.",
        length: "Minimum username length is 3 and maximum 20."
    }
}


const Login = () =>{

    const [loginFormValues, setLoginFormValues] = useState({
        username: '',
        password: '',
    })

    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [loginFormErrors, setLoginFormErrors] = useState({});
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [snackBarSeverity, setSnackBarSeverity] = useState('');
    const [openOTP, setOpenOTP] = useState(false);
    const [isLoading, setLoading] = useState(false);



    //Show & Hide Password
    const [showPassword, setShowPassowrd] = useState(false);
    
    // Get Footer Height 
    const footerHeight = useSelector((state)=>state.footerSize.fheight);
    // Get Title Height
    const titleHeight = useSelector((state)=>state.titleHeight.theight);
    


    // Input Change

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setLoginFormValues({
            ...loginFormValues,
            [name]: value,
        });
    }

    // Validate Forms 

    const validateForm = () =>{

        const errors = {};

        if(!loginFormValues.username){
            errors.username = errorMsg.usernameError.blank;
        }else if (loginFormValues.username.length < 3 || loginFormValues.username.length > 20){
            errors.username = errorMsg.usernameError.length;
        }

        if (!loginFormValues.password) {
            errors.password = errorMsg.passwordError.blank;
          } else if (loginFormValues.password.length < 3 || loginFormValues.password.length > 75) {
            errors.password = errorMsg.passwordError.length;
        }

        if(!captchaInput){
            errors.captcha = errorMsg.captchaError.blank;
        }

        return errors;

    }

    //Form Submit
    const handleFormSubmit = (e) => {

        e.preventDefault();

        const errors = validateForm();

        if(Object.keys(errors).length === 0){


            setLoginFormErrors({});

            if(captchaInput === captchaText){

                setLoading(true);

                AuthService.authenticate(loginFormValues)
                .then((response)=>{
                    if(decrypt(response.data) === "SUCCESS"){

                        setOpenOTP(true);
                    }else{
                        setSnackBarMessage(response.data);
                        setSnackBarSeverity('error');    
                        setSnackBarOpen(true);
                    
    
                    }
                })
                .catch((err)=>{

                    if(err?.response?.data?.error){
                        setSnackBarMessage("The server is busy. Please try again later.");
                    }else if(err?.response?.data){
                        setSnackBarMessage(err.response.data);
                    }else{
                        setSnackBarMessage("The server is busy. Please try again later.");
                    }

                    setSnackBarSeverity('error');    
                    setSnackBarOpen(true);
                })
                .finally(()=>{
                    setLoading(false);
                   });

            }else{
                
                setSnackBarMessage("Incorrect CAPTCHA!!");    
                setSnackBarSeverity("error");
                setSnackBarOpen(true);

            }


        }else{
            setLoginFormErrors(errors);
        }
        
       
    }

    return(
        <>

    <LoaderProgress open={isLoading} />


        <Box sx={{ display: 'flex', flexDirection: 'column',
           }}>

            

        <Box 
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',  
                minHeight: `calc(100vh - ${footerHeight + titleHeight}px)`
            }}
        >
            
            
            <FormWrapper>

                

                    <Paper elevation={4} sx={{mt: -3, 
                            backgroundColor: "primary.main", 
                            color: "#FFFFFF",
                            maxWidth: "420px", 
                            minHeight: "70px", 
                            borderRadius: "10px",
                            display:"flex", 
                            justifyContent: "center", 
                            alignItems: "center" ,
                            padding: 0,
                        }}>

                        <Grid container direction="column" sx={{ display:"flex", 
                            justifyContent: "center", 
                            alignItems: "center"}}>
                            <Grid item><Typography variant='h3'> Sign In </Typography></Grid>
                            
                            
                        </Grid>

                    </Paper>

                    <Box component="form"  noValidate sx={{ mt: 2 }} onSubmit={handleFormSubmit}>

                        <CustomSnackBar open={snackBarOpen} 
                            onClose={()=>setSnackBarOpen(false)} 
                            message={snackBarMessage}
                            autoHideDuration={5000}
                            severity={snackBarSeverity}
                        />


                        <InputLabel
                            shrink={false}
                            htmlFor={"username"}
                        >
                            <Typography variant='body1'>Enter Username*</Typography>
                        </InputLabel>

                        <TextField
                            id="username"
                            margin="dense"
                            required
                            fullWidth
                            placeholder='Enter Username'
                            name="username"
                            variant='outlined'
                            error={!!loginFormErrors.username}
                            helperText={!!loginFormErrors.username?loginFormErrors.username: ''}
                            onChange={handleInputChange}
                            onKeyDown={(e)=>validatePattern(e, /^[A-Za-z0-9]+$/)}
                            value={loginFormValues.username}
                            size="small"
                            inputProps={{ maxLength: 20 }}
                        />
                        <InputLabel
                            shrink={false}
                            htmlFor={"password"}
                            sx={{mt: 1}}
                        >
                            <Typography variant='body1'>Enter Password*</Typography>
                        </InputLabel>
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            name="password"
                            placeholder="Enter Password"
                            type={showPassword?'text':'password'}
                            id="password"
                            error={!!loginFormErrors.password}
                            helperText={!!loginFormErrors.password?loginFormErrors.password: ''}                            
                            onChange = {handleInputChange}
                            value = {loginFormValues.password}
                            size="small"
                            variant='outlined'
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end" >
                                    <IconButton aria-label="Toggle password visibility"
                                                onClick={()=>setShowPassowrd(!showPassword)}
                                                edge="end">
                                        {showPassword?<VisibilityOff />:<Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              inputProps={{ maxLength: 75 }}
                            onPaste={(e)=>e.preventDefault()}
                            
                        />
                        
                        <Captcha setCaptcha={setCaptchaText} 
                                 setCaptchaInput={setCaptchaInput}
                                 captchaInput={captchaInput}
                                 captchaError={!!loginFormErrors.captcha}
                                 captchaErrorMsg={loginFormErrors.captcha}/>

                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1}}
                        >
                        Sign In
                        </Button>
                        <Grid container  sx={{
                            marginTop: "2%",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }} direction="row">

                            <Grid item xs={5} sx={{textAlign: 'right'}}>
                                <Link href="/forgotpwd" variant="body1">
                                Forgot password?
                                </Link>
                            </Grid>

                            <Grid item xs={1} sx={{textAlign: 'right'}}>
                               
                            </Grid>
                            
                            <Grid item xs={5} sx={{textAlign: 'left'}}>
                                <Link href="/intentregistration" variant="body1">
                                New Registration
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                
            </FormWrapper>
        </Box> 
    </Box>

    <OTP userName={loginFormValues.username} open={openOTP} handleClose={()=>setOpenOTP(false)} />

    </>
    )
}

export default Login;