import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography, FormHelperText } from '@mui/material';
import { InputLabel, MenuItem, Select, FormControl, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StateService from '../../../../service/AdminService/StateService';
import CountryService from '../../../../service/AdminService/CountryService';
import CityService from '../../../../service/AdminService/CityService';
import LoaderProgress from '../../../global/common/LoaderProgress';
import FormWrapper from '../../../global/util/FormWrapper';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuditAgency from '../../../../service/AdminService/AuditAgency';
import showAlert from '../../../global/common/MessageBox/AlertService';
import Captcha from '../../../global/util/Captcha';
import dayjs from 'dayjs';
import validatePattern from '../../../global/util/ValidatePattern';
import { decrypt } from '../../../global/util/EncryptDecrypt';

const errorMsg = { 

    auditAgencyName: {
        blank: "Audit Agency Name cannot be empty.",
        length: "The length must be between 3 and 100 characters.",
        format: "Please enter valid audit agency name."
    },

    emailId: {
        blank: "Email Id cannot be empty",
        length: "The length must be between 3 and 50 characters.",
        format: "Please input valid email id."
    },

    blockNo: {
        blank: "Flat/Door/Block No cannot be empty",
        length: "The length must be between 3 and 15 characters.",
        format: "Please enter valid Flat/Door/Block No."
    },
    village: {
        blank: "Name of Premises/Building/Village cannot be empty",
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid Premises/Building/Village"
    },
    postOffice: {
        blank: "Road/Street/Lane/Post Office cannot be empty",
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid Road/Street/Lane/Post Office"
    },
    subDivision: {
        blank: "Area/Locality/Taluka/Sub-Division cannot be empty",
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid Area/Locality/Taluka/Sub-Division"
    },
    country: {
        blank: "Country cannot be empty"
    },
    city: {
        blank: "Town/City/District cannot be empty"
    },
    state: {
        blank: "State/Union Territory cannot be empty"
    },

    // Phone Record
    contactType: {
        blank: "Please select Contact Type"
    },

    telephone: {
        blank: "Telephone Number cannot be empty",
        length: "The length of telephone number should be 7 or 8.",
        format: "Only numbers are allowed."
    },

    areaCode: {
        blank: "Area Code cannot be empty.",
        length: "Length of area code must be 2 or 3",
        format: "Only numbers are allowed."
    },

    mobile: {
        blank: "Mobile Number cannot be empty",
        length: "Length of mobile number must be 10",
        format: "Only numbers are allowed starting with 6,7,8 and 9"
    },

//

    pin: {
        blank: "Pin cannot be empty",
        length: "The length of pin must be 6.",
        format: "Please enter valid pin."
    },

    effectiveFrom: {
        blank: "Effective from date cannot be empty.",
        diff: "Effective from date  must be less than effective to date."
    },

    effectiveTo: {
        blank: "Effective to date cannot be empty.",
        diff: "Effective to date must be greater than effective from date."
    },
    
    //Auditors

    salutation: {
        blank: "Salutation cannot be empty.",
    },

    firstName: {
        blank: "First Name cannot be empty.",
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid first name."
    },
    middleName: {
        length: "The length must be between 3 and 30 characters.",
        format: "Please enter valid middle name."
    },
    lastName: {
        length: "The length must be between 3 and 45 characters.",
        format: "Please enter valid last name."
    }, 
    
    
    captchaError: {
        blank: "Please enter captcha."
    },

};

const salutationData = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]

const EditAuditAgency = () => {
    const [auditAgencyRegFormValues, setAuditAgencyRegFormValues] = useState({

        auditAgencyName: '',
        phoneRecord: [{ contactType: '', areaCode: '', mobile: '' }],
        blockNo: '',
        village: '',
        postOffice: '',
        subDivision: '',
        country: '',
        city: '',
        state: '',
        pin: '',
        emailId: [{ email: '' }],
        effectiveFrom: null,
        effectiveTo: null,
        salutation: '',
        auditors: [
            {
                salutation: '',
                firstName: '',
                middleName: '',
                lastName: '',
            }
        ]
    });
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    let {id} = useParams();
    const MAX_EMAIL_IDS = 3;
    const [isLoading, setLoading] = useState(false);



    const handleBack = () => {
        navigate("/admin/agency", { replace: true })
    }

    const [filteredStates, setFilteredStates] = useState([]);
    const [states, setStates] = useState([]);
    useEffect(() => {
        StateService.getAllStateList().then(data => {
            setStates(data.data);
            console.log("Fetched states:", states); // Add console log to debug

        }).catch(error => {
            console.error("Error fetching states:", error);
        });
    }, []);
    const [countries, setCountry] = useState([]);
    useEffect(() => {
        CountryService.getAllCountryList().then(data => {
            setCountry(data.data);
            console.log("Fetched country:", countries); // Add console log to debug

        }).catch(error => {
            console.error("Error fetching country:", error);
        });
    }, []);
    const [cities, setCity] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);

    
    useEffect(() => {
        CityService.getAllCityList().then(data => {
            setCity(data.data);
            console.log("Fetched city:", cities); // Add console log to debug

        }).catch(error => {
            console.error("Error fetching city:", error);
        });
    }, []);


    useEffect(() => {
        if (id) {
            setLoading(true);
            AuditAgency.getAuditAgencyById(decrypt(id))
                .then((response) => {
                    const { country, state, city } = response.data;
    
                    // Filter states based on the country
                    const filteredStates = states.filter(st => st.countryId.countryId === parseInt(country));
                    setFilteredStates(filteredStates);
    
                    // Filter cities based on the state
                    const filteredCities = cities.filter(ct => ct.stateId.stateId === parseInt(state));
                    setFilteredCities(filteredCities);
    
                    // Set form values
                    setAuditAgencyRegFormValues({
                        auditAgencyId:response.data.auditAgencyId||'',
                        addressId:response.data.addressId ||'',
                        auditAgencyName: response.data.auditAgencyName || '',
                        phoneRecord: response.data.phoneRecord.length > 0 ? response.data.phoneRecord : [{auditAgencyEmailId:'',contactType: '', areaCode: '', mobile: '' }],
                        blockNo: response.data.blockNo || '',
                        village: response.data.village || '',
                        postOffice: response.data.postOffice || '',
                        subDivision: response.data.subDivision || '',
                        country: country || '',
                        city: city || '',
                        state: state || '',
                        pin: response.data.pin || '',
                        emailId: response.data.emailId.length > 0 ? response.data.emailId : [{ auditAgencyMobileId:'',emailType: '', email: '' }],
                        effectiveFrom: response.data.effectiveFrom || null,
                        effectiveTo: response.data.effectiveTo || null,
                        auditors: response.data.auditors.length > 0 ? response.data.auditors : [{
                            auditorsId:'',
                            salutation: '',
                            firstName: '',
                            middleName: '',
                            lastName: ''
                        }],
                        created: response.data.created,
                        updated: response.data.updated,
                        status: response.data.status
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id, states, cities]); 
    
    


    // reset
    const handleReset = () => {

        const auditorObj = auditAgencyRegFormValues.auditors.map(obj => {

            const resetObj = {};

            for (let key in obj) {
                resetObj[key] = ''
            }
            return resetObj;
        });

        const phoneObj = auditAgencyRegFormValues.phoneRecord.map(obj => {

            const resetObj = {};

            for (let key in obj) {
                resetObj[key] = ''
            }
            return resetObj;
        });

        const emailObj = auditAgencyRegFormValues.emailId.map(obj => {

            const resetObj = {};

            for (let key in obj) {
                resetObj[key] = ''
            }
            return resetObj;
        });

        

        setAuditAgencyRegFormValues({
            auditAgencyName: '',
            mobile: '',
            blockNo: '',
            phoneRecord: phoneObj,
            emailId: emailObj,
            village: '',
            postOffice: '',
            subDivision: '',
            country: '',
            city: '',
            state: '',
            pin: '',
            effectiveFrom: null,
            effectiveTo: null,
            auditors: auditorObj
        });


        setFormErrors({});
    }

    
    

    


    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Copy current form values
        let updatedValues = { ...auditAgencyRegFormValues, [name]: value };

        // Handle country change
        if (name === "country") {
            const filteredStates = states.filter(state => state.countryId.countryId === parseInt(value));
            setFilteredStates(filteredStates);
            updatedValues.state = '';
            updatedValues.city = '';
        }

        // Handle state change
        if (name === "state") {
            const filteredCities = cities.filter(city => city.stateId.stateId === parseInt(value));
            setFilteredCities(filteredCities);
            updatedValues.city = '';
        }

        // Update form values
        setAuditAgencyRegFormValues(updatedValues);
    };



    const handlePhoneRecordChange = (index, event) => {
        const { name, value } = event.target;
        const updatedPhoneRecords = [...auditAgencyRegFormValues.phoneRecord];
        updatedPhoneRecords[index] = { ...updatedPhoneRecords[index], [name]: value };
        setAuditAgencyRegFormValues({ ...auditAgencyRegFormValues, phoneRecord: updatedPhoneRecords });
    };


    const handleAddsField = () => {
        setAuditAgencyRegFormValues((prevValues) => ({
            ...prevValues,
            phoneRecord: [...prevValues.phoneRecord, { contactType: '', areaCode: '', mobile: '' }],
        }));
    };

    const handleRemovesField = (index) => {
        const updatedPhoneRecord = auditAgencyRegFormValues.phoneRecord.filter((_, i) => i !== index);
        setAuditAgencyRegFormValues((prevValues) => ({
            ...prevValues,
            phoneRecord: updatedPhoneRecord,
        }));
    };

    const handleAudtiorChange = (e, index) => {

        const { name, value } = e.target;

        const updateAuditors = [...auditAgencyRegFormValues.auditors];
        updateAuditors[index] = {
            ...updateAuditors[index],
            [name]: value
        };

        setAuditAgencyRegFormValues({
            ...auditAgencyRegFormValues,
            auditors: updateAuditors
        })

    }


    const handleAddField = () => {

        const updateAuditors = [...auditAgencyRegFormValues.auditors];
        updateAuditors[updateAuditors.length] = {
            salutation: '',
            firstName: '',
            middleName: '',
            lastName: '',
        };

        setAuditAgencyRegFormValues({
            ...auditAgencyRegFormValues,
            auditors: updateAuditors
        })

    }

    const handleEmailChange = (index, e) => {
        const { name, value } = e.target;
        const emailId = [...auditAgencyRegFormValues.emailId];
        emailId[index] = { ...emailId[index], [name]: value };
        setAuditAgencyRegFormValues({ ...auditAgencyRegFormValues, emailId });
    };

    const handleAddssField = () => {
        
        const emailId = [...auditAgencyRegFormValues.emailId, { emailType: '', email: '' }];
        setAuditAgencyRegFormValues({ ...auditAgencyRegFormValues, emailId });
        
    };

    const handleRemovessField = (index) => {
        const emailId = [...auditAgencyRegFormValues.emailId];
        emailId.splice(index, 1);
        setAuditAgencyRegFormValues({ ...auditAgencyRegFormValues, emailId });
    };
    const handleRemoveField = (index) => {

        const updateAuditors = auditAgencyRegFormValues.auditors.filter((item, i) => i !== index)

        console.log(updateAuditors)

        setAuditAgencyRegFormValues({
            ...auditAgencyRegFormValues,
            auditors: updateAuditors
        })


    }
    


    const validateForm = () => {

        const errors = {};
        errors.auditors = [];
        errors.phoneRecord = [];
        errors.emailId = [];


        if (!auditAgencyRegFormValues.auditAgencyName) {
            errors.auditAgencyName = errorMsg.auditAgencyName.blank;
        } else if (auditAgencyRegFormValues.auditAgencyName.length < 3 || auditAgencyRegFormValues.auditAgencyName.length > 100) {
            errors.auditAgencyName = errorMsg.auditAgencyName.length;
        } else if (!/^[A-Za-z ]+$/.test(auditAgencyRegFormValues.auditAgencyName)) {
            errors.auditAgencyName = errorMsg.auditAgencyName.format;
        }


        if (!auditAgencyRegFormValues.blockNo) {
            errors.blockNo = errorMsg.blockNo.blank;
        } else if (auditAgencyRegFormValues.blockNo.length < 3 || auditAgencyRegFormValues.blockNo.length > 15) {
            errors.blockNo = errorMsg.blockNo.length;
        } else if (!/^[A-Za-z0-9- ]+$/.test(auditAgencyRegFormValues.blockNo)) {
            errors.blockNo = errorMsg.blockNo.format;
        }


        if (!auditAgencyRegFormValues.village) {
            errors.village = errorMsg.village.blank;
        } else if (auditAgencyRegFormValues.village.length < 3 || auditAgencyRegFormValues.village.length > 30) {
            errors.village = errorMsg.village.length;
        } else if (!/^[A-Za-z0-9 ]+$/.test(auditAgencyRegFormValues.village)) {
            errors.village = errorMsg.village.format;
        }


        if (!auditAgencyRegFormValues.postOffice) {
            errors.postOffice = errorMsg.postOffice.blank;
        } else if (auditAgencyRegFormValues.postOffice.length < 3 || auditAgencyRegFormValues.postOffice.length > 30) {
            errors.postOffice = errorMsg.postOffice.length;
        } else if (!/^[A-Za-z ]+$/.test(auditAgencyRegFormValues.postOffice)) {
            errors.postOffice = errorMsg.postOffice.format;
        }


        if (!auditAgencyRegFormValues.subDivision) {
            errors.subDivision = errorMsg.subDivision.blank;
        } else if (auditAgencyRegFormValues.subDivision.length < 3 || auditAgencyRegFormValues.subDivision.length > 30) {
            errors.subDivision = errorMsg.subDivision.length;
        } else if (!/^[A-Za-z ]+$/.test(auditAgencyRegFormValues.subDivision)) {
            errors.subDivision = errorMsg.subDivision.format;
        }

        if (!auditAgencyRegFormValues.country) {
            errors.country = errorMsg.country.blank;
        }

        if (!auditAgencyRegFormValues.city) {
            errors.city = errorMsg.city.blank;
        }


        if (!auditAgencyRegFormValues.state) {
            errors.state = errorMsg.state.blank;
        }


        if (!auditAgencyRegFormValues.pin) {
            errors.pin = errorMsg.pin.blank;
        } else if (auditAgencyRegFormValues.pin.length !== 6) {
            errors.pin = errorMsg.pin.length;
        } else if (!/^[0-9]+$/.test(auditAgencyRegFormValues.pin)) {
            errors.pin = errorMsg.pin.format;
        }


        

        if (!auditAgencyRegFormValues.effectiveFrom) {
            errors.effectiveFrom = errorMsg.effectiveFrom.blank;
        } 

        if (!auditAgencyRegFormValues.effectiveTo) {
            errors.effectiveTo = errorMsg.effectiveTo.blank;
        } 


        auditAgencyRegFormValues.emailId.map((item, index)=>{
            if(!errors.emailId[index]){
                errors.emailId[index] = {};
            }

            if (!item.email) {
                errors.emailId[index].email = errorMsg.emailId.blank;
            } else if (item.email.length < 3 || item.email.length > 50) {
                errors.emailId[index].email = errorMsg.emailId.length;
            } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,4}$/i.test(item.email)) {
                errors.emailId[index].email = errorMsg.emailId.format;
            }
        })


        auditAgencyRegFormValues.auditors.map((item, index) => {

            if (!errors.auditors[index]) {
                errors.auditors[index] = {};
            }

            if (!item.salutation) {
                errors.auditors[index].salutation = errorMsg.salutation.blank;
            }

            if (!item.firstName) {
                errors.auditors[index].firstName = errorMsg.firstName.blank;
            } else if (item.firstName.length < 3 || item.firstName.length > 30) {
                errors.auditors[index].firstName = errorMsg.firstName.length;
            } else if (!/^[A-Za-z]+$/.test(item.firstName)) {
                errors.auditors[index].firstName = errorMsg.firstName.format;
            }

            if (!item.middleName) { }
            else if (item.middleName && (item.middleName.length < 3 || item.middleName.length > 30)) {
                errors.auditors[index].middleName = errorMsg.middleName.length;
            } else if (!/^[A-Za-z]+$/.test(item.middleName)) {
                errors.auditors[index].middleName = errorMsg.middleName.format;
            }

            if (!item.lastName) { }
            else if (item.lastName && (item.lastName.length < 3 || item.lastName.length > 30)) {
                errors.auditors[index].lastName = errorMsg.lastName.length;
            } else if (!/^[A-Za-z]+$/.test(item.lastName)) {
                errors.auditors[index].lastName = errorMsg.lastName.format;
            }


        })

        auditAgencyRegFormValues.phoneRecord.map((item, index) => {

            if (!errors.phoneRecord[index]) {
                errors.phoneRecord[index] = {};
            }

            if (!item.contactType) {
                errors.phoneRecord[index].contactType = errorMsg.contactType.blank;
            }

            if(item.contactType === 'telephone'){
                if(!item.areaCode){
                    errors.phoneRecord[index].areaCode = errorMsg.areaCode.blank;
                }else if(item.areaCode.length<2 || item.areaCode.length>3){
                    errors.phoneRecord[index].areaCode = errorMsg.areaCode.length;    
                }else if(!/^[0-9]+$/.test(item.areaCode)){
                    errors.phoneRecord[index].areaCode = errorMsg.areaCode.format;    
                }
            }

            if(item.contactType === 'mobile'){
                if (!item.mobile) {
                    errors.phoneRecord[index].mobile = errorMsg.mobile.blank;
                } else if (item.mobile.length !== 10) {
                    errors.phoneRecord[index].mobile = errorMsg.mobile.length;
                } 
                else if(!/^[6-9][0-9]{9}$/.test(item.mobile)){
                    errors.phoneRecord[index].mobile = errorMsg.mobile.format;    
                }
            }else if(item.contactType === 'telephone'){
                if (!item.mobile) {
                    errors.phoneRecord[index].mobile = errorMsg.telephone.blank;
                } else if (item.mobile.length < 7 || item.mobile.length > 8) {
                    errors.phoneRecord[index].mobile = errorMsg.telephone.length;
                } else if (!/^[1-9][0-9]+$/.test(item.mobile)) {
                    errors.phoneRecord[index].mobile = errorMsg.telephone.format;
                } 
            }else{
                if (!item.mobile) {
                    errors.phoneRecord[index].mobile = "Mobile Number / Telephone Number cannot be empty."
                }else{
                    errors.phoneRecord[index].mobile = "Please select contact type."
                }
                
            }


        })
        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }


        const auditorError = errors.auditors.filter(obj => Object.keys(obj).length !== 0);
        const phoneRecordError = errors.phoneRecord.filter(obj => Object.keys(obj).length !== 0);
        const emailIdError = errors.emailId.filter(obj => Object.keys(obj).length !== 0);

        if(Object.keys(auditorError).length === 0)
            delete errors.auditors 
        if(Object.keys(phoneRecordError).length === 0)
            delete errors.phoneRecord
        if(Object.keys(emailIdError).length === 0)
            delete errors.emailId

        return errors;
    };


    const handleDateChange = (name, date) => {
        const isValidDate = (date) => {
            return dayjs(date).isValid();
        };

        if (!isValidDate(date)) {
            console.error('Invalid date:', date);
            return;
        }

        const formatDate = (date) => {
            return dayjs(date).format('YYYY-MM-DD');
        };

        const formattedDate = formatDate(date);

        setAuditAgencyRegFormValues((prevValues) => ({
            ...prevValues,
            [name]: formattedDate,
        }));
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();

        console.log(errors)

        if (Object.keys(errors).length === 0) {
            setFormErrors({});

            

            if (captchaInput === captchaText) {
                
                setLoading(true);
                AuditAgency.updateAuditAgency(auditAgencyRegFormValues)
                    .then((response) => {
                        showAlert({
                            messageTitle: 'Update Audit Agency',
                            messageContent: response.data,
                            confirmText: 'Ok',
                            onConfirm: () => { navigate("/admin/agency") }
                        })
                    })
                    .catch((err) => {
                        showAlert({
                            messageTitle: 'Error',
                            messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
                            confirmText: 'Ok',
                        })
                    })
                    .finally(() => {
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


    return (
        <>
            <LoaderProgress open={isLoading} />
            <Box component="div">
                <Grid container spacing={2} direction={'column'}>
                    <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                        <Button variant="contained" onClick={handleBack}>
                            <Typography variant="h6">Back</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <FormWrapper headingText="Empanelled Audit Agency Registration Form">





                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>

                    <Grid container sx={{ mt: 1, mb: 1 }}>
                        <Grid item >
                            <Typography variant='h6' sx={{ mt: 1 }}><b>1. Basic Details</b></Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"auditAgencyName"}>
                                <Typography variant='body1'>Audit Agency Name*</Typography>
                            </InputLabel>
                            <TextField
                                id="auditAgencyName"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Audit Agency Name'
                                name="auditAgencyName"
                                variant='outlined'
                                error={!!formErrors.auditAgencyName}
                                helperText={formErrors.auditAgencyName || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                value={auditAgencyRegFormValues.auditAgencyName}
                                size="small"
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>
                    </Grid>

                    {auditAgencyRegFormValues.phoneRecord.map((record, index) => (
                        <Grid key={index} container spacing={2} sx={{marginTop: '1px'}}>
                            <Grid item xs={0.4}>
                                {index + 1}.
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <InputLabel shrink={false} htmlFor={`contactType-${index}`}>
                                    <Typography variant='body1' >Contact Type*</Typography>
                                </InputLabel>
                                <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                                    <Select
                                        id={`contactType-${index}`}
                                        margin='dense'
                                        required
                                        value={record.contactType}
                                        fullWidth
                                        onChange={(e) => handlePhoneRecordChange(index, e)}
                                        displayEmpty
                                        placeholder='Contact Type'
                                        name="contactType"
                                        error={
                                            Boolean((formErrors.phoneRecord && formErrors.phoneRecord[index]?.contactType))
                                        }
                                    >
                                        <MenuItem disabled value="">
                                            Select Contact Type
                                        </MenuItem>
                                        <MenuItem value="telephone">Telephone</MenuItem>
                                        <MenuItem value="mobile">Mobile</MenuItem>
                                    </Select>
                                    {(formErrors.phoneRecord && formErrors.phoneRecord[index]?.contactType) && (
                                        <FormHelperText error sx={{ ml: 0 }}>{(formErrors.phoneRecord && formErrors.phoneRecord[index]?.contactType)}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <InputLabel shrink={false} htmlFor={`areaCode-${index}`}>
                                    <Typography variant='body1'>Area Code {record.contactType === 'telephone'?'*':''}</Typography>
                                </InputLabel>
                                <TextField
                                    id={`areaCode-${index}`}
                                    margin="dense"
                                    required={record.contactType === 'telephone'}
                                    fullWidth
                                    placeholder='Area Code'
                                    name="areaCode"
                                    variant='outlined'
                                    error={!!(formErrors.phoneRecord && formErrors.phoneRecord[index]?.areaCode)}
                                    helperText={(formErrors.phoneRecord && formErrors.phoneRecord[index]?.areaCode) || ''}
                                    onChange={(e) => handlePhoneRecordChange(index, e)}
                                    onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                    value={record.areaCode}
                                    size="small"
                                    inputProps={{ maxLength: 3 }}
                                    disabled={record.contactType === 'mobile' || record.contactType === ''}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <InputLabel shrink={false} htmlFor={`mobile-${index}`}>
                                    <Typography variant='body1'>{record.contactType === 'telephone'?'Telephone Number*': record.contactType === 'mobile'?'Mobile Number*': 'Mobile Number /Telephone Number*'} </Typography>
                                </InputLabel>
                                <TextField
                                    id={`mobile-${index}`}
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder={record.contactType === 'telephone'?'Telephone Number*': record.contactType === 'mobile'?'Mobile Number*': 'Mobile Number /Telephone Number*'}
                                    name="mobile"
                                    variant='outlined'
                                    error={!!(formErrors.phoneRecord && formErrors.phoneRecord[index]?.mobile)}
                                    helperText={(formErrors.phoneRecord && formErrors.phoneRecord[index]?.mobile) || ''}
                                    onChange={(e) => handlePhoneRecordChange(index, e)}
                                    onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                    value={record.mobile}
                                    size="small"
                                    inputProps={{ maxLength: record.contactType === 'telephone'? 8 : 10 }}
                                />
                            </Grid>

                            <Grid item sm={0.6} xs={12} sx={{ display: 'flex', flexDirection: { sm: 'column', sx: 'row' } }}>
                                {auditAgencyRegFormValues.phoneRecord.length > 1 && auditAgencyRegFormValues.phoneRecord.length < 3 ? index === auditAgencyRegFormValues.phoneRecord.length - 1 ? (
                                    <>
                                        <IconButton sx={{ width: '20px', height: '20px', ml: { sm: 1 }, mt: { sm: 4 } }} onClick={handleAddsField}>
                                            <AddIcon fontSize='small' color="success" />
                                        </IconButton>
                                        <IconButton sx={{ width: '20px', height: '20px', ml: { sm: 1 }, mt: { sm: 1 } }} onClick={() => handleRemovesField(index)}>
                                            <RemoveIcon fontSize='small' color="error" />
                                        </IconButton>
                                    </>
                                ) : (
                                    <IconButton sx={{ width: '20px', height: '20px', ml: { sm: 1 }, mt: { sm: 5 } }} onClick={() => handleRemovesField(index)}>
                                        <RemoveIcon fontSize='small' color="error" />
                                    </IconButton>
                                ) : auditAgencyRegFormValues.phoneRecord.length === 1 ? (
                                    <IconButton sx={{ width: '20px', height: '20px', ml: { sm: 1 }, mt: { sm: 5 } }} onClick={handleAddsField}>
                                        <AddIcon fontSize='small' color="success" />
                                    </IconButton>
                                ) : (
                                    <IconButton sx={{ width: '20px', height: '20px', ml: { sm: 1 }, mt: { sm: 5 } }} onClick={() => handleRemovesField(index)}>
                                        <RemoveIcon fontSize='small' color="error" />
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    ))}
                    <Grid container spacing={2}>
                        {auditAgencyRegFormValues.emailId.map((record, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={12} sm={3.5} sx={{mt:2}}>
                                    <InputLabel shrink={false} htmlFor={`email-${index}`}>
                                        <Typography variant='body1' >{auditAgencyRegFormValues.emailId.length>1?`${index+1}. `:''} Email*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id={`email-${index}`}
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='Email Id'
                                        name="email"
                                        variant='outlined'
                                        error={!!(formErrors.emailId && formErrors.emailId[index]?.email)}
                                        helperText={(formErrors.emailId && formErrors.emailId[index]?.email) || ''}
                                        onChange={(e) => handleEmailChange(index, e)}
                                        value={record.email}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={1} sm={0.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                                    {auditAgencyRegFormValues.emailId.length > 1 && index === auditAgencyRegFormValues.emailId.length - 1 && auditAgencyRegFormValues.emailId.length < MAX_EMAIL_IDS ? (
                                        <>
                                            <IconButton sx={{ width: '20px', height: '20px', mt: {sm: 5} }} onClick={handleAddssField}>
                                                <AddIcon fontSize='small' color="success" />
                                            </IconButton>
                                            <IconButton sx={{ width: '20px', height: '20px', mt: {sm: 5} }} onClick={() => handleRemovessField(index)}>
                                                <RemoveIcon fontSize='small' color="error" />
                                            </IconButton>
                                        </>
                                    ) : auditAgencyRegFormValues.emailId.length === 1 ? (
                                        <IconButton sx={{ width: '20px', height: '20px', mt: {sm: 5} }} onClick={handleAddssField}>
                                            <AddIcon fontSize='small' color="success" />
                                        </IconButton>
                                    ) : auditAgencyRegFormValues.emailId.length === MAX_EMAIL_IDS && index === MAX_EMAIL_IDS - 1 ? (
                                        <IconButton sx={{ width: '20px', height: '20px', mt: {sm: 5} }} onClick={() => handleRemovessField(index)}>
                                            <RemoveIcon fontSize='small' color="error" />
                                        </IconButton>
                                    ) : (<></>)
                                    }
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>


                    <Grid container spacing={2} sx={{ mt: 0.1 }}>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"effectiveFrom"}>
                                <Typography variant='body1' >Effective From*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs} > 
                                <DatePicker
                                    id="effectiveFrom"
                                    disableFuture
                                    name="effectiveFrom"
                                    onChange={(date) => handleDateChange('effectiveFrom', date)}
                                    value={dayjs(auditAgencyRegFormValues.effectiveFrom)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "Effective From",
                                            error: !!formErrors.effectiveFrom,
                                            helperText: formErrors.effectiveFrom || ''
                                        }
                                    }}
                                    sx={{mt:1}}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"effectiveTo"}>
                                <Typography variant='body1' >Effective To*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="effectiveTo"
                                    disablePast
                                    name="effectiveTo"
                                    onChange={(date) => handleDateChange('effectiveTo', date)}
                                    value={dayjs(auditAgencyRegFormValues.effectiveTo)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "Effective To",
                                            error: !!formErrors.effectiveTo,
                                            helperText: formErrors.effectiveTo || ''
                                        }
                                    }}
                                    sx={{mt:1}}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>


                    <Grid container sx={{ mt: 1, mb: 1 }}>
                        <Grid item >
                            <Typography variant='h6' sx={{ mt: 1 }}><b>2. Address</b></Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"blockNo"}>
                                <Typography variant='body1' >Flat/Door/Block No*</Typography>
                            </InputLabel>
                            <TextField
                                id="blockNo"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Flat/Door/Block No'
                                name="blockNo"
                                variant='outlined'
                                error={!!formErrors.blockNo}
                                helperText={formErrors.blockNo || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9- ]+$/)}
                                value={auditAgencyRegFormValues.blockNo}
                                size="small"
                                inputProps={{ maxLength: 15 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"village"}>
                                <Typography variant='body1' >Name of Premises/Building/Village*</Typography>
                            </InputLabel>
                            <TextField
                                id="village"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Name of Premises/Building/Village'
                                name="village"
                                variant='outlined'
                                error={!!formErrors.village}
                                helperText={formErrors.village || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                                value={auditAgencyRegFormValues.village}
                                size="small"
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>


                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 0.1 }}>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"postOffice"}>
                                <Typography variant='body1' >Road/Street/Lane/Post Office*</Typography>
                            </InputLabel>
                            <TextField
                                id="postOffice"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Road/Street/Lane/Post Office'
                                name="postOffice"
                                variant='outlined'
                                error={!!formErrors.postOffice}
                                helperText={formErrors.postOffice || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                value={auditAgencyRegFormValues.postOffice}
                                size="small"
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"subDivision"}>
                                <Typography variant='body1' >Area/Locality/Taluka/Sub-Division*</Typography>
                            </InputLabel>
                            <TextField
                                id="subDivision"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Area/Locality/Taluka/Sub-Division'
                                name="subDivision"
                                variant='outlined'
                                error={!!formErrors.subDivision}
                                helperText={formErrors.subDivision || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                value={auditAgencyRegFormValues.subDivision}
                                size="small"
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>

                    </Grid>


                    <Grid container spacing={2} sx={{ mt: 0.1 }}>
                        <Grid item xs={12} sm={3} >
                            <InputLabel shrink={false} htmlFor="country">
                                <Typography variant='body1' >Country*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="country"
                                    margin='dense'
                                    required
                                    value={auditAgencyRegFormValues.country}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="country"
                                    error={!!formErrors.country}
                                >
                                    <MenuItem disabled value="">
                                        Select Country
                                    </MenuItem>
                                    {countries.map(country => (
                                        <MenuItem key={country.countryId} value={country.countryId}>
                                            {country.countryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.country && <FormHelperText sx={{ ml: 0 }} error>{formErrors.country}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} >
                            <InputLabel shrink={false} htmlFor="state">
                                <Typography variant='body1' >State/Province*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="state"
                                    margin='dense'
                                    required
                                    value={auditAgencyRegFormValues.state}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="state"
                                    error={!!formErrors.state}
                                >
                                    <MenuItem disabled value="">
                                        Select State/Province
                                    </MenuItem>
                                    {filteredStates.map(state => (
                                        <MenuItem key={state.stateId} value={state.stateId}>
                                            {state.stateName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.state && <FormHelperText sx={{ ml: 0 }} error>{formErrors.state}</FormHelperText>}
                            </FormControl>
                        </Grid>


                        <Grid item xs={12} sm={3} >
                            <InputLabel shrink={false} htmlFor="city">
                                <Typography variant='body1' >District*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="city"
                                    margin='dense'
                                    required
                                    value={auditAgencyRegFormValues.city}
                                    fullWidth
                                    onChange={handleInputChange}
                                    displayEmpty
                                    placeholder='District'
                                    name="city"
                                    error={!!formErrors.city}
                                >
                                    <MenuItem disabled value="">
                                        Select District
                                    </MenuItem>
                                    {filteredCities.map(city => (
                                        <MenuItem key={city.cityId} value={city.cityId}>
                                            {city.cityName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.city && <FormHelperText sx={{ ml: 0 }} error>{formErrors.city}</FormHelperText>}
                            </FormControl>
                        </Grid>


                        <Grid item xs={12} sm={3} >
                            <InputLabel shrink={false} htmlFor={"pin"}>
                                <Typography variant='body1' >Pin*</Typography>
                            </InputLabel>
                            <TextField
                                id="pin"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Pin'
                                name="pin"
                                variant='outlined'
                                error={!!formErrors.pin}
                                helperText={formErrors.pin || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                                value={auditAgencyRegFormValues.pin}
                                size="small"
                                inputProps={{ maxLength: 6 }}
                            />
                        </Grid>

                    </Grid>
                    <Grid container>
                        <Grid item >
                            <Typography variant='h6' sx={{ mt: 1, mb: 1 }}><b>3. Auditors</b></Typography>
                        </Grid>
                    </Grid>


                    {auditAgencyRegFormValues.auditors.map((item, index) => (



                        <Grid key={index} container spacing={2}>

                            <Grid item xs={0.4}>
                                {index + 1}.
                            </Grid>

                            <Grid item xs={12} sm={2.4}>

                                <InputLabel shrink={false} htmlFor={"salutation"}>
                                    <Typography variant='body1' >Salutation*</Typography>
                                </InputLabel>

                                <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>

                                    <Select
                                        id="salutation"
                                        onChange={(e) => handleAudtiorChange(e, index)}
                                        displayEmpty
                                        value={item.salutation}
                                        name="salutation"
                                        error={
                                            Boolean((formErrors.auditors && formErrors.auditors[index]?.salutation))
                                        }
                                        sx={{
                                            width: { xs: '100%', sm: '162px' },
                                        }}

                                    >

                                        <MenuItem disabled value="">
                                            Salutation
                                        </MenuItem>


                                        {
                                            salutationData.map((item, index) => (

                                                <MenuItem key={index} value={item}>{item}</MenuItem>

                                            ))
                                        }
                                    </Select>
                                    {(formErrors.auditors && formErrors.auditors[index]?.salutation) && (
                                        <FormHelperText error sx={{ ml: 0 }}>{(formErrors.auditors && formErrors.auditors[index]?.salutation)}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>


                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"firstName"}>
                                    <Typography variant='body1' >First Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="firstName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='First Name'
                                    name="firstName"
                                    variant='outlined'
                                    error={!!(formErrors.auditors && formErrors.auditors[index]?.firstName)}
                                    helperText={(formErrors.auditors && formErrors.auditors[index]?.firstName) || ''}
                                    onChange={(e) => handleAudtiorChange(e, index)}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                                    value={item.firstName}
                                    size="small"
                                    inputProps={{ maxLength: 30 }}
                                />
                            </Grid>


                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"middleName"}>
                                    <Typography variant='body1' >Middle Name</Typography>
                                </InputLabel>
                                <TextField
                                    id="middleName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Middle Name'
                                    name="middleName"
                                    variant='outlined'
                                    error={!!(formErrors.auditors && formErrors.auditors[index]?.middleName)}
                                    helperText={(formErrors.auditors && formErrors.auditors[index]?.middleName) || ''}
                                    onChange={(e) => handleAudtiorChange(e, index)}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                                    value={item.middleName}
                                    size="small"
                                    inputProps={{ maxLength: 30 }}
                                />
                            </Grid>



                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"lastName"}>
                                    <Typography variant='body1' >Last Name</Typography>
                                </InputLabel>
                                <TextField
                                    id="lastName"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Last Name'
                                    name="lastName"
                                    variant='outlined'
                                    error={!!(formErrors.auditors && formErrors.auditors[index]?.lastName)}
                                    helperText={(formErrors.auditors && formErrors.auditors[index]?.lastName) || ''}
                                    onChange={(e) => handleAudtiorChange(e, index)}
                                    onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                                    value={item.lastName}
                                    size="small"
                                    inputProps={{ maxLength: 45 }}
                                />
                            </Grid>


                            <Grid item sm={0.4} xs={12} sx={{ display: 'flex', flexDirection: { sm: 'column', sx: 'row' } }}>
                                {auditAgencyRegFormValues.auditors.length > 1 && auditAgencyRegFormValues.auditors.length < 51 ? index === auditAgencyRegFormValues.auditors.length - 1 ? (

                                    <>

                                        <IconButton sx={{ width: '20px', height: '20px', mt: { sm: 4 } }} onClick={handleAddField}>
                                            <AddIcon fontSize='small' color="success" />
                                        </IconButton>

                                        <IconButton sx={{ width: '20px', height: '20px', mt: { sm: 1 } }} onClick={() => handleRemoveField(index)}>
                                            <RemoveIcon fontSize='small' color="error" />
                                        </IconButton>

                                    </>

                                ) : (

                                    <IconButton sx={{ width: '20px', height: '20px', mt: { sm: 5 } }} onClick={() => handleRemoveField(index)}>
                                        <RemoveIcon fontSize='small' color="error" />
                                    </IconButton>


                                ) : (

                                    <IconButton sx={{ width: '20px', height: '20px', mt: { sm: 5 } }} onClick={handleAddField}>
                                        <AddIcon fontSize='small' color="success" />
                                    </IconButton>

                                )}

                            </Grid>

                        </Grid>

                    ))

                    }
                    <Grid container justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <Captcha
                                setCaptcha={setCaptchaText}
                                setCaptchaInput={setCaptchaInput}
                                captchaInput={captchaInput}
                                captchaError={!!formErrors.captcha}
                                captchaErrorMsg={formErrors.captcha}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
                        <Grid item  >
                            <Button type="submit" fullWidth variant="contained" sx={{ maxWidth: '120px' }}>
                                Submit
                            </Button>
                        </Grid>
                        <Grid item  >
                            <Button type="button" onClick={handleReset} color="reset" fullWidth variant="contained" sx={{ maxWidth: '120px', color: "#FFFFFF" }}>
                                Reset
                            </Button>
                        </Grid>
                    </Grid>


                </Box>

            </FormWrapper>
        </>
    );
};

export default EditAuditAgency;