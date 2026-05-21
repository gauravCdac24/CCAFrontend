import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {FormControl, FormHelperText, MenuItem, Select, Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import Captcha from '../../global/util/Captcha';
import validatePattern from '../../global/util/ValidatePattern';
import DashboardService from '../../../service/DashboardService/DashboardService';
import LoaderProgress from '../../global/common/LoaderProgress';
import showAlert from '../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../global/util/FormWrapper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import StateService from '../../../service/AdminService/StateService';
import CountryService from '../../../service/AdminService/CountryService';
import { decrypt } from '../../global/util/EncryptDecrypt';

//Errors
const errorMsg = {
    aspName: {
        blank: "Please enter ASP name.",
        length: "The length must be between 3 and 100 characters.",
        format: "Only alphabets and /().-& are allowed."
    },

    emailId: {
        blank: "Please enter email ID.",
        length: "The length must be between 3 and 50 characters.",
        format: "Please enter a valid email address."
    },

    countryId:{
        blank: "Please select country."
    },

    stateId:{
        blank: "Please select state."
    },

    onBoardingDate:{
        blank: "Please select onboarding date.",
        diff: "Onboarding date must be less than exit date."
    },

    exitDate:{
        diff: "Exit date must be greater than Onboarding Date."
    },

    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const EditASP = () => {
    const [formValues, setFormValues] = useState({
        aspId:'',
        aspName: '',
        emailId: '',
        countryId: '',
        stateId: '',
        onBoardingDate: '',
        exitDate: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [filteredState, setFilteredState] = useState([]);
    const [isRendered, setIsRendered] = useState(false);

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);
    let {id} = useParams();


    useEffect(() => {
        if (id) {
            setLoading(true);
    
            const fetchData = async () => {
                try {
                    const [aspResponse, countries, states] = await Promise.all([
                        DashboardService.getASPByID(decrypt(id)),
                        CountryService.getAllCountryList(),
                        StateService.getAllStateList()
                    ]);
    
                    setFormValues({
                        aspId: aspResponse.data.aspId,
                        aspName: aspResponse.data.aspName,
                        emailId: aspResponse.data.emailId,
                        countryId: decrypt(aspResponse.data.countryId),
                        stateId: decrypt(aspResponse.data.stateId),
                        onBoardingDate: aspResponse.data.onBoardingDate,
                        exitDate: aspResponse.data.exitDate,
                    });
    
                    setCountryList(countries.data);
                    setStateList(states.data);
    
                    const filteredStates = states.data.filter(
                        state => state.countryId.countryId === parseInt(decrypt(aspResponse.data.countryId))
                    );
                    setFilteredState(filteredStates);
    
                } catch (err) {
                    navigate(`${rolePath}/asplist`, { replace: true });
                } finally {
                    setLoading(false);
                }
            };
    
            fetchData();
        } else {
            navigate(`${rolePath}/asplist`, { replace: true });
        }
    }, []);
    
    

    // reset
    const handleReset = () => {
        setFormValues({
            aspId:'',
            aspName: '',
            emailId: '',
            countryId: '',
            stateId: '',
            onBoardingDate: '',
            exitDate: ''
        }); 

        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "countryId") {
            const filteredStates = stateList.filter(state => state.countryId.countryId === parseInt(value));
            setFilteredState(filteredStates);
            formValues.stateId = ''
        }

        setFormValues({
                ...formValues,
                [name]: value,
            });
        
    };

    const handleDateChange = (name, date) => {

        const isValidDate = (date) => {
            return dayjs(date).isValid();
        };

        if (!isValidDate(date)) {
            return;
        }

        const formatDate = (date) => {
            return dayjs(date).format('YYYY-MM-DD');
        };

        const formattedDate = formatDate(date);

        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: formattedDate,
        }));
    };


    const validateForm = () => {
        const errors = {};

        if(!formValues.countryId){
            errors.countryId = errorMsg.countryId.blank;
        }

        if(!formValues.stateId){
            errors.stateId = errorMsg.stateId.blank;
        }

        if(!formValues.onBoardingDate){
            errors.onBoardingDate = errorMsg.onBoardingDate.blank;
        }

        if(formValues.exitDate && formValues.onBoardingDate && formValues.exitDate <= formValues.onBoardingDate){
            errors.onBoardingDate = errorMsg.onBoardingDate.diff;
            errors.exitDate = errorMsg.exitDate.diff;
        }


        if(!formValues.aspName){
            errors.aspName = errorMsg.aspName.blank;
        } else if (formValues.aspName.length < 3 || formValues.aspName.length > 100) {
            errors.aspName = errorMsg.aspName.length;
        } else if(!/^[A-Za-z/\)\(.\-& ]+$/.test(formValues.aspName)){
            errors.aspName = errorMsg.aspName.format;
        }


        if(!formValues.emailId){
            errors.emailId = errorMsg.emailId.blank;
        } else if (formValues.emailId.length < 3 || formValues.emailId.length > 50) {
            errors.emailId = errorMsg.emailId.length;
        } else if(!/^[A-Za-z0-9.]+@[A-Za-z]+.[a-zA-Z]+[a-zA-Z.]+$/.test(formValues.emailId)){
            errors.emailId = errorMsg.emailId.format;
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
                DashboardService.updateASPDetails(formValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Edit ASP',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate(`${rolePath}/asplist`)},
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
        navigate(`${rolePath}/asplist`, { replace: true })
    }

    return (
        <>

            <LoaderProgress open={isLoading} />

                <Box component="div">

                    <Grid2 container spacing={2} direction={'column'}>

                        <Grid2  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                            <Button variant="contained"  onClick={handleBack}>
                                <Typography variant="h6">Back</Typography>
                            </Button>
                        </Grid2>
                    </Grid2>

                    


                </Box>

            
                <FormWrapper headingText="Edit Application Service Provider">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid2 container  spacing={2} direction="row">

                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputLabel shrink={false} htmlFor={"aspName"}>
                                    <Typography variant='body1'>ASP Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="aspName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='ASP Name'
                                    name="aspName"
                                    variant='outlined'
                                    error={!!formErrors.aspName}
                                    helperText={formErrors.aspName || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z/\)\(.\-& ]+$/)}
                                    value={formValues.aspName}
                                    size="small"
                                    slotProps={{
                                        htmlInput: {
                                            maxLength: 100
                                        }
                                    }}
                                    
                                />
                            </Grid2>


                            <Grid2 size={{ xs: 12, sm: 6 }}>
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
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9.@]+$/)}
                                    value={formValues.emailId}
                                    size="small"
                                    slotProps={{
                                        htmlInput: {
                                            maxLength: 50
                                        }
                                    }}
                                    sx={{ mt: 1}}
                                />
                            </Grid2>
                        </Grid2>


                        <Grid2 container  spacing={2} direction="row" sx={{mt: 2}}>

                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputLabel shrink={false} htmlFor={"onBoardingDate"}>
                                    <Typography variant='body1' >Onboarding Date*</Typography>
                                </InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 10015}}> 
                                    <DatePicker
                                        id="onBoardingDate"
                                        disableFuture
                                        name="onBoardingDate"
                                        onChange={(date) => handleDateChange('onBoardingDate', date)}
                                        value={dayjs(formValues.onBoardingDate)}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                placeholder: "Onboarding Date",
                                                error: !!formErrors.onBoardingDate,
                                                helperText: formErrors.onBoardingDate || ''
                                            },
                                            popper: {
                                                style: { zIndex: 110015 },
                                            },
                                        }}
                                        sx={{ mt: 1}}
                                        
                                    />
                                </LocalizationProvider>
                            </Grid2>

                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <InputLabel shrink={false} htmlFor={"issueDate"}>
                                    <Typography variant='body1' >Exit Date</Typography>
                                </InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 10015}}> 
                                    <DatePicker
                                        id="exitDate"
                                        disableFuture
                                        name="exitDate"
                                        onChange={(date) => handleDateChange('exitDate', date)}
                                        value={dayjs(formValues.exitDate)}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                placeholder: "Exit Date",
                                                error: !!formErrors.exitDate,
                                                helperText: formErrors.exitDate || ''
                                            },
                                            popper: {
                                                style: { zIndex: 110015 },
                                            },
                                        }}
                                        
                                        sx={{ mt: 1}}
                                    />
                                </LocalizationProvider>
                            </Grid2>
                        </Grid2>



                        <Grid2 container spacing={2} sx={{ mt: 2 }}>
                        <Grid2 size={{ xs: 12, sm: 6 }} >
                            <InputLabel shrink={false} htmlFor="countryId">
                                <Typography variant='body1'>Country*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="countryId"
                                    required
                                    value={formValues.countryId}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="countryId"
                                    error={!!formErrors.countryId}
                                    size='small'
                                    disabled={true}
                                >
                                    <MenuItem value="">
                                        Select Country
                                    </MenuItem>
                                    {countryList.map(country => (
                                        <MenuItem key={country.countryId} value={country.countryId}>
                                            {country.countryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.countryId && <FormHelperText error>{formErrors.countryId}</FormHelperText>}
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }} >
                            <InputLabel shrink={false} htmlFor="stateId">
                                <Typography variant='body1'>State/Province*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="stateId"
                                    required
                                    value={formValues.stateId }
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="stateId"
                                    error={!!formErrors.stateId}
                                    size='small'
                                    
                                >
                                    <MenuItem value="">
                                        Select State/Province
                                    </MenuItem>
                                    {filteredState.map(state => (
                                        <MenuItem key={state.stateId} value={state.stateId}>
                                            {state.stateName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.stateId && <FormHelperText error>{formErrors.stateId}</FormHelperText>}
                            </FormControl>
                        </Grid2>
                    </Grid2>


                    <Grid2 container direction="row" justifyContent="center" alignItems="center">
                        <Captcha setCaptcha={setCaptchaText} 
                                setCaptchaInput={setCaptchaInput}
                                captchaInput={captchaInput}
                                captchaError={!!formErrors.captcha}
                                captchaErrorMsg={formErrors.captcha}/> 
                    </Grid2>

                        <Grid2 container direction="row" sx={{ mt: 4}} spacing={2} justifyContent="center" alignItems="center">
                                    <Grid2   >
                                        <Button type="submit" fullWidth variant="contained" sx={{maxWidth: '120px' }}>
                                            Submit
                                        </Button>
                                    </Grid2>
                                    <Grid2   >
                                        <Button type="button" onClick={handleReset} color="reset" fullWidth variant="contained" sx={{maxWidth: '120px', color: "#FFFFFF" }}>
                                            Reset
                                        </Button>
                                    </Grid2>
                        </Grid2>                          

                        </Box>


                </FormWrapper>
        
        </>
    );
};

export default EditASP;


