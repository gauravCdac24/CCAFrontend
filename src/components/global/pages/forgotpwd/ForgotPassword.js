import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Captcha from '../../util/Captcha';
import {Typography } from '@mui/material';
import { useState, } from 'react';
import CustomSnackBar from '../../util/CustomSanckBar';
import { InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import AuthService from '../../../../service/AuthService/AuthService';
import {decrypt} from "../../util/EncryptDecrypt" ;
import LoaderProgress from '../../common/LoaderProgress';
import validatePattern from '../../util/ValidatePattern';
import FormWrapper from '../../util/FormWrapper';
import ForgotOtp from './ForgotOtp';

const errorMsg = {
    captchaError: {
        blank: "Captcha field cannot be empty."
    },
    emailerror:{
        blank: "Email field cannot be empty.",
        format: "Please enter valid email id."
    },
}


const ForgotPassword = () =>{

    const [formValues, setFormValues] = useState({
        emailid: '',
    })

    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [snackBarSeverity, setSnackBarSeverity] = useState('');
    const [openOTP, setOpenOTP] = useState(false);
    const [isLoading, setLoading] = useState(false);
    
    // Get Footer Height 
    const footerHeight = useSelector((state)=>state.footerSize.fheight);
    // Get Title Height
    const titleHeight = useSelector((state)=>state.titleHeight.theight);
    


    // Input Change

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    // Validate Forms 

    const validateForm = () =>{

        const errors = {};

        const emailRegex =  /^[a-zA-Z0-9_.]{3,}@[A-Za-z]{2,}\.[A-Za-z.]+$/;

        if(!formValues.emailid){
            errors.emailid = errorMsg.emailerror.blank;
        }else if(!emailRegex.test(formValues.emailid)){
            errors.emailid = errorMsg.emailerror.format;
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


            setFormErrors({});

            if(captchaInput === captchaText){

                setLoading(true);

                
                AuthService.validateEmailId(formValues)
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
            setFormErrors(errors);
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
                            <Grid item><Typography variant='h3'> Forgot Password </Typography></Grid>
                            
                            
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
                            <Typography variant='body1'>Enter Email Id*</Typography>
                        </InputLabel>

                        <TextField
                            id="emailid"
                            margin="dense"
                            required
                            fullWidth
                            placeholder='Enter Email Id'
                            name="emailid"
                            variant='outlined'
                            error={!!formErrors.emailid}
                            helperText={!!formErrors.emailid?formErrors.emailid: ''}
                            onChange={handleInputChange}
                            onKeyDown={(e)=>validatePattern(e, /^[A-Za-z0-9._@]+$/)}
                            value={formValues.emailid}
                            size="small"
                            inputProps={{ maxLength: 50 }}
                        />
                       
                        
                        <Captcha setCaptcha={setCaptchaText} 
                                 setCaptchaInput={setCaptchaInput}
                                 captchaInput={captchaInput}
                                 captchaError={!!formErrors.captcha}
                                 captchaErrorMsg={formErrors.captcha}/>

                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1}}
                        >
                        Submit
                        </Button>
                        <Grid container  sx={{
                            marginTop: "1%",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        </Grid>
                    </Box>
                
            </FormWrapper>
        </Box> 
    </Box>

    <ForgotOtp emailid={formValues.emailid} setOpen={setOpenOTP} open={openOTP} handleClose={()=>setOpenOTP(false)} />

    </>
    )
}

export default ForgotPassword;