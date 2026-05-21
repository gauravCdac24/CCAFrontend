import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText, MenuItem, Select, Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import AuditCriteriaService from '../../../../../service/AdminService/AuditCriteriaService';
import AuditSubCriteriaService from '../../../../../service/AdminService/AuditSubCriteriaService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';

//Errors
const errorMsg = {
    auditSubCriteriaTitle: {
        blank: "Please enter audit sub criteria title.",
        length: "The length must be between 3 and 155 characters.",
        format: "Alphabets, parenthesis and spaces are allowed."
    },
    auditCriteriaId:{
        blank: "Please select audit criteria."
    },
    visible:{
        blank: "Please select visibility status."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const AddAuditSubCriteria = () => {
    const [auditFormValues, setAuditFormValues] = useState({
        auditSubCriteriaTitle:'',
        auditCriteriaId:'',
        visible:'',
    });
    const [auditCriteriaList, setAuditCriteriaList] = useState([]);

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    
    const navigate = useNavigate();


    const visibleList = [
        {
            'id':1,
            'visibility':"TRUE",
            'title': "Yes"
        },
        {
            'id':2,
            'visibility':"FALSE",
            'title': "No"
        }
    ]

    // reset
    const handleReset = () => {
        setAuditFormValues({
            auditSubCriteriaTitle:'',
            auditCriteriaId:'',
            visible:'',
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

        if(!auditFormValues.auditSubCriteriaTitle){
            errors.auditSubCriteriaTitle = errorMsg.auditSubCriteriaTitle.blank;
        }

        if(!auditFormValues.auditSubCriteriaTitle){
            errors.auditSubCriteriaTitle = errorMsg.auditSubCriteriaTitle.blank;
        } else if (auditFormValues.auditSubCriteriaTitle.length < 3 || auditFormValues.auditSubCriteriaTitle.length > 155) {
            errors.auditSubCriteriaTitle = errorMsg.auditSubCriteriaTitle.length;
        } else if(!/^[A-Za-z\)\( ]+$/.test(auditFormValues.auditSubCriteriaTitle)){
            errors.auditSubCriteriaTitle = errorMsg.auditSubCriteriaTitle.format;
        }

        if(!auditFormValues.auditCriteriaId){
            errors.auditCriteriaId = errorMsg.auditCriteriaId.blank;
        }

        if(!auditFormValues.visible){
            errors.visible = errorMsg.visible.blank;
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
                AuditSubCriteriaService.addNewAuditSubCriteria(auditFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add Audit Sub Criteria',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/subaudit")},
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
        navigate("/admin/subaudit", { replace: true })
    }

    const getAuditCriteriaList = () =>{
        setLoading(true);
        AuditCriteriaService.getAllAuditCriteriaList()
        .then((response)=>{
            setAuditCriteriaList(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })
    }

    useEffect(()=>{
        getAuditCriteriaList();
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

            
                <FormWrapper headingText="Add Audit Sub Criteria">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"auditSubCriteriaTitle"}>
                                    <Typography variant='body1'>Audit Sub Criteria Title*</Typography>
                                </InputLabel>
                                <TextField
                                    id="auditSubCriteriaTitle"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Audit Sub Criteria Title'
                                    name="auditSubCriteriaTitle"
                                    variant='outlined'
                                    error={!!formErrors.auditSubCriteriaTitle}
                                    helperText={formErrors.auditSubCriteriaTitle || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z\)\( ]+$/)}
                                    value={auditFormValues.auditSubCriteriaTitle}
                                    size="small"
                                    inputProps={{ maxLength: 155 }}
                                />
                            </Grid>

                        </Grid> 

                        <Grid container spacing={2} direction="column" sx={{mt:1}}>

                        <Grid item xs={12} sm>

                            <InputLabel shrink={false} htmlFor={"auditCriteriaId"}>
                                <Typography variant='body1' sx={{color: "#000000"}}>Audit Criteria*</Typography>
                            </InputLabel>

                            <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                
                                <Select
                                    id="auditCriteriaId"
                                    onChange={handleInputChange}
                                    displayEmpty
                                    value={auditFormValues.auditCriteriaId || ''}
                                    name="auditCriteriaId"
                                    error={
                                        Boolean(formErrors.auditCriteriaId)
                                    }
                                    

                                    >

                                        <MenuItem disabled value={auditFormValues.auditCriteriaId}>
                                            Audit Criteria
                                        </MenuItem>


                                        {
                                            auditCriteriaList.map((item, index)=>(

                                                <MenuItem key={index} value={item.auditCriteriaId}>{item.auditCriteriaTitle}</MenuItem>

                                            ))
                                        }
                                </Select>
                                {formErrors.auditCriteriaId && (
                                <FormHelperText error sx={{ml:0}}>{formErrors.auditCriteriaId}</FormHelperText>
                            )}
                            </FormControl>
                            </Grid>
                        </Grid>


                        <Grid container spacing={2} direction="column" sx={{mt:1}}>

                            <Grid item xs={12} sm>

                                <InputLabel shrink={false} htmlFor={"visible"}>
                                    <Typography variant='body1' sx={{color: "#000000"}}>Do you want to make it visible?*</Typography>
                                </InputLabel>

                                <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                    
                                    <Select
                                        id="visible"
                                        onChange={handleInputChange}
                                        displayEmpty
                                        value={auditFormValues.visible || ''}
                                        name="visible"
                                        error={
                                            Boolean(formErrors.visible)
                                        }
                                        

                                        >

                                            <MenuItem disabled value={auditFormValues.visible}>
                                                Visibility
                                            </MenuItem>


                                            {
                                                visibleList.map((item, index)=>(

                                                    <MenuItem key={index} value={item.visibility}>{item.title}</MenuItem>

                                                ))
                                            }
                                    </Select>
                                    {formErrors.visible && (
                                    <FormHelperText error sx={{ml:0}}>{formErrors.visible}</FormHelperText>
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

export default AddAuditSubCriteria;
