import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Typography, Button, Box, Grid, RadioGroup, Radio, FormControlLabel, TableCell, Table, TableBody, TableContainer, TableHead, TableRow, IconButton, Checkbox, TextField ,Link, TextareaAutosize, Divider, FormHelperText, Collapse, Tabs, Tab, AppBar} from '@mui/material';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import DownloadIcon from '@mui/icons-material/Download';
import CityService from '../../../../service/AdminService/CityService';
import CountryService from '../../../../service/AdminService/CountryService';
import StateService from '../../../../service/AdminService/StateService';
import { useSelector } from 'react-redux';
import showAlert from '../../../global/common/MessageBox/AlertService';
import ApplicationReview from '../../../../service/NewLicenseService/ApplicationReview';
import CustomTabPanel from '../../../global/util/CustomTabPanel';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoaderProgress from '../../../global/common/LoaderProgress';
import dateFormatter from '../../../global/util/DateFormatter';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import GovernmentAgencyForm from '../../../../service/NewLicenseService/GovernmentAgencyForm';

const errorMsg = {

  issue: {
    blank: "At least one item must be marked for review.",
  },

  remarks: {
    blank: "Kindly provide your remarks.",
    format: "Only alphabets, numbers and the characters ,./ are allowed",
    length: "Minimum 3 characters and Maximum 500 characters are allowed."
  },

  captchaError: {
    blank: "Please enter captcha."
  },
};

const MAX_FILE_SIZE_MB = 5;

const GovernmentViewData = ()=> {

  const {id} = useParams();
   const userName = decrypt(id);
  console.log(userName);
  const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

  const reviewerUserName = useSelector((state)=>state.jwtAuthentication.username);
  const [checkedRows, setCheckedRows] = useState({
    userName:userName,
    reviewerUserName:reviewerUserName,
  });






  
   const [tabValue, setTabValue] = useState(0);
 const [collapseItem, setCollapseItem] = useState([]);
  const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({});

    // Get the first application form by userName
    useEffect(() => {
      if (userName) {
        setLoading(true);
        GovernmentAgencyForm.getAllGovernmentAgency(userName)
          .then((response) => {
            // Log the entire response data
            console.log(response.data);
            
            // Extracting appGovtOrganizationApplication and residential data
            const { appGovtOrganizationApplication, indivAddressDTO } = response.data;
    
            // Set residential and appGovtOrganizationApplication data into the form values
            setBasicDetailsFormValues({
              residential: indivAddressDTO?.residential || {}, // Set residential address data
              appGovtOrganizationApplication: appGovtOrganizationApplication || {}, // Set appGovtOrganizationApplication data
            });
          })
          .catch((error) => {
            console.error("Error fetching application form:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [userName]);



  //   const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({})
  //   // get first application form by userName
  //   useEffect(() => {
  //     if (userName) {
  //         setLoading(true);
  //         ApplicationForm.getApplicationFormByUsername(userName)
  //             .then((response) => {
                  
  //                     setBasicDetailsFormValues(response.data); // Set the parsed or direct object
                  
  //             })
  //             .catch((error) => {
  //                 console.error("Error fetching application form:", error);
  //             })
  //             .finally(() => {
  //                 setLoading(false);
  //             });
  //     }
  // }, [userName]);


  const [basicDetailesValues, setBasicDetailesValues] = useState({});



  useEffect(() => {
    if (userName) {
      console.log("Fetching data for userName:", userName);
    
      ApplicationReview.getApplicationForm6ByUsername(userName)
        .then((response) => {
          console.log("API Response:", response.data);
          setBasicDetailesValues(response.data);
        })
        .catch((error) => {
          console.error("Error fetching application form:", error);
        })
        .finally(() => {
         
        });
    }
  }, [userName]);
  
  
    console.log("Updated basicDetailesValues:", basicDetailesValues); 
  
  console.log(basicDetailesValues?.reviewApplications)







  
console.log(basicDetailsFormValues)
const [basicDetailsFormValues2, setBasicDetailsFormValues2] = useState({ residentialAddress: {},
  officialAddress: {}})
  // get second application form by userName
  useEffect(() => {
    if (userName) {
        console.log(userName);
        setLoading(true);

        ApplicationForm.getApplicationForm2ByUsername(userName)
            .then((response) => {
                console.log(response.data);

                const { indivAddressDTO } = response.data;

                // Assuming indivAddressDTO has residential and official addresses
                const residentialAddress = indivAddressDTO.residential;
                const officialAddress = indivAddressDTO.official;

                // Set state with both residential and official addresses
                setBasicDetailsFormValues2({
                    ...response.data, // Include other relevant data if needed
                    residentialAddress, // Set residential address
                    officialAddress // Set official address
                });
            })
            .catch((err) => {
                console.error(err);
                // Handle error (e.g., navigate or display a message)
            })
            .finally(() => {
                setLoading(false); // Ensure loading state is set to false
            });
    } else {
        // Handle the case where `userName` is not available
        // Example: navigate('/admin/state', { replace: true });
    }
}, [userName]);
console.log(basicDetailsFormValues2)

const [basicDetailsFormValues3, setBasicDetailsFormValues3] = useState({indivAdditionalDetails:{},
  applicationDocument:[]
})
 // get third application form by userName
 useEffect(() => {
  if (userName) {
      setLoading(true);
      ApplicationForm.getApplicationForm3ByUsername(userName)
          .then((response) => {
              console.log(response.data);
              const { indivAdditionalDetails, applicationDocument } = response.data;

              

              // Set the state with the extracted data
              setBasicDetailsFormValues3({
                  indivAdditionalDetails,
                  applicationDocument,
              });
          })
          .catch((err) => {
              console.error(err);
              // Handle error (optional)
          })
          .finally(() => {
              setLoading(false);
          });
  }
}, [userName]);

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




const getCountryNameById = (id) => {
  const country = countries.find(c => c.countryId === parseInt(id));
  return country ? country.countryName : 'Unknown';
};

const getStateNameById = (id) => {
  
  const state = states.find(s => s.stateId === parseInt(id));
  return state ? state.stateName : 'Unknown';
};

const getCityNameById = (id) => {
  const city = cities.find(c => c.cityId === parseInt(id));
  return city ? city.cityName : 'Unknown';
};

const formatDate = (dateString) => {
  if (!dateString) return ''; // Handle cases where dateString is null or undefined

  const date = new Date(dateString);
  
  // Ensure the date is valid
  if (isNaN(date.getTime())) return ''; // Invalid date

  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with zero
  const year = date.getFullYear(); // Get year

  return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
};
 // get Fourth application form by userName
 const [bankDetails, setBankDetails] = useState(null);
  const [bankDraft, setBankDraft] = useState(null);

  useEffect(() => {
    if (userName) {
      setLoading(true);

      ApplicationForm.getApplicationForm4ByUsername(userName)
        .then((response) => {
          console.log(response.data);

          const {
            bankDetails: responseBankDetails,
            bankDraft: responseBankDraft,
          } = response.data;

          // Set bank details and bank draft in state
          setBankDetails(responseBankDetails);
          setBankDraft(responseBankDraft);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userName]);

// get Fifth application form by userName
const [mappedLocations, setMappedLocations] = useState([]);
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

              // Map locationMap and find matching addressDTOList based on addressId
              const mappedLocations = locationMap
                  .map((location) => {
                      const matchingAddress = addressDTOList.find(
                          (address) => address.addressId === location.addressId
                      );

                      // Only return location if a matchingAddress is found
                      if (matchingAddress) {
                          return {
                              ...location,
                              matchingAddress,
                          };
                      }
                      return null; // Return null for locations without matching address
                  })
                  .filter((location) => location !== null); // Filter out locations that don't have a matching address

              // Set the mapped locations in state
              setMappedLocations(mappedLocations);
          })
          .catch((err) => {
              console.log(err);
              // Handle error (e.g., navigate or display a message)
          })
          .finally(() => {
              setLoading(false);
          });
  }
}, [userName]);








// get Sixth application form by userName
const [cpsDocument, setCpsDocument] = useState(null);

    useEffect(() => {
        if (userName) {
            setLoading(true);
            ApplicationForm.getApplicationForm6ByUsername(userName)
                .then((response) => {
                    console.log(response.data);
                    const documents = response.data.documents;

                    // Filter for CPSDocument
                    const cpsDoc = documents.find(doc => doc.documentTitle === "CPSDocument");
                    setCpsDocument(cpsDoc);  // Set the CPSDocument if found
                })
                .catch((err) => {
                    console.error(err);
                    // Handle error
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [userName]);

if (!basicDetailsFormValues || Object.keys(basicDetailsFormValues).length === 0) {
  return <Typography>No data available</Typography>;
}

// const handleViewDocument = async (appDocId,documentTitle) => {
//   try {
//       const response = await ApplicationForm.viewFile(appDocId);
//       console.log(response.data);
//       const blob = new Blob([response.data], { type: response.headers['content-type'] });

//       // Create a link element
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);

//       // Extract the filename from the Content-Disposition header
//       const contentDisposition = response.headers['content-disposition'];

//       console.log(JSON.stringify(contentDisposition))

//       const filename = documentTitle;

//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//   } catch (error) {
//       console.error('Error fetching document:', error);
//   }
// };


const handleDownload = async (appDocId, documentTitle) => {
  try {
      // Fetch the file from the server
      const response = await ApplicationForm.viewFile(appDocId);

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      // Extract the filename from the Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];

      console.log(JSON.stringify(contentDisposition))

      const filename = documentTitle;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  } catch (error) {
      console.error('Error downloading file:', error);
  }
};




    const getEmailAddresses = (emailIdArray) => {
        if (Array.isArray(emailIdArray) && emailIdArray.length > 0) {
          return emailIdArray.map(item => item.email).join(', ');
        }
        return 'No emails provided';
      };

      const handleCheckboxChange = (event, row) => {
        setCheckedRows((prev) => ({
          ...prev,
          [row]: event.target.checked ? row : null, // Store the row name if checked, otherwise set to null
        }));
      };
      
      const handleCheckboxChanges = (event, rowId, appDocId) => {

        const obj = checkedRows[rowId];
        
        let updatedObj = null;
        if(obj){
            updatedObj = {...checkedRows};
            delete updatedObj[rowId];
            setCheckedRows((updatedObj));
            
        }else{

          // Update the checkedRows state based on the checkbox state
          setCheckedRows((prevCheckedRows) => ({
            ...prevCheckedRows,
            [rowId]: appDocId,
          }));

        }
        
       
      };
      
      


      const handleChanges = (e, fieldName) => {
        const { value } = e.target;
        setCheckedRows((prevValues) => ({
          ...prevValues,
          [fieldName]: value,
        }));
      };
    
      console.log("checkedRowss====>",checkedRows)

      const handleFormSubmit = () => {
        ApplicationReview.addNewIndividualReview(checkedRows)
            .then((response) => {
                console.log(response.data);
                showAlert({
                    messageTitle: 'Submitted',
                    messageContent: "Data to be submitted to user",
                    confirmText: 'Ok',
                });
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: err.response?.data 
                        ? (typeof err.response.data === 'object' 
                            ? 'Your request cannot be processed at this time. Please try again later.' 
                            : err.response.data)
                        : 'Your request cannot be processed at this time. Please try again later.',
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);  // Set loading state to false after the operation completes
            });
    };

  const handleTabChange = (e, newValue) => {

    setTabValue(newValue);

  };


  const allyProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  const handleBack = () => {
   // navigate(`${routeRootPath}/espreviewapp`, { replace: true })
  }

 
  // get first application form by userName

  const handleRejectedSubmit = (e) => {
    e.preventDefault();
    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure you want to submit?",
      confirmText: "Yes",
      closeText: "No",
      fullWidth: true,
      maxWidth: "sm",
      onConfirm: () => handleConfrimSubmit(),
    });
  };
  
  
  
  
  
  const handleConfrimSubmit = () => {
    
    ApplicationReview.addGovernmentAgencyApplicationReveiw(checkedRows)
    .then((response) => {
      //console.log(response.data)
        showAlert({
            messageTitle: 'Success',
            messageContent: response.data,
            confirmText: 'Ok',
            onConfirm: () => window.location.href = '/applicationreviewcommittee/newapplication',
        });
        
    })
    .catch((err) => {
        const errorMessage = err.response?.data?.message || 'Request failed. Please try again later.';
        showAlert({
            messageTitle: 'Error',
            messageContent: errorMessage,
            confirmText: 'Ok',
        });
    })
    .finally(() => setLoading(false));
  
  }
  
  const handleApprovedSubmit = (e) => {
    e.preventDefault();
  
    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure you want to submit?",
      confirmText: "Yes",
      closeText: "No",
      fullWidth: true,
      maxWidth: "sm",
      onConfirm: () => handleSubmit(),
    });
  };
  
  
  
  
  
  const handleSubmit = () => {
    
   
    ApplicationReview.addGovernmentAgencyApplicationReveiw(checkedRows)
    .then((response) => {
        showAlert({
            messageTitle: 'Success',
            messageContent: response.data,
            confirmText: 'Ok',
            onConfirm: () => window.location.href = '/applicationreviewcommittee/newapplication',
        });
        
    })
    .catch((err) => {
        const errorMessage = err.response?.data?.message || 'Request failed. Please try again later.';
        showAlert({
            messageTitle: 'Error',
            messageContent: errorMessage,
            confirmText: 'Ok',
        });
    })
    .finally(() => setLoading(false));
  
  } 


  return (
    <Box p={3}>
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

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="tabs"
        variant="fullWidth"
      >

        <Tab
          label="Review Application"
          {...allyProps(0)}
        />

        <Tab
          label="Previous Reviewed Details"
          {...allyProps(1)}
        />

      </Tabs>



      <CustomTabPanel value={tabValue} index={0}>
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} autoComplete>
  <Box sx={{ width: '100%', padding: 2 }}>
          {/* Title Section */}
          <Typography variant="h4" sx={{ display: 'inline-block' }}>
    For Government Ministry/Department/Agency/Authority
</Typography>
<Box sx={{ borderBottom: '2px solid #000', width: '76%', marginTop: '1px' }} />

    
        {/* Organisation Details Section */}
<Typography variant="h6" style={{ marginTop: '10px' }}>
  28. Particulars of Organisation: *
</Typography>

{/* Name of Organisation */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name of Organisation:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.orgName || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['orgName'] || false}
        onChange={(e) => handleCheckboxChange(e, 'orgName')}
        inputProps={{ 'aria-label': 'Organisation Name Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Administrative Ministry/Department */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Administrative Ministry/Department:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.administrativeMinistry || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['administrativeMinistry'] || false}
        onChange={(e) => handleCheckboxChange(e, 'administrativeMinistry')}
        inputProps={{ 'aria-label': 'Administrative Ministry Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Under State/Central Government */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Under State/Central Government:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.orgType || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['orgType'] || false}
        onChange={(e) => handleCheckboxChange(e, 'orgType')}
        inputProps={{ 'aria-label': 'Government Type Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Flat/Door/Block No. */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Flat/Door/Block No.:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.residential?.blockNo || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['blockNo'] || false}
        onChange={(e) => handleCheckboxChange(e, 'blockNo')}
        inputProps={{ 'aria-label': 'Block No Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Name of Premises/Building/Village */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name of Premises/Building/Village:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.residential?.village || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['village'] || false}
        onChange={(e) => handleCheckboxChange(e, 'village')}
        inputProps={{ 'aria-label': 'Village Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Fax */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Fax No.:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.fax || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['fax'] || false}
        onChange={(e) => handleCheckboxChange(e, 'fax')}
        inputProps={{ 'aria-label': 'Fax Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Telephone No. */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Telephone No.:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.telephoneNo || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['telephoneNo'] || false}
        onChange={(e) => handleCheckboxChange(e, 'telephoneNo')}
        inputProps={{ 'aria-label': 'Telephone No. Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Web page URL Address */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Web page URL Address:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.webPageURL || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['webPageURL'] || false}
        onChange={(e) => handleCheckboxChange(e, 'webPageURL')}
        inputProps={{ 'aria-label': 'Web page URL Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Name Of Head */}

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name of the Head of Organisation:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
      {`${basicDetailsFormValues?.appGovtOrganizationApplication?.firstName || ''} ${basicDetailsFormValues?.appGovtOrganizationApplication?.middleName || ''} ${basicDetailsFormValues?.appGovtOrganizationApplication?.lastName || ''}`.trim() || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['nameOfHead'] || false}
        onChange={(e) => handleCheckboxChange(e, 'nameOfHead')}
        inputProps={{ 'aria-label': 'Name of the Head Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Designation */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Designation:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.designation || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['designation'] || false}
        onChange={(e) => handleCheckboxChange(e, 'designation')}
        inputProps={{ 'aria-label': 'Designation Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* E-mail Address */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">E-mail Address:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.emailId || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['emailId'] || false}
        onChange={(e) => handleCheckboxChange(e, 'emailId')}
        inputProps={{ 'aria-label': 'Email Address Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

         
  <Box sx={{ width: '100%' }}>
      {/* Bank Details Section */}
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        29. Bank Details
      </Typography>
      <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Bank Name*:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDetails?.bankName || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['bankName'] || false}
        onChange={(e) => handleCheckboxChange(e, 'bankName')}
        inputProps={{ 'aria-label': 'Bank Name Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Branch*:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDetails?.branchName || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['branchName'] || false}
        onChange={(e) => handleCheckboxChange(e, 'branchName')}
        inputProps={{ 'aria-label': 'Branch Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Bank Account No.*:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDetails?.bankAccountNo || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['bankAccountNo'] || false}
        onChange={(e) => handleCheckboxChange(e, 'bankAccountNo')}
        inputProps={{ 'aria-label': 'Bank Account No Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Type of Bank Account*:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDetails?.bankAccountType || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['bankAccountType'] || false}
        onChange={(e) => handleCheckboxChange(e, 'bankAccountType')}
        inputProps={{ 'aria-label': 'Bank Account Type Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>



      {/* Bank Draft Section */}
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        30. Whether bank draft/pay order for licence fee enclosed: {bankDraft ? 'Y' : 'N'}
      </Typography>

      {bankDraft && (
        <>
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name of Bank:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDraft?.bankName || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['bankName'] || false}
        onChange={(e) => handleCheckboxChange(e, 'bankName')}
        inputProps={{ 'aria-label': 'Bank Name Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Draft/Pay Order No.:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDraft?.draftNumber || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['draftNumber'] || false}
        onChange={(e) => handleCheckboxChange(e, 'draftNumber')}
        inputProps={{ 'aria-label': 'Draft Number Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Date of Issue:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDraft?.issueDate || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['issueDate'] || false}
        onChange={(e) => handleCheckboxChange(e, 'issueDate')}
        inputProps={{ 'aria-label': 'Issue Date Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Amount:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDraft?.amount || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['amount'] || false}
        onChange={(e) => handleCheckboxChange(e, 'amount')}
        inputProps={{ 'aria-label': 'Amount Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

        </>
      )}
    </Box>
    <Box>
    <Typography variant="h6" gutterBottom style={{ marginTop: '10px' }}>
            31.  Location of facility in India for generation of Digital Signature Certificate *
          </Typography>
    <TableContainer>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Location Type</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Block No</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Village</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Post Office</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Subdivision</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Country</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>State</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>City</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>PinCode</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {mappedLocations && mappedLocations.length > 0 ? (
          mappedLocations.map((location, index) => (
            <TableRow key={index}>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.locationName}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.blockNo || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.village || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.postOffice || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.subDivision || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{getCountryNameById(location.matchingAddress.country || '-')}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{getStateNameById(location.matchingAddress.state || '-')}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{getCityNameById(location.matchingAddress.city || '-')}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.pin || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}><Checkbox
                checked={checkedRows[location.locationName] || false}
                onChange={(e) => handleCheckboxChange(e, location.locationName)}
                inputProps={{ 'aria-label': `Select ${location.locationName}` }}
              /></TableCell>
              
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={10} sx={{ textAlign: 'center' }}>No data available</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
  </Box>
  <Box style={{ marginTop: '10px' }}>
  <Typography variant="h6" sx={{ display: 'inline'}} >
    32. Public Key @: 
  </Typography>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Public Key:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1" sx={{ display: 'inline' }}>
            {basicDetailsFormValues?.appGovtOrganizationApplication?.publicKey || 'N/A'}
        </Typography>
    </Grid>
</Grid>

</Box>

<Box>
<Grid container alignItems="center" sx={{ marginTop: '10px' }}>
  <Grid item sm={8}>
    <Typography variant="h6" sx={{ display: 'inline' }}>
      34. Whether Certification Practice Statement is enclosed *:
    </Typography>
  </Grid>
  <Grid item sm={4}>
    <Box display="flex" alignItems="center">
      <Typography variant="body1" sx={{ marginRight: '12px' }}>
        {cpsDocument ? 'Y' : 'N'}
      </Typography>
      {cpsDocument && (
        <Link
          onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)}
          sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '12px' }} // Increased margin
        >
          View
        </Link>
      )}
       <Checkbox
      checked={checkedRows['firmCPSDocument'] || false}
      onChange={(e) => handleCheckboxChanges(e, 'firmCPSDocument', cpsDocument.appDocId)} // Pass appDocId here
      inputProps={{ 'aria-label': 'Certification Practice Statement Checkbox' }}
    />
    </Box>
  </Grid>
</Grid>

</Box>


          {/* Undertakings Section */}
          <Typography variant="h6" gutterBottom style={{ marginTop: '10px' }}>
            Undertakings:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Typography variant="body1"sx={{ lineHeight: 1.5, letterSpacing: '0.5px' }}>
                  { "1. Whoever makes any misrepresentation to, or suppresses any material fact from the Controller or the Certifying Authority for obtaining any licence or Electronic Signature Certificate, as the case may be, shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
    
           {/* Notes Section */}
           <Grid container spacing={2}>
  <Grid item xs={12}>
    <Typography variant="h6" style={{ marginTop: '10px' }}>
      Remarks
    </Typography>
    <TextField
      multiline
      rows={4} // Adjust the number of rows as needed
      variant="outlined"
      fullWidth
      onChange={(e) => handleChanges(e, 'remarks')} // Pass appDocId here
      InputProps={{
        style: {
          padding: '10px', // Ensure there's enough padding
        },
      }}
    />
  </Grid>
</Grid>
        </Box>


          <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
                     <Grid item>
                       <Button
                         type="submit"
                         variant="contained"
                         sx={{ maxWidth: '120px', height: '40px' }}
                         //onClick={R}
                         aria-label="Submit"
                        onClick={handleRejectedSubmit}
                       >
                         Approval
                       </Button>
                     </Grid>
                     <Grid item>
                       <Button
                         type="button"
                         variant="contained"
                         sx={{ maxWidth: '120px', height: '40px', color: '#FFFFFF', backgroundColor: 'black' }}
                         aria-label="Reset"
                        onClick={handleApprovedSubmit}
                       >
                  {2<=  basicDetailesValues?.reviewApplications.length? 'Recommand for Rejection' : 'Rejected'}
                       </Button>
                     </Grid>
                   </Grid>
     

    </Box>

    
    </CustomTabPanel >

  <CustomTabPanel value={tabValue} index={1}>

  {
     basicDetailesValues?.reviewApplications && Array.isArray(basicDetailesValues?.reviewApplications) && basicDetailesValues?.reviewApplications.length > 0 ? (<>
    {
      basicDetailesValues?.reviewApplications.map((element, index)=>(
      
   

            <Box sx={{ mb: 1, pb: 2, color: 'primary.text' }} key={index}>

              <Box sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "primary.main", p: 1,
                borderRadius: '5px',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;', cursor: 'pointer'
              }}

                onClick={() =>
                  setCollapseItem((prev) => {
                    const newCollapseItem = [...prev];
                    newCollapseItem[index] = !newCollapseItem[index];
                    return newCollapseItem;
                  })
                }

              >
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Reviewd on {dateFormatter(Date.now())}
                </Typography>
                <IconButton

                  sx={{
                    backgroundColor: "transparent",
                    '&:hover': {
                      backgroundColor: "transparent"
                    },
                    fontSize: '20px',
                    color: 'primary.text'
                  }}>
                  {/* {collapseItem[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />} */}
                </IconButton>


              </Box>

              <Collapse in={collapseItem[index]} sx={{ pl: 1, pr: 1, backgroundColor: 'primary.light', color: 'bodycolor.text' }}>



             <Box sx={{ width: '100%', padding: 2 }}>
          {/* Title Section */}
          <Typography variant="h4" sx={{ display: 'inline-block' }}>
    For Government Ministry/Department/Agency/Authority
</Typography>
<Box sx={{ borderBottom: '2px solid #000', width: '76%', marginTop: '1px' }} />

    
        {/* Organisation Details Section */}
<Typography variant="h6" style={{ marginTop: '10px' }}>
  28. Particulars of Organisation: *
</Typography>

{/* Name of Organisation */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name of Organisation:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.orgName || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['orgName'] || false}
        onChange={(e) => handleCheckboxChange(e, 'orgName')}
        inputProps={{ 'aria-label': 'Organisation Name Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Administrative Ministry/Department */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Administrative Ministry/Department:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.administrativeMinistry || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['administrativeMinistry'] || false}
        onChange={(e) => handleCheckboxChange(e, 'administrativeMinistry')}
        inputProps={{ 'aria-label': 'Administrative Ministry Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Under State/Central Government */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Under State/Central Government:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.orgType || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['orgType'] || false}
        onChange={(e) => handleCheckboxChange(e, 'orgType')}
        inputProps={{ 'aria-label': 'Government Type Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Flat/Door/Block No. */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Flat/Door/Block No.:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.residential?.blockNo || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['blockNo'] || false}
        onChange={(e) => handleCheckboxChange(e, 'blockNo')}
        inputProps={{ 'aria-label': 'Block No Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Name of Premises/Building/Village */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name of Premises/Building/Village:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.residential?.village || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['village'] || false}
        onChange={(e) => handleCheckboxChange(e, 'village')}
        inputProps={{ 'aria-label': 'Village Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Fax */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Fax No.:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.fax || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['fax'] || false}
        onChange={(e) => handleCheckboxChange(e, 'fax')}
        inputProps={{ 'aria-label': 'Fax Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Telephone No. */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Telephone No.:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.telephoneNo || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['telephoneNo'] || false}
        onChange={(e) => handleCheckboxChange(e, 'telephoneNo')}
        inputProps={{ 'aria-label': 'Telephone No. Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Web page URL Address */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Web page URL Address:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.webPageURL || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['webPageURL'] || false}
        onChange={(e) => handleCheckboxChange(e, 'webPageURL')}
        inputProps={{ 'aria-label': 'Web page URL Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Name Of Head */}

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name of the Head of Organisation:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
      {`${basicDetailsFormValues?.appGovtOrganizationApplication?.firstName || ''} ${basicDetailsFormValues?.appGovtOrganizationApplication?.middleName || ''} ${basicDetailsFormValues?.appGovtOrganizationApplication?.lastName || ''}`.trim() || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['nameOfHead'] || false}
        onChange={(e) => handleCheckboxChange(e, 'nameOfHead')}
        inputProps={{ 'aria-label': 'Name of the Head Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* Designation */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Designation:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.designation || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['designation'] || false}
        onChange={(e) => handleCheckboxChange(e, 'designation')}
        inputProps={{ 'aria-label': 'Designation Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

{/* E-mail Address */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">E-mail Address:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.emailId || 'N/A'}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['emailId'] || false}
        onChange={(e) => handleCheckboxChange(e, 'emailId')}
        inputProps={{ 'aria-label': 'Email Address Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

         
  <Box sx={{ width: '100%' }}>
      {/* Bank Details Section */}
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        29. Bank Details
      </Typography>
      <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Bank Name*:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDetails?.bankName || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['bankName'] || false}
        onChange={(e) => handleCheckboxChange(e, 'bankName')}
        inputProps={{ 'aria-label': 'Bank Name Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Branch*:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDetails?.branchName || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['branchName'] || false}
        onChange={(e) => handleCheckboxChange(e, 'branchName')}
        inputProps={{ 'aria-label': 'Branch Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Bank Account No.*:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDetails?.bankAccountNo || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['bankAccountNo'] || false}
        onChange={(e) => handleCheckboxChange(e, 'bankAccountNo')}
        inputProps={{ 'aria-label': 'Bank Account No Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Type of Bank Account*:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDetails?.bankAccountType || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['bankAccountType'] || false}
        onChange={(e) => handleCheckboxChange(e, 'bankAccountType')}
        inputProps={{ 'aria-label': 'Bank Account Type Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>



      {/* Bank Draft Section */}
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        30. Whether bank draft/pay order for licence fee enclosed: {bankDraft ? 'Y' : 'N'}
      </Typography>

      {bankDraft && (
        <>
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name of Bank:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDraft?.bankName || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['bankName'] || false}
        onChange={(e) => handleCheckboxChange(e, 'bankName')}
        inputProps={{ 'aria-label': 'Bank Name Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Draft/Pay Order No.:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDraft?.draftNumber || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['draftNumber'] || false}
        onChange={(e) => handleCheckboxChange(e, 'draftNumber')}
        inputProps={{ 'aria-label': 'Draft Number Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Date of Issue:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDraft?.issueDate || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['issueDate'] || false}
        onChange={(e) => handleCheckboxChange(e, 'issueDate')}
        inputProps={{ 'aria-label': 'Issue Date Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Amount:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{bankDraft?.amount || 'N/A'}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['amount'] || false}
        onChange={(e) => handleCheckboxChange(e, 'amount')}
        inputProps={{ 'aria-label': 'Amount Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid>

        </>
      )}
    </Box>
    <Box>
    <Typography variant="h6" gutterBottom style={{ marginTop: '10px' }}>
            31.  Location of facility in India for generation of Digital Signature Certificate *
          </Typography>
    <TableContainer>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Location Type</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Block No</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Village</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Post Office</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Subdivision</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Country</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>State</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>City</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>PinCode</TableCell>
          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {mappedLocations && mappedLocations.length > 0 ? (
          mappedLocations.map((location, index) => (
            <TableRow key={index}>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.locationName}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.blockNo || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.village || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.postOffice || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.subDivision || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{getCountryNameById(location.matchingAddress.country || '-')}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{getStateNameById(location.matchingAddress.state || '-')}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{getCityNameById(location.matchingAddress.city || '-')}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{location.matchingAddress.pin || '-'}</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}><Checkbox
                checked={checkedRows[location.locationName] || false}
                onChange={(e) => handleCheckboxChange(e, location.locationName)}
                inputProps={{ 'aria-label': `Select ${location.locationName}` }}
              /></TableCell>
              
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={10} sx={{ textAlign: 'center' }}>No data available</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
  </Box>
  <Box style={{ marginTop: '10px' }}>
  <Typography variant="h6" sx={{ display: 'inline'}} >
    32. Public Key @: 
  </Typography>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Public Key:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1" sx={{ display: 'inline' }}>
            {basicDetailsFormValues?.appGovtOrganizationApplication?.publicKey || 'N/A'}
        </Typography>
    </Grid>
</Grid>

</Box>

<Box>
<Grid container alignItems="center" sx={{ marginTop: '10px' }}>
  <Grid item sm={8}>
    <Typography variant="h6" sx={{ display: 'inline' }}>
      34. Whether Certification Practice Statement is enclosed *:
    </Typography>
  </Grid>
  <Grid item sm={4}>
    <Box display="flex" alignItems="center">
      <Typography variant="body1" sx={{ marginRight: '12px' }}>
        {cpsDocument ? 'Y' : 'N'}
      </Typography>
      {cpsDocument && (
        <Link
          onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)}
          sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '12px' }} // Increased margin
        >
          View
        </Link>
      )}
       <Checkbox
      checked={checkedRows['firmCPSDocument'] || false}
      onChange={(e) => handleCheckboxChanges(e, 'firmCPSDocument', cpsDocument.appDocId)} // Pass appDocId here
      inputProps={{ 'aria-label': 'Certification Practice Statement Checkbox' }}
    />
    </Box>
  </Grid>
</Grid>

</Box>


          {/* Undertakings Section */}
          <Typography variant="h6" gutterBottom style={{ marginTop: '10px' }}>
            Undertakings:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Typography variant="body1"sx={{ lineHeight: 1.5, letterSpacing: '0.5px' }}>
                  { "1. Whoever makes any misrepresentation to, or suppresses any material fact from the Controller or the Certifying Authority for obtaining any licence or Electronic Signature Certificate, as the case may be, shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
    
           {/* Notes Section */}
           <Grid container spacing={2}>
  <Grid item xs={12}>
    <Typography variant="h6" style={{ marginTop: '10px' }}>
      Remarks
    </Typography>
    <TextField
      multiline
      rows={4} // Adjust the number of rows as needed
      variant="outlined"
      fullWidth
      onChange={(e) => handleChanges(e, 'remarks')} // Pass appDocId here
      InputProps={{
        style: {
          padding: '10px', // Ensure there's enough padding
        },
      }}
    />
  </Grid>
</Grid>
        </Box>




              </Collapse>

            </Box>
         
        ))
      }</>):(<Box sx={{textAlign: 'center', mt: 4}}>
        No Records Found
      </Box>)
    
    }
       
  </CustomTabPanel>
</Box>
  );
  };


export default GovernmentViewData;
