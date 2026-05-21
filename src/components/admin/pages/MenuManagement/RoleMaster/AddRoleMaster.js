import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import {useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import RoleMasterService from '../../../../../service/AdminService/RoleMasterService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';


//Errors
const errorMsg = {
    roleName: {
        blank: "Please enter role.",
        length: "Only alphabets and underscore are allowed.",
        format: "The length must be between 3 and 50 characters."
    },
    description:{
        blank: "Please enter role name.",
        length: "Only alphabets and space are allowed.",
        format: "The length must be between 3 and 50 characters."
    },
    path:{
        blank: "Please enter path.",
        length: "Only alphabets, /, and : are allowed.",
        format: "The length must be between 3 and 100 characters."
    },
    homePage:{
        blank: "Please enter home page path.",
        length: "Only alphabets, /, and : are allowed.",
        format: "The length must be between 3 and 100 characters."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const AddRoleMaster = () => {
    const [roleFormValues, setRoleFormValues] = useState({
        roleName:'',
        description: '',
        path: '',
        homePage: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    
    const navigate = useNavigate();


    // reset
    const handleReset = () => {
        setRoleFormValues({
            roleName:'',
            description: '',
            path: '',
            homePage: ''
        }); 
        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setRoleFormValues({
                ...roleFormValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {
        const errors = {};

        if (!roleFormValues.roleName) {
            errors.roleName = errorMsg.roleName.blank;
        } else if (roleFormValues.roleName < 3 || roleFormValues.roleName > 50) {
            errors.roleName = errorMsg.roleName.length;
        } else if (!/^[A-Za-z_]+$/.test(roleFormValues.roleName)) {
            errors.roleName = errorMsg.roleName.format;
        }

        if (!roleFormValues.description) {
            errors.description = errorMsg.description.blank;
        } else if (roleFormValues.description < 3 || roleFormValues.description > 50) {
            errors.description = errorMsg.description.length;
        } else if (!/^[A-Za-z ]+$/.test(roleFormValues.description)) {
            errors.description = errorMsg.description.format;
        }

        if (!roleFormValues.path) {
            errors.path = errorMsg.path.blank;
        } else if (roleFormValues.path < 3 || roleFormValues.path > 100) {
            errors.path = errorMsg.path.length;
        } else if (!/^[A-Za-z/:]+$/.test(roleFormValues.path)) {
            errors.path = errorMsg.path.format;
        }

        if (!roleFormValues.homePage) {
            errors.homePage = errorMsg.homePage.blank;
        } else if (roleFormValues.homePage < 3 || roleFormValues.homePage > 100) {
            errors.homePage = errorMsg.homePage.length;
        } else if (!/^[A-Za-z/:]+$/.test(roleFormValues.homePage)) {
            errors.homePage = errorMsg.homePage.format;
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
                RoleMasterService.addNewRole(roleFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add Role',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/rolemaster")},
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
        navigate("/admin/rolemaster", { replace: true })
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

            
                <FormWrapper headingText="Add Role">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={6} sm>
                                <InputLabel shrink={false} htmlFor={"roleName"}>
                                    <Typography variant='body1'>Role*</Typography>
                                </InputLabel>
                                <TextField
                                    id="roleName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Role'
                                    name="roleName"
                                    variant='outlined'
                                    error={!!formErrors.roleName}
                                    helperText={formErrors.roleName || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z_]+$/)}
                                    value={roleFormValues.roleName}
                                    size="small"
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container  spacing={2} direction="column">
                            <Grid item xs={6} sm>
                                <InputLabel shrink={false} htmlFor={"description"}>
                                    <Typography variant='body1'>Role Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="description"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Role Name'
                                    name="description"
                                    variant='outlined'
                                    error={!!formErrors.description}
                                    helperText={formErrors.description || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                    value={roleFormValues.description}
                                    size="small"
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>

                        </Grid> 


                        <Grid container  spacing={2} direction="column">

                            <Grid item xs={6} sm>
                                <InputLabel shrink={false} htmlFor={"path"}>
                                    <Typography variant='body1'>Path*</Typography>
                                </InputLabel>
                                <TextField
                                    id="path"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Path'
                                    name="path"
                                    variant='outlined'
                                    error={!!formErrors.path}
                                    helperText={formErrors.path || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z/:]+$/)}
                                    value={roleFormValues.path}
                                    size="small"
                                    inputProps={{ maxLength: 100 }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container  spacing={2} direction="column">
                            <Grid item xs={6} sm>
                                <InputLabel shrink={false} htmlFor={"homePage"}>
                                    <Typography variant='body1'>Home Page*</Typography>
                                </InputLabel>
                                <TextField
                                    id="homePage"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Home Page'
                                    name="homePage"
                                    variant='outlined'
                                    error={!!formErrors.homePage}
                                    helperText={formErrors.homePage || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z/:]+$/)}
                                    value={roleFormValues.homePage}
                                    size="small"
                                    inputProps={{ maxLength: 100 }}
                                />
                            </Grid>

                        </Grid>


                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Box sx={{width: '220px'}}>
                                <Captcha setCaptcha={setCaptchaText} 
                                        setCaptchaInput={setCaptchaInput}
                                        captchaInput={captchaInput}
                                        captchaError={!!formErrors.captcha}
                                        captchaErrorMsg={formErrors.captcha}/> 
                            </Box>
                        </Box>

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

export default AddRoleMaster;
