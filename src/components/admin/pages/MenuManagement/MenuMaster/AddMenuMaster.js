import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {Autocomplete, FormControl, FormHelperText, MenuItem, Select, Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import {useEffect, useState } from 'react';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import MenuMasterService from '../../../../../service/AdminService/MenuMasterService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../../../global/util/FormWrapper';
import * as ReactIcons from '@mui/icons-material';
import RoleMasterService from '../../../../../service/AdminService/RoleMasterService';

//Errors
const errorMsg = {
    menuName: {
        blank: "Please select menu name.",
        length: "Only alphabets and underscore are allowed.",
        format: "The length must be between 3 and 50 characters."
    },
    menuIcon:{
        blank: "Please select menu icon.",
    },
    roleId:{
        blank: "Please select role.",
    },
    captchaError: {
        blank: "Please enter captcha."
    },
    
};


const AddMenuMaster = () => {
    const [menuFormValues, setMenuFormValues] = useState({
        menuName:'',
        menuIcon: '',
        roleId:''
    });

    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [menuIconList,setMenuIconList] = useState([]);
    const [allRoleMasterList, setAllRoleMasterList] = useState([]);
   
    const navigate = useNavigate();
    
    const getAllMuiIcons = () => {

        const iconNamesArray = Object.keys(ReactIcons);
        const uniqueIconNamesSet = new Set(iconNamesArray);
        const uniqueIconNamesArray = Array.from(uniqueIconNamesSet);
        setMenuIconList(uniqueIconNamesArray);
    }

    const getAllRoleMaster = () => {
        setLoading(true);

        RoleMasterService.getAllRoleList()
            .then((response) => {
                setAllRoleMasterList(response.data);
            })
            .catch((err) => {
                console.log('Error fetching role list. Please try again later.')
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(()=>{
        getAllRoleMaster();
        getAllMuiIcons();
    },[])

    // reset
    const handleReset = () => {
        setMenuFormValues({
            menuName:'',
            menuIcon: '',
            roleId:''
        }); 
        setCaptchaInput('');
        setFormErrors({});
    }

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setMenuFormValues({
                ...menuFormValues,
                [name]: value,
            });
        
    };

    const handleAutoComplete = (name, value) =>{
        setMenuFormValues({
            ...menuFormValues,
            [name]: value,
        });
    }


    const validateForm = () => {
        const errors = {};

        if (!menuFormValues.menuName) {
            errors.menuName = errorMsg.menuName.blank;
        } else if (menuFormValues.menuName < 3 || menuFormValues.menuName > 50) {
            errors.menuName = errorMsg.menuName.length;
        } else if (!/^[A-Za-z ]+$/.test(menuFormValues.menuName)) {
            errors.menuName = errorMsg.menuName.format;
        }

        if (!menuFormValues.menuIcon) {
            errors.menuIcon = errorMsg.menuIcon.blank;
        }

        if (!menuFormValues.roleId) {
            errors.roleId = errorMsg.roleId.blank;
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
                MenuMasterService.addNewMenu(menuFormValues)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add Menu',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate("/admin/menumaster")},
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
        navigate("/admin/menumaster", { replace: true })
    }

    const DynamicIcon = ({ iconName }) => {
        const IconComponent = ReactIcons[iconName];
      
        if (IconComponent) {
          return <IconComponent />;
        } else {
          return <span>Icon not found</span>;
        }
      };
      

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

            
                <FormWrapper headingText="Add Menu">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                        <Grid container  spacing={2} direction="column">

                            <Grid item>
                                <InputLabel shrink={false} htmlFor={"menuName"}>
                                    <Typography variant='body1'>Menu Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="menuName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Menu Name'
                                    name="menuName"
                                    variant='outlined'
                                    error={!!formErrors.menuName}
                                    helperText={formErrors.menuName || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                    value={menuFormValues.menuName}
                                    size="small"
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>

                           

                            <Grid item >

                                <InputLabel shrink={false} htmlFor={"menuIcon"}>
                                    <Typography variant='body1' sx={{color: "#000000"}}>Menu Icon*</Typography>
                                </InputLabel>

                                <FormControl sx={{  mt: 1, width: '100%' }}>
                                    
                                    <Autocomplete
                                        id="menuIcon"
                                        onChange={(event, newValue) => {
                                            handleAutoComplete("menuIcon", newValue);
                                          }}
                                        value={menuFormValues.menuIcon || ''}
                                        name="menuIcon"
                                        getOptionLabel={(option) => option}
                                        
                                        renderOption={(props, option) => {
                                            const { key, ...optionProps } = props;
                                            return (
                                              <Box
                                                key={key}
                                                component="li"
                                                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                                {...optionProps}
                                              >
                                                <DynamicIcon iconName={option} /> {" "} {option}

                                              </Box>
                                            );
                                          }}

                                        renderInput={(params)=>(
                                            <TextField {...params} placeholder="Menu Icon" variant="outlined" size="small"/>
                                        )}
                                        options={menuIconList}
                                        
                                        isOptionEqualToValue={(option, value) => {
                                            return option.valueOf === value.valueOf;
                                   }}

                                        />

                                            
                                    {formErrors.menuIcon && (
                                    <FormHelperText error sx={{ml:0}}>{formErrors.menuIcon}</FormHelperText>
                                )}
                                </FormControl>
                                </Grid>

                            <Grid item >

                            <InputLabel shrink={false} htmlFor={"roleId"}>
                                <Typography variant='body1' sx={{color: "#000000"}}>Role Name*</Typography>
                            </InputLabel>

                            <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                
                                <Select
                                    id="roleId"
                                    onChange={handleInputChange}
                                    displayEmpty
                                    value={menuFormValues.roleId || ''}
                                    name="roleId"
                                    error={
                                        Boolean(formErrors.roleId)
                                    }
                                    

                                    >

                                        <MenuItem disabled value={menuFormValues.roleId}>
                                            Role Name
                                        </MenuItem>


                                        {
                                            allRoleMasterList.map((item, index)=>(

                                                <MenuItem key={index} value={item.roleId}>{item.roleName}</MenuItem>

                                            ))
                                        }
                                </Select>
                                {formErrors.roleId && (
                                <FormHelperText error sx={{ml:0}}>{formErrors.roleId}</FormHelperText>
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

export default AddMenuMaster;
