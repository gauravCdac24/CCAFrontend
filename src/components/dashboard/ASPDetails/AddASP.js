import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText, IconButton, MenuItem, Select, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import Captcha from '../../global/util/Captcha';
import validatePattern from '../../global/util/ValidatePattern';
import DashboardService from '../../../service/DashboardService/DashboardService';
import LoaderProgress from '../../global/common/LoaderProgress';
import showAlert from '../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../global/util/FormWrapper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import StateService from '../../../service/AdminService/StateService';
import CountryService from '../../../service/AdminService/CountryService';
import EsignAPISpecificationService from '../../../service/AdminService/EsignAPISpecificationService';
import ESignAPIVersionMasterService from '../../../service/AdminService/ESignAPIVersionMasterService';

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

    apiSpecificationId: {
        blank: "Please select API specification."
    },

    apiVersionId: {
        blank: "Please select API version."
    },

    auditFile: {
        blank: "Please upload ASP audit report.",
        format: "Audit report must be a PDF or Word file.",
        size: "Each audit report must be 5 MB or smaller."
    },

    auditDate: {
        blank: "Please select audit report date.",
        future: "Audit report date cannot be in the future.",
        before: "Audit report date cannot be before the onboarding date."
    },

    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const emptyAuditRow = () => ({ file: null, fileName: '', auditDate: '' });

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const activeMaster = (list) => (list || []).filter((item) => !item.status || String(item.status).toLowerCase() === 'active');

const AddASP = () => {
    const [formValues, setFormValues] = useState({
        aspId:'',
        aspName: '',
        emailId: '',
        countryId: '',
        stateId: '',
        onBoardingDate: '',
        exitDate: '',
        apiSpecificationId: '',
        apiVersionId: ''
    });
    const [auditReports, setAuditReports] = useState([emptyAuditRow()]);
    const [auditErrors, setAuditErrors] = useState([]);
    const [apiSpecList, setApiSpecList] = useState([]);
    const [apiVersionList, setApiVersionList] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0);

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [filteredState, setFilteredState] = useState([]);

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const getAllCountryAndState = async() => {
    
                            try {
                                const [countries, states] = await Promise.all([
                                    CountryService.getAllCountryList(),
                                    StateService.getAllStateList()
                                ]);
                
                                setCountryList(countries.data);
                                setStateList(states.data);
                
                                const filteredStates = states.data.filter(
                                    state => state.countryId.countryName === 'India'
                                );
                                setFilteredState(filteredStates);
                
                                const filteredCountry = countries.data.find(
                                    country => country.countryName === 'India'
                                );
    
                                setFormValues((prev) => ({
                                    ...prev,
                                    countryId: filteredCountry.countryId,
                                }));
                                
    
                            } catch (err) {
                                
                            } finally {
                                setLoading(false);
                            }
    
        }

    useEffect(() => {
        getAllCountryAndState();
        EsignAPISpecificationService.getAllAPISpecification()
            .then((response) => setApiSpecList(activeMaster(response.data)))
            .catch(() => setApiSpecList([]));
        ESignAPIVersionMasterService.getAllAPIVersion()
            .then((response) => setApiVersionList(activeMaster(response.data)))
            .catch(() => setApiVersionList([]));
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
            exitDate: '',
            apiSpecificationId: '',
            apiVersionId: ''
        });
        setAuditReports([emptyAuditRow()]);
        setAuditErrors([]);
        setFileInputKey((key) => key + 1);
        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "countryId") {
            const filteredStates = stateList.filter(state => state.countryId.countryId === value);
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

        if(!formValues.apiSpecificationId){
            errors.apiSpecificationId = errorMsg.apiSpecificationId.blank;
        }

        if(!formValues.apiVersionId){
            errors.apiVersionId = errorMsg.apiVersionId.blank;
        }

        const rowErrors = auditReports.map((row) => {
            const rowError = {};
            if(!row.file){
                rowError.file = errorMsg.auditFile.blank;
            } else if(!/\.(pdf|doc|docx)$/i.test(row.file.name)){
                rowError.file = errorMsg.auditFile.format;
            } else if(row.file.size > 5 * 1024 * 1024){
                rowError.file = errorMsg.auditFile.size;
            }
            if(!row.auditDate){
                rowError.auditDate = errorMsg.auditDate.blank;
            } else if(dayjs(row.auditDate).isAfter(dayjs(), 'day')){
                rowError.auditDate = errorMsg.auditDate.future;
            } else if(formValues.onBoardingDate && row.auditDate < formValues.onBoardingDate){
                rowError.auditDate = errorMsg.auditDate.before;
            }
            return rowError;
        });
        setAuditErrors(rowErrors);
        if(rowErrors.some((rowError) => Object.keys(rowError).length > 0)){
            errors.auditReports = 'invalid';
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

    const handleAuditFileChange = (index, file) => {
        setAuditReports((rows) => rows.map((row, rowIndex) => (
            rowIndex === index ? { ...row, file: file || null, fileName: file ? file.name : '' } : row
        )));
    };

    const handleAuditDateChange = (index, date) => {
        if (!dayjs(date).isValid()) {
            return;
        }
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setAuditReports((rows) => rows.map((row, rowIndex) => (
            rowIndex === index ? { ...row, auditDate: formattedDate } : row
        )));
    };

    const addAuditRow = () => {
        setAuditReports((rows) => [...rows, emptyAuditRow()]);
        setAuditErrors([]);
    };

    const removeAuditRow = (index) => {
        setAuditReports((rows) => rows.filter((_, rowIndex) => rowIndex !== index));
        setAuditErrors([]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            // Submit form

            if(captchaInput === captchaText){

                setLoading(true);

                let auditPayload;
                try {
                    auditPayload = await Promise.all(auditReports.map(async (row) => ({
                        fileName: row.file.name,
                        fileContent: await fileToBase64(row.file),
                        auditDate: row.auditDate,
                    })));
                } catch (readError) {
                    setLoading(false);
                    showAlert({
                        messageTitle: 'Error',
                        messageContent: 'Audit report file could not be read.',
                        confirmText: 'Ok',
                        enableHeaderCloseBtn: true,
                        disableOutsideKeyDown: false
                    });
                    return;
                }

                DashboardService.addASPDetails({
                    ...formValues,
                    exitDate: '',
                    auditReports: auditPayload,
                })
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add ASP',
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

            
                <FormWrapper headingText="Add Application Service Provider">


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
                                <InputLabel shrink={false} htmlFor={"exitDate"}>
                                    <Typography variant='body1' color="text.disabled">Exit Date</Typography>
                                </InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 10015}}> 
                                    <DatePicker
                                        id="exitDate"
                                        disabled
                                        name="exitDate"
                                        value={null}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                placeholder: "Exit Date",
                                                disabled: true,
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
                                    value={formValues.stateId}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="stateId"
                                    error={!!formErrors.stateId}
                                    size='small'
                                    
                                >
                                    <MenuItem value="">
                                        Select State/Province
                                    </MenuItem>
                                    {filteredState.map((state, index) => (
                                        <MenuItem key={index} value={state.stateId}>
                                            {state.stateName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.stateId && <FormHelperText error>{formErrors.stateId}</FormHelperText>}
                            </FormControl>
                        </Grid2>
                    </Grid2>

                    <Grid2 container spacing={2} sx={{ mt: 2 }}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <InputLabel shrink={false} htmlFor="apiSpecificationId">
                                <Typography variant='body1'>API Specification*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="apiSpecificationId"
                                    required
                                    value={formValues.apiSpecificationId}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="apiSpecificationId"
                                    error={!!formErrors.apiSpecificationId}
                                    size="small"
                                >
                                    <MenuItem value="">Select API Specification</MenuItem>
                                    {apiSpecList.map((item) => (
                                        <MenuItem key={item.esignApiSpecId} value={String(item.esignApiSpecId)}>
                                            {item.apiSpecification}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.apiSpecificationId && <FormHelperText error>{formErrors.apiSpecificationId}</FormHelperText>}
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <InputLabel shrink={false} htmlFor="apiVersionId">
                                <Typography variant='body1'>API Version*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="apiVersionId"
                                    required
                                    value={formValues.apiVersionId}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="apiVersionId"
                                    error={!!formErrors.apiVersionId}
                                    size="small"
                                >
                                    <MenuItem value="">Select API Version</MenuItem>
                                    {apiVersionList.map((item) => (
                                        <MenuItem key={item.esignApiVerId} value={String(item.esignApiVerId)}>
                                            {item.apiVersion}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.apiVersionId && <FormHelperText error>{formErrors.apiVersionId}</FormHelperText>}
                            </FormControl>
                        </Grid2>
                    </Grid2>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant='body1'>ASP Audit Report*</Typography>
                        {auditReports.map((row, index) => (
                            <Grid2 container spacing={2} key={`${fileInputKey}-${index}`} sx={{ mt: 1 }} alignItems="flex-start">
                                <Grid2 size={{ xs: 12, sm: 5 }}>
                                    <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                                        Upload
                                        <input
                                            hidden
                                            type="file"
                                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            onChange={(event) => handleAuditFileChange(index, event.target.files?.[0])}
                                        />
                                    </Button>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                        {row.fileName || 'No file chosen'}
                                    </Typography>
                                    {auditErrors[index]?.file && <FormHelperText error>{auditErrors[index].file}</FormHelperText>}
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 5 }}>
                                    <InputLabel shrink={false} htmlFor={`auditDate-${index}`}>
                                        <Typography variant='body1'>Audit Report Date*</Typography>
                                    </InputLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            disableFuture
                                            value={row.auditDate ? dayjs(row.auditDate) : null}
                                            onChange={(date) => handleAuditDateChange(index, date)}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true,
                                                    placeholder: 'Audit Report Date',
                                                    error: !!auditErrors[index]?.auditDate,
                                                    helperText: auditErrors[index]?.auditDate || '',
                                                },
                                                popper: {
                                                    style: { zIndex: 110015 },
                                                },
                                            }}
                                            sx={{ mt: 1 }}
                                        />
                                    </LocalizationProvider>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                                    <IconButton aria-label="Add audit report" color="primary" onClick={addAuditRow}>
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Remove audit report"
                                        color="error"
                                        onClick={() => removeAuditRow(index)}
                                        disabled={auditReports.length === 1}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Grid2>
                            </Grid2>
                        ))}
                    </Box>

                    <Grid2 container spacing={2} sx={{ mt: 2 }}>
                        <Grid2 size={12}>
                            <Typography variant="h6">
                                <b>Note:</b> <br />
                                1. Audit Reports and their Audit Dates are to be updated yearly.
                            </Typography>
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

export default AddASP;
