import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography, FormHelperText } from '@mui/material';
import { InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoaderProgress from '../../../global/common/LoaderProgress';
import Captcha from '../../../global/util/Captcha';
import FormWrapper from '../../../global/util/FormWrapper';
import CCAStaffService from '../../../../service/AdminService/CCAStaffService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import validatePattern from '../../../global/util/ValidatePattern';
import { useSelector } from "react-redux";
import { decrypt } from '../../../global/util/EncryptDecrypt';


const errorMsg = {
    salutation: {
        blank: "Salutation cannot be empty.",
    },
    firstName: {
        blank: "First Name cannot be empty.",
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid first name."
    },
    middleName:{
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid middle name."
    },
    lastName:{
        length: "The length must be between 3 and 45 characters.",
        format: "Please enter valid last name."
    },
    mobile: {
        blank: "Mobile Number cannot be empty",
        length: "Length of mobile number must be 10",
        format: "Only numbers are allowed starting with 6,7,8 and 9"
    },
    emailId: {
        blank: "Email Id cannot be empty",
        length: "The length must be between 3 and 50 characters.",
        format: "Please input valid email id."
    },
    designation: {
        blank: "Designation cannot be empty.",
        length: "The length must be between 3 and 50 characters.",
        format: "Please enter valid Designation."
    },
    captchaError: {
        blank: "Please enter captcha."
    },

};

const salutationData = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]

const EditCCAStaff = () => {

    const [staffFormValues, setStaffFormValues] = useState({
        staffId: '',
        salutation: '',
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNo: '',
        emailId: '',   
        designation: ''
    });
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(false);
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
    const {id} = useParams();

    const handleReset = () => {
        setStaffFormValues({
            salutation: '',
            firstName: '',
            middleName: '',
            lastName: '',
            mobileNo: '',
            emailId: '',   
            designation: ''
        }); 

        setFormErrors({});
    }



    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setStaffFormValues({
                ...staffFormValues,
                [name]: value,
            });
        
    };

    useEffect(()=>{
        if(id){

            setLoading(true);
            CCAStaffService.getCCAStaffById(decrypt(id))
            .then((response)=>{

                setStaffFormValues({

                    staffId: response.data.staffId,
                    salutation: response.data.salutation,
                    firstName: response.data.firstName,
                    middleName: response.data.middleName,
                    lastName: response.data.lastName,
                    mobileNo: response.data.mobileNo,
                    emailId: response.data.emailId,   
                    designation: response.data.designation
        
                })  
                
            })
            .catch((err)=>{
                navigate(`${routeRootPath}/ccastaff`, { replace: true })
            })
            .finally(()=>{
                setLoading(false);
            })

    }else{
        navigate(`${routeRootPath}/ccastaff`, { replace: true })
    }

    },[])
    



    const validateForm = () => {
        const errors = {};

        if(!staffFormValues.salutation){
            errors.salutation = errorMsg.salutation.blank;
        }

        if(!staffFormValues.firstName){
            errors.firstName = errorMsg.firstName.blank;
        } else if (staffFormValues.firstName.length < 3 || staffFormValues.firstName.length > 30) {
            errors.firstName = errorMsg.firstName.length;
        } else if(!/^[A-Za-z]+$/.test(staffFormValues.firstName)){
            errors.firstName = errorMsg.firstName.format;
        }

        if(!staffFormValues.middleName)
        {

        }
        else if (staffFormValues.middleName && (staffFormValues.middleName.length < 3 || staffFormValues.middleName.length > 30)) {
            errors.middleName = errorMsg.middleName.length;
        }else if(!/^[A-Za-z]+$/.test(staffFormValues.middleName)){
            errors.middleName = errorMsg.middleName.format;
        }

        if(!staffFormValues.lastName){}
        else if (staffFormValues.lastName && (staffFormValues.lastName.length < 3 || staffFormValues.lastName.length > 45)) {
            errors.lastName = errorMsg.lastName.length;
        }else if(!/^[A-Za-z]+$/.test(staffFormValues.lastName)){
            errors.lastName = errorMsg.lastName.format;
        }



        if(!staffFormValues.mobileNo){
            errors.mobile = errorMsg.mobile.blank;
        }else if (!/^[6-9]\d{9}$/.test(staffFormValues.mobileNo)) {
            errors.mobile = errorMsg.mobile.format;
        } else if (staffFormValues.mobileNo.length !== 10) {
            errors.mobile = errorMsg.mobile.length;
        }


        if(!staffFormValues.emailId){
            errors.emailId = errorMsg.emailId.blank;
        } else if (staffFormValues.emailId.length < 3 || staffFormValues.emailId.length > 50) {
            errors.emailId = errorMsg.emailId.length;
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,4}$/i.test(staffFormValues.emailId)) {
            errors.emailId = errorMsg.emailId.format;
        }


        if(!staffFormValues.designation){
            errors.designation = errorMsg.designation.blank;
        } else if (staffFormValues.designation.length < 3 || staffFormValues.designation.length > 30) {
            errors.designation = errorMsg.designation.length;
        } else if(!/^[A-Za-z ]+$/.test(staffFormValues.designation)){
            errors.designation = errorMsg.designation.format;
        }

        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }


        return errors;
    };

    const handleFormSubmit = (e) => {

        e.preventDefault();
        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            if (captchaInput === captchaText) {
                setLoading(true);
           
                CCAStaffService.updateCCAStaff(staffFormValues)
                    .then((response) => {
                        showAlert({
                            messageTitle: 'Edit Registered Employee',
                            messageContent: response.data,
                            confirmText: 'Ok',
                            onConfirm: () => { navigate(`${routeRootPath}/ccastaff`) }
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

    const handleBack = () => {
        navigate(`${routeRootPath}/ccastaff`, { replace: true })
    }

    return (
        <> 
          <LoaderProgress open={isLoading} />
          <Box component="div">
        <Grid container spacing={2} direction={'column'}>
            <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                <Button variant="contained" onClick={handleBack}>
                    <Typography variant="h6">Back</Typography>
                </Button>
            </Grid>
        </Grid>
    </Box>
                    <FormWrapper headingText="Edit Registered Employee">
                
                        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                           

                            <Grid container  spacing={2}>

                                <Grid item xs={12} sm={2.4}>

                                    <InputLabel shrink={false} htmlFor={"salutation"}>
                                        <Typography variant='body1'>Salutation*</Typography>
                                    </InputLabel>

                                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                                        
                                        <Select
                                            id="salutation"
                                            onChange={handleInputChange}
                                            displayEmpty
                                            value={staffFormValues.salutation}
                                            name="salutation"
                                            error={
                                                Boolean(formErrors.salutation)
                                             }
                                             sx={{
                                                width: { xs: '100%', sm: '162px' }, 
                                            }}

                                            >

                                                <MenuItem disabled value="">
                                                    Salutation
                                                </MenuItem>


                                                {
                                                    salutationData.map((item, index)=>(

                                                        <MenuItem key={index} value={item}>{item}</MenuItem>

                                                    ))
                                                }
                                        </Select>
                                        {formErrors.salutation && (
                                        <FormHelperText error sx={{ml:0}}>{formErrors.salutation}</FormHelperText>
                                    )}
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"firstName"}>
                                        <Typography variant='body1'>First Name*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="firstName"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='First Name'
                                        name="firstName"
                                        variant='outlined'
                                        error={!!formErrors.firstName}
                                        helperText={formErrors.firstName || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                                        value={staffFormValues.firstName}
                                        size="small"
                                        inputProps={{ maxLength: 30 }}
                                    />
                                </Grid>


                                <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"middleName"}>
                                        <Typography variant='body1'>Middle Name</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="middleName"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Middle Name'
                                        name="middleName"
                                        variant='outlined'
                                        error={!!formErrors.middleName}
                                        helperText={formErrors.middleName || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                                        value={staffFormValues.middleName}
                                        size="small"
                                        inputProps={{ maxLength: 30 }}
                                    />
                                </Grid>
                                

                                
                                <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"lastName"}>
                                        <Typography variant='body1'>Last Name</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="lastName"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Last Name'
                                        name="lastName"
                                        variant='outlined'
                                        error={!!formErrors.lastName}
                                        helperText={formErrors.lastName || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                                        value={staffFormValues.lastName}
                                        size="small"
                                        inputProps={{ maxLength: 45 }}
                                    />
                                </Grid>



                            </Grid>

                            <Grid container spacing={2} sx={{mt: 0.1}}>

                            <Grid item xs={12} sm >
                                    <InputLabel shrink={false} htmlFor={"mobileNo"}>
                                        <Typography variant='body1'>Mobile Number*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="mobileNo"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Mobile Number'
                                        name="mobileNo"
                                        variant='outlined'
                                        error={!!formErrors.mobile}
                                        helperText={formErrors.mobile || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                        value={staffFormValues.mobileNo}
                                        size="small"
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"emailId"}>
                                        <Typography variant='body1'>Email Id*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="emailId"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Email Id'
                                        name="emailId"
                                        variant='outlined'
                                        error={!!formErrors.emailId}
                                        helperText={formErrors.emailId || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9_@.]+$/)}
                                        value={staffFormValues.emailId}
                                        size="small"
                                        inputProps={{ maxLength: 50 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"designation"}>
                                        <Typography variant='body1'>Designation*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="designation"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Designation'
                                        name="designation"
                                        variant='outlined'
                                        error={!!formErrors.designation}
                                        helperText={formErrors.designation || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                        value={staffFormValues.designation}
                                        size="small"
                                        inputProps={{ maxLength: 50 }}
                                    />
                                </Grid>

                            </Grid>
    
                     <Grid container justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <Captcha 
                                setCaptcha={setCaptchaText}
                                setCaptchaInput={setCaptchaInput}
                                captchaInput={captchaInput}
                                captchaError={!!formErrors.captcha}
                                captchaErrorMsg={formErrors.captcha}
                            />
                        </Grid>
                    </Grid>
                                    <Grid container direction="row" sx={{ mt: 4}} spacing={2} justifyContent="center" alignItems="center">
                                        <Grid item  >
                                            <Button type="Update" fullWidth variant="contained" sx={{maxWidth: '120px' }}>
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

export default EditCCAStaff;
