import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {FormControl, FormHelperText, MenuItem, Select, Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import {useEffect, useState } from 'react';
import Captcha from '../../../global/util/Captcha';
import validatePattern from '../../../global/util/ValidatePattern';
import IntentUniqueCodeService from '../../../../service/AdminService/IntentUniqueCodeService';
import ApplicationType from '../../../../service/AdminService/ApplicationType';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../global/util/FormWrapper';


//Errors
const errorMsg = {
    emailId: {
        blank: "Email Id cannot be empty",
        length: "The length must be between 3 and 50 characters.",
        format: "Please input valid email id."
    },
    mobileNo: {
        blank: "Mobile Number cannot be empty",
        length: "Length of mobile number must be 10",
        format: "Only numbers are allowed starting with 6,7,8 and 9"
    },
    applicationType: {
        blank: "Application Type cannot be empty"
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    organizationName: {
        blank: "Organization Name cannot be empty",
        length: "The length must be between 3 and 75 characters.",
        format: "Please enter valid Organization Name"
    },
    
};


const AddIntentUniqueCode = () => {
    const [formValues, setFormValues] = useState({
        emailId:'',
        mobileNo: '',
        applicationType: '',
        organizationName: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [appTypeList, setAppTypeList] = useState([]);
    
    const navigate = useNavigate();


    const getAllApplicationTypeList = () => {
        setLoading(true);
        ApplicationType.getAllApplicationTypeList()
        .then((response)=>{

            setAppTypeList(response.data);

        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false)
        })
    }

    // reset
    const handleReset = () => {
        setFormValues({
            emailId:'',
            mobileNo: '',
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

    //
    useEffect(()=>{

        getAllApplicationTypeList();

    },[])


    const validateForm = () => {
        const errors = {};


        if(!formValues.emailId){
            errors.emailId = errorMsg.emailId.blank;
        } else if (formValues.emailId.length < 3 || formValues.emailId.length > 50) {
            errors.emailId = errorMsg.emailId.length;
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.emailId)) {
            errors.emailId = errorMsg.emailId.format;
        }
       
        if(!formValues.applicationType){
            errors.applicationType = errorMsg.applicationType.blank;
        }


        if(!captchaInput){
            errors.captcha = errorMsg.captchaError.blank;
        }

        if(!formValues.mobileNo){
            errors.mobileNo = errorMsg.mobileNo.blank;
        }else if (!/^[6-9]\d{9}$/.test(formValues.mobileNo)) {
            errors.mobileNo = errorMsg.mobileNo.format;
        } else if (formValues.mobileNo.length !== 10) {
            errors.mobileNo = errorMsg.mobileNo.length;
        }

        if(formValues.applicationType && formValues.applicationType !=='Individual'){
            if(!formValues.organizationName){
                errors.organizationName = errorMsg.organizationName.blank;
            }else if (formValues.organizationName.length < 3 || formValues.organizationName.length > 75) {
                errors.organizationName = errorMsg.organizationName.length;
            }else if(!/^[A-Za-z ]+$/.test(formValues.organizationName)){
                errors.organizationName = errorMsg.organizationName.format;
            }
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
                IntentUniqueCodeService.addNewIntentUniqueCode(formValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Unique Code',
                        messageContent: `Unique Code is ${response.data.uniqueCode}` ,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/iuniquecode")},
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
        navigate("/admin/iuniquecode", { replace: true })
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

            
                <FormWrapper headingText="Generate Intent Code">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                        <Grid item xs={12} sm={3} >
                            <InputLabel shrink={false} htmlFor="applicationType">
                                <Typography variant='body1'>Application Type*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="applicationType"
                                    required
                                    value={formValues.applicationType}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="applicationType"
                                    error={!!formErrors.applicationType}
                                    size='small'
                                >
                                    <MenuItem value="">
                                        Select Application Type
                                    </MenuItem>
                                    {appTypeList.map((item, index) => (
                                        <MenuItem key={index} value={item.appType}>
                                            {item.appType}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.applicationType && <FormHelperText error sx={{ml:0}}>{formErrors.applicationType}</FormHelperText>}
                            </FormControl>
                        </Grid>


                        {formValues.applicationType && formValues.applicationType !== "Individual" && (<Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"organizationName"}>
                                        <Typography variant='body1'>Organization Name*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="organizationName"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Organization Name'
                                        name="organizationName"
                                        variant='outlined'
                                        error={!!formErrors.organizationName}
                                        helperText={formErrors.organizationName || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                        value={formValues.organizationName}
                                        size="small"
                                        inputProps={{ maxLength: 75 }}
                                    />
                                </Grid>)}


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
                                        value={formValues.emailId}
                                        size="small"
                                        inputProps={{ maxLength: 50 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm>
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
                                        error={!!formErrors.mobileNo}
                                        helperText={formErrors.mobileNo || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                        value={formValues.mobileNo}
                                        size="small"
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>
                        
                            

                        </Grid> 


                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Box sx={{width: '220px'}}>
                                <Captcha setCaptcha={setCaptchaText} 
                                        setCaptchaInput={setCaptchaInput}
                                        captchaInput={captchaInput}
                                        captchaError={!!formErrors.captcha}
                                        captchaErrorMsg={formErrors.captcha}/> 
                            </Box>
                        </Box>

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

export default AddIntentUniqueCode;
