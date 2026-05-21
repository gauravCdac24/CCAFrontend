import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import Captcha from '../../../global/util/Captcha';
import validatePattern from '../../../global/util/ValidatePattern';
import EsignDocTypeService from '../../../../service/AdminService/EsignDocTypeService';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../../global/util/FormWrapper';
import { useSelector } from 'react-redux';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import DocumentService from '../../../../service/AdminService/DocumentService';

//Errors
const errorMsg = {
    documentName: {
        blank: "Please enter Document Type.",
        length: "The length must be between 3 and 50 characters.",
        format: "Only alphabets and space are allowed."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const EditDocument = () => {
    const [formValues, setFormValues] = useState({
        documentName:'',
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    let {id} = useParams();

    useEffect(()=>{
        if(id){

            setLoading(true);
            DocumentService.getDocumentNameByID(decrypt(id))
            .then((response)=>{

                setFormValues({

                    documentId: response.data.documentId,
                    documentName: response.data.documentName,
                    created: response.data.created,
                    updated: response.data.updated,
                    status: response.data.status
        
                })
                
            })
            .catch((err)=>{
                navigate(`${rolePath}/documentName`, { replace: true })
            })
            .finally(()=>{
                setLoading(false);
            })

    }else{
        navigate(`${rolePath}/documentName`, { replace: true })
    }

    },[])

    // reset
    const handleReset = () => {
        setFormValues({
            documentName: '',
        }); 

        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormValues({
                ...formValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {
        const errors = {};

        if(!formValues.documentName){
            errors.documentName = errorMsg.documentName.blank;
        }

        if(!formValues.documentName){
            errors.documentName = errorMsg.documentName.blank;
        } else if (formValues.documentName.length < 3 || formValues.documentName.length > 50) {
            errors.documentName = errorMsg.documentName.length;
        } else if(!/^[A-Za-z ]+$/.test(formValues.documentName)){
            errors.documentName = errorMsg.documentName.format;
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
                DocumentService.updateDocumentName(formValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Edit Document Master',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate(`${rolePath}/documentName`)},
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
        navigate(`${rolePath}/documentName`, { replace: true })
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

            
                <FormWrapper headingText="Edit Document Master">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"documentName"}>
                                    <Typography variant='body1'>Document Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="documentName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Document Name'
                                    name="documentName"
                                    variant='outlined'
                                    error={!!formErrors.documentName}
                                    helperText={formErrors.documentName || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                    value={formValues.documentName}
                                    size="small"
                                    inputProps={{ maxLength: 16 }}
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

export default EditDocument;

