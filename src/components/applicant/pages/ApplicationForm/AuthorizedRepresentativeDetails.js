
import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, FormControl, InputLabel, Button, Select, Tooltip, MenuItem, Typography, IconButton, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StateService from '../../../../service/AdminService/StateService';
import CountryService from '../../../../service/AdminService/CountryService';
import CityService from '../../../../service/AdminService/CityService';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import FirmApplicationForm from '../../../../service/NewLicenseService/FirmApplicationForm';
import showAlert from '../../../global/common/MessageBox/AlertService';
import validatePattern from '../../../global/util/ValidatePattern';
const VisuallyHiddenInput = styled('input')({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: '0',
});

const AuthorizedRepresentativeDetails = ({ handleNext, handleFormDataChange, handleBack }) => {
    const [communicationAddress, setCommunicationAddress] = useState('residential');
    const userName = useSelector((state)=>state.jwtAuthentication.username);
    const appTypeMasterId= useSelector((state)=>state.licenseApplication.applicationType);
    console.log(userName);
    console.log(appTypeMasterId);
    const [communicationAddressFormValues, setCommunicationAddressFormValues] = useState({
      
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
                firstName: '',
                lastName: '',
                middleName: '',
                salutation: '',
                naturesOfBusiness: '',
                authorizedRepresentativeId:'',
                addressId:'',
                userName:userName,
    });


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

        setCommunicationAddressFormValues(updatedValues);
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

        communicationAddressFormValues((prevValues) => ({
            ...prevValues,
            [name]: formattedDate,
        }));
    };

    useEffect(() => {
        if (userName) {
            console.log(userName);
            setLoading(true);
    
            FirmApplicationForm.getAllFirmApplication4(userName)
                .then((response) => {
                    console.log(response.data);

                    // Assuming response.data contains the necessary data to set the form values
                    const addressData = response?.data?.addressDTOs?.[0] || {};
                    const representativeData = response?.data?.FirmAuthorizedRepresentative || {};
console.log("representativeData===>",JSON.stringify(representativeData));
                    setCommunicationAddressFormValues(prevValues => ({
                        ...prevValues,
                        blockNo: addressData.blockNo || '',
                        village: addressData.village || '',
                        postOffice: addressData.postOffice || '',
                        subDivision: addressData.subDivision || '',
                        country: addressData.country || '',
                        city: addressData.city || '',
                        state: addressData.state || '',
                        pin: addressData.pin || '',
                        fax: representativeData.fax || '',
                        telephoneNo: representativeData.telephoneNo || '',
                        firstName: representativeData.firstName || '',
                        lastName: representativeData.lastName || '',
                        middleName: representativeData.middleName || '',
                        salutation: representativeData.salutation || '',
                        naturesOfBusiness: representativeData.natureOfBusiness || '',
                        authorizedRepresentativeId: representativeData.authorizedRepresentativeId || '',
                        addressId: addressData.addressId || '',
                        userName: prevValues.userName || ''
                    }));
                      // You can also filter states and cities here as needed
                      const filteredStates = states.filter(state => state.countryId.countryId === parseInt(addressData.country));
                      setFilteredStates(filteredStates);
      
                      const filteredCities = cities.filter(city => city.stateId.stateId === parseInt(addressData.state));
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
            console.log("userName is not available.");
            // Handle the case where `userName` is not available
            // Example: navigate('/admin/state', { replace: true });
        }
    }, [userName,states,cities]);  // Removed unnecessary dependencies 'states' and 'cities'
    


console.log("commication=====>"+JSON.stringify(communicationAddressFormValues))
    const handleBacks = () => {
        handleBack();
    }
    // const handleFormSubmit = (e) => {
    //     e.preventDefault();
    
    //     console.log(communicationAddressFormValues);
    
    //     handleFormDataChange({ OrganizationalDetails: communicationAddressFormValues });
    //     alert("Next part");
    
    //     handleNext();
    // };

    const [isLoading, setLoading] = useState(false);
    const handleFormSubmit = (event) => {
        event.preventDefault();
      
            //const requestMethod = FirmApplicationForm.addNewFirmApplication4;

            const requestMethod = communicationAddressFormValues.authorizedRepresentativeId ? FirmApplicationForm.updateFirmApplication4 : FirmApplicationForm.addNewFirmApplication4;
            requestMethod(communicationAddressFormValues)
            .then((response) => {
                console.log(response.data);
                showAlert({
                    messageTitle: 'Successful',
                    messageContent: `data  saved  successfully`,
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
        
    };

    return (
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
            {/* Residential Address Section */}
         
     <Grid container sx={{ mt: 1, mb: 1, alignItems: 'center' }}>
    <Grid item xs>
        <Typography variant='h6' sx={{ mt: 1 }}> Authorized Representative Details(27)</Typography>
    </Grid>
</Grid>
            <Grid container sx={{ mt: 1, mb: 1 }}>
                <Grid item>
                    <Typography variant='h6' sx={{ mt: 1 }}>a. Full Name</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>

                    <InputLabel shrink={false} htmlFor={"salutation"}>
                        <Typography variant='body1' >Salutation*</Typography>
                    </InputLabel>
                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                        <Select defaultValue="" id="salutation"
                            displayEmpty
                            name="salutation"
                            value={communicationAddressFormValues.salutation}
                            onChange={handleInputChange}
                            sx={{
                                width: { xs: '100%', sm: '100%' },
                            }}
                        >
                            <MenuItem disabled value="">
                                Salutation
                            </MenuItem>
                            {salutationData.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))}
                        </Select>

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
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                        onChange={handleInputChange}
                        size="small"
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
                        onChange={handleInputChange}
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                        size="small"
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
                        value={communicationAddressFormValues.lastName}
                        onChange={handleInputChange}
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                        variant='outlined'
                        size="small"
                        inputProps={{ maxLength: 45 }}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 1, mb: 1 }}>
                <Grid item>
                    <Typography variant='h6' sx={{ mt: 1 }}>b. Address</Typography>
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
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.blockNo}
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
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.village}
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
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                        value={communicationAddressFormValues.postOffice}
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
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                        value={communicationAddressFormValues.subDivision}
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
                            value={communicationAddressFormValues.country}
                            onChange={handleInputChange}
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
                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.pin}
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
                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.telephoneNo}
                        size="small"
                        inputProps={{ maxLength: 15 }}
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
                        onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                        variant='outlined'
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.fax}
                        size="small"
                        inputProps={{ maxLength: 15 }}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor="natureOfBusiness">
                        <Typography variant='body1'>Nature of Business*</Typography>
                    </InputLabel>
                    <TextField
                        id="naturesOfBusiness"
                        margin="dense"
                        required
                        fullWidth
                        placeholder='Nature of Business'
                        name="naturesOfBusiness"
                        variant='outlined'
                        onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                        onChange={handleInputChange}
                        value={communicationAddressFormValues.naturesOfBusiness}
                        size="small"
                        inputProps={{ maxLength: 30 }}
                    />
                </Grid>
            </Grid>
            {/* Official Address Section */}
          
        
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, ml: 1 }}>
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

        </Box>
    );
}

export default AuthorizedRepresentativeDetails;
