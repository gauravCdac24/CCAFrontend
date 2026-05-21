
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography, FormHelperText } from '@mui/material';
import { InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoaderProgress from '../common/LoaderProgress';
import Captcha from '../util/Captcha';
import { useEffect } from 'react';
import StateService from '../../../service/AdminService/StateService';
import CountryService from '../../../service/AdminService/CountryService';
import FormWrapper from '../util/FormWrapper';
import CityService from '../../../service/AdminService/CityService';
import IntentService from '../../../service/AdminService/IntentService';
import showAlert from '../common/MessageBox/AlertService';
import validatePattern from '../util/ValidatePattern';



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
    blockNo: {
        blank: "Flat/Door/Block No cannot be empty",
        length: "The length must be between 3 and 15 characters.",
        format: "Please enter valid Flat/Door/Block No."
    },
    village: {
        blank: "Name of Premises/Building/Village cannot be empty",
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid Premises/Building/Village"
    },
    postOffice: {
        blank: "Road/Street/Lane/Post Office cannot be empty",
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid Road/Street/Lane/Post Office"
    },
    subDivision: {
        blank: "Area/Locality/Taluka/Sub-Division cannot be empty",
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid Area/Locality/Taluka/Sub-Division"
    },
    country: {
        blank: "Country cannot be empty"
    },
    city: {
        blank: "Town/City/District cannot be empty"
    },
    state: {
        blank: "State/Union Territory cannot be empty"
    },
    pin: {
        blank: "Pin cannot be empty",
        length: "The length of pin must be 6.",
        format: "Please enter valid pin."
    },
    emailId: {
        blank: "Email Id cannot be empty",
        length: "The length must be between 3 and 50 characters.",
        format: "Please input valid email id."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    uniqueCode: {
        blank: "Please enter unique code.",
        length: "The length must be 8 character.",
        format: "Please enter valid unique code."
    }

};

const salutationData = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]

const IntentRegistration = () => {
    const [intentFormValues, setIntentFormValues] = useState({
        salutation: '',
        firstName: '',
        middleName: '',
        lastName: '',
        mobile: '',
        blockNo: '',
        village: '',
        postOffice: '',
        subDivision: '',
        country: '',
        state: '',
        city: '',
        pin: '',
        emailId: '',
        uniqueCode:'',
        organizationName: '',
        applicationType: ''
    });
    const [filteredStates, setFilteredStates] = useState([]);
    const [states, setStates] = useState([]);
    const [uniCodeObj, setUniCodeObj] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [countries, setCountry] = useState([]);
    const [cities, setCity] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const getUniqueCodeDetails = () => {

        const errors = validateUniqueCode();

        if (Object.keys(errors).length === 0) {

            setFormErrors({});
            setLoading(true);
                IntentService.getAllIntentByUniqueCode(intentFormValues.uniqueCode)
                     .then((response)=>{
                        setUniCodeObj(response.data);
                        
                        const updatedObj = {
                            salutation: '',
                            firstName: '',
                            middleName: '',
                            lastName: '',
                            mobile: response.data.mobileNo,
                            blockNo: '',
                            village: '',
                            postOffice: '',
                            subDivision: '',
                            country: '',
                            state: '',
                            city: '',
                            pin: '',
                            applicationType: response.data.appTypeMasterId.appType,
                            organizationName: response.data.organizationName,
                            emailId: response.data.emailId,
                            uniqueCode: response.data.uniqueCode.toString(),
                        }

                        setIntentFormValues(updatedObj);
                     })
                     .catch(()=>{
                        showAlert({
                            messageTitle: 'Error',
                            messageContent: 'Please enter valid code.',
                            confirmText: 'Ok',
                            disableOutsideKeyDown: false
                        })
                     })
                    .finally(()=>{
                        setLoading(false)
                    })
        }else {
            setFormErrors(errors);
        }

    };



    useEffect(() => {
        StateService.getAllStateList().then(data => {
            setStates(data.data);
            console.log("Fetched states:",states); 

        }).catch(error => {
            console.error("Error fetching states:", error);
        });
    }, []);
    
    useEffect(() => {
        CountryService.getAllCountryList().then(data => {
            setCountry(data.data);
            console.log("Fetched country:",countries); 

        }).catch(error => {
            console.error("Error fetching country:", error);
        });
    }, []);
    
    useEffect(() => {
        CityService.getAllCityList().then(data => {
            setCity(data.data);
            console.log("Fetched city:",cities); 

        }).catch(error => {
            console.error("Error fetching city:", error);
        });
    }, []);
   
    // reset
    const handleReset = () => {
        setIntentFormValues((prevState) => ({
            

            salutation: '',
            firstName: '',
            middleName: '',
            lastName: '',
            mobile: prevState.mobile,
            blockNo: '',
            village: '',
            postOffice: '',
            subDivision: '',
            country: '',
            state: '',
            city: '',
            pin: '',
            applicationType: prevState.applicationType,
            organizationName: prevState.organizationName,
            emailId: prevState.emailId,
            uniqueCode: prevState.uniqueCode,

        })); 

        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "country") {
            const filteredStates = states.filter(state => state.countryId.countryId === parseInt(value));
            setFilteredStates(filteredStates);
            console.log("filteredStates==>",filteredStates)
            setIntentFormValues({
                ...intentFormValues,
                [name]: value,
                state: '',
                city: ''
            });
        } else if (name === "state") {
            const filteredCities = cities.filter(city => city.stateId.stateId === parseInt(value));
            setFilteredCities(filteredCities);
            setIntentFormValues({
                ...intentFormValues,
                [name]: value,
                city: ''
            });
        } else {
            setIntentFormValues({
                ...intentFormValues,
                [name]: value
            });
        }
    };

    const validateUniqueCode = () =>{
        const errors = {};


        if(!intentFormValues.uniqueCode){
            errors.uniqueCode = errorMsg.uniqueCode.blank;
        } else if (intentFormValues.uniqueCode.length != 8) {
            errors.uniqueCode = errorMsg.uniqueCode.length;
        } else if(!/^[0-9]+$/.test(intentFormValues.uniqueCode)){
            errors.uniqueCode = errorMsg.uniqueCode.format;
        }

        return errors;

    }

    const validateForm = () => {
        const errors = {};

        if(!intentFormValues.salutation){
            errors.salutation = errorMsg.salutation.blank;
        }

        if(!intentFormValues.uniqueCode){
            errors.uniqueCode = errorMsg.uniqueCode.blank;
        } else if (intentFormValues.uniqueCode.length != 8) {
            errors.uniqueCode = errorMsg.uniqueCode.length;
        } else if(!/^[0-9]+$/.test(intentFormValues.uniqueCode)){
            errors.uniqueCode = errorMsg.uniqueCode.format;
        }


        if(!intentFormValues.firstName){
            errors.firstName = errorMsg.firstName.blank;
        } else if (intentFormValues.firstName.length < 3 || intentFormValues.firstName.length > 30) {
            errors.firstName = errorMsg.firstName.length;
        } else if(!/^[A-Za-z]+$/.test(intentFormValues.firstName)){
            errors.firstName = errorMsg.firstName.format;
        }

        if(!intentFormValues.firstName){
            errors.firstName = errorMsg.firstName.blank;
        } else if (intentFormValues.firstName.length < 3 || intentFormValues.firstName.length > 30) {
            errors.firstName = errorMsg.firstName.length;
        } else if(!/^[A-Za-z]+$/.test(intentFormValues.firstName)){
            errors.firstName = errorMsg.firstName.format;
        }

        if(!intentFormValues.middleName)
        {

        }
        else if (intentFormValues.middleName && (intentFormValues.middleName.length < 3 || intentFormValues.middleName.length > 30)) {
            errors.middleName = errorMsg.middleName.length;
        }else if(!/^[A-Za-z]+$/.test(intentFormValues.middleName)){
            errors.middleName = errorMsg.middleName.format;
        }

        if(!intentFormValues.lastName){}
        else if (intentFormValues.lastName && (intentFormValues.lastName.length < 3 || intentFormValues.lastName.length > 45)) {
            errors.lastName = errorMsg.lastName.length;
        }else if(!/^[A-Za-z]+$/.test(intentFormValues.lastName)){
            errors.lastName = errorMsg.lastName.format;
        }



        if(!intentFormValues.mobile){
            errors.mobile = errorMsg.mobile.blank;
        }else if (!/^[6-9]\d{9}$/.test(intentFormValues.mobile)) {
            errors.mobile = errorMsg.mobile.format;
        } else if (intentFormValues.mobile.length !== 10) {
            errors.mobile = errorMsg.mobile.length;
        }


        if(!intentFormValues.blockNo){
            errors.blockNo = errorMsg.blockNo.blank;
        }else if (intentFormValues.blockNo.length < 3 || intentFormValues.blockNo.length > 15) {
            errors.blockNo = errorMsg.blockNo.length;
        }else if(!/^[A-Za-z0-9 ]+$/.test(intentFormValues.blockNo)){
            errors.blockNo = errorMsg.blockNo.format;
        }


        if(!intentFormValues.village){
            errors.village = errorMsg.village.blank;
        }else if (intentFormValues.village.length < 3 || intentFormValues.village.length > 30) {
            errors.village = errorMsg.village.length;
        }else if(!/^[A-Za-z0-9 ]+$/.test(intentFormValues.village)){
            errors.village = errorMsg.village.format;
        }


        if(!intentFormValues.postOffice){
            errors.postOffice = errorMsg.postOffice.blank;
        }else if (intentFormValues.postOffice.length < 3 || intentFormValues.postOffice.length > 30) {
            errors.postOffice = errorMsg.postOffice.length;
        }else if(!/^[A-Za-z ]+$/.test(intentFormValues.postOffice)){
            errors.postOffice = errorMsg.postOffice.format;
        }


        if(!intentFormValues.subDivision){
            errors.subDivision = errorMsg.subDivision.blank;
        }else if (intentFormValues.subDivision.length < 3 || intentFormValues.subDivision.length > 30) {
            errors.subDivision = errorMsg.subDivision.length;
        }else if(!/^[A-Za-z ]+$/.test(intentFormValues.subDivision)){
            errors.subDivision = errorMsg.subDivision.format;
        }

        if(!intentFormValues.country){
            errors.country = errorMsg.country.blank;
        }

        if(!intentFormValues.city){
            errors.city = errorMsg.city.blank;
        }


        if(!intentFormValues.state){
            errors.state = errorMsg.state.blank;
        }


        if(!intentFormValues.pin){
            errors.pin = errorMsg.pin.blank;
        }else if (intentFormValues.pin.length !== 6) {
            errors.pin = errorMsg.pin.length;
        }else if(!/^[0-9]+$/.test(intentFormValues.pin)){
            errors.pin = errorMsg.pin.format;
        }


        if(!intentFormValues.emailId){
            errors.emailId = errorMsg.emailId.blank;
        } else if (intentFormValues.emailId.length < 3 || intentFormValues.emailId.length > 50) {
            errors.emailId = errorMsg.emailId.length;
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,4}$/i.test(intentFormValues.emailId)) {
            errors.emailId = errorMsg.emailId.format;
        }
        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }


        return errors;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(intentFormValues)
        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            if (captchaInput === captchaText) {
                setLoading(true);
                console.log(intentFormValues)
                IntentService.addNewIntent(intentFormValues)
                    .then((response) => {
                        showAlert({
                            messageTitle: 'Registration Successful',
                            messageContent: response.data,
                            confirmText: 'Ok',
                            onConfirm: () => { navigate("/login") },
                            fullWidth: true,
                            maxWidth: 'sm',
                            disableOutsideKeyDown: true,
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


    return (
        <> 
          <LoaderProgress open={isLoading} />
          
    <Box component='div' sx={{mb: 2}}>
    <FormWrapper headingText= {uniCodeObj !==null ? "Intent Registration": "Intent Unique Code"}>
                


                        <Box component="form" noValidate sx={{ mt: 2, p: 1 }} onSubmit={handleFormSubmit}>


                        <Grid container sx={{mt: 1, mb: 1}}>
                                <Grid item >
                                    <Typography variant='h6'>{uniCodeObj !==null ? "1. Unique Code": "Unique Code *"}</Typography>
                                </Grid>
                            </Grid>

                            <Grid container  spacing={2} direction="column">

                            <Grid item   >
                                   
                                    <TextField
                                        id="uniqueCode"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Unique Code'
                                        name="uniqueCode"
                                        variant='outlined'
                                        error={!!formErrors.uniqueCode}
                                        helperText={formErrors.uniqueCode || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                        value={intentFormValues.uniqueCode}
                                        size="small"
                                        inputProps={{ maxLength: 8 }}
                                        disabled={uniCodeObj !== null}
                                        sx={{maxWidth: {sm: uniCodeObj !== null?'230px':'100%', xs: '100%'}}}
                                    />
                                </Grid>
                                {uniCodeObj === null && (
                                <Grid item sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}} >
                                    <Button disabled={uniCodeObj !== null} type="button" onClick={getUniqueCodeDetails} color="success"  variant="contained" sx={{maxWidth: '120px', color: "#FFFFFF", marginTop: '2%' }}>
                                        Validate
                                    </Button>
                                </Grid>
                                )}

                            </Grid>

                        <Box sx={{display:`${uniCodeObj?'block':'none'}`}}>

                            <Grid container sx={{mt: 1, mb: 1}}>
                                <Grid item >
                                    <Typography variant='h6'>2. Personal Details</Typography>
                                </Grid>
                            </Grid>

                            <Grid container  spacing={2}>

                                <Grid item xs={12} sm>

                                    <InputLabel shrink={false} htmlFor={"salutation"}>
                                        <Typography variant='body1'>Salutation*</Typography>
                                    </InputLabel>

                                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                                        
                                        <Select
                                            id="salutation"
                                            onChange={handleInputChange}
                                            displayEmpty
                                            value={intentFormValues.salutation}
                                            name="salutation"
                                            error={
                                                Boolean(formErrors.salutation)
                                             }
                                             

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
                                        value={intentFormValues.firstName}
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
                                        value={intentFormValues.middleName}
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
                                        value={intentFormValues.lastName}
                                        size="small"
                                        inputProps={{ maxLength: 45 }}
                                    />
                                </Grid>



                            </Grid>

                            <Grid container spacing={2} sx={{mt: 0.1}}>

                            <Grid item xs={12} sm >
                                    <InputLabel shrink={false} htmlFor={"mobile"}>
                                        <Typography variant='body1'>Mobile Number*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="mobile"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Mobile Number'
                                        name="mobile"
                                        variant='outlined'
                                        error={!!formErrors.mobile}
                                        helperText={formErrors.mobile || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                        value={intentFormValues.mobile}
                                        size="small"
                                        inputProps={{ maxLength: 10 }}
                                        disabled
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
                                        value={intentFormValues.emailId}
                                        size="small"
                                        inputProps={{ maxLength: 50 }}
                                        disabled
                                    />
                                </Grid>

                            </Grid>

                            <Grid container sx={{mt: 1, mb: 1}}>
                                <Grid item >
                                    <Typography variant='h6'>3. Address</Typography>
                                </Grid>
                            </Grid>

                            <Grid container  spacing={2}>

                            <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"blockNo"}>
                                        <Typography variant='body1'>Flat/Door/Block No*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="blockNo"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Flat/Door/Block No'
                                        name="blockNo"
                                        variant='outlined'
                                        error={!!formErrors.blockNo}
                                        helperText={formErrors.blockNo || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                                        value={intentFormValues.blockNo}
                                        size="small"
                                        inputProps={{ maxLength: 15 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"village"}>
                                        <Typography variant='body1'>Name of Premises/Building/Village*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="village"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Name of Premises/Building/Village'
                                        name="village"
                                        variant='outlined'
                                        error={!!formErrors.village}
                                        helperText={formErrors.village || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                                        value={intentFormValues.village}
                                        size="small"
                                        inputProps={{ maxLength: 30 }}
                                    />
                                </Grid>


                            </Grid>

                            <Grid container spacing={2} sx={{mt: 0.1}}>

                            <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"postOffice"}>
                                        <Typography variant='body1'>Road/Street/Lane/Post Office*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="postOffice"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Road/Street/Lane/Post Office'
                                        name="postOffice"
                                        variant='outlined'
                                        error={!!formErrors.postOffice}
                                        helperText={formErrors.postOffice || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                        value={intentFormValues.postOffice}
                                        size="small"
                                        inputProps={{ maxLength: 30 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"subDivision"}>
                                        <Typography variant='body1'>Area/Locality/Taluka/Sub-Division*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="subDivision"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Area/Locality/Taluka/Sub-Division'
                                        name="subDivision"
                                        variant='outlined'
                                        error={!!formErrors.subDivision}
                                        helperText={formErrors.subDivision || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                        value={intentFormValues.subDivision}
                                        size="small"
                                        inputProps={{ maxLength: 30 }}
                                    />
                                </Grid>

                            </Grid>


                          
                            <Grid container spacing={2} sx={{ mt: 0.1 }}>
                        <Grid item xs={12} sm={3} >
                            <InputLabel shrink={false} htmlFor="country">
                                <Typography variant='body1'>Country*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="country"
                                    
                                    required
                                    value={intentFormValues.country}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="country"
                                    error={!!formErrors.country}
                                    size='small'
                                >
                                    <MenuItem value="">
                                        Select Country
                                    </MenuItem>
                                    {countries.map(country => (
                                        <MenuItem key={country.countryId} value={country.countryId}>
                                            {country.countryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.country && <FormHelperText error>{formErrors.country}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} >
                            <InputLabel shrink={false} htmlFor="state">
                                <Typography variant='body1'>State/Province*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="state"
                                   
                                    required
                                    value={intentFormValues.state}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="state"
                                    error={!!formErrors.state}
                                    size='small'
                                >
                                    <MenuItem value="">
                                        Select State/Province
                                    </MenuItem>
                                    {filteredStates.map(state => (
                                        <MenuItem key={state.stateId} value={state.stateId}>
                                            {state.stateName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.state && <FormHelperText error>{formErrors.state}</FormHelperText>}
                            </FormControl>
                        </Grid>
              
                   
                        <Grid item xs={12} sm={3} >
                            <InputLabel shrink={false} htmlFor="district">
                                <Typography variant='body1'>District*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="city"
                                    margin='dense'
                                    required
                                    value={intentFormValues.city}
                                    fullWidth
                                    onChange={handleInputChange}
                                    displayEmpty
                                    size='small'
                                    name="city"
                                    error={!!formErrors.city}
                                >
                                    <MenuItem value="">
                                        Select District
                                    </MenuItem>
                                    {filteredCities.map(city => (
                                        <MenuItem key={city.cityId} value={city.cityId}>
                                            {city.cityName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.city && <FormHelperText error>{formErrors.city}</FormHelperText>}
                            </FormControl>
                        </Grid> 

                                
                                <Grid item xs={12} sm={3} >
                                    <InputLabel shrink={false} htmlFor={"pin"}>
                                        <Typography variant='body1'>Pin*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="pin"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Pin'
                                        name="pin"
                                        variant='outlined'
                                        error={!!formErrors.pin}
                                        helperText={formErrors.pin || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                        value={intentFormValues.pin}
                                        size="small"
                                        inputProps={{ maxLength: 6 }}
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
                        </Box>
                   
                </FormWrapper>
                </Box>
        </>
    );
};

export default IntentRegistration;
