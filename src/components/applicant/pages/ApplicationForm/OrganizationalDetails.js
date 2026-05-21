import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, FormControl, InputLabel, Button, Select, MenuItem, Typography, IconButton, FormControlLabel, Radio, RadioGroup, FormHelperText, TextareaAutosize } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StateService from '../../../../service/AdminService/StateService';
import CountryService from '../../../../service/AdminService/CountryService';
import CityService from '../../../../service/AdminService/CityService';
import { useSelector } from 'react-redux';
import GovernmentAgencyForm from '../../../../service/NewLicenseService/GovernmentAgencyForm';
import showAlert from '../../../global/common/MessageBox/AlertService';
import validatePattern from '../../../global/util/ValidatePattern';
import IntentService from '../../../../service/AdminService/IntentService';
import ApplicationReview from '../../../../service/NewLicenseService/ApplicationReview';

const errorMsg = {
    blockNo: {
        blank: 'Block No is required',
        length: 'Block No must be between 3 and 20 characters',
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
    salutation: {
        blank: "Salutation is required."
    },
    firstName: {
        blank: "First Name cannot be empty.",
        length: "The length of First Name must be between 1 and 30 characters.",
        format: "Please enter a valid First Name."
    },
    middleName: {
        length: "The length of Middle Name must be between 0 and 30 characters.",
        format: "Please enter a valid Middle Name."
    },
    lastName: {
        blank: "Last Name cannot be empty.",
        length: "The length of Last Name must be between 1 and 30 characters.",
        format: "Please enter a valid Last Name."
    }, 
    underState: {
        blank: 'Please enter the Under State',
        length: 'Under State must be between 3 and 20 characters',
    },
    organizationName: {
        blank: 'Please enter the organization name',
        length: 'organization name must be between 3 and 50 characters',
    },
    department: {
        blank: 'Please enter the department',
        length: 'Department must be between 3 and 50 characters',
    },
    designation: {
        blank: 'Please enter the designation name',
        length: 'designation name must be between 3 and 50 characters',
    },
    emailId: {
        blank: 'Please enter the emailId',
        format: 'Please Enter the valid emailId',
    },
};


const OrganizationalDetails = ({ handleNext, handleFormDataChange }) => {
    const [communicationAddress, setCommunicationAddress] = useState('residential');

    const [communicationAddressFormValues, setCommunicationAddressFormValues] = useState({
        organizationName:'',
        department:'',
        orgType:'',
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
        webURL: '',
        salutation: '',
        firstName: '',
        middleName: '',
        lastName: '',
        emailId:'',
        designation:'',
        publickey:'',
        userName:'',
        appTypeMasterId:'',
        orgApplicationId:'',
        addressId:'',
        intentId:'',
        
    });


    const userName = useSelector((state)=>state.jwtAuthentication.username);
    const appTypeMasterId= useSelector((state)=>state.licenseApplication.applicationType);
    console.log(userName);
    console.log(appTypeMasterId);


    useEffect(() => {
       
        setCommunicationAddressFormValues((prevState) => ({
          ...prevState,
          userName: userName || '', 
          appTypeMasterId: appTypeMasterId || '', 
        }));
      }, [userName, appTypeMasterId]); 

    const underStateDate=["central","State"]
    const salutationData = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [filteredState, setFilteredState] = useState([]);
    const [filteredCitie, setFilteredCitie] = useState([]);

    console.log(filteredCitie, "", filteredState)
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

        handleFormDataChange({ OrganizationalDetails: communicationAddressFormValues });
        // Update form values
        setCommunicationAddressFormValues(updatedsValues);
    };
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (userName) {
            console.log(userName);
            setLoading(true);
            GovernmentAgencyForm.getAllGovernmentAgency(userName)
                .then((response) => {
                    const data = response.data;
    
                    // Extracting fields from the appGovtOrganizationApplication and residential address
                    const govtOrgApp = data.appGovtOrganizationApplication || {};
                    const residentialAddress = data.indivAddressDTO?.residential || {};
                    const appLocation = data.appLocation?.[0] || {};
    
                    setCommunicationAddressFormValues({
                        organizationName: govtOrgApp.orgName || '',
                        department: govtOrgApp.administrativeMinistry || '',
                        orgType: govtOrgApp.orgType || '',
                        blockNo: residentialAddress.blockNo || '',
                        village: residentialAddress.village || '',
                        postOffice: residentialAddress.postOffice || '',
                        subDivision: residentialAddress.subDivision || '',
                        country: residentialAddress.country || '',
                        city: residentialAddress.city || '',
                        state: residentialAddress.state || '',
                        pin: residentialAddress.pin || '',
                        fax: govtOrgApp.fax || '',
                        telephoneNo: govtOrgApp.telephoneNo || '',
                        webURL: govtOrgApp.webPageURL || '',
                        salutation: govtOrgApp.salutation || '',
                        firstName: govtOrgApp.firstName || '',
                        middleName: govtOrgApp.middleName || '',
                        lastName: govtOrgApp.lastName || '',
                        emailId: govtOrgApp.emailId || '',
                        designation: govtOrgApp.designation || '',
                        publickey: govtOrgApp.publicKey || '',
                        userName: userName || '',
                        orgApplicationId: govtOrgApp.orgApplicationId || '',
                        addressId: residentialAddress.addressId || appLocation.addressId || '',
                        intentId: govtOrgApp.intentAppId?.intentAppId || '',
                    });
                 
                    // Use the values from the response (residentialAddress), not from the old state
                    if (residentialAddress.country) {
                        const filteredStates = states.filter(state => state.countryId.countryId === parseInt(residentialAddress.country));
                        setFilteredStates(filteredStates);
                    }
           
                    if (residentialAddress.state) {
                        const filteredCities = cities.filter(city => city.stateId.stateId === parseInt(residentialAddress.state));
                        setFilteredCities(filteredCities);
                    }
                      
             
                    console.log(response.data);
        
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false); // Set loading to false after the API call
                });
        }
    }, [userName,states, cities]);

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
                organizationName:appData.organizationName,
                emailId:appData.emailId	,
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


    console.log(JSON.stringify(communicationAddressFormValues))
    const validateForm = (values) => {
        let errors = {};
    
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
    
        // Validate pin
        if (!values.pin) {
            errors.pin = errorMsg.pin.blank;
        } else if (!/^\d{6}$/.test(values.pin)) {
            errors.pin = errorMsg.pin.format;
        }
    
        // Validate fax
        if (!values.fax) {
            errors.fax = errorMsg.fax.blank;
        } else if (isNaN(values.fax)) {
            errors.fax = errorMsg.fax.format;
        }
    
        // Validate telephoneNo
        if (!values.telephoneNo) {
            errors.telephoneNo = errorMsg.telephoneNo.blank;
        } else if (isNaN(values.telephoneNo)) {
            errors.telephoneNo = errorMsg.telephoneNo.format;
        }
    
        // // Validate mobile
        // if (!values.mobile) {
        //     errors.mobile = errorMsg.mobile.blank;
        // } else if (!/^\d{10}$/.test(values.mobile)) {
        //     errors.mobile = errorMsg.mobile.format;
        // }
    
        // Validate salutation
        if (!values.salutation) {
            errors.salutation = errorMsg.salutation.blank;
        }
    
        // Validate firstName
        if (!values.firstName) {
            errors.firstName = errorMsg.firstName.blank;
        } else if (values.firstName.length < 1 || values.firstName.length > 30) {
            errors.firstName = errorMsg.firstName.length;
        }
    
        // Validate middleName
        if (values.middleName && (values.middleName.length > 30)) {
            errors.middleName = errorMsg.middleName.length;
        }
    
        // Validate lastName
        if (!values.lastName) {
            errors.lastName = errorMsg.lastName.blank;
        } else if (values.lastName.length < 1 || values.lastName.length > 30) {
            errors.lastName = errorMsg.lastName.length;
        }
    
        // Validate emailId
        if (!values.emailId) {
            errors.emailId = errorMsg.emailId.blank;
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.emailId)) {
            errors.emailId = errorMsg.emailId.format;
        }
    
        // Validate organizationName
        if (!values.organizationName) {
            errors.organizationName = errorMsg.organizationName.blank;
        } else if (values.organizationName.length < 3 || values.organizationName.length > 50) {
            errors.organizationName = errorMsg.organizationName.length;
        }
    
        // Validate department
        if (!values.department) {
            errors.department = errorMsg.department.blank;
        } else if (values.department.length < 3 || values.department.length > 50) {
            errors.department = errorMsg.department.length;
        }
    
        // Validate designation
        if (!values.designation) {
            errors.designation = errorMsg.designation.blank;
        } else if (values.designation.length < 3 || values.designation.length > 50) {
            errors.designation = errorMsg.designation.length;
        }
    
        // Validate underState
        if (!values.orgType) {
            errors.orgType = errorMsg.underState.blank;
        } else if (values.orgType.length < 3 || values.orgType.length > 20) {
            errors.orgType = errorMsg.underState.length;
        }
    
        return errors;
    };
  
    const [isLoading, setLoading] = useState(false);


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





    const handleFormSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm(communicationAddressFormValues);
        if (Object.keys(errors).length > 0) {
            console.log('Validation errors:', errors);
        
            setFormErrors(errors);
        } else {
            console.log('Form is valid, proceed with submission.');
           
           
            const requestMethod = communicationAddressFormValues.orgApplicationId ? GovernmentAgencyForm.updateGovernmentAgency : GovernmentAgencyForm.addNewGovernmentAgency;
            requestMethod(communicationAddressFormValues)
            .then((response) => {
                console.log(response.data);
                showAlert({
                    messageTitle: 'First Step Successful',
                    messageContent: `First step ${ communicationAddressFormValues.orgApplicationId ? 'updated' : 'saved'} successfully`,
                    confirmText: 'Ok',
                    onConfirm: () => { handleNext(); }
                });
            })
            .catch((err) => {
                console.log(err);
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
                    <Typography variant='h6' sx={{ mt: 1 }}>1. Particulars of Organization(28)</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="blockNo">
                        <Typography variant='body1'>Name Of Organization*</Typography>
                    </InputLabel>
                    <TextField
                        id="organizationName"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Name Of Organization'
                        name="organizationName"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.organizationName}
                        error={!!(formErrors.organizationName && formErrors.organizationName)}
                        helperText={formErrors?.organizationName}
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                        size="small"
                        inputProps={{ maxLength: 75 }}
                        disabled
                    />
                </Grid>
            </Grid>
            
            <Grid container spacing={2}>
    <Grid item xs={12} sm>
        <InputLabel shrink={false} htmlFor="department">
            <Typography variant='body1'>Administrative Ministry/Department*</Typography>
        </InputLabel>
        <TextField
            id="department"
            margin="dense"
            required
            fullWidth
            placeholder='Administrative Ministry/Department'
            name="department"
            variant='outlined'
            onChange={handleInputChange}
            value={communicationAddressFormValues.department}
            error={!!formErrors.department}
            helperText={formErrors.department}
            onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
            size="small"
            inputProps={{ maxLength: 75 }}
        />
    </Grid>
    <Grid item xs={12} sm>
        <InputLabel shrink={false} htmlFor="OrgType">
            <Typography variant='body1'>OrgType*</Typography>
        </InputLabel>
        <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
            <Select
                id="orgType"
                name="orgType"
                value={communicationAddressFormValues.orgType || ''} // Ensure value is controlled
                displayEmpty
                onChange={handleInputChange}
                error={Boolean(formErrors.OrgType)}
               fullWidth
            >
                <MenuItem disabled value="">
                    OrgType
                </MenuItem>
                {underStateDate.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
            {formErrors.OrgType && (
                <FormHelperText error sx={{ ml: 0 }}>
                    {formErrors.OrgType}
                </FormHelperText>
            )}
        </FormControl>
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
                        placeholder='Flat/Door/Block No'
                        name="blockNo"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.blockNo}
                        error={!!(formErrors.blockNo && formErrors.blockNo)}
                        helperText={formErrors?.blockNo}
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9]+$/)}
                        size="small"
                        inputProps={{ maxLength: 15 }}
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
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.village}
                        error={!!(formErrors.village && formErrors.village)}
                        helperText={formErrors?.village}
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9]+$/)}
                        size="small"
                        inputProps={{ maxLength: 30 }}
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
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.postOffice}
                        error={!!(formErrors.postOffice && formErrors.postOffice)}
                        helperText={formErrors?.postOffice}
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                        size="small"
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
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.subDivision}
                        error={!!(formErrors.subDivision && formErrors.subDivision)}
                        helperText={formErrors?.subDivision}
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                        size="small"
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
                            value={(communicationAddressFormValues.country)}
                            onChange={handleInputChange}
                            error={!!formErrors.country}
                            name="country"
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
                            value={(communicationAddressFormValues.city)}
                            onChange={handleInputChange}
                            error={!!formErrors.city}
                            name="city"
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
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.pin}
                        error={!!(formErrors.pin && formErrors.pin)}
                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                        helperText={formErrors?.pin}
                        size="small"
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
                        onChange={handleInputChange}
                        error={!!(formErrors.telephoneNo && formErrors.telephoneNo)}
                        helperText={formErrors?.telephoneNo}
                        value={communicationAddressFormValues.telephoneNo}
                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                        size="small"
                        inputProps={{ maxLength: 12 }}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="fax">
                        <Typography variant='body1'>Fax*</Typography>
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
                        value={communicationAddressFormValues.fax}
                        error={!!(formErrors.fax && formErrors.fax)}
                        helperText={formErrors?.fax}
                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                        size="small"
                        inputProps={{ maxLength: 12 }}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="mobile">
                        <Typography variant='body1'>Web Page URL</Typography>
                    </InputLabel>
                    <TextField
                        id="webURL"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Web Page URL'
                        name="webURL"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.webURL}
                        error={!!(formErrors.webURL && formErrors.webURL)}
                        helperText={formErrors?.webURL}
                        size="small"
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9]+$/)}
                        inputProps={{ maxLength: 100 }}
                    />
                </Grid>
            </Grid>
            
            {/* Official Address Section */}
            <Grid container sx={{ mt: 1, mb: 1 }}>
                <Grid item>
                    <Typography variant='h6' sx={{ mt: 1 }}>Full Name Of the Head Of Organization</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
            <Grid item xs={12} sm={2.4}>

<InputLabel shrink={false} htmlFor={"salutation"}>
    <Typography variant='body1' >Salutation*</Typography>
</InputLabel>
<FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
    <Select defaultValue="" id="salutation"
        displayEmpty
        name="salutation"
        value={communicationAddressFormValues.salutation}
        sx={{
            width: { xs: '100%', sm: '162px' },
        }}
        onChange={handleInputChange}
        error={Boolean(formErrors.salutation)}>
        <MenuItem disabled value="">
            Salutation
        </MenuItem>
        {salutationData.map((item, index) => (
            <MenuItem key={index} value={item}>{item}</MenuItem>
        ))}
    </Select>
    {formErrors.salutation && (
<FormHelperText error sx={{ ml: 0 }}>{formErrors.salutation}</FormHelperText>
)}
</FormControl>
</Grid>
<Grid item xs={12} sm={3}>
<InputLabel shrink={false} htmlFor={"firstName"}>
    <Typography variant='body1'>First Name*</Typography>
</InputLabel>
<TextField
    id="firstName"
    margin="dense"
    required
    fullWidth
    placeholder='First Name'
    name="firstName"
    variant='outlined'
    value={communicationAddressFormValues.firstName}
    onChange={handleInputChange}
    error={!!(formErrors.firstName && formErrors.firstName)}
    helperText={formErrors?.firstName}
    size="small"
    onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
    inputProps={{ maxLength: 30 }}
/>
</Grid>
<Grid item xs={12} sm={3}>
<InputLabel shrink={false} htmlFor={"middleName"}>
    <Typography variant='body1'>Middle Name</Typography>
</InputLabel>
<TextField
    id="middleName"
    margin="dense"
    fullWidth
    placeholder='Middle Name'
    name="middleName"
    variant='outlined'
    value={communicationAddressFormValues.middleName}
    size="small"
    onChange={handleInputChange}
    onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
    error={!!(formErrors.middleName && formErrors.middleName)}
    helperText={formErrors?.middleName}
    inputProps={{ maxLength: 30 }}
/>
</Grid>
<Grid item xs={12} sm={3}>
<InputLabel shrink={false} htmlFor={"lastName"}>
    <Typography variant='body1'>Last Name/Surname*</Typography>
</InputLabel>
<TextField
    id="lastName"
    margin="dense"
    required
    fullWidth
    placeholder='Last Name'
    name="lastName"
    variant='outlined'
    value={communicationAddressFormValues.lastName}
    onChange={handleInputChange}
    onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
    error={!!(formErrors.lastName && formErrors.lastName)}
    helperText={formErrors?.lastName}
    size="small"
    inputProps={{ maxLength: 45 }}
/>
</Grid>

            </Grid>

            <Grid container spacing={2} sx={{ mt: 0.1 }}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="designation">
                        <Typography variant='body1'>Designation*</Typography>
                    </InputLabel>
                    <TextField
                        id="designation"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Designation'
                        name="designation"
                        variant='outlined'
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                        onChange={handleInputChange}
                        error={!!(formErrors.designation && formErrors.designation)}
                        helperText={formErrors?.designation}
                        value={communicationAddressFormValues.designation}
                        size="small"
                        inputProps={{ maxLength: 35 }}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="emailId">
                        <Typography variant='body1'>Email Address*</Typography>
                    </InputLabel>
                    <TextField
                        id="emailId"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Email Address'
                        name="emailId"
                        variant='outlined'
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9]+$/)}
                        onChange={handleInputChange}
                        error={!!(formErrors.emailId && formErrors.emailId)}
                        helperText={formErrors?.emailId}
                        value={communicationAddressFormValues.emailId}
                        size="small"
                        inputProps={{ maxLength: 50 }}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 1, mb: 1 }}>
    <Grid item xs={12}>
        <Typography variant='h6' sx={{ mt: 1 }}>
            2. Public Key @(32)
        </Typography>
    </Grid>
    <Grid item xs={12} sx={{ mt: 1 }}>
        <FormControl fullWidth error={Boolean(formErrors.publicKey)}>
            <TextareaAutosize
                id="publickey"
                name="publickey"
                onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9]+$/)}
                placeholder="Enter your public key here..."
                minRows={3} // Adjust as needed
                style={{ width: '100%', padding: '8px', borderRadius: '4px', borderColor: formErrors.publicKey ? 'red' : 'grey' }}
                onChange={handleInputChange}
                value={communicationAddressFormValues.publickey} // Ensure correct key is used
            />
            {formErrors.publicKey && (
                <FormHelperText error>{formErrors.publicKey}</FormHelperText>
            )}
        </FormControl>
    </Grid>
</Grid>


            <Box sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"

                >
                    Save & Next
                </Button>

            </Box>


        </Box>
    );
}

export default OrganizationalDetails;
