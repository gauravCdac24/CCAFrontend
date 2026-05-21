import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import AuditCriteriaService from '../../../../../service/AdminService/AuditCriteriaService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';

//Errors
const errorMsg = {
    auditCriteriaTitle: {
        blank: "Please enter audit criteria title.",
        length: "The length must be between 3 and 155 characters.",
        format: "Alphabets, parenthesis and spaces are allowed."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const AddAuditCriteria = () => {
    const [auditFormValues, setAuditFormValues] = useState({
        auditCriteriaTitle:'',
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();


    // reset
    const handleReset = () => {
        setAuditFormValues({
            auditCriteriaTitle: '',
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

        if(!auditFormValues.auditCriteriaTitle){
            errors.auditCriteriaTitle = errorMsg.auditCriteriaTitle.blank;
        }

        if(!auditFormValues.auditCriteriaTitle){
            errors.auditCriteriaTitle = errorMsg.auditCriteriaTitle.blank;
        } else if (auditFormValues.auditCriteriaTitle.length < 3 || auditFormValues.auditCriteriaTitle.length > 155) {
            errors.auditCriteriaTitle = errorMsg.auditCriteriaTitle.length;
        } else if(!/^[A-Za-z\)\( ]+$/.test(auditFormValues.auditCriteriaTitle)){
            errors.auditCriteriaTitle = errorMsg.auditCriteriaTitle.format;
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
                AuditCriteriaService.addNewAuditCriteria(auditFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add Audit Criteria',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/audit")},
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
        navigate("/admin/audit", { replace: true })
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

            
                <FormWrapper headingText="Add Audit Criteria">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"auditCriteriaTitle"}>
                                    <Typography variant='body1'>Audit Criteria Title*</Typography>
                                </InputLabel>
                                <TextField
                                    id="auditCriteriaTitle"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Audit Criteria Title'
                                    name="auditCriteriaTitle"
                                    variant='outlined'
                                    error={!!formErrors.auditCriteriaTitle}
                                    helperText={formErrors.auditCriteriaTitle || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z\)\( ]+$/)}
                                    value={auditFormValues.auditCriteriaTitle}
                                    size="small"
                                    inputProps={{ maxLength: 155 }}
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

export default AddAuditCriteria;
