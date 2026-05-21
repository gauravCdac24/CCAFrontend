import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {FormControl, FormHelperText, MenuItem, Select, Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import {useEffect, useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import SubMenuMasterService from '../../../../../service/AdminService/SubMenuMasterService';
import SubMenuInternalMasterService from '../../../../../service/AdminService/SubMenuInternalMasterService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';

//Errors
const errorMsg = {
    subMenuInternalName: {
        blank: "Please enter sub menu internal name.",
        length: "Only alphabets and space are allowed.",
        format: "The length must be between 3 and 50 characters."
    },
    subMenuInternalPath: {
        blank: "Please enter sub menu internal path.",
        length: "Only alphabets,/, and : are allowed.",
        format: "The length must be between 3 and 100 characters."
    },
    trackerHeading:{
        blank: "Please enter tracker heading.",
        length: "Only alphabets and space are allowed.",
        format: "The length must be between 3 and 50 characters."
    },

    subsubMenuId:{
        blank: "Please select sub menu.",
    },  
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const AddSubMenuInternalMaster = () => {
    const [subMenuInternalFormValues, setSubMenuInternalFormValues] = useState({
        subMenuInternalName:'',
        subMenuInternalPath: '',
        subMenuId:'',
        trackerHeading: ''
        
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [allSubMenuMasterList, setAllSubMenuMasterList] = useState([]);

    const navigate = useNavigate();
    
    

    const getAllSubMenuMaster = () => {
        setLoading(true);

        SubMenuMasterService.getAllSubMenuList()
            .then((response) => {
                setAllSubMenuMasterList(response.data);
            })
            .catch((err) => {
                console.log('Error fetching menu list. Please try again later.')
            })
            .finally(() => {
                setLoading(false);
            });
    };


    useEffect(()=>{
        getAllSubMenuMaster();
    },[])

    // reset
    const handleReset = () => {
        setSubMenuInternalFormValues({
            subMenuInternalName:'',
            subMenuInternalPath: '',
            subsubMenuId:'',
            trackerHeading: ''
        }); 
        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setSubMenuInternalFormValues({
                ...subMenuInternalFormValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {

        const errors = {};


        if (!subMenuInternalFormValues.subMenuInternalName) {
            errors.subMenuInternalName = errorMsg.subMenuInternalName.blank;
        } else if (subMenuInternalFormValues.subMenuInternalName < 3 || subMenuInternalFormValues.subMenuInternalName > 50) {
            errors.subMenuInternalName = errorMsg.subMenuInternalName.length;
        } else if (!/^[A-Za-z ]+$/.test(subMenuInternalFormValues.subMenuInternalName)) {
            errors.subMenuInternalName = errorMsg.subMenuInternalName.format;
        }

        if (!subMenuInternalFormValues.subMenuInternalPath) {
            errors.subMenuInternalPath = errorMsg.subMenuInternalPath.blank;
        } else if (subMenuInternalFormValues.subMenuInternalPath < 3 || subMenuInternalFormValues.subMenuInternalPath > 100) {
            errors.subMenuInternalPath = errorMsg.subMenuInternalPath.length;
        } else if (!/^[A-Za-z/:]+$/.test(subMenuInternalFormValues.subMenuInternalPath)) {
            errors.subMenuInternalPath = errorMsg.subMenuInternalPath.format;
        }

        if (!subMenuInternalFormValues.trackerHeading) {
            errors.trackerHeading = errorMsg.trackerHeading.blank;
        } else if (subMenuInternalFormValues.trackerHeading < 3 || subMenuInternalFormValues.trackerHeading > 50) {
            errors.subMenuInternalPath = errorMsg.subMenuInternalPath.length;
        } else if (!/^[A-Za-z ]+$/.test(subMenuInternalFormValues.trackerHeading)) {
            errors.trackerHeading = errorMsg.trackerHeading.format;
        }

        if (!subMenuInternalFormValues.subMenuId) {
            errors.subMenuId = errorMsg.subMenuId.blank;
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
                SubMenuInternalMasterService.addNewSubMenuInternal(subMenuInternalFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add Sub Menu Internal',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/internalsubmenu")},
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
        navigate("/admin/internalsubmenu", { replace: true })
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

            
                <FormWrapper headingText="Add Sub Menu Internal">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item >
                                <InputLabel shrink={false} htmlFor={"subMenuInternalName"}>
                                    <Typography variant='body1'>Sub Menu Internal Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="subMenuInternalName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Sub Menu Internal Name'
                                    name="subMenuInternalName"
                                    variant='outlined'
                                    error={!!formErrors.subMenuInternalName}
                                    helperText={formErrors.subMenuInternalName || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                    value={subMenuInternalFormValues.subMenuInternalName}
                                    size="small"
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>
                        
                            <Grid item >
                                <InputLabel shrink={false} htmlFor={"subMenuInternalPath"}>
                                    <Typography variant='body1'>Sub Menu Internal Path*</Typography>
                                </InputLabel>
                                <TextField
                                    id="subMenuInternalPath"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Sub Menu Internal Path'
                                    name="subMenuInternalPath"
                                    variant='outlined'
                                    error={!!formErrors.subMenuInternalPath}
                                    helperText={formErrors.subMenuInternalPath || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z/:]+$/)}
                                    value={subMenuInternalFormValues.subMenuInternalPath}
                                    size="small"
                                    inputProps={{ maxLength: 100 }}
                                />
                            </Grid>

                            <Grid item >
                                <InputLabel shrink={false} htmlFor={"trackerHeading"}>
                                    <Typography variant='body1'>Tracker Heading*</Typography>
                                </InputLabel>
                                <TextField
                                    id="trackerHeading"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Tracker Heading'
                                    name="trackerHeading"
                                    variant='outlined'
                                    error={!!formErrors.trackerHeading}
                                    helperText={formErrors.trackerHeading || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                    value={subMenuInternalFormValues.trackerHeading}
                                    size="small"
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>
                    
                            <Grid item >

                                <InputLabel shrink={false} htmlFor={"subMenuId"}>
                                    <Typography variant='body1' sx={{color: "#000000"}}>Sub Menu Name*</Typography>
                                </InputLabel>

                                <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                    
                                    <Select
                                        id="subMenuId"
                                        onChange={handleInputChange}
                                        displayEmpty
                                        value={subMenuInternalFormValues.subMenuId || ''}
                                        name="subMenuId"
                                        error={
                                            Boolean(formErrors.subMenuId)
                                        }
                                        

                                        >

                                            <MenuItem disabled value={subMenuInternalFormValues.subMenuId}>
                                                Sub Menu Name
                                            </MenuItem>


                                            {
                                                allSubMenuMasterList.map((item, index)=>(

                                                    <MenuItem key={index} value={item.subMenuId}>{item.subMenuName}{" ("}{item.menuId.roleId.roleName}{")"}</MenuItem>

                                                ))
                                            }
                                    </Select>
                                    {formErrors.subMenuId && (
                                    <FormHelperText error sx={{ml:0}}>{formErrors.subMenuId}</FormHelperText>
                                )}
                                </FormControl>
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

export default AddSubMenuInternalMaster;
