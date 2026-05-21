import { useState } from "react"
import Timer from "./Timer";
import { Box, InputLabel, Typography, TextField, Button, Link } from "@mui/material";
import CustomSnackBar from "./CustomSanckBar";
import AuthService from "../../../service/AuthService/AuthService";
import RoleMasterService from "../../../service/AdminService/RoleMasterService";
import { useDispatch } from "react-redux";
import {setCredentials, clearCredentials} from "../../../store/Auth/Reducer";
import {Navigate, Routes, useLocation, useNavigate} from 'react-router-dom';
import {Dialog, DialogTitle, DialogContent} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {decrypt} from "./EncryptDecrypt" ;
import LoaderProgress from "../common/LoaderProgress";
import validatePattern from "./ValidatePattern";

const errorMsg = {
    otpError: {
        blank: "OTP field cannot be empty."
    }
    
}


const OTP = ({userName, open, handleClose}) =>{

const [userotp, setUserotp] = useState('');
const [snackBarOpen, setSnackBarOpen] = useState(false);
const [snackBarMessage, setSnackBarMessage] = useState('');
const [snackBarSeverity, setSnackBarSeverity] = useState('');
const [otpFormErrors, setOtpFormErrors] = useState({});
const [isLoading, setLoading] = useState(false);
const [isOtpLinkActive, setIsOtpLinkActive] = useState(false);
const [timeLimit, setTimeLimit] = useState(60);


const dispatch = useDispatch();
const navigate = useNavigate();
const location = useLocation();
    

   // Validate Forms 

   const validateForm = () =>{

    const errors = {};

    if(!userotp){
        errors.otp = errorMsg.otpError.blank;
    }

    return errors;

}


    //Form Submit
    const handleFormSubmit = (e) => {

        e.preventDefault();

        const errors = validateForm();

        if(Object.keys(errors).length === 0){


            setOtpFormErrors({});

           
                setLoading(true);

            AuthService.validateOTP(userName, userotp)
            .then((response)=>{

                

                if(decrypt(response.data.status) === "VERIFIED"){
                    const userCredentials = {
                        name: response.data.name,
                        username: response.data.userName,
                        refreshToken: response.data.refreshToken,
                        roles: response.data.roles,
                        jwt: response.data.jwt,
                        currentRole: response.data.roles[0]
                    }

                    
                    

                    RoleMasterService.getRoleByName(userCredentials.currentRole.substring(5))
                    .then((response)=>{

                        const roleDetails= response.data;

                        userCredentials.rolePath = `/${roleDetails.path}`;
                        userCredentials.homePath = `/${roleDetails.homePage}`;
                        userCredentials.roleName = roleDetails.description;
                        

                        dispatch(setCredentials(userCredentials));

                        navigate(`/${roleDetails.homePage}`, { replace: true, state: { from: location } });
                       
                    })
                    .catch((err)=>{

                    })  


                    

                }
            }) .catch((err)=>{

     
                if(err.response.data.error){
                    setSnackBarMessage("The server is busy. Please try again later.");
                }
                else if(err.response.data){
          
                    setSnackBarMessage(err.response.data);
          
                }else{
                    setSnackBarMessage("The server is busy. Please try again later.");
                }
          
                setSnackBarSeverity("error");
                setSnackBarOpen(true);
              })
          
              .finally(()=>{
                setLoading(false);
               });

        

        }else{
            setOtpFormErrors(errors);
        }
        
       
    }


    // handle resend otp

  const handleResendOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    AuthService.resendLoginOTP(userName)
         .then((response)=>{  
          setUserotp('');
          setIsOtpLinkActive(false);
         })
         .catch((err) => {
            setSnackBarMessage("The server is busy. Please try again later.");
            setSnackBarSeverity('error');    
            setSnackBarOpen(true);
         })
         .finally(()=>{
            setLoading(false);
         })

  }



return(

    <>

    <LoaderProgress open={isLoading} />

    <Dialog 
        open={open}
        aria-labelledby="alert-dialog-title"
        aira-describedby="alert-dialog-description"
        disableEscapeKeyDown={true}
    >

        <DialogTitle id="alert-dialog-title"  sx={{backgroundColor:"primary.main", color: "#FFFFFF", p:0, padding: '3px 3px 3px 12px'}}>
            

                <Box display="flex" alignItems="center">
                <Box flexGrow={1} ><Typography variant="h5">OTP Verification</Typography></Box>
                <Box>
                    <IconButton onClick={handleClose}>
                          <CloseIcon sx={{color: "#FFFFFF"}}/>
                    </IconButton>
                </Box>
          </Box>

            
        </DialogTitle>

        <DialogContent dividers={true} sx={{backgroundColor: "formcolor.main"}}>

        

        <Box component="form"  noValidate sx={{ mt: 2 }} onSubmit={handleFormSubmit}>
            <CustomSnackBar open={snackBarOpen} 
                onClose={()=>setSnackBarOpen(false)} 
                message={snackBarMessage}
                autoHideDuration={5000}
                severity={snackBarSeverity}
             />

            <InputLabel
                shrink={false}
                htmlFor={"otp"}
            >
                <Typography variant='body1' >Enter OTP*</Typography>
            </InputLabel>
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="otp"
                            placeholder='Enter OTP'
                            name="otp"
                            inputProps={{ maxLength: 6 }}
                            onChange={(e)=>setUserotp(e.target.value)}
                            error={!!otpFormErrors.otp}
                            helperText={!!otpFormErrors.otp?otpFormErrors.otp: ''} 
                            value={userotp}
                            size="small"
                            onKeyDown={(e)=>validatePattern(e, /^[0-9]+$/)}
                        />

                            

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1}}
                        >
                        Submit
                    </Button>

            </Box>

            <Box componenet="div" sx={{mt: 2}}>

            
                {isOtpLinkActive ? (
                    <Box sx={{color: 'bodycolor.text'}}>Did not get the OTP? <Link sx={{textDecoration: 'underline', cursor: 'pointer', color: 'primary.main'}} onClick={handleResendOtp}>Resend OTP</Link></Box>
                ) : (
                    <Box sx={{color: 'bodycolor.text'}}>Did not get the OTP? Resend in <Timer onTimeout={() => setIsOtpLinkActive(true)} timeLimit={timeLimit} />{" "}seconds</Box>
                )}

                

            </Box>

        </DialogContent>


    </Dialog>

    </>
)


}

export default OTP;