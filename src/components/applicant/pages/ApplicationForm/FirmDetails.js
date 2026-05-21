import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, FormControl, InputLabel,Button, Select, MenuItem, Typography, IconButton ,FormControlLabel,Radio,RadioGroup, FormHelperText, InputAdornment} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StateService from '../../../../service/AdminService/StateService';
import CountryService from '../../../../service/AdminService/CountryService';
import CityService from '../../../../service/AdminService/CityService';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import FirmApplicationForm from '../../../../service/NewLicenseService/FirmApplicationForm';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useSelector } from 'react-redux';
import validatePattern from '../../../global/util/ValidatePattern';
import IntentService from '../../../../service/AdminService/IntentService';
import ApplicationReview from '../../../../service/NewLicenseService/ApplicationReview';

const errorMsg = {
    blockNo: {
        blank: 'Block No is required',
        length: 'Block No must be between 3 and 20 characters',
    },
    officeName:{
blank:'please enter the office Name',
length: 'Block No must be between 3 and 75 characters',
    },
    village: {
        blank: 'Village is required',
        length: 'Village must be between 3 and 50 characters',
    },
    postOffice: {
        blank: 'Post Office is required',
        length: 'Post Office must be between 3 and 50 characters',
    },
    subDivision: {
        blank: 'Subdivision is required',
        length: 'Subdivision must be between 3 and 50 characters',
    },
    country: {
        blank: 'Country is required',
    },
    state: {
        blank: 'State is required',
    },
    city: {
        blank: 'City is required',
    },
    pin: {
        blank: 'PIN is required',
        format: 'PIN must be a valid 6-digit number',
    },
    fax: {
        blank: 'Fax is required',
        format: 'Fax must be a valid number',
    },
    telephoneNo: {
        blank: 'Telephone No is required',
        format: 'Telephone No must be a valid number',
    },
    mobile: {
        blank: 'Mobile No is required',
        format: 'Mobile No must be a valid 10-digit number',
    },
    registrationNo: {
        blank: 'Please enter the organization name',
        format: 'Expected format: L|U00000XXYYYYXXX000000. Example: U12345DL2010PTC123456',
    },
    noOfBranch: {
        blank: 'Please enter the No. Of Branch',
        format: 'Please Enter a No. Of Branch',
    },
    partnership: {
        blank: "Please enter the date of Partenership.",
        format: "Please enter a valid Partenership."
    },
   
};



const FirmDetails = ({handleNext,handleFormDataChange   }) => {
    const [communicationAddress, setCommunicationAddress] = useState('residential');
    const userName = useSelector((state)=>state.jwtAuthentication.username);
    const appTypeMasterId= useSelector((state)=>state.licenseApplication.applicationType);
    console.log(userName);
    console.log(appTypeMasterId);

    
    const [formErrors, setFormErrors] = useState({});
    const salutationData = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [filteredState, setFilteredState] = useState([]);
    const [filteredCitie, setFilteredCitie] = useState([]);
    const [communicationAddressFormValues, setCommunicationAddressFormValues] = useState({
        firmApplicationId: '',
        registrationNo: '',
        officeName:'',
        incorporationDate: '',
        officeName: '',
        webPageURL: '',
        noOfBranch: '',
        naturesOfBusiness: '',
        publicKey: '',
        status: '',
        blockNo: '',
        village: '',
        postOffice: '',
        subDivision: '',
        country: '',
        city: '',
        state: '',
        pin: '',
        fax: '',
        telephoneNo: '',
        created: '',
        updated: '',
        createdBy: userName,  // Preserving the userName here
        updatedBy: '',
        appTypeMasterId: appTypeMasterId,
        addressId: '',
        intentId: '',
        userName: userName, 
        appDocId: '',      
         

    });
  

    useEffect(() => {
        if (userName) {
            console.log(userName);
            setLoading(true);
            FirmApplicationForm.getAllFirmApplication(userName)
                .then((response) => {
                    console.log(response.data);
    
                    const { appLocation, appFirmApplication, indivAddressDTO } = response.data;
    
                    // Accessing the first element of appLocation
                    const locationData = appLocation[0] || {};
                    const residentialData = indivAddressDTO.residential || {};
                    const firmData = appFirmApplication || {};
    
                    // Set form values
                    setCommunicationAddressFormValues({
                        firmApplicationId: firmData.firmApplicationId || '',
                        registrationNo: firmData.registrationNo || '',
                        incorporationDate: firmData.incorporationDate ? new Date(firmData.incorporationDate) : null,
                        officeName: firmData.officeName || '',
                        webPageURL: firmData.webPageURL || '',
                        noOfBranch: firmData.noOfBranches || '',
                        naturesOfBusiness: firmData.natureOfBusiness || '',
                        publicKey: firmData.publicKey || '',
                        status: firmData.status || '',
                        blockNo: residentialData.blockNo || '',
                        village: residentialData.village || '',
                        postOffice: residentialData.postOffice || '',
                        subDivision: residentialData.subDivision || '',
                        country: residentialData.country || '',
                        city: residentialData.city || '',
                        state: residentialData.state || '',
                        pin: residentialData.pin || '',
                        fax: firmData.fax || '',
                        telephoneNo: firmData.telephoneNo || '',
                        created: firmData.created || '',
                        updated: firmData.updated || '',
                        createdBy: userName || '',
                        updatedBy: firmData.updatedBy || '',
                        appTypeMasterId: firmData.appTypeMasterId || '',
                        addressId: residentialData.addressId || '',
                        intentId: firmData.intentAppId.intentAppId || '',
                        userName: userName || '',
                       
                    });
    
                    // You can also filter states and cities here as needed
                    const filteredStates = states.filter(state => state.countryId.countryId === parseInt(residentialData.country));
                    setFilteredStates(filteredStates);
    
                    const filteredCities = cities.filter(city => city.stateId.stateId === parseInt(residentialData.state));
                    setFilteredCities(filteredCities);
                })
                .catch((err) => {
                    console.log(err);
                    // Handle error (e.g., navigate or display a message)
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Handle the case where `userName` is not available
            // Example: navigate('/admin/state', { replace: true });
        }
    }, [userName, states, cities]); 
  
console.log("commication==>"+JSON.stringify(communicationAddressFormValues));


const[applicationReviewData,setApplicatioReviewData]=useState([])
useEffect(() => {
  setLoading(true);
  ApplicationReview.getAllApplicationReviewByUserName(userName)
      .then((data) => {
          console.log("data.dtaa===>",data.data)
          setApplicatioReviewData(data.data);
          setLoading(false);
      })
      .catch(error => {
          console.error("Error fetching application types:", error);
          setLoading(false);
      });
}, [userName]);

console.log("applicationReviewData===>",applicationReviewData)

const isFieldEnabled = (fieldName) => {
// Log the applicationReviewData to confirm structure
console.log("applicationReviewData:", fieldName);

// Enable by default if data is undefined or empty
if (!applicationReviewData || applicationReviewData.length === 0) {
console.log(`Enabling ${fieldName} by default (data undefined or empty).`);
return true;
}

// Find matching field by name
const field = applicationReviewData.find((f) => f.fieldName === fieldName);

// Log the field status
console.log(`Field found for ${fieldName}:`, field);

// Enable if field is "Active", otherwise disable
const isEnabled = field ?  field.status === "Active"  : false;
console.log(`isFieldEnabled(${fieldName}) returns:`, isEnabled);

return isEnabled;
};






const [applicationTypeData, setApplicationTypeData] = useState({});
useEffect(() => {
    setLoading(true);
    IntentService.getIntentByUserName(userName)
        .then(data => {
          const appData = data.data;
console.log(appData)
          // Assuming appData contains an emailDetails object
         // const emailData = appData.emailId || {};

        //   // Set the emailId field from the object if available
          setCommunicationAddressFormValues(prevState => ({
              ...prevState,
              officeName:appData.organizationName,
          }));
            setApplicationTypeData(appData);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching application types:", error);
            setLoading(false);
        });
}, [userName]);


console.log("------------------->"+JSON.stringify(applicationTypeData))

    const validateForm = (values) => {
        let errors = {};
    
        // Validate registrationNo
        if (!values.registrationNo) {
            errors.registrationNo = errorMsg.registrationNo.blank;
        } else if (!/^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(values.registrationNo)) {
            errors.registrationNo = errorMsg.registrationNo.format;
        }
        

        if (!values.noOfBranch) {
            errors.noOfBranch = errorMsg.noOfBranch.blank;
        } else if (!/^[0-9]+$/.test(values.noOfBranch)) {
            errors.noOfBranch = errorMsg.noOfBranch.format;
        }
    
        // Validate blockNo
        if (!values.blockNo) {
            errors.blockNo = errorMsg.blockNo.blank;
        } else if (values.blockNo.length < 3 || values.blockNo.length > 20) {
            errors.blockNo = errorMsg.blockNo.length;
        }
    
        // Validate village
        if (!values.village) {
            errors.village = errorMsg.village.blank;
        } else if (values.village.length < 3 || values.village.length > 50) {
            errors.village = errorMsg.village.length;
        }
       
        // Validate postOffice
        if (!values.postOffice) {
            errors.postOffice = errorMsg.postOffice.blank;
        } else if (values.postOffice.length < 3 || values.postOffice.length > 50) {
            errors.postOffice = errorMsg.postOffice.length;
        }
    
        // Validate subDivision
        if (!values.subDivision) {
            errors.subDivision = errorMsg.subDivision.blank;
        } else if (values.subDivision.length < 3 || values.subDivision.length > 50) {
            errors.subDivision = errorMsg.subDivision.length;
        }
    
        // Validate country
        if (!values.country) {
            errors.country = errorMsg.country.blank;
        }
    
        // Validate state
        if (!values.state) {
            errors.state = errorMsg.state.blank;
        }
    
        // Validate city
        if (!values.city) {
            errors.city = errorMsg.city.blank;
        }
    
        if (!values.incorporationDate) {
            errors.incorporationDate = errorMsg.partnership.blank;
        }
        // Validate pin
        if (!values.pin) {
            errors.pin = errorMsg.pin.blank;
        } else if (!/^\d{6}$/.test(values.pin)) {
            errors.pin = errorMsg.pin.format;
        }
    
        // Validate fax
         if (isNaN(values.fax)) {
            errors.fax = errorMsg.fax.format;
        }
    
        // Validate telephoneNo
        if (!values.telephoneNo) {
            errors.telephoneNo = errorMsg.telephoneNo.blank;
        } else if (isNaN(values.telephoneNo)) {
            errors.telephoneNo = errorMsg.telephoneNo.format;
        }
    
        // // Validate mobile
         if (!values.officeName) {
             errors.officeName = errorMsg.officeName.blank;
        } else if  (values.officeName.length < 3 || values.officeName.length > 75) {
             errors.officeName = errorMsg.officeName.length;
         }
    
        return errors;
    };
    

    const handleDateChange = (name, date) => {
        const isValidDate = (date) => {
            return dayjs(date).isValid();
        };
    
        if (!isValidDate(date)) {
            console.error('Invalid date:', date);
            setFormErrors((prev) => ({
                ...prev,
                [name]: "Please enter a valid date."
            }));
            return;
        }
    
        // Clear the error message if the date is valid
        setFormErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    
        const formatDate = (date) => {
            return dayjs(date).format('YYYY-MM-DD');
        };
    
        const formattedDate = formatDate(date);
    
        setCommunicationAddressFormValues((prevValues) => ({
            ...prevValues,
            [name]: formattedDate,
        }));
    };
    

    console.log(filteredCitie,"",filteredState)
    useEffect(() => {
        StateService.getAllStateList().then(data => {
            setStates(data.data);
        }).catch(error => {
            console.error("Error fetching states:", error);
        });
    }, []);

    useEffect(() => {
        CountryService.getAllCountryList().then(data => {
            setCountries(data.data);
        }).catch(error => {
            console.error("Error fetching countries:", error);
        });
    }, []);

    useEffect(() => {
        CityService.getAllCityList().then(data => {
            setCities(data.data);
        }).catch(error => {
            console.error("Error fetching cities:", error);
        });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let updatedValues = { ...communicationAddressFormValues, [name]: value };

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

        let updatedsValues = { ...communicationAddressFormValues, [name]: value };

        // Handle country change
        if (name === "country1") {
            const filteredState = states.filter(state => state.countryId.countryId === parseInt(value));
            setFilteredState(filteredState);
            updatedsValues.state1 = '';
            updatedValues.city1 = '';
        }

        // Handle state change
        if (name === "state1") {
            const filteredCitie = cities.filter(city => city.stateId.stateId === parseInt(value));
            setFilteredCitie(filteredCitie);
           
            updatedsValues.city1 = '';
        }
        handleFormDataChange({ OrganizationalDetails: communicationAddressFormValues });
        // Update form values
        setCommunicationAddressFormValues(updatedsValues);
    };
    const [isLoading, setLoading] = useState(false);
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm(communicationAddressFormValues);
        if (Object.keys(errors).length > 0) {
            console.log('Validation errors:', errors);
            // Optionally, you can set the errors in state to display them in the UI
            setFormErrors(errors);
        } else {
            console.log('Form is valid, proceed with submission.');
         
            // Determine if we are adding or updating
            const requestMethod = communicationAddressFormValues.firmApplicationId?   FirmApplicationForm.updateFirmApplication: FirmApplicationForm.addNewFirmApplication;
            requestMethod(communicationAddressFormValues)
                .then((response) => {
                    handleFormDataChange({ personalDetails: JSON.stringify(response.data) });
    
                    showAlert({
                        messageTitle: 'Successful',
                        messageContent: 'first page saved successfully',
                        confirmText: 'Ok',
                        onConfirm: () => { handleNext(); }
                    });
                })
                .catch((err) => {
                    showAlert({
                        messageTitle: 'Error',
                        messageContent: err.response?.data
                            ? typeof err.response.data === 'object'
                                ? 'Your request cannot be processed at this time. Please try again later.'
                                : err.response.data
                            : 'Your request cannot be processed at this time. Please try again later.',
                        confirmText: 'Ok',
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        
        }
    };
    

    return (
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
            {/* Residential Address Section */}
            <Grid container sx={{ mt: 1, mb: 1 }}>
                <Grid item>
                    <Typography variant='h6' sx={{ mt: 1 }}>Organization Details</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="registrationNo">
                        <Typography variant='body1'>Registration Number(18)*</Typography>
                    </InputLabel>
                    <TextField
                        id="registrationNo"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Registration Number'
                        name="registrationNo"
                        variant='outlined'
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9]+$/)}
                        onChange={handleInputChange}
                        error={!!(formErrors.registrationNo && formErrors.registrationNo)}
                        helperText={formErrors?.registrationNo}
                        value={communicationAddressFormValues.registrationNo}
                        size="small"
                        inputProps={{ maxLength: 21 }}
                        disabled={!isFieldEnabled("registrationNumber")}
                        
                    />
                </Grid>
                <Grid item xs={12} sm>
    <InputLabel shrink={false} htmlFor="incorporationDate">
        <Typography variant='body1'>Date Of Incorporation/Agreement/Partnership (19)*</Typography>
    </InputLabel>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            id="incorporationDate"
            disableFuture
            maxDate={dayjs()}
            name="incorporationDate"
            disabled={!isFieldEnabled("dateofPartnership")}
            onChange={(date) => handleDateChange('incorporationDate', date ? date.toISOString() : null)} // Convert to ISO string or handle null
            value={dayjs(communicationAddressFormValues.incorporationDate)} 
            slotProps={{
                textField: {
                    size: 'small',
                    fullWidth: true,
                    placeholder: "incorporationDate",
                    error: !!formErrors.incorporationDate,
                    helperText: formErrors.incorporationDate || ''
                }
            }}
            sx={{ mt: 1 }}
        />
    </LocalizationProvider>
</Grid>
</Grid>
            <Grid container sx={{ mt: 1, mb: 1 }}>
                <Grid item>
                    <Typography variant='h6' sx={{ mt: 1 }}>Particulars of Business*(20)</Typography>
                </Grid>
            </Grid>

            <Grid item>
                    <Typography variant='h6' sx={{ mt: 1 }}>Head Office</Typography>
                </Grid>
          
                <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="officeName">
                        <Typography variant='body1'>Office Name*</Typography>
                    </InputLabel>
                    <TextField
                        id="officeName"
                        margin="dense"
                        required
                        fullWidth
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                        placeholder='Office Name'
                        name="officeName"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.officeName}
                        error={!!(formErrors.officeName && formErrors.officeName)}
                        helperText={formErrors?.officeName}
                        size="small"
                        inputProps={{ maxLength: 75 }}
                        disabled
                    />
                </Grid>
</Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="blockNo">
                        <Typography variant='body1'>Flat/Door/Block No*</Typography>
                    </InputLabel>
                    <TextField
                        id="blockNo"
                        margin="dense"
                        required
                        fullWidth
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9]+$/)}
                        placeholder='Flat/Door/Block No'
                        name="blockNo"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.blockNo}
                        error={!!(formErrors.blockNo && formErrors.blockNo)}
                        helperText={formErrors?.blockNo}
                        size="small"
                        inputProps={{ maxLength: 15 }}
                        disabled={!isFieldEnabled("blockNo")}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="village">
                        <Typography variant='body1'>Name of Premises/Building/Village*</Typography>
                    </InputLabel>
                    <TextField
                        id="village"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Name of Premises/Building/Village'
                        name="village"
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.village}
                        error={!!(formErrors.village && formErrors.village)}
                        helperText={formErrors?.village}
                        size="small"
                        inputProps={{ maxLength: 30 }}
                        disabled={!isFieldEnabled("premisesName")}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 0.1 }}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="postOffice">
                        <Typography variant='body1'>Road/Street/Lane/Post Office*</Typography>
                    </InputLabel>
                    <TextField
                        id="postOffice"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Road/Street/Lane/Post Office'
                        name="postOffice"
                        variant='outlined'
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.postOffice}
                        error={!!(formErrors.postOffice && formErrors.postOffice)}
                        helperText={formErrors?.postOffice}
                        size="small"
                        disabled={!isFieldEnabled("road")}
                        inputProps={{ maxLength: 30 }}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="subDivision">
                        <Typography variant='body1'>Area/Locality/Taluka/Sub-Division*</Typography>
                    </InputLabel>
                    <TextField
                        id="subDivision"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Area/Locality/Taluka/Sub-Division'
                        name="subDivision"
                        variant='outlined'
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.subDivision}
                        error={!!(formErrors.subDivision && formErrors.subDivision)}
                        helperText={formErrors?.subDivision}
                        size="small"
                        disabled={!isFieldEnabled("subDivision")}
                        inputProps={{ maxLength: 30 }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 0.1 }}>
                <Grid item xs={12} sm={3}>
                    <InputLabel shrink={false} htmlFor="country">
                        <Typography variant='body1'>Country*</Typography>
                    </InputLabel>
                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                        <Select
                            id="country"
                            displayEmpty
                            required
                            value={communicationAddressFormValues.country}
                            onChange={handleInputChange}
                            error={!!formErrors.country}
                            name="country"
                            disabled={!isFieldEnabled("registrationNumber")}
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

                <Grid item xs={12} sm={3}>
                    <InputLabel shrink={false} htmlFor="state">
                        <Typography variant='body1'>State/Province*</Typography>
                    </InputLabel>
                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                        <Select
                            id="state"
                            required
                            displayEmpty
                            value={communicationAddressFormValues.state}
                            error={!!formErrors.state}
                            onChange={handleInputChange}
                            name="state"
                            disabled={!isFieldEnabled("state")}
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

                <Grid item xs={12} sm={3}>
                    <InputLabel shrink={false} htmlFor="city">
                        <Typography variant='body1'>District*</Typography>
                    </InputLabel>
                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                        <Select
                            id="city"
                            required
                            displayEmpty
                            value={communicationAddressFormValues.city}
                            onChange={handleInputChange}
                            error={!!formErrors.city}
                            name="city"
                            disabled={!isFieldEnabled("city")}
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

                <Grid item xs={12} sm={3}>
                    <InputLabel shrink={false} htmlFor="pin">
                        <Typography variant='body1'>Pin*</Typography>
                    </InputLabel>
                    <TextField
                        id="pin"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Pin'
                        name="pin"
                        variant='outlined'
                        onKeyDown={(e) => validatePattern(e, /^[0-6]+$/)}
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.pin}
                        error={!!(formErrors.pin && formErrors.pin)}
                        helperText={formErrors?.pin}
                        size="small"
                        disabled={!isFieldEnabled("pin")}
                        inputProps={{ maxLength: 6 }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="telephoneNo">
                        <Typography variant='body1'>Telephone No*</Typography>
                    </InputLabel>
                    <TextField
                        id="telephoneNo"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Telephone No'
                        name="telephoneNo"
                        variant='outlined'
                        disabled={!isFieldEnabled("telephoneNo")}
                        onChange={handleInputChange}
                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                        error={!!(formErrors.telephoneNo && formErrors.telephoneNo)}
                        helperText={formErrors?.telephoneNo}
                        value={communicationAddressFormValues.telephoneNo}
                        size="small"
                        inputProps={{ maxLength: 12 }}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="fax">
                        <Typography variant='body1'>Fax</Typography>
                    </InputLabel>
                    <TextField
                        id="fax"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Fax'
                        name="fax"
                        variant='outlined'
                        onChange={handleInputChange}
                        disabled={!isFieldEnabled("fax")}
                        value={communicationAddressFormValues.fax}
                        error={!!(formErrors.fax && formErrors.fax)}
                        helperText={formErrors?.fax}
                        size="small"
                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                        inputProps={{ maxLength: 12 }}
                    />
                </Grid>
                <Grid item xs={12} sm>
    <InputLabel shrink={false} htmlFor="webPageURL">
        <Typography variant='body1'>Web Page URL</Typography>
    </InputLabel>
    <TextField
        id="webPageURL"
        margin="dense"
        required
        fullWidth
        placeholder='Web Page Url'
        name="webPageURL"
        variant='outlined'
        disabled={!isFieldEnabled("webPageURL")}
        onChange={handleInputChange}
        value={communicationAddressFormValues.webPageURL.replace(/^https:\/\//, '')} 
        error={!!(formErrors.webPageURL && formErrors.webPageURL)}
        helperText={formErrors?.webPageURL}
        size="small"
        InputProps={{
            startAdornment: (
                <InputAdornment position="start"sx={{ml:1}}>
                    https://
                </InputAdornment>
            ),
            maxLength: 100 ,
        }}
        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9.-]+$/)} 
    />
</Grid>


                
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="noOfBranch">
                        <Typography variant='body1'>No. Of Branch*</Typography>
                    </InputLabel>
                    <TextField
                        id="noOfBranch"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='No. Of Branch'
                        name="noOfBranch"
                        variant='outlined'
                        disabled={!isFieldEnabled("noOfBranches")}
                        onChange={handleInputChange}
                        error={!!(formErrors.noOfBranch && formErrors.noOfBranch)}
                        helperText={formErrors?.noOfBranch}
                        value={communicationAddressFormValues.noOfBranch}
                        size="small"
                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                        inputProps={{ maxLength: 6 }}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="naturesOfBusiness">
                        <Typography variant='body1'>Nature Of Business</Typography>
                    </InputLabel>
                    <TextField
                        id="naturesOfBusiness"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Nature Of Business'
                        name="naturesOfBusiness"
                        variant='outlined'
                        disabled={!isFieldEnabled("natureOfBusiness")}
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.naturesOfBusiness}
                        size="small"
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                        inputProps={{ maxLength: 35 }}
                    />
                </Grid>
                </Grid>
          
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
  <Button
    type="submit"
    variant="contained"
    color="primary"
  >
    Save & Next
  </Button>
</Box>
<Grid>
            <InputLabel shrink={false} >
                        <Typography variant='body1'>Note: * marked field are mandatory to be filled </Typography>
                    </InputLabel>
            </Grid>

           
        </Box>
    );
}

export default FirmDetails;
