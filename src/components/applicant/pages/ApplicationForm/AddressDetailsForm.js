import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography,Button, IconButton,FormHelperText, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StateService from '../../../../service/AdminService/StateService';
import CountryService from '../../../../service/AdminService/CountryService';
import CityService from '../../../../service/AdminService/CityService';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import { useSelector } from 'react-redux';
import showAlert from '../../../global/common/MessageBox/AlertService';
import ValidatePattern from '../../../global/util/ValidatePattern';
import IntentService from '../../../../service/AdminService/IntentService';
import ApplicationReview from '../../../../service/NewLicenseService/ApplicationReview';

const errorMsg = {
    blockNo: {
        blank: 'Block No is required',
        length: 'Block No must be between 3 and 15 characters',
    },
    village: {
        blank: 'Village is required',
        length: 'Village must be between 3 and 30 characters',
    },
    postOffice: {
        blank: 'Post Office is required',
        length: 'Post Office must be between 3 and 30 characters',
    },
    subDivision: {
        blank: 'Subdivision is required',
        length: 'Subdivision must be between 3 and 30 characters',
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

    blockNo1: {
        blank: 'Block No is required',
        length: 'Block No must be between 3 and 15 characters',
    },
    village1: {
        blank: 'Village is required',
        length: 'Village must be between 3 and 30 characters',
    },
    postOffice1: {
        blank: 'Post Office is required',
        length: 'Post Office must be between 3 and 30 characters',
    },
    subDivision1: {
        blank: 'Subdivision is required',
        length: 'Subdivision must be between 3 and 30 characters',
    },
    country1: {
        blank: 'Country is required',
    },
    state1: {
        blank: 'State is required',
    },
    city1: {
        blank: 'City is required',
    },
    pin1: {
        blank: 'PIN is required',
        format: 'PIN must be a valid 6-digit number',
    },
    fax1: {
        blank: 'Fax is required',
        format: 'Fax must be a valid number',
    },
    telephoneNo1: {
        blank: 'Telephone No is required',
        format: 'Telephone No must be a valid number',
    },
};



const AddressDetailsForm = ({handleNext,handleBack,handleFormDataChange}) => {
    const [formErrors, setFormErrors] = useState({});

    const [communicationAddressFormValues, setCommunicationAddressFormValues] = useState({
        residential: {
          locationName:'Residential',  
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
          mobile: '',
          addressId:'',
        },
        official: {
          locationName:'Official',  
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
          mobile: '',
          addressId:'',

        },
        communicationAddress:'',
        userName:'',
      });


      const userName = useSelector((state)=>state.jwtAuthentication.username);
      const appTypeMasterId= useSelector((state)=>state.licenseApplication.applicationType);
      console.log(userName);
      console.log(appTypeMasterId);

      useEffect(() => {
       
        setCommunicationAddressFormValues((prevState) => ({
          ...prevState,
          userName: userName || '', 
        }));
      }, [userName]); 


    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredStates, setFilteredStates] = useState([{
        
    }]);
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


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let updatedValues = { ...communicationAddressFormValues };

        console.log(updatedValues)
    
        // Determine if the field belongs to residential or official
        if (name.startsWith("residential")) {
            const fieldName = name.replace("residential", ""); // Remove the prefix
            console.log(fieldName)
            updatedValues.residential[fieldName] = value;
    
            // Handle country change for residential
            if (fieldName === "country") {
                const filteredStates = states.filter(state => state.countryId.countryId === parseInt(value));
                setFilteredStates(filteredStates);
                updatedValues.residential.state = '';
                updatedValues.residential.city = '';
            }
    
            // Handle state change for residential
            if (fieldName === "state") {
                const filteredCities = cities.filter(city => city.stateId.stateId === parseInt(value));
                setFilteredCities(filteredCities);
                updatedValues.residential.city = '';
            }
        } else if (name.startsWith("official")) {
            const fieldName = name.replace("official", ""); // Remove the prefix
            updatedValues.official[fieldName] = value;
    
            // Handle country change for official
            if (fieldName === "country") {
                const filteredState = states.filter(state => state.countryId.countryId === parseInt(value));
                setFilteredState(filteredState);
                updatedValues.official.state = '';
                updatedValues.official.city = '';
            }
    
            // Handle state change for official
            if (fieldName === "state") {
                const filteredCitie = cities.filter(city => city.stateId.stateId === parseInt(value));
                setFilteredCitie(filteredCitie);
                updatedValues.official.city = '';
            }
        }
    
        // Update form values
        setCommunicationAddressFormValues(updatedValues);
    };

    useEffect(() => {
        if (userName) {
            console.log(userName);
            setLoading(true);
    
            ApplicationForm.getApplicationForm2ByUsername(userName)
                .then((response) => {
                    console.log(response.data);
    
                    const { indivAddressDTO } = response.data;
    
                    // Ensure residential and official are defined before accessing properties
                    const residential = indivAddressDTO?.residential || {};
                    const official = indivAddressDTO?.official || {};
    
                    // Set the state with the extracted data
                    setCommunicationAddressFormValues((prevState) => ({
                        ...prevState,
                        residential: {
                            locationName: 'Residential',
                            blockNo: residential.blockNo || '',
                            village: residential.village || '',
                            postOffice: residential.postOffice || '',
                            subDivision: residential.subDivision || '',
                            country: residential.country || "",
                            city: residential.city || '',
                            state: residential.state || '',
                            pin: residential.pin || '',
                            fax: residential.fax || '',
                            telephoneNo: residential.telephoneNo || '',
                            mobile: residential.mobile || '',
                            addressId:residential.addressId||'',
                        },
                        official: {
                            locationName: 'Official',
                            blockNo: official.blockNo || '',
                            village: official.village || '',
                            postOffice: official.postOffice || '',
                            subDivision: official.subDivision || '',
                            country: official.country || '',
                            city: official.city || '',
                            state: official.state || '',
                            pin: official.pin || '',
                            fax: official.fax || '',
                            telephoneNo: official.telephoneNo || '',
                            mobile: official.mobile || '',
                            addressId:official.addressId||'',
                        },
                        communicationAddress: response.data.communicationAddress,
                        userName: userName,
                    }));
    


                    
                    // Filter states and cities based on residential and official countries/states
                    if (official.country && official.state) {
                        const filteredState = states.filter(
                            (state) => state.countryId.countryId === parseInt(official.country)
                        );
                        setFilteredState(filteredState);
    
                        const filteredCitie = cities.filter(
                            (city) => city.stateId.stateId === parseInt(official.state)
                        );
                        setFilteredCitie(filteredCitie);
                    }
    
                    if (residential.country && residential.state) {
                        const filteredStates = states.filter(
                            (state) => state.countryId.countryId === parseInt(residential.country)
                        );
                        setFilteredStates(filteredStates);
    
                        const filteredCities = cities.filter(
                            (city) => city.stateId.stateId === parseInt(residential.state)
                        );
                        setFilteredCities(filteredCities);
                    }
    
                    // After state update, logging updated values
                    setTimeout(() => {
                        console.log('Updated communicationAddressFormValues:', communicationAddressFormValues);
                    }, 0);
                })
                .catch((err) => {
                    console.log(err);
                    // Handle error (e.g., navigate or display a message)
                })
                .finally(() => {
                   // setLoading(false);
                });
        } else {
            // Handle the case where `userName` is not available
            // Example: navigate('/admin/state', { replace: true });
        }
    }, [userName, states, cities]);



    const [applicationTypeData, setApplicationTypeData] = useState({});
    useEffect(() => {
        setLoading(true);
        IntentService.getIntentByUserName(userName)
            .then(data => {
              const appData = data.data;

              // Assuming appData contains an emailDetails object
              const mobileData = appData.mobileNo || {};
  
              // Set the emailId field from the object if available
              setCommunicationAddressFormValues(prevState => ({
                  ...prevState,
                  residential: {
                      mobile: mobileData|| '',
                  }
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

    const handleBacks = () => {
       handleBack();
    }


    console.log("communication===>"+JSON.stringify(communicationAddressFormValues))
    const validateForm = () => {
        const errors = {};
    
        // Validate Residential Address
        const residential = communicationAddressFormValues.residential;
    
        // Validate blockNo
        if (!residential.blockNo) {
            errors.blockNo = errorMsg.blockNo.blank;
        } else if (residential.blockNo.length < 3 || residential.blockNo.length > 15) {
            errors.blockNo = errorMsg.blockNo.length;
        }
    
        // Validate village
        if (!residential.village) {
            errors.village = errorMsg.village.blank;
        } else if (residential.village.length < 3 || residential.village.length > 30) {
            errors.village = errorMsg.village.length;
        }
    
        // Validate postOffice
        if (!residential.postOffice) {
            errors.postOffice = errorMsg.postOffice.blank;
        } else if (residential.postOffice.length < 3 || residential.postOffice.length > 30) {
            errors.postOffice = errorMsg.postOffice.length;
        }
    
        // Validate subDivision
        if (!residential.subDivision) {
            errors.subDivision = errorMsg.subDivision.blank;
        } else if (residential.subDivision.length < 3 || residential.subDivision.length > 30) {
            errors.subDivision = errorMsg.subDivision.length;
        }
    
        // Validate country
        if (!residential.country) {
            errors.country = errorMsg.country.blank;
        }
    
        // Validate state
        if (!residential.state) {
            errors.state = errorMsg.state.blank;
        }
    
        // Validate city
        if (!residential.city) {
            errors.city = errorMsg.city.blank;
        }
    
        // Validate pin
        if (!residential.pin) {
            errors.pin = errorMsg.pin.blank;
        } else if (!/^\d{6}$/.test(residential.pin)) {
            errors.pin = errorMsg.pin.format;
        }
    
        // Validate telephoneNo
        if (!residential.telephoneNo) {
            errors.telephoneNo = errorMsg.telephoneNo.blank;
        }
    
        // Validate mobile
        if (!residential.mobile) {
            errors.mobile = errorMsg.mobile.blank;
        }
    
        // Validate Official Address
        const official = communicationAddressFormValues.official;
    
        // Validate blockNo
        if (!official.blockNo) {
            errors.blockNo1 = errorMsg.blockNo.blank;
        } else if (official.blockNo.length < 3 || official.blockNo.length > 15) {
            errors.blockNo1 = errorMsg.blockNo.length;
        }
    
        // Validate village
        if (!official.village) {
            errors.village1 = errorMsg.village.blank;
        } else if (official.village.length < 3 || official.village.length > 30) {
            errors.village1 = errorMsg.village.length;
        }
    
        // Validate postOffice
        if (!official.postOffice) {
            errors.postOffice1 = errorMsg.postOffice.blank;
        } else if (official.postOffice.length < 3 || official.postOffice.length > 30) {
            errors.postOffice1 = errorMsg.postOffice.length;
        }
    
        // Validate subDivision
        if (!official.subDivision) {
            errors.subDivision1 = errorMsg.subDivision.blank;
        } else if (official.subDivision.length < 3 || official.subDivision.length > 30) {
            errors.subDivision1 = errorMsg.subDivision.length;
        }
    
        // Validate country
        if (!official.country) {
            errors.country1 = errorMsg.country.blank;
        }
    
        // Validate state
        if (!official.state) {
            errors.state1 = errorMsg.state.blank;
        }
    
        // Validate city
        if (!official.city) {
            errors.city1 = errorMsg.city.blank;
        }
    
        // Validate pin
        if (!official.pin) {
            errors.pin1 = errorMsg.pin.blank;
        }
    
        // Validate telephoneNo
        if (!official.telephoneNo) {
            errors.telephoneNo1 = errorMsg.telephoneNo.blank;
        }
    
    
        return errors;
    };
    
    
    
    // const handleFormSubmit = (e) => {
    //     e.preventDefault();
    //             alert("next part");
    //             handleNext();    
    // };

    const [isLoading, setLoading] = useState(false);
    
    const handleRadioChange = (event) => {
        const selectedAddressType = event.target.value;
        setCommunicationAddressFormValues(prevValues => ({
          ...prevValues,
          communicationAddress: selectedAddressType
        }));
      };

      const handleFormSubmit = (e) => {
        e.preventDefault();

        console.log(communicationAddressFormValues)
        const errors = validateForm();
        console.log(errors)
        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            setLoading(true);
            
          
             const requestMethod = (communicationAddressFormValues.official?.addressId && communicationAddressFormValues.residential?.addressId) 
            ? ApplicationForm.updateNewApplicationForm2 
            : ApplicationForm.addNewApplicationForm2;
        
            requestMethod(communicationAddressFormValues)
                    .then((response) => {

                        showAlert({
                            messageTitle: 'Second Step Successfull',
                            messageContent: `Second step ${(communicationAddressFormValues.official?.addressId && communicationAddressFormValues.residential?.addressId) ? 'updated' : 'saved'} successfully`,
                            confirmText: 'Ok',
                            onConfirm: () => { handleNext() }
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
           

        } else {
            //     // Set form errors if validation fails
            setFormErrors(errors);
        }
    };
    

    return (
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
            {/* Residential Address Section */}
            <Grid container sx={{ mt: 1, mb: 1 }}>
                <Grid item>
                    <Typography variant='h6' sx={{ mt: 1 }}>1. Residential Address (3A)</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="blockNo">
                        <Typography variant='body1'>Flat/Door/Block No*</Typography>
                    </InputLabel>
                    <TextField
                        id="residentialblockNo"
                        margin="dense"
                        required
                        fullWidth
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9 ]+$/)}
                        placeholder='Flat/Door/Block No'
                        name="residentialblockNo"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.residential.blockNo}
                        error={!!(formErrors.blockNo && formErrors.blockNo)}
                        helperText={formErrors?.blockNo}
                        size="small"
                        inputProps={{ maxLength: 15 }}
                        disabled={!isFieldEnabled("residentialBlockNo")}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="village">
                        <Typography variant='body1'>Name of Premises/Building/Village*</Typography>
                    </InputLabel>
                    <TextField
                        id="residentialvillage"
                        margin="dense"
                        required
                        fullWidth
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z ]+$/)}
                        placeholder='Name of Premises/Building/Village'
                        name="residentialvillage"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.residential.village}
                        error={!!(formErrors.village && formErrors.village)}
                        helperText={formErrors?.village}
                        size="small"
                        inputProps={{ maxLength: 30 }}
                        disabled={!isFieldEnabled("residentialVillage")}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 0.1 }}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="postOffice">
                        <Typography variant='body1'>Road/Street/Lane/Post Office*</Typography>
                    </InputLabel>
                    <TextField
                        id="residentialpostOffice"
                        margin="dense"
                        required
                        fullWidth
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z ]+$/)}
                        placeholder='Road/Street/Lane/Post Office'
                        name="residentialpostOffice"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.residential.postOffice}
                        error={!!(formErrors.postOffice && formErrors.postOffice)}
                        helperText={formErrors?.postOffice}
                        size="small"
                        inputProps={{ maxLength: 30 }}
                        disabled={!isFieldEnabled("residentialPostOffice")}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="subDivision">
                        <Typography variant='body1'>Area/Locality/Taluka/Sub-Division*</Typography>
                    </InputLabel>
                    <TextField
                        id="residentialsubDivision"
                        margin="dense"
                        required
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9 ]+$/)}
                        fullWidth
                        placeholder='Area/Locality/Taluka/Sub-Division'
                        name="residentialsubDivision"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.residential.subDivision}
                        error={!!(formErrors.subDivision && formErrors.subDivision)}
                        helperText={formErrors?.subDivision}
                        size="small"
                        inputProps={{ maxLength: 30 }}
                        disabled={!isFieldEnabled("residentialSubDivision")}
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
                            id="residentialcountry"
                            required
                            value={communicationAddressFormValues.residential.country?communicationAddressFormValues.residential.country:''}
                            onChange={handleInputChange}
                            name="residentialcountry"
                            displayEmpty
                            error={!!formErrors.country}
                            disabled={!isFieldEnabled("residentialCountry")}
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
                        {formErrors.country1 && <FormHelperText sx={{ ml: 0 }} error>{formErrors.country}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <InputLabel shrink={false} htmlFor="state">
                        <Typography variant='body1'>State/Province*</Typography>
                    </InputLabel>
                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                        <Select
                            id="residentialstate"
                            required
                            value={communicationAddressFormValues.residential.state?communicationAddressFormValues.residential.state:''}
                            onChange={handleInputChange}
                            name="residentialstate"
                            displayEmpty
                            error={!!formErrors.state}
                            disabled={!isFieldEnabled("residentialState")}
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
                        {formErrors.state1 && <FormHelperText sx={{ ml: 0 }} error>{formErrors.state}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <InputLabel shrink={false} htmlFor="city">
                        <Typography variant='body1'>District*</Typography>
                    </InputLabel>
                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                        <Select
                            id="residentialcity"
                            required
                            value={communicationAddressFormValues.residential.city?communicationAddressFormValues.residential.city:''}
                            onChange={handleInputChange}
                            name="residentialcity"
                            displayEmpty
                            error={!!formErrors.city}
                            disabled={!isFieldEnabled("residentialCity")}
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
                        id="residentialpin"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Pin'
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                        name="residentialpin"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.residential.pin}
                        error={!!(formErrors.pin && formErrors.pin)}
                        helperText={formErrors?.pin}
                        size="small"
                        inputProps={{ maxLength: 6 }}
                        disabled={!isFieldEnabled("residentialPin")}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="telephoneNo">
                        <Typography variant='body1'>Telephone No*</Typography>
                    </InputLabel>
                    <TextField
                        id="residentialtelephoneNo"
                        margin="dense"
                        required
                        fullWidth
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                        placeholder='Telephone No'
                        name="residentialtelephoneNo"
                        variant='outlined'
                        onChange={handleInputChange}
                        error={!!(formErrors.telephoneNo && formErrors.telephoneNo)}
                        helperText={formErrors?.telephoneNo}
                        value={communicationAddressFormValues.residential.telephoneNo}
                        size="small"
                        inputProps={{ maxLength: 12 }}
                        disabled={!isFieldEnabled("residentialTelephoneNo")}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="fax">
                        <Typography variant='body1'>Fax</Typography>
                    </InputLabel>
                    <TextField
                        id="residentialfax"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Fax'
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                        name="residentialfax"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.residential.fax}
                        error={!!(formErrors.fax && formErrors.fax)}
                        helperText={formErrors?.fax}
                        size="small"
                        inputProps={{ maxLength: 12 }}
                        disabled={!isFieldEnabled("residentialFax")}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="mobile">
                        <Typography variant='body1'>Mobile*</Typography>
                    </InputLabel>
                    <TextField
                        id="residentialmobile"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Mobile'
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                        name="residentialmobile"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.residential.mobile}
                        error={!!(formErrors.Mobile && formErrors.Mobile)}
                        helperText={formErrors?.Mobile}
                        size="small"
                        disabled={!isFieldEnabled("residentialMobile")}
                        inputProps={{ maxLength: 10 }}
                    />
                </Grid>
            </Grid>
            {/* Official Address Section */}
            <Grid container sx={{ mt: 1, mb: 1 }}>
                <Grid item>
                    <Typography variant='h6' sx={{ mt: 1 }}>2. Official Address (3B)</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="blockNoOffice1">
                        <Typography variant='body1'>Flat/Door/Block No*</Typography>
                    </InputLabel>
                    <TextField
                        id="officialblockNo"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Flat/Door/Block No'
                        name="officialblockNo"
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9 ]+$/)}
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.official.blockNo}
                        error={!!(formErrors.blockNo1 && formErrors.blockNo1)}
                        helperText={formErrors?.blockNo1}
                        size="small"
                        inputProps={{ maxLength: 15 }}
                        disabled={!isFieldEnabled("officialBlockNo")}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="village">
                        <Typography variant='body1'>Name of Premises/Building/Village*</Typography>
                    </InputLabel>
                    <TextField
                        id="officialvillage"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Name of Premises/Building/Village'
                        name="officialvillage"
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z ]+$/)}
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.official.village}
                        error={!!(formErrors.village1 && formErrors.village1)}
                        helperText={formErrors?.village1}
                        size="small"
                        inputProps={{ maxLength: 30 }}
                        disabled={!isFieldEnabled("officialVillage")}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 0.1 }}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="postOffice1">
                        <Typography variant='body1'>Road/Street/Lane/Post Office*</Typography>
                    </InputLabel>
                    <TextField
                        id="officialpostOffice"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Road/Street/Lane/Post Office'
                        name="officialpostOffice"
                        variant='outlined'
                        onChange={handleInputChange}
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9 ]+$/)}
                        value={communicationAddressFormValues.official.postOffice}
                        error={!!(formErrors.postOffice1 && formErrors.postOffice1)}
                        helperText={formErrors?.postOffice1}
                        size="small"
                        inputProps={{ maxLength: 30 }}
                        disabled={!isFieldEnabled("officialPostOffice")}
                    />
                </Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="subDivision">
                        <Typography variant='body1'>Area/Locality/Taluka/Sub-Division*</Typography>
                    </InputLabel>
                    <TextField
                        id="officialsubDivision"
                        margin="dense"
                        required
                        fullWidth
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9 ]+$/)}
                        placeholder='Area/Locality/Taluka/Sub-Division'
                        name="officialsubDivision"
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.official.subDivision}
                        error={!!(formErrors.subDivision1 && formErrors.subDivision1)}
                        helperText={formErrors?.subDivision1}
                        size="small"
                        inputProps={{ maxLength: 30 }}
                        disabled={!isFieldEnabled("officialSubDivision")}
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
                            id="officialcountry"
                            required
                            value={communicationAddressFormValues.official.country}
                            onChange={handleInputChange}
                            name="officialcountry"
                            displayEmpty
                            error={!!formErrors.country1}
                            disabled={!isFieldEnabled("officialCountry")}
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
                        {formErrors.country1 && <FormHelperText sx={{ ml: 0 }} error>{formErrors.country1}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <InputLabel shrink={false} htmlFor="state">
                        <Typography variant='body1'>State/Province*</Typography>
                    </InputLabel>
                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                        <Select
                            id="officialstate"
                            required
                            value={communicationAddressFormValues.official.state}
                            onChange={handleInputChange}
                            name="officialstate"
                            displayEmpty
                            error={!!formErrors.state1}
                            disabled={!isFieldEnabled("officialState")}
                        >
                            <MenuItem disabled value="">
                                Select State/Province
                            </MenuItem>
                            {filteredState.map(state => (
                                <MenuItem key={state.stateId} value={state.stateId}>
                                    {state.stateName}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.state1 && <FormHelperText sx={{ ml: 0 }} error>{formErrors.state1}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <InputLabel shrink={false} htmlFor="city">
                        <Typography variant='body1'>District*</Typography>
                    </InputLabel>
                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                        <Select
                            id="officialcity"
                            required
                            value={communicationAddressFormValues.official.city}
                            onChange={handleInputChange}
                            name="officialcity"
                            displayEmpty
                            error={!!formErrors.city1}
                            disabled={!isFieldEnabled("officialCity")}
                        >
                            <MenuItem disabled value="">
                                Select District
                            </MenuItem>
                            {filteredCitie.map(city => (
                                <MenuItem key={city.cityId} value={city.cityId}>
                                    {city.cityName}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.city1 && <FormHelperText sx={{ ml: 0 }} error>{formErrors.city1}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <InputLabel shrink={false} htmlFor="pin">
                        <Typography variant='body1'>Pin*</Typography>
                    </InputLabel>
                    <TextField
                        id="officialpin"
                        margin="dense"
                        required
                        placeholder='Pin'
                        name="officialpin"
                        variant='outlined'
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.official.pin}
                        error={!!(formErrors.pin1 && formErrors.pin1)}
                        helperText={formErrors?.pin1}
                        size="small"
                        inputProps={{ maxLength: 6 }}
                        disabled={!isFieldEnabled("officialPin")}
                    />
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm sx={{ml:2}}>
                        <InputLabel shrink={false} htmlFor="telephoneNo">
                            <Typography variant='body1'>Telephone No*</Typography>
                        </InputLabel>
                        <TextField
                            id="officialtelephoneNo"
                            margin="dense"
                            required
                            fullWidth
                            placeholder='Telephone No'
                            name="officialtelephoneNo"
                            variant='outlined'
                            onChange={handleInputChange}
                            onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                            value={communicationAddressFormValues.official.telephoneNo}
                            error={!!(formErrors.telephoneNo1 && formErrors.telephoneNo1)}
                            helperText={formErrors?.telephoneNo1}
                            size="small"
                            inputProps={{ maxLength: 12 }}
                            disabled={!isFieldEnabled("officialTelephoneNo")}
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <InputLabel shrink={false} htmlFor="fax">
                            <Typography variant='body1'>Fax</Typography>
                        </InputLabel>
                        <TextField
                            id="officialfax"
                            margin="dense"
                            required
                            fullWidth
                            placeholder='Fax'
                            onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                            name="officialfax"
                            variant='outlined'
                            onChange={handleInputChange}
                            value={communicationAddressFormValues.official.fax}
                            error={!!(formErrors.fax1 && formErrors.fax1)}
                            helperText={formErrors?.fax1}
                            size="small"
                            inputProps={{ maxLength: 12 }}
                            disabled={!isFieldEnabled("officialFax")}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1">Address For Communication* (4)</Typography>
                        <RadioGroup
                            row
                          value={communicationAddressFormValues.communicationAddress}
                          onChange={handleRadioChange}
                            sx={{
                                ml: 2, '& .MuiFormControlLabel-root': {
                                    mr: 2,
                                    '& .MuiTypography-root': { fontSize: '0.875rem' },
                                    '& .MuiRadio-root': {
                                        transform: 'scale(0.8)'
                                    }
                                }
                            }}
                        >




                            <FormControlLabel value="Residential" control={<Radio />} label="Residential" />
                            <FormControlLabel value="Official" control={<Radio />} label="Office" />
                        </RadioGroup>
                    </Box>
                </Grid>



                
            </Grid>

            <Box sx={{ display: 'flex', justifyContent:'space-between', mt: 3 ,ml:1}}>
            <Button
                                        onClick={handleBacks}
                                        sx={{ mr: 1 }}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Back
                                    </Button>
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

export default AddressDetailsForm;
