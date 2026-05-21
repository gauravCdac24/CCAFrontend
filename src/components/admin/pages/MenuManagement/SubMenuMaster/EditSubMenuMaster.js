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
import MenuMasterService from '../../../../../service/AdminService/MenuMasterService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';
import { decrypt } from '../../../../global/util/EncryptDecrypt';

//Errors
const errorMsg = {
    subMenuName: {
        blank: "Please enter sub menu name.",
        length: "Only alphabets and space are allowed.",
        format: "The length must be between 3 and 50 characters."
    },
    subMenuPath: {
        blank: "Please enter sub menu path.",
        length: "Only alphabets,/, and : are allowed.",
        format: "The length must be between 3 and 100 characters."
    },

    trackerHeading:{
        blank: "Please enter tracker heading.",
        length: "Only alphabets and space are allowed.",
        format: "The length must be between 3 and 50 characters."
    },

    menuId:{
        blank: "Please select menu.",
    },

    subMenuOrder:{
        blank: "Please select sub menu order."
    },
    
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const EditSubMenuMaster = () => {
    const [subMenuFormValues, setsubMenuFormValues] = useState({
        subMenuId:'',
        subMenuName:'',
        subMenuPath: '',
        menuId:'',
        subMenuOrder: '',
        trackerHeading: '',
        created: '',
        updated: '',
        status: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [allMenuMasterList, setAllMenuMasterList] = useState([]);
    const [subMenuOrderList, setSubMenuOrderList] = useState([]);

    const navigate = useNavigate();
    const {id} = useParams();

    const getAllSubMenuOrderList = (ids) => {
        setLoading(true);

        SubMenuMasterService.getAllSubMenuOrderByMenuId(ids)
            .then((response) => {
                setSubMenuOrderList(response.data);
            })
            .catch((err) => {
                console.log('Error fetching sub menu order. Please try again later.')
            })
            .finally(() => {
                setLoading(false);
            });
    }


    useEffect(()=>{
        if(id){

            setLoading(true);
            SubMenuMasterService.getSubMenuById(decrypt(id))
            .then((response)=>{

                setsubMenuFormValues({

                    subMenuId:response.data.subMenuId,
                    subMenuName:response.data.subMenuName,
                    trackerHeading: response.data.trackerHeading,
                    subMenuPath: response.data.subMenuPath,
                    menuId:response.data.menuId.menuId,
                    subMenuOrder: response.data.subMenuOrder,
                    created: response.data.created,
                    updated: response.data.updated,
                    status: response.data.status
                })
                getAllSubMenuOrderList(response.data.menuId.menuId)
            })
            .catch((err)=>{
                navigate('/admin/submenu', { replace: true })
            })
            .finally(()=>{
                setLoading(false);
            })

    }else{
        navigate('/admin/submenu', { replace: true })
    }

    

    },[])

    
    


    const getAllMenuMaster = () => {
        setLoading(true);

        MenuMasterService.getAllMenuList()
            .then((response) => {
                setAllMenuMasterList(response.data);
            })
            .catch((err) => {
                console.log('Error fetching menu list. Please try again later.')
            })
            .finally(() => {
                setLoading(false);
            });
    };


    useEffect(()=>{
        getAllMenuMaster();
    },[])

    // reset
    const handleReset = () => {
        setsubMenuFormValues({
            subMenuName:'',
            subMenuPath: '',
            menuId:'',
            roleId:'',
            trackerHeading:''
        }); 
        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setsubMenuFormValues({
                ...subMenuFormValues,
                [name]: value,
            });
        
    };


    const validateForm = () => {

        const errors = {};


        if (!subMenuFormValues.subMenuName) {
            errors.subMenuName = errorMsg.subMenuName.blank;
        } else if (subMenuFormValues.subMenuName < 3 || subMenuFormValues.subMenuName > 50) {
            errors.subMenuName = errorMsg.subMenuName.length;
        } else if (!/^[A-Za-z ]+$/.test(subMenuFormValues.subMenuName)) {
            errors.subMenuName = errorMsg.subMenuName.format;
        }

        if (!subMenuFormValues.subMenuPath) {
            errors.subMenuPath = errorMsg.subMenuPath.blank;
        } else if (subMenuFormValues.subMenuPath < 3 || subMenuFormValues.subMenuPath > 100) {
            errors.subMenuPath = errorMsg.subMenuPath.length;
        } else if (!/^[A-Za-z/:]+$/.test(subMenuFormValues.subMenuPath)) {
            errors.subMenuPath = errorMsg.subMenuPath.format;
        }

        if (!subMenuFormValues.trackerHeading) {
            errors.trackerHeading = errorMsg.trackerHeading.blank;
        } else if (subMenuFormValues.trackerHeading < 3 || subMenuFormValues.trackerHeading > 50) {
            errors.subMenuPath = errorMsg.subMenuPath.length;
        } else if (!/^[A-Za-z ]+$/.test(subMenuFormValues.trackerHeading)) {
            errors.trackerHeading = errorMsg.trackerHeading.format;
        }

        if (!subMenuFormValues.menuId) {
            errors.menuId = errorMsg.menuId.blank;
        }

        if(!subMenuFormValues.subMenuOrder){
            errors.subMenuOrder = errorMsg.subMenuOrder.blank;
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
                SubMenuMasterService.updateSubMenu(subMenuFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Update Sub Menu',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/submenu")},
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
        navigate("/admin/submenu", { replace: true })
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

            
                <FormWrapper headingText="Update Sub Menu">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item >
                                <InputLabel shrink={false} htmlFor={"subMenuName"}>
                                    <Typography variant='body1'>Sub Menu Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="subMenuName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Sub Menu Name'
                                    name="subMenuName"
                                    variant='outlined'
                                    error={!!formErrors.subMenuName}
                                    helperText={formErrors.subMenuName || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                    value={subMenuFormValues.subMenuName}
                                    size="small"
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>
                        
                            <Grid item >
                                <InputLabel shrink={false} htmlFor={"subMenuPath"}>
                                    <Typography variant='body1'>Sub Menu Path*</Typography>
                                </InputLabel>
                                <TextField
                                    id="subMenuPath"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Sub Menu Path'
                                    name="subMenuPath"
                                    variant='outlined'
                                    error={!!formErrors.subMenuPath}
                                    helperText={formErrors.subMenuPath || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z/:]+$/)}
                                    value={subMenuFormValues.subMenuPath}
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
                                    value={subMenuFormValues.trackerHeading}
                                    size="small"
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>

                    
                            <Grid item >

                                <InputLabel shrink={false} htmlFor={"menuId"}>
                                    <Typography variant='body1' sx={{color: "#000000"}}>Menu Name*</Typography>
                                </InputLabel>

                                <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                    
                                    <Select
                                        id="menuId"
                                        onChange={handleInputChange}
                                        displayEmpty
                                        value={subMenuFormValues.menuId || ''}
                                        name="menuId"
                                        error={
                                            Boolean(formErrors.menuId)
                                        }
                                        

                                        >

                                            <MenuItem disabled value={subMenuFormValues.menuId}>
                                                Menu Name
                                            </MenuItem>


                                            {
                                                allMenuMasterList.map((item, index)=>(

                                                    <MenuItem key={index} value={item.menuId}>{item.menuName} {`(${item.roleId.roleName})`}</MenuItem>

                                                ))
                                            }
                                    </Select>
                                    {formErrors.menuId && (
                                    <FormHelperText error sx={{ml:0}}>{formErrors.menuId}</FormHelperText>
                                )}
                                </FormControl>
                                </Grid>


                                    <Grid item>
                                        <InputLabel shrink={false} htmlFor={"subMenuOrder"}>
                                            <Typography variant='body1' sx={{color: "#000000"}}>Sub Menu Order*</Typography>
                                        </InputLabel>

                                        <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                            
                                            <Select
                                                id="subMenuOrder"
                                                onChange={handleInputChange}
                                                displayEmpty
                                                value={subMenuFormValues.subMenuOrder || ''}
                                                name="subMenuOrder"
                                                error={
                                                    Boolean(formErrors.subMenuOrder)
                                                }
                                                

                                                >

                                                    <MenuItem disabled value={subMenuFormValues.subMenuOrder}>
                                                        Sub Menu Order
                                                    </MenuItem>


                                                    {
                                                        subMenuOrderList.map((item, index)=>(

                                                            <MenuItem key={index} value={item}>{item}</MenuItem>

                                                        ))
                                                    }
                                            </Select>
                                            {formErrors.subMenuOrder && (
                                            <FormHelperText error sx={{ml:0}}>{formErrors.subMenuOrder}</FormHelperText>
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

export default EditSubMenuMaster;
