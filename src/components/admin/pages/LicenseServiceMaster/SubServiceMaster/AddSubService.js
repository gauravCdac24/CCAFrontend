import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography,FormControl,Select,FormHelperText,MenuItem,RadioGroup,Radio,FormControlLabel,Checkbox} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';
import MinimumAttempt from '../../../../../service/AdminService/MinimumAttempt';
import { CheckBox } from '@mui/icons-material';
import ServiceMaster from '../../../../../service/AdminService/ServiceMaster';
import { useEffect } from 'react';
import SubServiceMaster from '../../../../../service/AdminService/SubServiceMaster';

//Errors
const errorMsg = {
    subServiceName: {
        blank: "Please enter sub service name.",
         min: "sub service name should be in the range of 1 to 17.",
        format: "please enter a valid format"
    },
    serviceId: {
        blank: "Please select the service name.",
    },
    isMandatory: {
        blank: "Please select one.",
    },

    captchaError: {
        blank: "Please enter captcha."
    }
};

const AddSubService = () => {
    const [subServiceFormValues, setSubServiceFormValues] = useState({
        subServiceName:'',
        serviceId:'',
        isMandatory:'',
      
    });
//const serviceData=["service1","service2","service3"]

const [serviceData, setServiceData] = useState([]);

useEffect(() => {
    ServiceMaster.getAllServiceList().then(data => {
        setServiceData(data.data);
        console.log("Fetched  :", serviceData); // Add console log to debug

    }).catch(error => {
        console.error("Error fetching countries:", error);
    });
}, []);


    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();


    // reset
    const handleReset = () => {
        setSubServiceFormValues({
            subServiceName:'',
            serviceId:'',
            isMandatory:'',
        }); 

        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setSubServiceFormValues({
                ...subServiceFormValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {
        const errors = {};

        if(!subServiceFormValues.subServiceName){
            errors.subServiceName = errorMsg.subServiceName.blank;
        }else if ((subServiceFormValues.subServiceName > 0 && subServiceFormValues.subServiceName < 17)) {
            errors.serviceName = errorMsg.subServiceName.min;
        } else if(!/^[A-Za-z/  ]+$/.test(subServiceFormValues.subServiceName)){
            errors.subServiceName = errorMsg.subServiceName.format;
        }
        if(!subServiceFormValues.serviceId){
            errors.serviceId = errorMsg.serviceId.blank;
        }
        if(!subServiceFormValues.isMandatory){
            errors.isMandatory = errorMsg.isMandatory.blank;
        }
        if(!captchaInput){
            errors.captcha = errorMsg.captchaError.blank;
        }


        return errors;
    };
    console.log(subServiceFormValues)

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();
 console.log(subServiceFormValues)
        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            // Submit form
            console.log(subServiceFormValues)
         
            if(captchaInput === captchaText){

                setLoading(true);
                console.log(subServiceFormValues)
                //Save
                SubServiceMaster.addNewService(subServiceFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add Sub Service',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/subservice")}
                    })

                })
                .catch((err)=>{

                        showAlert({
                            messageTitle: 'Error',
                            messageContent: err.response.data? typeof err.response.data === 'object'? 'Your request cannot be processed at this time. Please try again later.': err.response.data:'Your request cannot be processed at this time. Please try again later.',
                            confirmText: 'Ok',
                        })

                })
                .finally(()=>{
                    setLoading(false);
                   });
            }

        } else {
            console.log(errors)
            setFormErrors(errors);
        }
    };

    const handleBack = () =>{
        navigate("/admin/subservice", { replace: true })
    }

    return (
        <>

        <LoaderProgress open={isLoading} />
    
        <Box component="div">
    
            <Grid container spacing={2} direction={'column'}>
    
                <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                    <Button variant="contained" onClick={handleBack}>
                        <Typography variant="h6">Back</Typography>
                    </Button>
                </Grid>
            </Grid>
    
        </Box>
    
        <FormWrapper headingText="Add Sub Service">
    
            <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >
    
                <Grid container spacing={2} direction="column">
    
                    <Grid item xs={12} sm>
                        <InputLabel shrink={false} htmlFor={"subServiceName"}>
                            <Typography variant='body1'>Sub Service Name*</Typography>
                        </InputLabel>
                        <TextField
                            id="subServiceName"
                            margin="dense"
                            required
                            fullWidth
                            placeholder='Sub Service Name'
                            name="subServiceName"
                            variant='outlined'
                            error={!!formErrors.subServiceName}
                            helperText={formErrors.subServiceName || ''}
                            onChange={handleInputChange}
                            onKeyDown={(e) =>validatePattern(e, /^[A-Za-z/ ]+$/)}
                            value={subServiceFormValues.subServiceName}
                            size="small"
                            inputProps={{ maxLength: 17 }}
                        />
                    </Grid>
    
                    <Grid item xs={12} sm>
                        <InputLabel shrink={false} htmlFor="serviceId">
                            <Typography variant='body1'>Service Name*</Typography>
                        </InputLabel>
                        <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                            <Select
                                id="serviceId"
                                margin='dense'
                                required
                                fullWidth
                                onChange={handleInputChange}
                                displayEmpty
                                name="serviceId"
                                value={subServiceFormValues.serviceId}
                                error={Boolean(formErrors.serviceId)}
                            >
                                <MenuItem disabled value="">
                                    Service Name
                                </MenuItem>
                                {serviceData.map((item, index) => (
                                    <MenuItem key={index} value={item.serviceId}>{item.serviceTitle}</MenuItem>
                                ))}
                            </Select>
                            {formErrors.serviceId && (
                                <FormHelperText error sx={{ ml: 0 }}>{formErrors.serviceId}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
    
                    <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="isMandatory">
                                <Typography variant='body1'>Is Mandatory*</Typography>
                            </InputLabel>
                            <FormControl component="fieldset" sx={{ mt: 1 }}>
                                <Grid container direction="row" spacing={4}>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Yes"
                                            name="isMandatoryYes"
                                            checked={subServiceFormValues.isMandatory === 'true'}
                                            onChange={() => handleInputChange({ target: { name: 'isMandatory', value: 'true' } })}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="No"
                                            name="isMandatoryNo"
                                            checked={subServiceFormValues.isMandatory === 'false'}
                                            onChange={() => handleInputChange({ target: { name: 'isMandatory', value: 'false' } })}
                                        />
                                    </Grid>
                                </Grid>
                                {formErrors.isMandatory && (
                                    <FormHelperText error sx={{ ml: 0 }}>{formErrors.isMandatory}</FormHelperText>
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
                    <Grid item>
                        <Button type="submit" fullWidth variant="contained" sx={{maxWidth: '120px' }}>
                            Submit
                        </Button>
                    </Grid>
                    <Grid item>
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

export default AddSubService;
