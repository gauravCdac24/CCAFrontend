import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  MenuItem,
  Typography,
  IconButton,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Checkbox,
  styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StateService from "../../../../service/AdminService/StateService";
import CountryService from "../../../../service/AdminService/CountryService";
import CityService from "../../../../service/AdminService/CityService";
import validatePattern from "../../../global/util/ValidatePattern";
import { getStepSuccessAlert, getStepErrorAlert } from "../../../global/util/applicationFormSteps";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import showAlert from "../../../global/common/MessageBox/AlertService";
import ApplicationForm from "../../../../service/NewLicenseService/ApplicationForm";
import { useSelector } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const VisuallyHiddenInput = styled("input")({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  border: "0",
});
const errorMsg = {
  blockNo: {
    blank: "Block No cannot be empty.",
    length: "The length of Block No must be between 1 and 10 characters.",
  },
  village: {
    blank: "Village cannot be empty.",
    length: "The length of Village must be between 1 and 50 characters.",
  },
  postOffice: {
    blank: "Post Office cannot be empty.",
    length: "The length of Post Office must be between 1 and 50 characters.",
  },
  subDivision: {
    blank: "Subdivision cannot be empty.",
    length: "The length of Subdivision must be between 1 and 50 characters.",
  },
  country: {
    blank: "Country cannot be empty.",
  },
  state: {
    blank: "State cannot be empty.",
  },
  certificationLevel: {
    blank: "certificationLevel cannot be empty.",
  },
  companyName: {
    blank: "companyName cannot be empty.",
  },
  city: {
    blank: "City cannot be empty.",
    length: "The length of City must be between 1 and 50 characters.",
  },
  pin: {
    blank: "PIN cannot be empty.",
    length: "PIN must be exactly 6 digits.",
    format: "PIN must contain only numbers.",
  },
  blockNo1: {
    blank: "Block No (Office) cannot be empty.",
    length:
      "The length of Block No (Office) must be between 1 and 10 characters.",
  },
  village1: {
    blank: "Village (Office) cannot be empty.",
    length:
      "The length of Village (Office) must be between 1 and 50 characters.",
  },
  postOffice1: {
    blank: "Post Office (Office) cannot be empty.",
    length:
      "The length of Post Office (Office) must be between 1 and 50 characters.",
  },
  subDivision1: {
    blank: "Subdivision (Office) cannot be empty.",
    length:
      "The length of Subdivision (Office) must be between 1 and 50 characters.",
  },
  country1: {
    blank: "Country (Office) cannot be empty.",
  },
  state1: {
    blank: "State (Office) cannot be empty.",
  },
  city1: {
    blank: "City (Office) cannot be empty.",
    length: "The length of City (Office) must be between 1 and 50 characters.",
  },
  pin1: {
    blank: "PIN (Office) cannot be empty.",
    length: "PIN (Office) must be exactly 6 digits.",
    format: "PIN (Office) must contain only numbers.",
  },
  blockNo2: {
    blank: "Block No (Communication) cannot be empty.",
    length:
      "The length of Block No (Communication) must be between 1 and 10 characters.",
  },
  village2: {
    blank: "Village (Communication) cannot be empty.",
    length:
      "The length of Village (Communication) must be between 1 and 50 characters.",
  },
  postOffice2: {
    blank: "Post Office (Communication) cannot be empty.",
    length:
      "The length of Post Office (Communication) must be between 1 and 50 characters.",
  },
  subDivision2: {
    blank: "Subdivision (Communication) cannot be empty.",
    length:
      "The length of Subdivision (Communication) must be between 1 and 50 characters.",
  },
  country2: {
    blank: "Country (Communication) cannot be empty.",
  },
  state2: {
    blank: "State (Communication) cannot be empty.",
  },
  city2: {
    blank: "City (Communication) cannot be empty.",
    length:
      "The length of City (Communication) must be between 1 and 50 characters.",
  },
  pin2: {
    blank: "PIN (Communication) cannot be empty.",
    length: "PIN (Communication) must be exactly 6 digits.",
    format: "PIN (Communication) must contain only numbers.",
  },
};

const Location = ({ handleNext, handleBack }) => {
  // const [communicationAddress, setCommunicationAddress] =
  //   useState("residential");
const [communicationAddress, setCommunicationAddress] = useState(["residential", "office"]);
  //  const [communicationAddress, setCommunicationAddress] = useState('official');
  const [editIndex, setEditIndex] = useState(null); // Keep track of which address is being edited
  const [editFormValues, setEditFormValues] = useState({});
  const userName = useSelector((state) => state.jwtAuthentication.username);
  const appTypeMasterId = useSelector(
    (state) => state.licenseApplication.applicationType,
  );
  console.log(userName);
  console.log(appTypeMasterId);
  const allowedFileTypes = ["application/pdf"];
  const [fileInputKey1, setFileInputKey1] = useState(Date.now());
  const [fileName1, setFileName1] = useState("");

  const [selectedLocationTypes, setSelectedLocationTypes] = useState([]);
  const [communicationAddressFormValues, setCommunicationAddressFormValues] =
    useState({
      locationType: "",
      blockNo: "",
      village: "",
      postOffice: "",
      subDivision: "",
      country: "",
      city: "",
      state: "",
      pin: "",
      userName: userName,
      intentAppId: "",
      addressId: "",
      locationId: "",
      certificationLevel: "",
      companyName: "",
      certificationDocument: null,
      certificateName: "",
      LocationDetails: [],
    });
  const [disabledLocationTypes, setDisabledLocationTypes] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredState, setFilteredState] = useState([]);
  const [filteredCitie, setFilteredCitie] = useState([]);
  const [sameAsOfficialAddress, setSameAsOfficialAddress] = useState("");
  const [sitePresent, setSitePresent] = useState("");
  useEffect(() => {
    StateService.getAllStateList()
      .then((data) => {
        setStates(data.data);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  }, []);

  useEffect(() => {
    CountryService.getAllCountryList()
      .then((data) => {
        setCountries(data.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    CityService.getAllCityList()
      .then((data) => {
        setCities(data.data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  // Function to process the application form data
  const processApplicationData = (e) => {
    ApplicationForm.getApplicationForm2ByUsername(userName)
      .then((response) => {
        const { indivAddressDTO } = response.data;
        const official = indivAddressDTO?.official || {};
        const residential = indivAddressDTO?.residential || {};

        // Create LocationDetails array
        const locationDetails = [];

        // Add official location details
        if (Object.keys(official).length > 0) {
          locationDetails.push({
            locationType: "Registered Office",
            blockNo: official.blockNo || "",
            village: official.village || "",
            postOffice: official.postOffice || "",
            subDivision: official.subDivision || "",
            country: official.country || "",
            city: official.city || "",
            state: official.state || "",
            pin: official.pin || "",
            userName: userName || "",
          });
        }

        // Set the state with the extracted data
        setCommunicationAddressFormValues((prevState) => ({
          ...prevState,
          locationType: official.locationType || "", // Assuming you still need this field
          userName: userName,
          LocationDetails: locationDetails, // Update LocationDetails array
        }));

        // Determine whether to check the same as official address checkbox
        const isChecked = e ? e.target.checked : true; // Default to true if not provided
        setSameAsOfficialAddress(isChecked);

        console.log(locationDetails);
        // Update selected and disabled location types
        const updatedDisabledLocationTypes = locationDetails.map(
          (detail) => detail.locationType,
        );
        console.log(
          "Updated Disabled Location Types:",
          updatedDisabledLocationTypes,
        ); // Debugging

        // Update selected location types, including "Registered Office"
        setSelectedLocationTypes((prevTypes) => [
          ...prevTypes,
          "Registered Office",
        ]);

        setDisabledLocationTypes((prevTypes) => [
          ...prevTypes,
          ...updatedDisabledLocationTypes,
        ]);
        // Filter states and cities based on official and residential countries/states
        if (official.country && official.state) {
          const filteredState = states.filter(
            (state) => state.countryId.countryId === parseInt(official.country),
          );
          setFilteredState(filteredState);

          const filteredCities = cities.filter(
            (city) => city.stateId.stateId === parseInt(official.state),
          );
          setFilteredCitie(filteredCities);
        }

        if (residential.country && residential.state) {
          const filteredStates = states.filter(
            (state) =>
              state.countryId.countryId === parseInt(residential.country),
          );
          setFilteredStates(filteredStates);

          const filteredCities = cities.filter(
            (city) => city.stateId.stateId === parseInt(residential.state),
          );
          setFilteredCities(filteredCities);
        }

        // Log updated values
        setTimeout(() => {
          console.log(
            "Updated communicationAddressFormValues:",
            communicationAddressFormValues,
          );
        }, 0);
      })
      .catch((err) => {
        console.log(err);
        // Handle error (e.g., navigate or display a message)
      });
  };

  console.log("Disabled Location Types:", disabledLocationTypes);

  // // Updated useEffect
  // useEffect(() => {
  //     if (userName) {
  //         console.log(userName);
  //         setLoading(true);

  //         ApplicationForm.getApplicationForm2ByUsername(userName)
  //             .then((response) => {
  //                 console.log(response.data);
  //                 processApplicationData(response.data);
  //             })
  //             .catch((err) => {
  //                 console.log(err);
  //                 // Handle error (e.g., navigate or display a message)
  //             })
  //             .finally(() => {
  //                 // setLoading(false);
  //             });
  //     } else {
  //         // Handle the case where `userName` is not available
  //         // Example: navigate('/admin/state', { replace: true });
  //     }
  // }, [userName, states, cities]);

  const locationTypeOptions = [
    {
      locationTypeName: "PR",
      isMandatory: true,
      fullName: "Primary Site Details",
    },
    {
      locationTypeName: "DR",
      isMandatory: true,
      fullName: "Disaster Recovery Site Details",
    },
    {
      locationTypeName: "Registered Office",
      isMandatory: false,
      fullName: "Registered Office Site Details",
    },
    {
      locationTypeName: "Other",
      isMandatory: false,
      fullName: "Other Site Details",
    },
  ];

  useEffect(() => {
    if (userName) {
      console.log(userName);
      setLoading(true);

      ApplicationForm.getApplicationForm5ByUsername(userName)
        .then((response) => {
          console.log(response.data);

          const formData = response.data;

          // Extract and map addressDTOList
          const addressDTOList = formData.addressDTOList || [];
          const locationMap = formData.LocationMap || [];

          // Map addressDTOList to match the form's structure
          const mappedAddressDetails = addressDTOList.map((address) => ({
            blockNo: address.blockNo || "",
            village: address.village || "",
            postOffice: address.postOffice || "",
            subDivision: address.subDivision || "",
            country: address.country || "",
            state: address.state || "",
            city: address.city || "",
            pin: address.pin || "",
            userName: userName || "", // Ensure userName is included
          }));

          // Map LocationMap and integrate locationType into the combined data
          const mappedLocationMap = locationMap.map((location) => ({
            locationType: location.locationName || "Unknown",
            addressId: location.addressId || "Unknown",
            locationId: location.locationId || "Unknown",
            intentAppId: location.intentAppId || "Unknown",
            userName: userName || "Unknown",
            certificationLevel: location.certificateLevel || "Unknown",
            companyName: location.companyName || "Unknown",
            certificateName: location.certificateFile || null,
          }));

          console.log("Mapped Address Details:", mappedAddressDetails);
          console.log("Mapped Location Map:", mappedLocationMap);

          // Filter LocationMap based on locationTypeOptions
          const filteredLocationMap = mappedLocationMap.filter((location) =>
            locationTypeOptions.some(
              (option) =>
                option.locationTypeName.trim() === location.locationType.trim(),
            ),
          );

          console.log("Filtered Location Map:", filteredLocationMap);
          // Combine mapped address details with location types
          const combinedLocationDetails = addressDTOList.map(
            (address, index) => {
              const matchingLocation = filteredLocationMap[index];

              console.log("Matching Location:", matchingLocation);

              return {
                ...address,
                locationType:
                  (matchingLocation && matchingLocation.locationType) ||
                  "Unknown",
                addressId:
                  (matchingLocation && matchingLocation.addressId) || "Unknown",
                locationId:
                  (matchingLocation && matchingLocation.locationId) ||
                  "Unknown",
                intentAppId:
                  (matchingLocation &&
                    matchingLocation.intentAppId.intentAppId) ||
                  "Unknown",
                userName:
                  (matchingLocation && matchingLocation.userName) || userName, // Ensure userName is included
                certificateName:
                  (matchingLocation && matchingLocation.certificateName) ||
                  null,
                certificationLevel:
                  (matchingLocation && matchingLocation.certificationLevel) ||
                  "Unknown",
                companyName:
                  (matchingLocation && matchingLocation.companyName) ||
                  "Unknown",
              };
            },
          );

          console.log("Combined Location Details:", combinedLocationDetails);

          // Get the filtered location types to disable
          const updatedDisabledLocationTypes = filteredLocationMap.map(
            (detail) => detail.locationType,
          );

          // Update the selected location types (if needed)
          setSelectedLocationTypes((prevTypes) => [
            ...prevTypes,
            communicationAddressFormValues.locationType,
          ]);
          // Disable already selected location types in the dropdown
          setDisabledLocationTypes((prevTypes) => [
            ...prevTypes,
            ...updatedDisabledLocationTypes,
          ]);
          // Update form values with combined location details
          setCommunicationAddressFormValues((prevValues) => ({
            ...prevValues,
            LocationDetails: combinedLocationDetails,
          }));

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
  }, [userName, states, cities]); // Removed locationType

  const [openEditModal, setOpenEditModal] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Handle specific field updates
    setCommunicationAddressFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Handle country change
    if (name === "country") {
      const filteredStates = states.filter(
        (state) => state.countryId.countryId === parseInt(value),
      );
      setFilteredState(filteredStates);
      // Clear city selection if country changes
      setCommunicationAddressFormValues((prevValues) => ({
        ...prevValues,
        state: "", // Reset state when country changes
        city: "", // Reset city when country changes
      }));
      setFilteredCitie([]); // Clear the filtered cities
    }

    // Handle state change
    if (name === "state") {
      const filteredCities = cities.filter(
        (city) => city.stateId.stateId === parseInt(value),
      );
      setFilteredCitie(filteredCities);
      // Clear city selection if state changes
      setCommunicationAddressFormValues((prevValues) => ({
        ...prevValues,
        city: "", // Reset city when state changes
      }));
    }
  };

  const handleBacks = () => {
    handleBack();
  };

  const validateForm = () => {
    const errors = {};

    // Validate blockNo
    if (!communicationAddressFormValues.blockNo) {
      errors.blockNo = errorMsg.blockNo.blank;
    } else if (
      communicationAddressFormValues.blockNo.length < 3 ||
      communicationAddressFormValues.blockNo.length > 20
    ) {
      errors.blockNo = errorMsg.blockNo.length;
    }

    // Validate village
    if (!communicationAddressFormValues.village) {
      errors.village = errorMsg.village.blank;
    } else if (
      communicationAddressFormValues.village.length < 3 ||
      communicationAddressFormValues.village.length > 50
    ) {
      errors.village = errorMsg.village.length;
    }

    // Validate postOffice
    if (!communicationAddressFormValues.postOffice) {
      errors.postOffice = errorMsg.postOffice.blank;
    } else if (
      communicationAddressFormValues.postOffice.length < 3 ||
      communicationAddressFormValues.postOffice.length > 50
    ) {
      errors.postOffice = errorMsg.postOffice.length;
    }

    // Validate subDivision
    if (!communicationAddressFormValues.subDivision) {
      errors.subDivision = errorMsg.subDivision.blank;
    } else if (
      communicationAddressFormValues.subDivision.length < 3 ||
      communicationAddressFormValues.subDivision.length > 50
    ) {
      errors.subDivision = errorMsg.subDivision.length;
    }

    // Validate country
    if (!communicationAddressFormValues.country) {
      errors.country = errorMsg.country.blank;
    }

    // Validate state
    if (!communicationAddressFormValues.state) {
      errors.state = errorMsg.state.blank;
    }
    if (!communicationAddressFormValues.certificationLevel) {
      errors.certificationLevel = errorMsg.certificationLevel.blank;
    }
    // Validate city
    if (!communicationAddressFormValues.city) {
      errors.city = errorMsg.city.blank;
    }
    if (!communicationAddressFormValues.companyName) {
      errors.companyName = errorMsg.companyName.blank;
    }
    // Validate pin
    if (!communicationAddressFormValues.pin) {
      errors.pin = errorMsg.pin.blank;
    } else if (!/^\d{6}$/.test(communicationAddressFormValues.pin)) {
      errors.pin = errorMsg.pin.format;
    }

    // Return errors object
    return errors;
  };

  const [locationType, setLocationType] = useState("");

  const [entries, setEntries] = useState([]);

  const clearLocationFormFields = (keepLocationType = false) => {
    setCommunicationAddressFormValues((prevValues) => ({
      ...prevValues,
      locationType: keepLocationType ? prevValues.locationType : "",
      blockNo: "",
      village: "",
      postOffice: "",
      subDivision: "",
      country: "",
      city: "",
      state: "",
      pin: "",
      companyName: "",
      certificationLevel: "",
      certificationDocument: null,
    }));
    setFileName1("");
    setFilteredState([]);
    setFilteredCitie([]);
    if (!keepLocationType) {
      setLocationType("");
    }
  };

  const removeLocationByType = (type) => {
    setCommunicationAddressFormValues((prevValues) => ({
      ...prevValues,
      LocationDetails: prevValues.LocationDetails.filter(
        (loc) => loc.locationType !== type,
      ),
    }));
    setDisabledLocationTypes((prevTypes) =>
      prevTypes.filter((t) => t !== type),
    );
    setSelectedLocationTypes((prevTypes) =>
      prevTypes.filter((t) => t !== type),
    );
  };

  const handleSitePresentChange = (event) => {
    const value = event.target.value;
    setSitePresent(value);

    if (value === "no") {
      if (locationType) {
        removeLocationByType(locationType);
      }
      clearLocationFormFields(true);
    }
  };

  const handleAddLocation = (e, forcedLocationType) => {
    e.preventDefault();
    const typeToAdd =
      forcedLocationType || communicationAddressFormValues.locationType;

    if (!typeToAdd) {
      return;
    }

    console.log("Current form values:", communicationAddressFormValues);

    // Validate the form fields
    const errors = validateForm();
    console.log("Form errors:", errors);

    if (Object.keys(errors).length === 0) {
      // Clear previous form errors
      setFormErrors({});

      // Create a new location object from the form values
      const newLocation = {
        locationType: typeToAdd,
        blockNo: communicationAddressFormValues.blockNo,
        village: communicationAddressFormValues.village,
        postOffice: communicationAddressFormValues.postOffice,
        subDivision: communicationAddressFormValues.subDivision,
        country: communicationAddressFormValues.country,
        city: communicationAddressFormValues.city,
        state: communicationAddressFormValues.state,
        pin: communicationAddressFormValues.pin,
        userName: communicationAddressFormValues.userName, // Persist userName
        companyName: communicationAddressFormValues.companyName, // Persist companyName
        certificationLevel: communicationAddressFormValues.certificationLevel, // Persist certificationLevel
        certificationDocument:
          communicationAddressFormValues.certificationDocument, // Persist certificationDocument
      };

      console.log("New location:", newLocation);

      // Replace existing entry for same type (PR/DR allow one entry each)
      setCommunicationAddressFormValues((prevValues) => {
        const withoutSameType = prevValues.LocationDetails.filter(
          (loc) => loc.locationType !== typeToAdd,
        );
        return {
          ...prevValues,
          LocationDetails: [...withoutSameType, newLocation],
        };
      });

      clearLocationFormFields(true);
      setCommunicationAddressFormValues((prevValues) => ({
        ...prevValues,
        locationType: typeToAdd,
      }));
      setLocationType(typeToAdd);

      setSelectedLocationTypes((prevTypes) => [
        ...prevTypes.filter((t) => t !== typeToAdd),
        typeToAdd,
      ]);
      setDisabledLocationTypes((prevTypes) => [
        ...prevTypes.filter((t) => t !== typeToAdd),
        typeToAdd,
      ]);
    } else {
      // If validation fails, set form errors
      setFormErrors(errors);
    }
  };
  const getCountryNameById = (id) => {
    const country = countries.find((c) => c.countryId === id);
    return country ? country.countryName : "Unknown";
  };

  const getStateNameById = (id) => {
    const state = states.find((s) => s.stateId === id);
    return state ? state.stateName : "Unknown";
  };

  const getCityNameById = (id) => {
    const city = cities.find((c) => c.cityId === id);
    return city ? city.cityName : "Unknown";
  };

  // Mutable ref to pass edit values back from the isolated EditComponent
  const editFormRef = React.useRef({});

  const menuPropsHighZ = {
    PaperProps: {
      sx: { zIndex: 10012 },
    },
    sx: { zIndex: 10012 },
  };

  const EditComponent = ({
    formValues,
    allCountries,
    allStates,
    allCities,
  }) => {
    const [localFormValues, setLocalFormValues] = React.useState(formValues);
    const [localFilteredStates, setLocalFilteredStates] = React.useState(() => {
      return allStates.filter(
        (state) => state.countryId.countryId === parseInt(formValues.country),
      );
    });
    const [localFilteredCities, setLocalFilteredCities] = React.useState(() => {
      return allCities.filter(
        (city) => city.stateId.stateId === parseInt(formValues.state),
      );
    });

    React.useEffect(() => {
      editFormRef.current = localFormValues;
    }, [localFormValues]);

    const handleLocalChange = (event) => {
      const { name, value } = event.target;
      let updatedValues = { ...localFormValues, [name]: value };

      if (name === "country") {
        const newStates = allStates.filter(
          (state) => state.countryId.countryId === parseInt(value),
        );
        setLocalFilteredStates(newStates);
        setLocalFilteredCities([]);
        updatedValues.state = "";
        updatedValues.city = "";
      }

      if (name === "state") {
        const newCities = allCities.filter(
          (city) => city.stateId.stateId === parseInt(value),
        );
        setLocalFilteredCities(newCities);
        updatedValues.city = "";
      }

      setLocalFormValues(updatedValues);
    };

    return (
      <>
        <TextField
          label="Location Type"
          name="locationType"
          value={localFormValues.locationType || ""}
          onChange={handleLocalChange}
          fullWidth
          disabled
        />
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <InputLabel shrink={false} htmlFor="blockNo">
              <Typography variant="body1">Flat/Door/Block No<span className="req-asterisk">*</span></Typography>
            </InputLabel>
            <TextField
              id="blockNo"
              margin="dense"
              required
              fullWidth
              placeholder="Flat/Door/Block No"
              name="blockNo"
              variant="outlined"
              onChange={handleLocalChange}
              value={localFormValues.blockNo || ""}
              size="small"
              inputProps={{ maxLength: 15 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel shrink={false} htmlFor="village">
              <Typography variant="body1">
                Name of Premises/Building/Village<span className="req-asterisk">*</span>
              </Typography>
            </InputLabel>
            <TextField
              id="village"
              margin="dense"
              required
              fullWidth
              placeholder="Name of Premises/Building/Village"
              name="village"
              variant="outlined"
              onChange={handleLocalChange}
              value={localFormValues.village || ""}
              size="small"
              inputProps={{ maxLength: 30 }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <InputLabel shrink={false} htmlFor="postOffice">
              <Typography variant="body1">
                Road/Street/Lane/Post Office<span className="req-asterisk">*</span>
              </Typography>
            </InputLabel>
            <TextField
              id="postOffice"
              margin="dense"
              required
              fullWidth
              placeholder="Road/Street/Lane/Post Office"
              name="postOffice"
              variant="outlined"
              onChange={handleLocalChange}
              value={localFormValues.postOffice || ""}
              size="small"
              inputProps={{ maxLength: 30 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel shrink={false} htmlFor="subDivision">
              <Typography variant="body1">
                Area/Locality/Taluka/Sub-Division<span className="req-asterisk">*</span>
              </Typography>
            </InputLabel>
            <TextField
              id="subDivision"
              margin="dense"
              required
              fullWidth
              placeholder="Area/Locality/Taluka/Sub-Division"
              name="subDivision"
              variant="outlined"
              onChange={handleLocalChange}
              value={localFormValues.subDivision || ""}
              size="small"
              inputProps={{ maxLength: 30 }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={3}>
            <InputLabel shrink={false} htmlFor="country">
              <Typography variant="body1">Country<span className="req-asterisk">*</span></Typography>
            </InputLabel>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ width: "100%", mt: 1 }}
            >
              <Select
                id="country"
                displayEmpty
                required
                value={localFormValues.country || ""}
                onChange={handleLocalChange}
                name="country"
                MenuProps={menuPropsHighZ}
              >
                <MenuItem disabled value="">
                  Select Country
                </MenuItem>
                {allCountries.map((country) => (
                  <MenuItem key={country.countryId} value={country.countryId}>
                    {country.countryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <InputLabel shrink={false} htmlFor="state">
              <Typography variant="body1">State/Province<span className="req-asterisk">*</span></Typography>
            </InputLabel>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ width: "100%", mt: 1 }}
            >
              <Select
                id="state"
                required
                displayEmpty
                value={localFormValues.state || ""}
                onChange={handleLocalChange}
                name="state"
                MenuProps={menuPropsHighZ}
              >
                <MenuItem disabled value="">
                  Select State/Province
                </MenuItem>
                {localFilteredStates.map((state) => (
                  <MenuItem key={state.stateId} value={state.stateId}>
                    {state.stateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <InputLabel shrink={false} htmlFor="city">
              <Typography variant="body1">District<span className="req-asterisk">*</span></Typography>
            </InputLabel>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ width: "100%", mt: 1 }}
            >
              <Select
                id="city"
                required
                displayEmpty
                value={localFormValues.city || ""}
                onChange={handleLocalChange}
                name="city"
                MenuProps={menuPropsHighZ}
              >
                <MenuItem disabled value="">
                  Select District
                </MenuItem>
                {localFilteredCities.map((city) => (
                  <MenuItem key={city.cityId} value={city.cityId}>
                    {city.cityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <InputLabel shrink={false} htmlFor="pin">
              <Typography variant="body1">Pin<span className="req-asterisk">*</span></Typography>
            </InputLabel>
            <TextField
              id="pin"
              margin="dense"
              required
              fullWidth
              placeholder="Pin"
              name="pin"
              variant="outlined"
              value={localFormValues.pin || ""}
              onChange={handleLocalChange}
              size="small"
              inputProps={{ maxLength: 6 }}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  const handleEditClick = (index) => {
    setEditIndex(index);

    const fvalues = {
      ...communicationAddressFormValues.LocationDetails[index],
    };

    // Initialize the ref with current values
    editFormRef.current = fvalues;

    showAlert({
      messageTitle: "Edit Address",
      messageContent: (
        <EditComponent
          formValues={fvalues}
          allCountries={countries}
          allStates={states}
          allCities={cities}
        />
      ),
      confirmText: "Update",
      onConfirm: () => handleUpdate(index),
      enableHeaderCloseBtn: true,
      disableOutsideKeyDown: true,
      maxWidth: "md",
      fullWidth: true,
    });

    // return updatedValues;sss
  };

  const handleUpdate = () => {
    // Read from the ref which is kept in sync by the isolated EditComponent
    const updatedEditValues = editFormRef.current;
    // Ensure to use the editIndex to update the correct item
    setCommunicationAddressFormValues((prevValues) => {
      const updatedList = [...prevValues.LocationDetails];
      updatedList[editIndex] = updatedEditValues; // Apply the changes from ref
      return {
        ...prevValues,
        LocationDetails: updatedList,
      };
    });

    // Close the modal or perform additional actions
    // hideAlert();  // Uncomment if you have a function to hide the alert/modal
  };

  const handleFileChange1 = (e) => {
    const file = e.target.files[0]; // Get the selected file
    let errorMessage = "";

    if (file) {
      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        errorMessage = "Only allowed file types are supported";
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        errorMessage = "File size must be less than 5MB";
      }

      // Set form errors if validation fails
      if (errorMessage) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          file1: errorMessage, // Setting the error for file1
        }));
      } else {
        // If no errors, clear the error message and update file
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          file1: "", // Clear any previous errors
        }));

        setCommunicationAddressFormValues((prevState) => ({
          ...prevState,
          certificationDocument: file, // Update the selected file in state
        }));

        setFileName1(file.name); // Update the file name for display
      }
    }
  };

  // const handleEditClick = (index) => {
  //     // Handle edit logic here
  //     console.log('Edit index:', index);
  // };
  // Delete an address
  const handleDeleteAddress = (index) => {
    const updatedLocationDetails =
      communicationAddressFormValues.LocationDetails.filter(
        (_, i) => i !== index,
      );
    const deletedLocationType =
      communicationAddressFormValues.LocationDetails[index].locationType;

    setCommunicationAddressFormValues((prevValues) => ({
      ...prevValues,
      LocationDetails: updatedLocationDetails,
    }));

    setDisabledLocationTypes(
      disabledLocationTypes.filter((type) => type !== deletedLocationType),
    );

    if (deletedLocationType === locationType) {
      setSitePresent("");
    }
  };
  console.log(communicationAddressFormValues);
  const [selectedLocationFullName, setSelectedLocationFullName] = useState("");
  const handleLocationTypeChange = (event) => {
    const { value } = event.target;

    setSitePresent("");
    setLocationType(value);

    const selectedOption = locationTypeOptions.find(
      (option) => option.locationTypeName === value,
    );

    setSelectedLocationFullName(selectedOption?.fullName || "");
    setCommunicationAddressFormValues((prevValues) => ({
      ...prevValues,
      locationType: value,
    }));
  };

  const getSitePresentLabel = () => {
    if (locationType === "PR") {
      return "Is PR site present?";
    }
    if (locationType === "DR") {
      return "Is DR site present?";
    }
    return "Do you have own Data Center (DC)?";
  };

  const locationFullName = locationTypeOptions.find(
    (option) => option.locationTypeName === locationType,
  );
  const [isLoading, setLoading] = useState(false);
  // const handleFormSubmit = (e) => {
  //     e.preventDefault();
  //             alert("next part");
  //             handleNext();
  // };

  const hasMandatorySiteEntry = (type) => {
    const entry = communicationAddressFormValues.LocationDetails.find(
      (location) => (location.locationType || "").trim() === type,
    );
    if (!entry) {
      return false;
    }
    return !!(
      entry.blockNo &&
      entry.village &&
      entry.postOffice &&
      entry.subDivision &&
      entry.country &&
      entry.state &&
      entry.city &&
      entry.pin &&
      entry.companyName &&
      entry.certificationLevel
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const hasPr = hasMandatorySiteEntry("PR");
    const hasDr = hasMandatorySiteEntry("DR");

    if (!hasPr || !hasDr) {
      showAlert({
        messageTitle: "Alert",
        messageContent: "PR sites & DR sites are mandatory.",
        confirmText: "Ok",
      });
      return;
    }

    setLoading(true);

    console.log(
      JSON.stringify(communicationAddressFormValues.LocationDetails),
    );

    const formData = new FormData();

      // // Predefined fields
      // formData.append('locationType', communicationAddressFormValues.locationType || '');
      // formData.append('blockNo', communicationAddressFormValues.blockNo || '');
      // formData.append('village', communicationAddressFormValues.village || '');
      // formData.append('postOffice', communicationAddressFormValues.postOffice || '');
      // formData.append('subDivision', communicationAddressFormValues.subDivision || '');
      // formData.append('country', communicationAddressFormValues.country || '');
      // formData.append('city', communicationAddressFormValues.city || '');
      // formData.append('state', communicationAddressFormValues.state || '');
      // formData.append('pin', communicationAddressFormValues.pin || '');
      // formData.append('userName', userName || ''); // assuming userName is defined
      // formData.append('intentAppId', '');
      // formData.append('addressId', '');
      // formData.append('locationId', '');
      // formData.append('certificationLevel', communicationAddressFormValues.certificationLevel || '');
      // formData.append('companyName', communicationAddressFormValues.companyName || '');

      // Append each item in the LocationDetails array
      communicationAddressFormValues.LocationDetails.forEach((item, index) => {
        formData.append(
          `locationDetails[${index}].locationType`,
          item.locationType || "",
        );
        formData.append(
          `locationDetails[${index}].blockNo`,
          item.blockNo || "",
        );
        formData.append(
          `locationDetails[${index}].village`,
          item.village || "",
        );
        formData.append(
          `locationDetails[${index}].postOffice`,
          item.postOffice || "",
        );
        formData.append(
          `locationDetails[${index}].subDivision`,
          item.subDivision || "",
        );
        formData.append(
          `locationDetails[${index}].country`,
          item.country || "",
        );
        formData.append(`locationDetails[${index}].city`, item.city || "");
        formData.append(`locationDetails[${index}].state`, item.state || "");
        formData.append(`locationDetails[${index}].pin`, item.pin || "");
        formData.append(`locationDetails[${index}].userName`, userName || ""); // assuming userName is defined
        formData.append(
          `locationDetails[${index}].intentAppId`,
          item.intentAppId || "",
        );
        formData.append(
          `locationDetails[${index}].addressId`,
          item.addressId || "",
        );
        formData.append(
          `locationDetails[${index}].locationId`,
          item.locationId || "",
        );
        formData.append(
          `locationDetails[${index}].certificationLevel`,
          item.certificationLevel || "",
        );
        formData.append(
          `locationDetails[${index}].companyName`,
          item.companyName || "",
        );
        if (item?.certificationDocument) {
          formData.append(
            `locationDetails[${index}].certificationDocument`,
            item.certificationDocument || "",
          );
        }
        formData.append(
          `locationDetails[${index}].certificateName`,
          item.certificationName || "",
        );
      });

      console.log(formData);

      ApplicationForm.addNewApplicationForm5(formData)
        .then((response) => {
          console.log(response.data); // Log the success response

          // Show a success alert, either for 'updated' or 'saved'
          const { messageTitle, messageContent } = getStepSuccessAlert(appTypeMasterId, 'location', false);
          showAlert({
            messageTitle,
            messageContent,
            confirmText: "Ok",
            onConfirm: () => {
              handleNext();
            },
          });
        })
        .catch((err) => {
          const errorAlert = getStepErrorAlert(appTypeMasterId, 'location', err);
          showAlert({
            messageTitle: errorAlert.messageTitle,
            messageContent: errorAlert.messageContent,
            confirmText: "Ok",
          });
        })
        .finally(() => {
          setLoading(false); // Set loading state to false after the operation completes
        });
  };

  const showLocationFormFields = locationType && sitePresent === "yes";

  return (
    <Box
      component="form"
      noValidate
      sx={{ mt: 2, p: 2 }}
      onSubmit={handleFormSubmit}
    >
      <Grid container spacing={2} sx={{ mt: 0.1 }}>
        <Grid item xs={12} sm={3}>
          <InputLabel shrink={false} htmlFor="locationType">
            <Typography variant="body1">Location Type<span className="req-asterisk">*</span></Typography>
          </InputLabel>
          <FormControl
            variant="outlined"
            size="small"
            sx={{ width: "100%", mt: 1 }}
          >
            <Select
              id="locationType"
              displayEmpty
              required
              value={communicationAddressFormValues.locationType}
              onChange={(e) => {
                setCommunicationAddressFormValues({
                  ...communicationAddressFormValues,
                  locationType: e.target.value,
                });
                handleLocationTypeChange(e);
              }}
              name="locationType"
              error={!!formErrors.locationType}
            >
              <MenuItem disabled value="">
                Select Location Type
              </MenuItem>
              {locationTypeOptions.map((option) => (
                <MenuItem
                  key={option.locationTypeName}
                  value={option.locationTypeName}
                  disabled={disabledLocationTypes.includes(
                    option.locationTypeName,
                  )}
                >
                  {option.locationTypeName}
                  {option.isMandatory ? " (Mandatory)" : ""}
                </MenuItem>
              ))}
            </Select>
            {formErrors.locationType && (
              <FormHelperText sx={{ ml: 0 }} error>
                {formErrors.locationType}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {locationType && (
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="body1">{getSitePresentLabel()}<span className="req-asterisk">*</span></Typography>
            <RadioGroup
              row
              value={sitePresent}
              onChange={handleSitePresentChange}
              sx={{ ml: 2 }}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>
        </Grid>
      )}

      {showLocationFormFields && (
        <>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", textAlign: "center", mt: 2 }}
            >
              {selectedLocationFullName}
            </Typography>
          </Grid>

          {locationType === "Registered Office" && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsOfficialAddress}
                      onChange={(e) => {
                        setSameAsOfficialAddress(e.target.checked);
                        processApplicationData(e); // Call the function with the event
                      }}
                      color="primary"
                    />
                  }
                  label="Address same as Official Address"
                />
              </Grid>
            </>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <InputLabel shrink={false} htmlFor="village">
                <Typography variant="body1">Name Of Company<span className="req-asterisk">*</span></Typography>
              </InputLabel>
              <TextField
                id="companyName"
                margin="dense"
                required
                fullWidth
                placeholder="Name Of Company"
                name="companyName"
                variant="outlined"
                onChange={handleInputChange}
                value={communicationAddressFormValues.companyName}
                error={!!formErrors.companyName}
                onKeyDown={(e) => validatePattern(e, /^[A-Za-z. ]+$/)}
                helperText={formErrors.companyName}
                size="small"
                inputProps={{ maxLength: 30 }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <InputLabel shrink={false} htmlFor="blockNo">
                <Typography variant="body1">Flat/Door/Block No<span className="req-asterisk">*</span></Typography>
              </InputLabel>
              <TextField
                id="blockNo"
                margin="dense"
                required
                fullWidth
                placeholder="Flat/Door/Block No"
                name="blockNo"
                variant="outlined"
                onChange={handleInputChange}
                value={communicationAddressFormValues.blockNo}
                error={!!formErrors.blockNo}
                helperText={formErrors.blockNo}
                onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9]+$/)}
                size="small"
                inputProps={{ maxLength: 15 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel shrink={false} htmlFor="village">
                <Typography variant="body1">
                  Name of Premises/Building/Village<span className="req-asterisk">*</span>
                </Typography>
              </InputLabel>
              <TextField
                id="village"
                margin="dense"
                required
                fullWidth
                placeholder="Name of Premises/Building/Village"
                name="village"
                variant="outlined"
                onChange={handleInputChange}
                value={communicationAddressFormValues.village}
                error={!!formErrors.village}
                onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                helperText={formErrors.village}
                size="small"
                inputProps={{ maxLength: 30 }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <InputLabel shrink={false} htmlFor="postOffice">
                <Typography variant="body1">
                  Road/Street/Lane/Post Office<span className="req-asterisk">*</span>
                </Typography>
              </InputLabel>
              <TextField
                id="postOffice"
                margin="dense"
                required
                fullWidth
                placeholder="Road/Street/Lane/Post Office"
                name="postOffice"
                variant="outlined"
                onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                onChange={handleInputChange}
                value={communicationAddressFormValues.postOffice}
                error={!!formErrors.postOffice}
                helperText={formErrors.postOffice}
                size="small"
                inputProps={{ maxLength: 30 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel shrink={false} htmlFor="subDivision">
                <Typography variant="body1">
                  Area/Locality/Taluka/Sub-Division<span className="req-asterisk">*</span>
                </Typography>
              </InputLabel>
              <TextField
                id="subDivision"
                margin="dense"
                required
                fullWidth
                placeholder="Area/Locality/Taluka/Sub-Division"
                name="subDivision"
                variant="outlined"
                onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9 ]+$/)}
                onChange={handleInputChange}
                value={communicationAddressFormValues.subDivision}
                error={!!formErrors.subDivision}
                helperText={formErrors.subDivision}
                size="small"
                inputProps={{ maxLength: 30 }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={3}>
              <InputLabel shrink={false} htmlFor="country">
                <Typography variant="body1">Country<span className="req-asterisk">*</span></Typography>
              </InputLabel>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ width: "100%", mt: 1 }}
              >
                <Select
                  id="country"
                  displayEmpty
                  required
                  value={communicationAddressFormValues.country}
                  onChange={handleInputChange}
                  name="country"
                  error={!!formErrors.country}
                >
                  <MenuItem disabled value="">
                    Select Country
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.countryId} value={country.countryId}>
                      {country.countryName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.country && (
                  <FormHelperText sx={{ ml: 0 }} error>
                    {formErrors.country}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <InputLabel shrink={false} htmlFor="state">
                <Typography variant="body1">State/Province<span className="req-asterisk">*</span></Typography>
              </InputLabel>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ width: "100%", mt: 1 }}
              >
                <Select
                  id="state"
                  required
                  displayEmpty
                  value={communicationAddressFormValues.state}
                  onChange={handleInputChange}
                  name="state"
                  error={!!formErrors.state}
                >
                  <MenuItem disabled value="">
                    Select State/Province
                  </MenuItem>
                  {filteredState.map((state) => (
                    <MenuItem key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.state && (
                  <FormHelperText sx={{ ml: 0 }} error>
                    {formErrors.state}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <InputLabel shrink={false} htmlFor="city">
                <Typography variant="body1">District<span className="req-asterisk">*</span></Typography>
              </InputLabel>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ width: "100%", mt: 1 }}
              >
                <Select
                  id="city"
                  required
                  displayEmpty
                  value={communicationAddressFormValues.city}
                  onChange={handleInputChange}
                  name="city"
                  error={!!formErrors.city}
                >
                  <MenuItem disabled value="">
                    Select District
                  </MenuItem>
                  {filteredCitie.map((city) => (
                    <MenuItem key={city.cityId} value={city.cityId}>
                      {city.cityName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.city && (
                  <FormHelperText sx={{ ml: 0 }} error>
                    {formErrors.city}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <InputLabel shrink={false} htmlFor="pin">
                <Typography variant="body1">Pin<span className="req-asterisk">*</span></Typography>
              </InputLabel>
              <TextField
                id="pin"
                margin="dense"
                required
                fullWidth
                placeholder="Pin"
                name="pin"
                onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                variant="outlined"
                onChange={handleInputChange}
                value={communicationAddressFormValues.pin}
                error={!!formErrors.pin}
                helperText={formErrors.pin}
                size="small"
                inputProps={{ maxLength: 6 }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0.1 }}>
            {/* Certification Level */}
            <Grid item xs={12} sm={6}>
              <InputLabel shrink={false} htmlFor="certificationLevel">
                <Typography variant="body1">Certification Level<span className="req-asterisk">*</span></Typography>
              </InputLabel>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ width: "100%", mt: 1 }}
              >
                <Select
                  id="certificationLevel"
                  required
                  displayEmpty
                  value={communicationAddressFormValues.certificationLevel}
                  onChange={handleInputChange} // Ensure this handles the change for the certification level
                  name="certificationLevel"
                  error={!!formErrors.certificationLevel} // Conditionally show error based on form validation
                >
                  <MenuItem disabled value="">
                    Select Certification Level
                  </MenuItem>
                  {/* Certification Level options */}
                  <MenuItem value="Level 1">Level 1</MenuItem>
                  <MenuItem value="Level 2">Level 2</MenuItem>
                  <MenuItem value="Level 3">Level 3</MenuItem>
                </Select>
                {/* Displaying form error */}
                {formErrors.certificationLevel && (
                  <FormHelperText sx={{ ml: 0 }} error>
                    {formErrors.certificationLevel}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* File Upload Section */}
            <Grid item xs={12} sm={6}>
              <InputLabel shrink={false} htmlFor="pdffile">
                <Typography variant="body1">
                  Upload Certificate Document (Only PDF and Max allowed size 5
                  MB)
                </Typography>
              </InputLabel>

              <Grid
                container
                direction="row"
                sx={{ border: "1px solid #cfcfcf", borderRadius: "5px", mt: 1 }}
              >
                <Grid item>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      key={fileInputKey1}
                      type="file"
                      name="certificationDocument"
                      accept="application/pdf"
                      onChange={handleFileChange1}
                    />
                  </Button>
                </Grid>

                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {fileName1 && (
                    <Tooltip title={fileName1} placement="top">
                      <Typography
                        variant="body2"
                        sx={{
                          display: "inline-block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        {fileName1}
                      </Typography>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>

              {formErrors.file1 && (
                <FormHelperText error>{formErrors.file1}</FormHelperText>
              )}
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, ml: 1 }}>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              color="primary"
              onClick={(e) => handleAddLocation(e, locationType)}
            >
              {locationType === "PR" || locationType === "DR"
                ? `Add ${locationType} Location`
                : "ADD"}
            </Button>
          </Box>
        </>
      )}

      <TableContainer sx={{ mt: 3 }}>
        <Table>
          {communicationAddressFormValues.LocationDetails.length > 0 && (
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "tablecolor.main",
                  color: "tablecolor.text",
                }}
              >
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  Location Type
                </TableCell>
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  Block No
                </TableCell>
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  Village
                </TableCell>
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  Post Office
                </TableCell>
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  Subdivision
                </TableCell>
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  Country
                </TableCell>
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  State
                </TableCell>
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  City
                </TableCell>
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  PinCode
                </TableCell>
                <TableCell
                  sx={{
                    border: 0.5,
                    borderColor: "grey.500",
                    fontWeight: "bold",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {communicationAddressFormValues.LocationDetails.map(
              (location, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    {location.locationType}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    {location.blockNo}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    {location.village}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    {location.postOffice}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    {location.subDivision}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    {getCountryNameById(parseInt(location.country))}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    {getStateNameById(parseInt(location.state))}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    {getCityNameById(parseInt(location.city))}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    {location.pin}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    <IconButton onClick={() => handleEditClick(index)}>
                      <EditIcon color="info" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteAddress(index)}>
                      <DeleteIcon color="info" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 3, ml: 1 }}
      >
        <Button
          onClick={handleBacks}
          sx={{ mr: 1 }}
          variant="contained"
          color="primary"
        >
          Back
        </Button>

        <Button type="submit" variant="contained" color="primary">
          Save & Next
        </Button>
      </Box>

      <Grid item xs={12}>
        <InputLabel shrink={false}>
          <Typography variant="body1">
            Note: <span className="req-asterisk">*</span> marked field are mandatory to be filled
          </Typography>
        </InputLabel>
      </Grid>
    </Box>
  );
};

export default Location;
