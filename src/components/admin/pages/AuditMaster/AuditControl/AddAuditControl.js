import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText, MenuItem, Select, Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import AuditControlService from '../../../../../service/AdminService/AuditControlService';
import AuditParameterService from '../../../../../service/AdminService/AuditParameterService';
import AuditCheckService from '../../../../../service/AdminService/AuditCheckService';
import AuditControlTypeService from '../../../../../service/AdminService/AuditControlTypeService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';
import MyTextEditor from '../../../../global/common/MyTextEditor';
import DOMPurify from 'dompurify';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
//Errors
const errorMsg = {
    controlDesc: {
        blank: "Please enter audit control.",
    },
    references:{
        blank: "Please enter references.",
        format: "Alphabets, digits, parenthesis, . and space are allowed.",
        length: "The length must be between 3 and 60 characters."
    },
    auditCheckId:{
        blank: "Please select audit check."
    },
    auditControlTypeId:{
        blank: "Please select audit control type"
    },
    auditParameterId:{
        blank: "Please select audit parameter."
    },
    auditControlId:{
        blank: "Please select audit control."
    },
    effctiveDate:{
        blank: "Please select effective date."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const AddAuditControl = () => {
    const [auditFormValues, setAuditFormValues] = useState({
        controlDesc:'',
        auditParameterId:'',
        auditCheckId:'',
        auditControlTypeId:'',
        references:'',
        selfAuditControlId:'',
        effectiveDate: '',
    });
 //```javascript
// ...

// Input Change
const handleInputChange = (e) => {
    const { name, value } = e.target;

    setAuditFormValues({
        ...auditFormValues,
        [name]: value,
    });
};

// Date Change
const handleDateChange = (name, date) => {
    const isValidDate = (date) => {
        return dayjs(date).isValid();
    };

    if (!isValidDate(date)) {
        console.error('Invalid date:', date);
        return;
    }

    const formatDate = (date) => {
        return dayjs(date).format('YYYY-MM-DD');
    };

    const formattedDate = formatDate(date);

    setAuditFormValues((prevValues) => ({
        ...prevValues,
        [name]: formattedDate,
    }));
};

// Validate Form
const validateForm = () => {
    const errors = {};

    if (!auditFormValues.controlDesc) {
        errors.controlDesc = errorMsg.controlDesc.blank;
    }

    if (!auditFormValues.references) {
        errors.references = errorMsg.references.blank;
    } else if (auditFormValues.references.length < 3 || auditFormValues.references.length > 60) {
        errors.references = errorMsg.references.length;
    } else if (!/^[A-Za-z0-9\)\(. ]+$/.test(auditFormValues.references)) {
        errors.references = errorMsg.references.format;
    }

    if (!auditFormValues.auditParameterId) {
        errors.auditParameterId = errorMsg.auditParameterId.blank;
    }

    if (!auditFormValues.auditCheckId) {
        errors.auditCheckId = errorMsg.auditCheckId.blank;
    }

    if (!auditFormValues.auditControlTypeId) {
        errors.auditControlTypeId = errorMsg.auditControlTypeId.blank;
    }

    if (!auditFormValues.selfAuditControlId) {
        errors.auditControlId = errorMsg.auditControlId.blank;
    }

    if (!auditFormValues.effectiveDate) {
        errors.effctiveDate = errorMsg.effctiveDate.blank;
    }

    if (!captchaInput) {
        errors.captcha = errorMsg.captchaError.blank;
    }

    return errors;
};

// Handle Form Submit
const handleFormSubmit = (e) => {
    e.preventDefault();

    auditFormValues.controlDesc = editorText;

    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
        setFormErrors({});

        if (captchaInput === captchaText) {
            setLoading(true);

            AuditControlService.addNewAuditControl(auditFormValues)
                .then((response) => {
                    showAlert({
                        messageTitle: 'Add Audit Control',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => { navigate("/admin/control") },
                        enableHeaderCloseBtn: false,
                        disableOutsideKeyDown: true
                    })
                })
                .catch((err) => {
                    showAlert({
                        messageTitle: 'Error',
                        messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
                        confirmText: 'Ok',
                        enableHeaderCloseBtn: true,
                        disableOutsideKeyDown: false
                    })
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
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

    const [auditParameterList, setAuditParameterList] = useState([]);
    const [auditCheckList, setAuditCheckList] = useState([]);
    const [auditControlTypeList, setAuditControlTypeList] = useState([]);
    const [editorText, setEditorText] = useState('');
    const [allAuditControlList, setAllAuditControlList] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    
    const navigate = useNavigate();


    // reset
    const handleReset = () => {
        setAuditFormValues({
            controlDesc:'',
            auditParameterId:'',
            auditCheckId:'',
            auditControlTypeId:'',
            references:'',
        }); 
        setEditorText('');
        setCaptchaInput('');
        setFormErrors({});
    }

 
    const handleBack = () =>{
        navigate("/admin/control", { replace: true })
    }

    //Audit Parameter List
    const getAuditParameterList = () =>{
        setLoading(true);
        AuditParameterService.getAllAuditParameterList()
        .then((response)=>{
            setAuditParameterList(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })
    }

     //Audit Check List
     const getAuditCheckList = () =>{
        setLoading(true);
        AuditCheckService.getAllAuditCheckList()
        .then((response)=>{
            setAuditCheckList(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })
    }

    
     //Audit Control Type
     const getAuditControlTypeList = () =>{
        setLoading(true);
        AuditControlTypeService.getAllAuditControlTypeList()
        .then((response)=>{
            setAuditControlTypeList(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })
    }


    const getAllAuditControl = () => {
        setLoading(true);

        AuditControlService.getAllAuditControlList()
            .then((response) => {
                
                setAllAuditControlList(response.data);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching audit control list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllAuditControl();
    }, []);




    useEffect(()=>{
        getAuditParameterList();
        getAuditCheckList();
        getAuditControlTypeList();
    }, []);

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

            
                <FormWrapper headingText="Add Audit Control">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                    <Grid container  spacing={2} direction="column">

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"controlDesc"}>
                                <Typography variant='body1'>Audit Control*</Typography>
                            </InputLabel>
                            <MyTextEditor editorText={editorText} setEditorText={setEditorText}/>
                            {formErrors.controlDesc && (
                                    <FormHelperText error sx={{ml:0}}>{formErrors.controlDesc}</FormHelperText>
                                )}
                        </Grid>

                        </Grid> 

                        <Grid container  spacing={2} direction="column" sx={{mt: 1}}>

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"references"}>
                                    <Typography variant='body1'>Reference*</Typography>
                                </InputLabel>
                                <TextField
                                    id="references"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Reference'
                                    name="references"
                                    variant='outlined'
                                    error={!!formErrors.references}
                                    helperText={formErrors.references || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9\)\(. ]+$/)}
                                    value={auditFormValues.references}
                                    size="small"
                                    inputProps={{ maxLength: 60 }}
                                />
                            </Grid>

                        </Grid> 

                        <Grid container spacing={2} direction="column" sx={{mt:1}}>
                    {/* Date of Birth Field */}
                    <Grid item xs={12} sm>
                        <InputLabel shrink={false} htmlFor={"effectiveDate"}>
                            <Typography variant='body1'>Effective Date*</Typography>
                        </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                id="effectiveDate"
                                disablePast
                                name="effectiveDate"
                                minDate={dayjs()}
                                onChange={(date) => handleDateChange('effectiveDate', date)}
                                value={dayjs(auditFormValues.effectiveDate)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                        placeholder: "Effective Date",
                                         error: !!formErrors.effectiveDate,
                                            helperText: formErrors.effectiveDate || ''
                                    }
                                }}
                                sx={{ mt: 1 }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    </Grid>


                        <Grid container spacing={2} direction="column" sx={{mt:1}}>

                        <Grid item xs={12} sm>

                            <InputLabel shrink={false} htmlFor={"auditParameterId"}>
                                <Typography variant='body1' sx={{color: "#000000"}}>Audit Parameter*</Typography>
                            </InputLabel>

                            <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                
                                <Select
                                    id="auditParameterId"
                                    onChange={handleInputChange}
                                    displayEmpty
                                    value={auditFormValues.auditParameterId || ''}
                                    name="auditParameterId"
                                    error={
                                        Boolean(formErrors.auditParameterId)
                                    }
                                    

                                    >

                                        <MenuItem disabled value={auditFormValues.auditParameterId}>
                                            Audit Parameter
                                        </MenuItem>


                                        {
                                            auditParameterList.map((item, index)=>(

                                                <MenuItem key={index} value={item.auditParameterId}>{item.auditParameterTitle} ({item.auditSubCriteriaId?.auditSubCriteriaTitle || '-'})</MenuItem>

                                            ))
                                        }
                                </Select>
                                {formErrors.auditParameterId && (
                                <FormHelperText error sx={{ml:0}}>{formErrors.auditParameterId}</FormHelperText>
                            )}
                            </FormControl>
                            </Grid>
                        </Grid>


                        <Grid container spacing={2} direction="column" sx={{mt:1}}>

                        <Grid item xs={12} sm>

                            <InputLabel shrink={false} htmlFor={"auditCheckId"}>
                                <Typography variant='body1' sx={{color: "#000000"}}>Audit Check*</Typography>
                            </InputLabel>

                            <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                
                                <Select
                                    id="auditCheckId"
                                    onChange={handleInputChange}
                                    displayEmpty
                                    value={auditFormValues.auditCheckId || ''}
                                    name="auditCheckId"
                                    error={
                                        Boolean(formErrors.auditCheckId)
                                    }
                                    
                                    sx={{padding: 0}}
                                    >

                                        <MenuItem disabled value={auditFormValues.auditCheckId}>
                                            Audit Check
                                        </MenuItem>


                                        {
                                            auditCheckList.map((item, index)=>(

                                                <MenuItem key={index} value={item.auditCheckId}>
                                                <Box
                                                    component="span"
                                                    sx={{ display: 'inline' }}
                                                >
                                                    {DOMPurify.sanitize(item.auditCheckDesc)
                                                    .replace(/<[^>]*>/g, '') 
                                                    .substring(0, 50)}...
                                                </Box>
                                                </MenuItem>
                                             

                                            ))
                                        }
                                </Select>
                                {formErrors.auditCheckId && (
                                <FormHelperText error sx={{ml:0}}>{formErrors.auditCheckId}</FormHelperText>
                            )}
                            </FormControl>
                            </Grid>
                        </Grid>


                         <Grid container spacing={2} direction="column" sx={{mt:1}}>

                        <Grid item xs={12} sm>

                            <InputLabel shrink={false} htmlFor={"auditControlTypeId"}>
                                <Typography variant='body1' sx={{color: "#000000"}}>Audit Control Type*</Typography>
                            </InputLabel>

                            <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                
                                <Select
                                    id="auditControlTypeId"
                                    onChange={handleInputChange}
                                    displayEmpty
                                    value={auditFormValues.auditControlTypeId || ''}
                                    name="auditControlTypeId"
                                    error={
                                        Boolean(formErrors.auditControlTypeId)
                                    }
                                    

                                    >

                                        <MenuItem disabled value={auditFormValues.auditControlTypeId}>
                                            Audit Control Type
                                        </MenuItem>


                                        {
                                            auditControlTypeList.map((item, index)=>(

                                                <MenuItem key={index} value={item.auditControlTypeId}>{item.auditControlDesc}</MenuItem>

                                            ))
                                        }
                                </Select>
                                {formErrors.auditCheckId && (
                                <FormHelperText error sx={{ml:0}}>{formErrors.auditControlTypeId}</FormHelperText>
                            )}
                            </FormControl>
                            </Grid>
                        </Grid>


                        <Grid container spacing={2} direction="column" sx={{mt:1}}>

                        <Grid item xs={12} sm>

                            <InputLabel shrink={false} htmlFor={"selfAuditControlId"}>
                                <Typography variant='body1' sx={{color: "#000000"}}>Audit Control*</Typography>
                            </InputLabel>

                            <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                
                                <Select
                                    id="selfAuditControlId"
                                    onChange={handleInputChange}
                                    displayEmpty
                                    value={auditFormValues.selfAuditControlId || ''}
                                    name="selfAuditControlId"
                                    error={
                                        Boolean(formErrors.auditControlId)
                                    }
                                    

                                    >

                                        <MenuItem disabled value={auditFormValues.selfAuditControlId}>
                                            Audit Control
                                        </MenuItem>


                                        <MenuItem value="notNow">Not Now</MenuItem>

                                        {
                                            allAuditControlList.map((item, index)=>(

                                                <MenuItem key={index} value={item.auditControlId}>
                                                
                                                <Box
                                                    component="span"
                                                    sx={{ display: 'inline' }}
                                                >
                                                    {DOMPurify.sanitize(item.controlDesc)
                                                    .replace(/<[^>]*>/g, '') 
                                                    .substring(0, 50)}...
                                                </Box>
                                                
                                                </MenuItem>

                                            ))
                                        }
                                </Select>
                                {formErrors.auditControlId && (
                                <FormHelperText error sx={{ml:0}}>{formErrors.auditControlId}</FormHelperText>
                            )}
                            </FormControl>
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

export default AddAuditControl;
