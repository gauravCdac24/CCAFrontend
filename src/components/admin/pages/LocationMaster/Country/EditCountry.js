import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import CountryService from '../../../../../service/AdminService/CountryService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';
import { decrypt } from '../../../../global/util/EncryptDecrypt';

//Errors
const errorMsg = {
    countryName: {
        blank: "Please enter country name.",
        length: "The length must be between 3 and 60 characters.",
        format: "Only alphabets and spaces are allowed."
    },
    phoneCode: {
        blank: "Please enter phone code.",
        length: "The length must be between 2 and 5 characters.",
        format: "Only digits and hyphens are allowed. The first character must be a digit, only one hyphen is permitted, and the last character cannot be a hyphen."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const EditCountry = () => {

    const [countryFormValues, setCountryFormValues] = useState({
        countryId: '',
        countryName:'',
        phoneCode:'',
        created: '',
        updated: '',
        status: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    let {id} = useParams();

    useEffect(()=>{
        if(id){

            setLoading(true);
            CountryService.getCountryById(decrypt(id))
            .then((response)=>{

                setCountryFormValues({

                    countryId: response.data.countryId,
                    countryName: response.data.countryName,
                    phoneCode: response.data.phoneCode,
                    created: response.data.created,
                    updated: response.data.updated,
                    status: response.data.status
        
                })
                
            })
            .catch((err)=>{
                navigate('/admin/country', { replace: true })
            })
            .finally(()=>{
                setLoading(false);
            })

    }else{
        navigate('/admin/country', { replace: true })
    }

    },[])

    // reset
    const handleReset = () => {
        setCountryFormValues({
            countryName: '',
            phoneCode: '',
        }); 

        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setCountryFormValues({
                ...countryFormValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {
        const errors = {};

        if(!countryFormValues.countryName){
            errors.countryName = errorMsg.countryName.blank;
        }

        if(!countryFormValues.countryName){
            errors.countryName = errorMsg.countryName.blank;
        } else if (countryFormValues.countryName.length < 3 || countryFormValues.countryName.length > 60) {
            errors.countryName = errorMsg.countryName.length;
        } else if(!/^[A-Za-z ]+$/.test(countryFormValues.countryName)){
            errors.countryName = errorMsg.countryName.format;
        }

        if(!countryFormValues.phoneCode){
            errors.phoneCode = errorMsg.phoneCode.blank;
        } else if (countryFormValues.phoneCode.length < 2 || countryFormValues.phoneCode.length > 5) {
            errors.phoneCode = errorMsg.phoneCode.length;
        } else if (!/^\d+(-\d+)?$/.test(countryFormValues.phoneCode)) {
            errors.phoneCode = errorMsg.phoneCode.format;
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
                CountryService.updateCountry(countryFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Update Country',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/country")},
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
        navigate("/admin/country", { replace: true })
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

            
                <FormWrapper headingText="Update Country">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"countryName"}>
                                    <Typography variant='body1'>Country Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="countryName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Country Name'
                                    name="countryName"
                                    variant='outlined'
                                    error={!!formErrors.countryName}
                                    helperText={formErrors.countryName || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                    value={countryFormValues.countryName}
                                    size="small"
                                    inputProps={{ maxLength: 60 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"phoneCode"}>
                                    <Typography variant='body1'>Phone Code*</Typography>
                                </InputLabel>
                                <TextField
                                    id="phoneCode"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Phone Code'
                                    name="phoneCode"
                                    variant='outlined'
                                    error={!!formErrors.phoneCode}
                                    helperText={formErrors.phoneCode || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[0-9\-]+$/)}
                                    value={countryFormValues.phoneCode}
                                    size="small"
                                    inputProps={{ maxLength: 5 }}
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
                                            Update
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

export default EditCountry;
