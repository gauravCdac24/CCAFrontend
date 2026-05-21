import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText, MenuItem, Select, Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import AuditSubCriteriaService from '../../../../../service/AdminService/AuditSubCriteriaService';
import AuditParameterService from '../../../../../service/AdminService/AuditParameterService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';
import { decrypt } from '../../../../global/util/EncryptDecrypt';

//Errors
const errorMsg = {
    auditParameterTitle: {
        blank: "Please enter audit parameter title.",
        length: "The length must be between 3 and 155 characters.",
        format: "Alphabets, parenthesis and spaces are allowed."
    },
    auditSubCriteriaId:{
        blank: "Please select audit sub criteria."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const EditAuditParameter = () => {
    const [auditFormValues, setAuditFormValues] = useState({
        auditParameterId:'',
        auditParameterTitle:'',
        auditSubCriteriaId:'',
        status:'',
        createdBy:'',
        updatedBy:'',
        created:'',
    });
    const [auditSubCriteriaList, setAuditSubCriteriaList] = useState([]);

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const {id} = useParams();

    // reset
    const handleReset = () => {
        setAuditFormValues({
            auditParameterTitle:'',
            auditSubCriteriaId:'',
        }); 

        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setAuditFormValues({
                ...auditFormValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {
        const errors = {};

        if(!auditFormValues.auditParameterTitle){
            errors.auditParameterTitle = errorMsg.auditParameterTitle.blank;
        }

        if(!auditFormValues.auditParameterTitle){
            errors.auditParameterTitle = errorMsg.auditParameterTitle.blank;
        } else if (auditFormValues.auditParameterTitle.length < 3 || auditFormValues.auditParameterTitle.length > 155) {
            errors.auditParameterTitle = errorMsg.auditParameterTitle.length;
        } else if(!/^[A-Za-z\)\( ]+$/.test(auditFormValues.auditParameterTitle)){
            errors.auditParameterTitle = errorMsg.auditParameterTitle.format;
        }

        if(!auditFormValues.auditSubCriteriaId){
            errors.auditSubCriteriaId = errorMsg.auditSubCriteriaId.blank;
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
                AuditParameterService.updateAuditParameter(auditFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Update Audit Parameter',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/parameter")},
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
        navigate("/admin/parameter", { replace: true })
    }

    const getAuditSubCriteriaList = () =>{
        setLoading(true);
        AuditSubCriteriaService.getAllAuditSubCriteriaList()
        .then((response)=>{
            setAuditSubCriteriaList(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })
    }


    useEffect(()=>{
        if(id){

            setLoading(true);
            AuditParameterService.getAuditParameterById(decrypt(id))
            .then((response)=>{

                setAuditFormValues({

                    auditParameterId:response.data.auditParameterId,
                    auditParameterTitle:response.data.auditParameterTitle,
                    auditSubCriteriaId:response.data.auditSubCriteriaId.auditSubCriteriaId,
                    status:response.data.status,
                    createdBy:response.data.createdBy,
                    updatedBy:response.data.updatedBy,
                    created:response.data.created,
        
                })

                getAuditSubCriteriaList();
                
            })
            .catch((err)=>{
                navigate('/admin/parameter', { replace: true })
            })
            .finally(()=>{
                setLoading(false);
            })

    }else{
        navigate('/admin/parameter', { replace: true })
    }

    },[])

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

            
                <FormWrapper headingText="Update Audit Parameter">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"auditParameterTitle"}>
                                    <Typography variant='body1'>Audit Parameter Title*</Typography>
                                </InputLabel>
                                <TextField
                                    id="auditParameterTitle"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Audit Parameter Title'
                                    name="auditParameterTitle"
                                    variant='outlined'
                                    error={!!formErrors.auditParameterTitle}
                                    helperText={formErrors.auditParameterTitle || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z\)\( ]+$/)}
                                    value={auditFormValues.auditParameterTitle}
                                    size="small"
                                    inputProps={{ maxLength: 155 }}
                                />
                            </Grid>

                        </Grid> 

                        <Grid container spacing={2} direction="column" sx={{mt:1}}>

                        <Grid item xs={12} sm>

                            <InputLabel shrink={false} htmlFor={"auditSubCriteriaId"}>
                                <Typography variant='body1' sx={{color: "#000000"}}>Audit Sub Criteria*</Typography>
                            </InputLabel>

                            <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                
                                <Select
                                    id="auditSubCriteriaId"
                                    onChange={handleInputChange}
                                    displayEmpty
                                    value={auditFormValues.auditSubCriteriaId || ''}
                                    name="auditSubCriteriaId"
                                    error={
                                        Boolean(formErrors.auditSubCriteriaId)
                                    }
                                    

                                    >

                                        <MenuItem disabled value={auditFormValues.auditSubCriteriaId}>
                                            Audit Sub Criteria
                                        </MenuItem>


                                        {
                                            auditSubCriteriaList.map((item, index)=>(

                                                <MenuItem key={index} value={item.auditSubCriteriaId}>{item.auditSubCriteriaTitle}</MenuItem>

                                            ))
                                        }
                                </Select>
                                {formErrors.auditSubCriteriaId && (
                                <FormHelperText error sx={{ml:0}}>{formErrors.auditSubCriteriaId}</FormHelperText>
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

export default EditAuditParameter;
