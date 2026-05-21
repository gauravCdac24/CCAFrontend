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
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';
import MinimumAttempt from '../../../../../service/AdminService/MinimumAttempt';
import { CheckBox } from '@mui/icons-material';
import ServiceMaster from '../../../../../service/AdminService/ServiceMaster';
import { useEffect } from 'react';
import SubServiceMaster from '../../../../../service/AdminService/SubServiceMaster';
import ApplicationType from '../../../../../service/AdminService/ApplicationType';
import Undertaking from '../../../../../service/AdminService/Undertaking';
import { decrypt, encrypt } from '../../../../global/util/EncryptDecrypt';

//Errors
const errorMsg = {
    undertaking: {
        blank: "Please enter sub service name.",
    },
    appTypeMasterId: {
        blank: "Please select the application Type name.",
    },
    isMandatory: {
        blank: "Please select one.",
    },

    captchaError: {
        blank: "Please enter captcha."
    }
};

const EditUndertaking = () => {
    const [subServiceFormValues, setSubServiceFormValues] = useState({
        undertakingsTitle:'',
        appTypeMasterId:'',
        isMandatory:'',
      
    });
//const serviceData=["service1","service2","service3"]

const [serviceData, setServiceData] = useState({});

useEffect(() => {
    ApplicationType.getAllApplicationTypeList().then(data => {
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
            undertakingsTitle:'',
        appTypeMasterId:'',
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
    let {id} = useParams();

    console.log('id----->',encrypt(id))
    useEffect(()=>{
        if(id){

            setLoading(true);
            Undertaking.getUndertakingById(decrypt(id))
            .then((response)=>{

                setSubServiceFormValues({

                    undertakingId: response.data.undertakingId,
                    undertakingsTitle:response.data.undertakingsTitle,
                    appTypeMasterId:response.data.appTypeMasterId.appTypeMasterId,
                    isMandatory:response.data.isMandatory,
                    created: response.data.created,
                    updated: response.data.updated,
                    status: response.data.status
        
                })
                
            })
            .catch((err)=>{
                navigate('/admin/undertaking', { replace: true })
            })
            .finally(()=>{
                setLoading(false);
            })

    }else{
        navigate('/admin/undertaking', { replace: true })
    }

    },[])

//alert(subServiceFormValues.isMandatory)

    const validateForm = () => {
        const errors = {};

        if(!subServiceFormValues.undertakingsTitle){
            errors.undertakingsTitle = errorMsg.undertaking.blank;
        }
        if(!subServiceFormValues.appTypeMasterId){
            errors.appTypeMasterId = errorMsg.appTypeMasterId.blank;
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
                Undertaking.updateUndertaking(subServiceFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Update Sub Service',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/undertaking")}
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
        navigate("/admin/undertaking", { replace: true })
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
    
        <FormWrapper headingText="Update Undertaking">
    
            <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >
    
                <Grid container spacing={2} direction="column">
    
                <Grid item xs={12} sm>
    <InputLabel shrink={false} htmlFor={"undertakingsTitle"}>
        <Typography variant="body1">Undertaking Title*</Typography>
    </InputLabel>

    <FormControl fullWidth error={!!formErrors.undertakingsTitle} variant="outlined" margin="dense">
        <textarea
            id="undertakingsTitle"
            name="undertakingsTitle"
            placeholder="Undertaking"
            onChange={handleInputChange}
            value={subServiceFormValues.undertakingsTitle}
            style={{
                width: "100%",
                padding: "8px",
                borderColor: formErrors.undertakingsTitle ? 'red' : '#ced4da',
                borderRadius: '4px',
                resize: 'vertical',
                minHeight: '100px', 
                fontSize: '14px'
            }}
        />
        {formErrors.undertakingsTitle && (
            <FormHelperText>{formErrors.undertakingsTitle}</FormHelperText>
        )}
    </FormControl>
</Grid>

    
<Grid item xs={12} sm>
    <InputLabel shrink={false} htmlFor="appTypeMasterId">
        <Typography variant='body1'>Application Type Name*</Typography>
    </InputLabel>
    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
        <Select
            id="appTypeMasterId"
            margin='dense'
            required
            fullWidth
            onChange={handleInputChange}
            displayEmpty
            name="appTypeMasterId"
            value={subServiceFormValues.appTypeMasterId}
            error={Boolean(formErrors.appTypeMasterId)}
        >
            <MenuItem disabled value="">
                Application Type Name
            </MenuItem>
            {/* Iterate through serviceData object */}
            {Object.entries(serviceData).map(([key, item]) => (
                <MenuItem key={key} value={item.appTypeMasterId}>
                    {item.appType}
                </MenuItem>
            ))}
        </Select>
        {formErrors.appTypeMasterId && (
            <FormHelperText error sx={{ ml: 0 }}>{formErrors.appTypeMasterId}</FormHelperText>
        )}
    </FormControl>
</Grid>

    
<Grid item xs={12} sm>
    <InputLabel shrink={false} htmlFor="isMandatory">
        <Typography variant='body1'>Is Mandatory*</Typography>
    </InputLabel>
    <FormControl component="fieldset" sx={{ mt: 1 }}>
        <RadioGroup
            row
            name="isMandatory"
            value={subServiceFormValues.isMandatory} // Expecting either 'true' or 'false'
            onChange={handleInputChange}
        >
            <FormControlLabel
                value="true"
                control={<Radio />}
                label="Yes"
            />
            <FormControlLabel
                value="false"
                control={<Radio />}
                label="No"
            />
        </RadioGroup>
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

export default EditUndertaking;
