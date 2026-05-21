import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Typography, Button, Box, Grid, RadioGroup, Radio, FormControlLabel, TableCell, Table, TableBody, TableContainer, TableHead, TableRow, IconButton, Checkbox, TextField ,Link, TextareaAutosize, Divider, FormHelperText, Collapse, Tabs, Tab, AppBar, InputLabel} from '@mui/material';
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

const ViewCessationApplication = ()=> {

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
    const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({})
    // get first application form by userName
    useEffect(() => {
      if (userName) {
          setLoading(true);
          ApplicationForm.getApplicationFormByUsername(userName)
              .then((response) => {
                  
                      setBasicDetailsFormValues(response.data); // Set the parsed or direct object
                  
              })
              .catch((error) => {
                  console.error("Error fetching application form:", error);
              })
              .finally(() => {
                  setLoading(false);
              });
      }
  }, [userName]);


  const [basicDetailesValues, setBasicDetailesValues] = useState({reviewApplications:[],reviewDocuments
    :[],
    reviewFields
    :[]
  });



  useEffect(() => {
    if (userName) {
      console.log("Fetching data for userName:", userName);
  
      ApplicationReview.getApplicationForm6ByUsername(userName)
        .then((response) => {
          console.log("API Response:", response.data);
          setBasicDetailesValues(response.data);
  
          // Extract reviewFields and reviewDocuments from the response
          const reviewFields = response.data?.reviewFields || [];
          const reviewDocuments = response.data?.reviewDocuments || [];
          
          console.log("reviewFields:", reviewFields);
          console.log("reviewDocuments:", reviewDocuments);
  
         
          const newCheckedRows = {};
  
         
          // reviewFields.forEach(field => {
          //   newCheckedRows[field.fieldName] = true; 
          // });
  
         
          // reviewDocuments.forEach(doc => {
          //     newCheckedRows[doc.reviewDocId] = true;  
            
          // });
  
          // console.log("newCheckedRows:", newCheckedRows);
         // setCheckedRows(newCheckedRows); 
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


  const [raj, setRaj] = useState([]);
  const [reviewDocuments, setReviewDocuments] = useState([]);
  const [reviewFields, setReviewFields] = useState([]);
  

  useEffect(() => {
    if (userName) {
      console.log("Fetching data for userName:", userName);
  
      ApplicationReview.getAllApplicationReviewByUserNames(userName)
        .then((response) => {
          console.log("API Response:", response.data);
          setRaj(response.data);
  
          const documents = [];
          const fields = [];
          const newCheckedRows = {}; // Initialize checked rows object
  
          // Extract reviewDocuments and reviewFields and set checked state for each fieldName and documentId
          response.data.forEach((item) => {
            const { reviewDocuments, reviewFields } = item;
  
            // Check if reviewDocuments exist for this item
            if (reviewDocuments && reviewDocuments.length > 0) {
              reviewDocuments.forEach((doc) => {
                // Set documentId as checked
                newCheckedRows[doc.documentId] = true; // Mark document as checked
              });
              documents.push(...reviewDocuments);
            }
  
            // Check if reviewFields exist for this item
            if (reviewFields && reviewFields.length > 0) {
              reviewFields.forEach((field) => {
                // Set fieldName as checked
                newCheckedRows[field.fieldName] = true; // Mark field as checked
              });
              fields.push(...reviewFields);
            }
          });
  
          setReviewDocuments(documents);
          setReviewFields(fields);
         // setCheckedRows(newCheckedRows); // Update the checkedRows state
          console.log("newCheckedRows:", newCheckedRows);
        })
        .catch((error) => {
          console.error("Error fetching application form:", error);
        });
    }
  }, [userName]);
  
  




  
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



//
const checkIsDocChecked = (documentId, reviewId) => {
 
  let isChecked = false;

  const rdata = raj.find((item) => parseInt(item.reviewId) === reviewId);
  const rDocuments = rdata?.reviewDocuments || [];

  rDocuments.forEach((document) => {
   
    const doc = parseInt(document.documentId);

   
    if (doc === documentId) {
      isChecked = true; 
    }
  });

  return isChecked; 
};


const checkIsFieldChecked = (fieldName, reviewId) => {
 
  let isChecked = false;

  const rdata = raj.find((item) => parseInt(item.reviewId) === reviewId);
  const rField = rdata?.reviewFields || [];

  rField.forEach((field) => {
   
  
    if (fieldName === field.fieldName) {
      isChecked = true; 
    }
  });

  return isChecked; 
};








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


const downloads = async (momFile) => {
    try {
      // Fetch the file from the server
      const response = await ApplicationForm.viewsFile(momFile);

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      // Extract the filename from the Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];

      console.log(JSON.stringify(contentDisposition))

      const filename = "Committee MoM Document";

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

  const handleRejectedSubmit = (e) => {
    e.preventDefault();
    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure you want to submit?",
      confirmText: "Yes",
      closeText: "No",
      maxWidth: "sm",
      onConfirm: () => handleConfrimSubmit(),
    });
  };
  
  
  
  
  
  const handleConfrimSubmit = () => {
    
    ApplicationForm.addAllRejectedAData(checkedRows)
    .then((response) => {
      //console.log(response.data)
        showAlert({
            messageTitle: 'Success',
            messageContent: response.data,
            confirmText: 'Ok',
            onConfirm: () => window.location.href = '/cca/rejectedreviewapplication',
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
      maxWidth: "sm",
      onConfirm: () => handleSubmit(),
    });
  };
  
  
  
  
  
  const handleSubmit = () => {
    
    ApplicationForm.addAllAprovedAData(checkedRows)
    .then((response) => {
        showAlert({
            messageTitle: 'Success',
            messageContent: response.data,
            confirmText: 'Ok',
            onConfirm: () => window.location.href = '/cca/rejectedreviewapplication',
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
 
  // get first application form by userName




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
      {
  basicDetailesValues?.reviewApplications &&
  Array.isArray(basicDetailesValues?.reviewApplications) &&
  basicDetailesValues?.reviewApplications.length > 0 ? (
    <>
      {basicDetailesValues?.reviewApplications
        .filter(element => element.status === "Active")
        .map((element, index) => (

        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} autoComplete>
        <Box sx={{ width: '100%' }}>

<Typography variant="h4" >Form for Application for Grant of Licence to be a Certifying Authority</Typography>
<Box>
  <Typography variant="h4" color="primary.tabletext">
    For Individual
  </Typography>
  <Box style={{ borderBottom: '2px solid #000', width: '18%', marginTop: '1px' }} />
</Box>

<Grid item sm={12}>
  <Typography variant="h6">1. Full Name*:</Typography>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Last Name/Surname:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.lastName1}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['lastName1'] || false}
        onChange={(e) => handleCheckboxChange(e, 'lastName1')}
        inputProps={{ 'aria-label': 'Last Name/Surname Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">First Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.firstName1}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('firstName1',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'firstName1')}
        inputProps={{ 'aria-label': 'First Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Middle Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.middleName1}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('middleName1',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'middleName1')}
        inputProps={{ 'aria-label': 'Middle Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Typography variant="h6">2. Have you ever been known by any other name? If Yes:</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Last Name/Surname:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.lastName2}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('lastName2',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'lastName2')}
        inputProps={{ 'aria-label': 'Last Name/Surname Checkbox (Other Name)' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">First Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.firstName2}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('firstName2',element.reviewId )|| false}
        onChange={(e) => handleCheckboxChange(e, 'firstName2')}
        inputProps={{ 'aria-label': 'First Name Checkbox (Other Name)' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Middle Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.middleName2}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('middleName2',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'middleName2')}
        inputProps={{ 'aria-label': 'Middle Name Checkbox (Other Name)' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>




<Typography variant="h6">3. Address:</Typography>
<Typography variant="h6">A. Residential Address*:</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Flat/Door/Block No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.blockNo}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialBlockNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialBlockNo')}
        inputProps={{ 'aria-label': 'Residential Block No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name Of Premises/Building/Village:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.village}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialVillage',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialVillage')}
        inputProps={{ 'aria-label': 'Residential Village Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.postOffice}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialPostOffice',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialPostOffice')}
        inputProps={{ 'aria-label': 'Residential Post Office Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Area/Locality/Taluka/Subdivision:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.subDivision}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialSubDivision',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialSubDivision')}
        inputProps={{ 'aria-label': 'Residential Subdivision Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Town/City/District:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${getCityNameById(basicDetailsFormValues2.residentialAddress.city)}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialCity',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialCity')}
        inputProps={{ 'aria-label': 'Residential City Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">State/Union Territory:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${getStateNameById(basicDetailsFormValues2.residentialAddress.state)}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialState',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialState')}
        inputProps={{ 'aria-label': 'Residential State Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Pin:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.pin}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialPin',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialPin')}
        inputProps={{ 'aria-label': 'Residential Pin Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Telephone No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.telephoneNo}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialTelephoneNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialTelephoneNo')}
        inputProps={{ 'aria-label': 'Residential Telephone No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Fax:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.fax}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialFax',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialFax')}
        inputProps={{ 'aria-label': 'Residential Fax Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Mobile Phone No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.mobile}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialMobile',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialMobile')}
        inputProps={{ 'aria-label': 'Residential Mobile Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Typography variant="h6">B. Office Address*:</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Flat/Door/Block No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.blockNo}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeBlockNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeBlockNo')}
        inputProps={{ 'aria-label': 'Office Block No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name Of Premises/Building/Village:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.village}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeVillage',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeVillage')}
        inputProps={{ 'aria-label': 'Office Village Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.postOffice}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officePostOffice',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officePostOffice')}
        inputProps={{ 'aria-label': 'Office Post Office Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Area/Locality/Taluka/Subdivision:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.subDivision}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeSubDivision',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeSubDivision')}
        inputProps={{ 'aria-label': 'Office Subdivision Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Town/City/District:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${getCityNameById(basicDetailsFormValues2.officialAddress.city)}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeCity',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeCity')}
        inputProps={{ 'aria-label': 'Office City Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">State/Union Territory:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${getStateNameById(basicDetailsFormValues2.officialAddress.state)}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeState',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeState')}
        inputProps={{ 'aria-label': 'Office State Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Pin:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.pin}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officePin',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officePin')}
        inputProps={{ 'aria-label': 'Office Pin Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Telephone No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.telephoneNo}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeTelephoneNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeTelephoneNo')}
        inputProps={{ 'aria-label': 'Office Telephone No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Fax:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.fax || 'N/A'}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeFax',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeFax')}
        inputProps={{ 'aria-label': 'Office Fax Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Mobile Phone No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.mobile}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['officeMobile'] || false}
        onChange={(e) => handleCheckboxChange(e, 'officeMobile')}
        inputProps={{ 'aria-label': 'Office Mobile Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid> */}

            {/* Title */}
            
  {/* Title */}
 
  <Grid container spacing={2} sx={{ alignItems: 'center' }}>
  {/* Title */}
  <Grid item sm={6}>
    <Typography variant="h6">
      4. Address for Communication*:
    </Typography>
  </Grid>

  {/* Radio Buttons */}
  <Grid item sm={6}>
    <RadioGroup
      row
      value={basicDetailsFormValues2.communicationAddress}
      sx={{ alignItems: 'center' }}
    >
      <FormControlLabel
        value="Residential"
        control={
          <Radio
            checked={basicDetailsFormValues2.communicationAddress === 'Residential'}
          />
        }
        label={
          <span>
            Residential {basicDetailsFormValues2.communicationAddress === 'Residential' && <span>✓</span>}
          </span>
        }
      />
      <FormControlLabel
        value="Office"
        control={
          <Radio
            checked={basicDetailsFormValues2.communicationAddress === 'Office'}
          />
        }
        label={
          <span>
            Office {basicDetailsFormValues2.communicationAddress === 'Office' && <span>✓</span>}
          </span>
        }
      />
    </RadioGroup>
  </Grid>
</Grid>



  <Typography variant="h6">5. Father's Name*:</Typography>

  <Grid container spacing={2} sx={{ ml: 1 }}>
  {/* Last Name/Surname */}
  <Grid item sm={6}>
    <Typography variant="body1">Last Name/Surname:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.flastName}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('fatherLastName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'fatherLastName')}
        inputProps={{ 'aria-label': 'Father Last Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  {/* First Name */}
  <Grid item sm={6}>
    <Typography variant="body1">First Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.ffirstName}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('fatherFirstName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'fatherFirstName')}
        inputProps={{ 'aria-label': 'Father First Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  {/* Middle Name */}
  <Grid item sm={6}>
    <Typography variant="body1">Middle Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.fmiddleName}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('fatherMiddleName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'fatherMiddleName')}
        inputProps={{ 'aria-label': 'Father Middle Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>



  <Grid container spacing={2} alignItems="center">
    {/* Title */}
    <Grid item sm={6}>
      <Typography variant="h6" sx={{ display: 'inline' }}>
        6. Sex* (For Individual Applicant only):
      </Typography>
    </Grid>

    {/* Radio Buttons */}
    <Grid item sm={6}>
      <RadioGroup
        row
        value={basicDetailsFormValues.application.gender}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <FormControlLabel
          value="Male"
          control={
            <Radio checked={basicDetailsFormValues.application.gender === 'Male'} />
          }
          label={
            <span>
              Male {basicDetailsFormValues.application.gender === 'Male' && <span>✓</span>}
            </span>
          }
        />
        <FormControlLabel
          value="Female"
          control={
            <Radio checked={basicDetailsFormValues.application.gender === 'Female'} />
          }
          label={
            <span>
              Female {basicDetailsFormValues.application.gender === 'Female' && <span>✓</span>}
            </span>
          }
        />
      </RadioGroup>
    </Grid>
  </Grid>


  
  <Grid container alignItems="center">
  {/* Title */}
  <Grid item sm={6}>
    <Typography variant="h6" sx={{ display: 'inline' }}>
      7. Date of Birth (dd/mm/yyyy)*:
    </Typography>
  </Grid>
 
  {/* Formatted Date */}
  <Grid item sm={6} container alignItems="center">
  <Grid item sm={5}>
    <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
      {formatDate(basicDetailsFormValues.application.dob)}
    </Typography>
  </Grid>

  {/* Checkbox for Confirming Date of Birth */}
  <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('dob',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'dob')}
        inputProps={{ 'aria-label': 'Date of Birth Checkbox' }}
        disabled
      />
    </Grid>
</Grid>
</Grid>


 
  <Grid container alignItems="center">
    {/* Title */}
    <Grid item sm={6}>
      <Typography variant="h6" sx={{ display: 'inline' }}>
        8. Nationality*:
      </Typography>
    </Grid>

    {/* Nationality */}
    <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues.application.nationality}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('nationality',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'nationality')}
        inputProps={{ 'aria-label': 'Nationality Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

 

    {/* Title */}
    
    <Typography variant="h6">
  9. Credit Card Details:
</Typography>

{/* Credit Card Type */}
<Grid container alignItems="center" sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" sx={{ display: 'inline' }}>
      Credit Card Type:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.creditCardType}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('creditCardType',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'creditCardType')}
        inputProps={{ 'aria-label': 'Credit Card Type Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* Credit Card Number */}
<Grid container alignItems="center" sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" sx={{ display: 'inline' }}>
      Credit Card No.:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.creditCardNo}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('creditCardNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'creditCardNo')}
        inputProps={{ 'aria-label': 'Credit Card No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* Issued By */}
<Grid container alignItems="center" sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" sx={{ display: 'inline' }}>
      Issued By:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.creditCardIssuedBy}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('creditCardIssuedBy',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'creditCardIssuedBy')}
        inputProps={{ 'aria-label': 'Credit Card Issued By Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>




 
  <Grid container spacing={2} alignItems="center">
    {/* Title */}
    <Grid item sm={6}>
      <Typography variant="h6" sx={{ display: 'inline' }}>
        10. E-mail Address:
      </Typography>
    </Grid>

    {/* Email Addresses */}
    <Grid item sm={6}>
      {basicDetailsFormValues.emails.map((doc, index) => (
        <Typography key={index} variant="body1" sx={{ display: 'inline' ,marginLeft: '8px' }}>
          {`${index + 1}) ${doc.emailId}`}
        </Typography>
      ))}
    </Grid>
  </Grid>



  <Grid container spacing={2} alignItems="center">
  {/* Title */}
  <Grid item sm={6}>
    <Typography variant="h6" sx={{ display: 'inline' }}>
      11. Web URL address:
    </Typography>
  </Grid>

  {/* Web URL Address */}
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {/* Replace with actual data when available */}
        {`${basicDetailsFormValues.application.webURL||'N/A'}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('webURL',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'webURL')}
        inputProps={{ 'aria-label': 'Web URL Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>





<Box sx={{ margin: '20px 0' }}>
  <Typography variant="h6">
    12. Passport Details#:
  </Typography>

  {/* Passport No */}
  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Passport No.:
      </Typography>
    </Grid>
    <Grid item sm={6} container alignItems="center">
      <Grid item sm={5}>
        <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
          {`${basicDetailsFormValues3.indivAdditionalDetails.passportNo}`}
        </Typography>
      </Grid>
      <Grid item sm={7} container alignItems="center">
        <Checkbox
          checked={checkIsFieldChecked('passportNo',element.reviewId) || false}
          onChange={(e) => handleCheckboxChange(e, 'passportNo')}
          inputProps={{ 'aria-label': 'Passport No Checkbox' }}
          disabled
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Passport Issuing Authority */}
  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Passport Issuing Authority:
      </Typography>
    </Grid>
    <Grid item sm={6} container alignItems="center">
      <Grid item sm={5}>
        <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
          {`${basicDetailsFormValues3.indivAdditionalDetails.passportIssuingAuthority}`}
        </Typography>
      </Grid>
      <Grid item sm={7} container alignItems="center">
        <Checkbox
          checked={checkIsFieldChecked('passportIssuingAuthority',element.reviewId) || false}
          onChange={(e) => handleCheckboxChange(e, 'passportIssuingAuthority')}
          inputProps={{ 'aria-label': 'Passport Issuing Authority Checkbox' }}
          disabled
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Passport Expiry Date */}
  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Passport Expiry Date (dd/mm/yyyy):
      </Typography>
    </Grid>
    <Grid item sm={6} container alignItems="center">
      <Grid item sm={5}>
        <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
          {formatDate(basicDetailsFormValues3.indivAdditionalDetails.passportExpiryDate)}
        </Typography>
      </Grid>
      <Grid item sm={7} container alignItems="center">
        <Checkbox
          checked={checkIsFieldChecked('passportExpiryDate',element.reviewId) || false}
          onChange={(e) => handleCheckboxChange(e, 'passportExpiryDate')}
          inputProps={{ 'aria-label': 'Passport Expiry Date Checkbox' }}
          disabled
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Passport Document */}
  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1" sx={{ display: 'inline' }}>
        Passport Document:
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {basicDetailsFormValues3.applicationDocument
          .filter(doc => doc.documentTitle === "passportDocument") // Filter for passportDocument
          .map((doc, index) => (
            <React.Fragment key={index}>
              <Link
                onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Use correct doc for downloading
                sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '8px' }} // Set text color to red and underline, add margin
              >
                View
              </Link>
              <Grid item sm={3} container justifyContent="flex-start">
                <Checkbox
                  checked={checkIsDocChecked(doc.appDocId, element.reviewId) || false}
                  onChange={(e) => handleCheckboxChanges(e, 'passportDocument', doc.appDocId)} // Pass appDocId here
                  inputProps={{ 'aria-label': 'Passport Document Checkbox' }}
                  disabled
                />
              </Grid>
            </React.Fragment>
          ))}
      </Box>
    </Grid>
  </Grid>
</Box>




<Typography variant="h6">
  14. Pan Card Details#:
</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  {/* Pan Card No */}
  <Grid item sm={6}>
    <Typography variant="body1">
      Pan Card No.:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.pan}`}
      </Typography>
    </Grid>
    <Grid item sm={7} container alignItems="center">
      <Checkbox
        checked={checkIsFieldChecked('panCardNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'panCardNo')}
        inputProps={{ 'aria-label': 'Pan Card No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* Pan Card Document */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" sx={{ display: 'inline' }}>
      Pan Card Document:
    </Typography>
  </Grid>
  <Grid item sm={6}>
    <Box sx={{ display: 'flex', alignItems: 'center'}}>
      {basicDetailsFormValues3.applicationDocument
        .filter(doc => doc.documentTitle === "panDocument") // Filter for panDocument
        .map((doc, index) => (
          <React.Fragment key={index}>
            <Link
              onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Use the correct document for downloading
              sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '8px' }} // Set text color to red and underline
            >
              View
            </Link>
            <Checkbox
               checked={checkIsDocChecked(doc.appDocId, element.reviewId) || false}
              onChange={(e) => handleCheckboxChanges(e, 'panDocument', doc.appDocId)} // Pass appDocId here
              inputProps={{ 'aria-label': 'Pan Document Checkbox' }}
              disabled
            />
          </React.Fragment>
        ))}
    </Box>
  </Grid>
</Grid>




<Typography variant="h6">
  15. ISP Details:
</Typography>

{/* ISP Name */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      ISP Name*:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.ispName}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('ispName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'ispName')}
        inputProps={{ 'aria-label': 'ISP Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* ISP Website Address */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      ISP's Website Address: 
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.ispWebsite}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('ispWebsite',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'ispWebsite')}
        inputProps={{ 'aria-label': 'ISP Website Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* ISP Username */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      Your User Name at ISP: 
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.ispUsername}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('ispUsername',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'ispUsername')}
        inputProps={{ 'aria-label': 'ISP Username Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>




 
 
<Typography variant="h6">
  16. Personal Web page URL address:
</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      Personal Web page URL address: 
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Typography variant="body1">
      {`${basicDetailsFormValues3.indivAdditionalDetails.personalWebPage}`}
    </Typography>
    <Checkbox
      checked={checkIsFieldChecked('personalWebPage',element.reviewId) || false} // Check if the checkbox is checked
      onChange={(e) => handleCheckboxChange(e, 'personalWebPage')} // Handle checkbox state change
      inputProps={{ 'aria-label': 'Personal Web Page Checkbox' }} 
      disabled
    />
  </Grid>
</Grid>



  <Typography variant="h6">
  17. Capital in the business or profession *Rs:
</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      Capital in the business or profession *Rs.: 
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Typography variant="body1">
      {`${basicDetailsFormValues3.indivAdditionalDetails.indivCapital}`}
    </Typography>
    <Checkbox
      checked={checkIsFieldChecked('indivCapital',element.reviewId) || false} 
      onChange={(e) => handleCheckboxChange(e, 'indivCapital')} 
      inputProps={{ 'aria-label': 'Indiv Capital Checkbox' }} 
      disabled
    />
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" style={{ display: 'inline' }}>
      Capital Document:
    </Typography>
  </Grid>
  <Grid item sm={6}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {basicDetailsFormValues3.applicationDocument
        .filter(doc => doc.documentTitle === "capitalDocument") // Filter for capitalDocument
        .map((doc, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Link
              onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Change the handler function if needed
              sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }} // Set text color to red and underline
            >
              View
            </Link>
            <Checkbox
               checked={checkIsDocChecked(doc.appDocId, element.reviewId) || false}
              onChange={(e) => handleCheckboxChanges(e, 'capitalDocument', doc.appDocId)} // Pass appDocId here
              inputProps={{ 'aria-label': 'Capital Document Checkbox' }}
              sx={{ ml: 1 }} 
              disabled
            />
          </Box>
        ))}
    </Box>
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
        checked={checkIsFieldChecked('bankName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'bankName')}
        inputProps={{ 'aria-label': 'Bank Name Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('branchName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'branchName')}
        inputProps={{ 'aria-label': 'Branch Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('bankAccountNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'bankAccountNo')}
        inputProps={{ 'aria-label': 'Bank Account No Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('bankAccountType',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'bankAccountType')}
        inputProps={{ 'aria-label': 'Bank Account Type Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('bankName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'bankName')}
        inputProps={{ 'aria-label': 'Bank Name Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('draftNumber',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'draftNumber')}
        inputProps={{ 'aria-label': 'Draft Number Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('issueDate',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'issueDate')}
        inputProps={{ 'aria-label': 'Issue Date Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('amount',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'amount')}
        inputProps={{ 'aria-label': 'Amount Checkbox' }}
        disabled
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
                checked={checkIsFieldChecked(location.locationName,element.reviewId) || false}
                disabled
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
          onClick={() => handleDownload(cpsDocument?.appDocId, cpsDocument.documentTitle)}
          sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '12px' }} // Increased margin
        >
          View
        </Link>
      )}
       <Checkbox
       disabled
       checked={checkIsDocChecked(cpsDocument?.appDocId, element.reviewId)}
      onChange={(e) => handleCheckboxChanges(e, 'individualCPSDocument', cpsDocument?.appDocId)} // Pass appDocId here
      inputProps={{ 'aria-label': 'Certification Practice Statement Checkbox' }}
    />
    </Box>
  </Grid>
</Grid>

</Box>
          <Grid container spacing={2}>
  <Grid item xs={12}>
    <Typography variant="h6" style={{ marginTop: '10px' }}>
     Application Review Remarks
    </Typography>
    <TextField
      multiline
      rows={4} 
      disabled
      variant="outlined"
      value={element?.remarks}
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

<Grid container spacing={2} sx={{ mt: 0.1 }} direction="row" alignItems="center">
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <InputLabel shrink={false} htmlFor="reviewDate">
                            <Typography variant="body1">Review Date:</Typography>
                          </InputLabel>
                          <Typography variant="body1" sx={{ ml: 1 }}>
                            {dateFormatter(element?.reviewDate)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <InputLabel shrink={false} htmlFor="pdffile">
                            <Typography variant="body1">Committee MoM Document:</Typography>
                          </InputLabel>
                          <Typography variant="body1" sx={{ ml: 1 }}>
                            <Link
                              onClick={() => downloads(element?.momFile)}
                              sx={{
                                color: 'red',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              Download
                            </Link>
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>


          <Grid container spacing={2}>
  <Grid item xs={12}>
    <Typography variant="h6" style={{ marginTop: '10px' }}>
      CCA Remarks
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


          {/* Buttons */}
          <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                sx={{ minWidth: '160px', height: '40px', whiteSpace: 'nowrap' }}
                //onClick={R}
                aria-label="Submit"
               onClick={handleApprovedSubmit}
              >
                Approval
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="button"
                variant="contained"
                sx={{ minWidth: '160px', height: '40px', color: '#FFFFFF', backgroundColor: 'black', whiteSpace: 'nowrap' }}
                aria-label="Reset"
               onClick={handleRejectedSubmit}
              >
             Rejected The Applicant
              </Button>
            </Grid>
          </Grid>
     

    </Box>
         
))
}</>):(<Box sx={{textAlign: 'center', mt: 4}}>
No Records Found
</Box>)
}   
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
                  Reviewd on {dateFormatter(element.created)}
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
                  {collapseItem[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />} 
                </IconButton>


              </Box>

             <Collapse in={collapseItem[index]} sx={{pl: 1, pr: 1, backgroundColor: 'primary.light', color: 'bodycolor.text'}}>



              <Box sx={{ width: '100%' }}>

<Typography variant="h4" >Form for Application for Grant of Licence to be a Certifying Authority</Typography>
<Box>
  <Typography variant="h4" color="primary.tabletext">
    For Individual
  </Typography>
  <Box style={{ borderBottom: '2px solid #000', width: '18%', marginTop: '1px' }} />
</Box>

<Grid item sm={12}>
  <Typography variant="h6">1. Full Name*:</Typography>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Last Name/Surname:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.lastName1}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['lastName1'] || false}
        onChange={(e) => handleCheckboxChange(e, 'lastName1')}
        inputProps={{ 'aria-label': 'Last Name/Surname Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">First Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.firstName1}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('firstName1',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'firstName1')}
        inputProps={{ 'aria-label': 'First Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Middle Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.middleName1}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('middleName1',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'middleName1')}
        inputProps={{ 'aria-label': 'Middle Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Typography variant="h6">2. Have you ever been known by any other name? If Yes:</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Last Name/Surname:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.lastName2}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('lastName2',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'lastName2')}
        inputProps={{ 'aria-label': 'Last Name/Surname Checkbox (Other Name)' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">First Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.firstName2}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('firstName2',element.reviewId )|| false}
        onChange={(e) => handleCheckboxChange(e, 'firstName2')}
        inputProps={{ 'aria-label': 'First Name Checkbox (Other Name)' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Middle Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues.application.middleName2}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('middleName2',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'middleName2')}
        inputProps={{ 'aria-label': 'Middle Name Checkbox (Other Name)' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>




<Typography variant="h6">3. Address:</Typography>
<Typography variant="h6">A. Residential Address*:</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Flat/Door/Block No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.blockNo}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialBlockNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialBlockNo')}
        inputProps={{ 'aria-label': 'Residential Block No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name Of Premises/Building/Village:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.village}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialVillage',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialVillage')}
        inputProps={{ 'aria-label': 'Residential Village Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.postOffice}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialPostOffice',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialPostOffice')}
        inputProps={{ 'aria-label': 'Residential Post Office Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Area/Locality/Taluka/Subdivision:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.subDivision}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialSubDivision',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialSubDivision')}
        inputProps={{ 'aria-label': 'Residential Subdivision Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Town/City/District:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${getCityNameById(basicDetailsFormValues2.residentialAddress.city)}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialCity',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialCity')}
        inputProps={{ 'aria-label': 'Residential City Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">State/Union Territory:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${getStateNameById(basicDetailsFormValues2.residentialAddress.state)}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialState',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialState')}
        inputProps={{ 'aria-label': 'Residential State Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Pin:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.pin}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialPin',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialPin')}
        inputProps={{ 'aria-label': 'Residential Pin Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Telephone No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.telephoneNo}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialTelephoneNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialTelephoneNo')}
        inputProps={{ 'aria-label': 'Residential Telephone No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Fax:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.fax}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialFax',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialFax')}
        inputProps={{ 'aria-label': 'Residential Fax Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Mobile Phone No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.mobile}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('residentialMobile',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'residentialMobile')}
        inputProps={{ 'aria-label': 'Residential Mobile Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Typography variant="h6">B. Office Address*:</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Flat/Door/Block No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.blockNo}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeBlockNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeBlockNo')}
        inputProps={{ 'aria-label': 'Office Block No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name Of Premises/Building/Village:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.village}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeVillage',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeVillage')}
        inputProps={{ 'aria-label': 'Office Village Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.postOffice}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officePostOffice',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officePostOffice')}
        inputProps={{ 'aria-label': 'Office Post Office Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Area/Locality/Taluka/Subdivision:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.subDivision}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeSubDivision',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeSubDivision')}
        inputProps={{ 'aria-label': 'Office Subdivision Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Town/City/District:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${getCityNameById(basicDetailsFormValues2.officialAddress.city)}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeCity',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeCity')}
        inputProps={{ 'aria-label': 'Office City Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">State/Union Territory:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${getStateNameById(basicDetailsFormValues2.officialAddress.state)}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeState',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeState')}
        inputProps={{ 'aria-label': 'Office State Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Pin:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.pin}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officePin',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officePin')}
        inputProps={{ 'aria-label': 'Office Pin Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Telephone No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.telephoneNo}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeTelephoneNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeTelephoneNo')}
        inputProps={{ 'aria-label': 'Office Telephone No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Fax:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.fax || 'N/A'}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('officeFax',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'officeFax')}
        inputProps={{ 'aria-label': 'Office Fax Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Mobile Phone No:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.mobile}`}</Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkedRows['officeMobile'] || false}
        onChange={(e) => handleCheckboxChange(e, 'officeMobile')}
        inputProps={{ 'aria-label': 'Office Mobile Checkbox' }}
      />
    </Grid>
  </Grid>
</Grid> */}

            {/* Title */}
            
  {/* Title */}
 
  <Grid container spacing={2} sx={{ alignItems: 'center' }}>
  {/* Title */}
  <Grid item sm={6}>
    <Typography variant="h6">
      4. Address for Communication*:
    </Typography>
  </Grid>

  {/* Radio Buttons */}
  <Grid item sm={6}>
    <RadioGroup
      row
      value={basicDetailsFormValues2.communicationAddress}
      sx={{ alignItems: 'center' }}
    >
      <FormControlLabel
        value="Residential"
        control={
          <Radio
            checked={basicDetailsFormValues2.communicationAddress === 'Residential'}
          />
        }
        label={
          <span>
            Residential {basicDetailsFormValues2.communicationAddress === 'Residential' && <span>✓</span>}
          </span>
        }
      />
      <FormControlLabel
        value="Office"
        control={
          <Radio
            checked={basicDetailsFormValues2.communicationAddress === 'Office'}
          />
        }
        label={
          <span>
            Office {basicDetailsFormValues2.communicationAddress === 'Office' && <span>✓</span>}
          </span>
        }
      />
    </RadioGroup>
  </Grid>
</Grid>



  <Typography variant="h6">5. Father's Name*:</Typography>

  <Grid container spacing={2} sx={{ ml: 1 }}>
  {/* Last Name/Surname */}
  <Grid item sm={6}>
    <Typography variant="body1">Last Name/Surname:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.flastName}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('fatherLastName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'fatherLastName')}
        inputProps={{ 'aria-label': 'Father Last Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  {/* First Name */}
  <Grid item sm={6}>
    <Typography variant="body1">First Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.ffirstName}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('fatherFirstName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'fatherFirstName')}
        inputProps={{ 'aria-label': 'Father First Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  {/* Middle Name */}
  <Grid item sm={6}>
    <Typography variant="body1">Middle Name:</Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.fmiddleName}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('fatherMiddleName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'fatherMiddleName')}
        inputProps={{ 'aria-label': 'Father Middle Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>



  <Grid container spacing={2} alignItems="center">
    {/* Title */}
    <Grid item sm={6}>
      <Typography variant="h6" sx={{ display: 'inline' }}>
        6. Sex* (For Individual Applicant only):
      </Typography>
    </Grid>

    {/* Radio Buttons */}
    <Grid item sm={6}>
      <RadioGroup
        row
        value={basicDetailsFormValues.application.gender}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <FormControlLabel
          value="Male"
          control={
            <Radio checked={basicDetailsFormValues.application.gender === 'Male'} />
          }
          label={
            <span>
              Male {basicDetailsFormValues.application.gender === 'Male' && <span>✓</span>}
            </span>
          }
        />
        <FormControlLabel
          value="Female"
          control={
            <Radio checked={basicDetailsFormValues.application.gender === 'Female'} />
          }
          label={
            <span>
              Female {basicDetailsFormValues.application.gender === 'Female' && <span>✓</span>}
            </span>
          }
        />
      </RadioGroup>
    </Grid>
  </Grid>


  
  <Grid container alignItems="center">
  {/* Title */}
  <Grid item sm={6}>
    <Typography variant="h6" sx={{ display: 'inline' }}>
      7. Date of Birth (dd/mm/yyyy)*:
    </Typography>
  </Grid>
 
  {/* Formatted Date */}
  <Grid item sm={6} container alignItems="center">
  <Grid item sm={5}>
    <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
      {formatDate(basicDetailsFormValues.application.dob)}
    </Typography>
  </Grid>

  {/* Checkbox for Confirming Date of Birth */}
  <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('dob',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'dob')}
        inputProps={{ 'aria-label': 'Date of Birth Checkbox' }}
        disabled
      />
    </Grid>
</Grid>
</Grid>


 
  <Grid container alignItems="center">
    {/* Title */}
    <Grid item sm={6}>
      <Typography variant="h6" sx={{ display: 'inline' }}>
        8. Nationality*:
      </Typography>
    </Grid>

    {/* Nationality */}
    <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues.application.nationality}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('nationality',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'nationality')}
        inputProps={{ 'aria-label': 'Nationality Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

 

    {/* Title */}
    
    <Typography variant="h6">
  9. Credit Card Details:
</Typography>

{/* Credit Card Type */}
<Grid container alignItems="center" sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" sx={{ display: 'inline' }}>
      Credit Card Type:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.creditCardType}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('creditCardType',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'creditCardType')}
        inputProps={{ 'aria-label': 'Credit Card Type Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* Credit Card Number */}
<Grid container alignItems="center" sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" sx={{ display: 'inline' }}>
      Credit Card No.:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.creditCardNo}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('creditCardNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'creditCardNo')}
        inputProps={{ 'aria-label': 'Credit Card No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* Issued By */}
<Grid container alignItems="center" sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" sx={{ display: 'inline' }}>
      Issued By:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.creditCardIssuedBy}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('creditCardIssuedBy',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'creditCardIssuedBy')}
        inputProps={{ 'aria-label': 'Credit Card Issued By Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>




 
  <Grid container spacing={2} alignItems="center">
    {/* Title */}
    <Grid item sm={6}>
      <Typography variant="h6" sx={{ display: 'inline' }}>
        10. E-mail Address:
      </Typography>
    </Grid>

    {/* Email Addresses */}
    <Grid item sm={6}>
      {basicDetailsFormValues.emails.map((doc, index) => (
        <Typography key={index} variant="body1" sx={{ display: 'inline' ,marginLeft: '8px' }}>
          {`${index + 1}) ${doc.emailId}`}
        </Typography>
      ))}
    </Grid>
  </Grid>



  <Grid container spacing={2} alignItems="center">
  {/* Title */}
  <Grid item sm={6}>
    <Typography variant="h6" sx={{ display: 'inline' }}>
      11. Web URL address:
    </Typography>
  </Grid>

  {/* Web URL Address */}
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {/* Replace with actual data when available */}
        {`${basicDetailsFormValues.application.webURL||'N/A'}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('webURL',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'webURL')}
        inputProps={{ 'aria-label': 'Web URL Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>





<Box sx={{ margin: '20px 0' }}>
  <Typography variant="h6">
    12. Passport Details#:
  </Typography>

  {/* Passport No */}
  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Passport No.:
      </Typography>
    </Grid>
    <Grid item sm={6} container alignItems="center">
      <Grid item sm={5}>
        <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
          {`${basicDetailsFormValues3.indivAdditionalDetails.passportNo}`}
        </Typography>
      </Grid>
      <Grid item sm={7} container alignItems="center">
        <Checkbox
          checked={checkIsFieldChecked('passportNo',element.reviewId) || false}
          onChange={(e) => handleCheckboxChange(e, 'passportNo')}
          inputProps={{ 'aria-label': 'Passport No Checkbox' }}
          disabled
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Passport Issuing Authority */}
  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Passport Issuing Authority:
      </Typography>
    </Grid>
    <Grid item sm={6} container alignItems="center">
      <Grid item sm={5}>
        <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
          {`${basicDetailsFormValues3.indivAdditionalDetails.passportIssuingAuthority}`}
        </Typography>
      </Grid>
      <Grid item sm={7} container alignItems="center">
        <Checkbox
          checked={checkIsFieldChecked('passportIssuingAuthority',element.reviewId) || false}
          onChange={(e) => handleCheckboxChange(e, 'passportIssuingAuthority')}
          inputProps={{ 'aria-label': 'Passport Issuing Authority Checkbox' }}
          disabled
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Passport Expiry Date */}
  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Passport Expiry Date (dd/mm/yyyy):
      </Typography>
    </Grid>
    <Grid item sm={6} container alignItems="center">
      <Grid item sm={5}>
        <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
          {formatDate(basicDetailsFormValues3.indivAdditionalDetails.passportExpiryDate)}
        </Typography>
      </Grid>
      <Grid item sm={7} container alignItems="center">
        <Checkbox
          checked={checkIsFieldChecked('passportExpiryDate',element.reviewId) || false}
          onChange={(e) => handleCheckboxChange(e, 'passportExpiryDate')}
          inputProps={{ 'aria-label': 'Passport Expiry Date Checkbox' }}
          disabled
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Passport Document */}
  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1" sx={{ display: 'inline' }}>
        Passport Document:
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {basicDetailsFormValues3.applicationDocument
          .filter(doc => doc.documentTitle === "passportDocument") // Filter for passportDocument
          .map((doc, index) => (
            <React.Fragment key={index}>
              <Link
                onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Use correct doc for downloading
                sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '8px' }} // Set text color to red and underline, add margin
              >
                View
              </Link>
              <Grid item sm={3} container justifyContent="flex-start">
                <Checkbox
                  checked={checkIsDocChecked(doc.appDocId, element.reviewId) || false}
                  onChange={(e) => handleCheckboxChanges(e, 'passportDocument', doc.appDocId)} // Pass appDocId here
                  inputProps={{ 'aria-label': 'Passport Document Checkbox' }}
                  disabled
                />
              </Grid>
            </React.Fragment>
          ))}
      </Box>
    </Grid>
  </Grid>
</Box>




<Typography variant="h6">
  14. Pan Card Details#:
</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  {/* Pan Card No */}
  <Grid item sm={6}>
    <Typography variant="body1">
      Pan Card No.:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.pan}`}
      </Typography>
    </Grid>
    <Grid item sm={7} container alignItems="center">
      <Checkbox
        checked={checkIsFieldChecked('panCardNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'panCardNo')}
        inputProps={{ 'aria-label': 'Pan Card No Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* Pan Card Document */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" sx={{ display: 'inline' }}>
      Pan Card Document:
    </Typography>
  </Grid>
  <Grid item sm={6}>
    <Box sx={{ display: 'flex', alignItems: 'center'}}>
      {basicDetailsFormValues3.applicationDocument
        .filter(doc => doc.documentTitle === "panDocument") // Filter for panDocument
        .map((doc, index) => (
          <React.Fragment key={index}>
            <Link
              onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Use the correct document for downloading
              sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '8px' }} // Set text color to red and underline
            >
              View
            </Link>
            <Checkbox
               checked={checkIsDocChecked(doc.appDocId, element.reviewId) || false}
              onChange={(e) => handleCheckboxChanges(e, 'panDocument', doc.appDocId)} // Pass appDocId here
              inputProps={{ 'aria-label': 'Pan Document Checkbox' }}
              disabled
            />
          </React.Fragment>
        ))}
    </Box>
  </Grid>
</Grid>




<Typography variant="h6">
  15. ISP Details:
</Typography>

{/* ISP Name */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      ISP Name*:
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.ispName}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('ispName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'ispName')}
        inputProps={{ 'aria-label': 'ISP Name Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* ISP Website Address */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      ISP's Website Address: 
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.ispWebsite}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('ispWebsite',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'ispWebsite')}
        inputProps={{ 'aria-label': 'ISP Website Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>

{/* ISP Username */}
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      Your User Name at ISP: 
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Grid item sm={5}>
      <Typography variant="body1" sx={{ display: 'inline' }}>
        {`${basicDetailsFormValues3.indivAdditionalDetails.ispUsername}`}
      </Typography>
    </Grid>
    <Grid item sm={7}>
      <Checkbox
        checked={checkIsFieldChecked('ispUsername',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'ispUsername')}
        inputProps={{ 'aria-label': 'ISP Username Checkbox' }}
        disabled
      />
    </Grid>
  </Grid>
</Grid>




 
 
<Typography variant="h6">
  16. Personal Web page URL address:
</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      Personal Web page URL address: 
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Typography variant="body1">
      {`${basicDetailsFormValues3.indivAdditionalDetails.personalWebPage}`}
    </Typography>
    <Checkbox
      checked={checkIsFieldChecked('personalWebPage',element.reviewId) || false} // Check if the checkbox is checked
      onChange={(e) => handleCheckboxChange(e, 'personalWebPage')} // Handle checkbox state change
      inputProps={{ 'aria-label': 'Personal Web Page Checkbox' }} 
      disabled
    />
  </Grid>
</Grid>



  <Typography variant="h6">
  17. Capital in the business or profession *Rs:
</Typography>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">
      Capital in the business or profession *Rs.: 
    </Typography>
  </Grid>
  <Grid item sm={6} container alignItems="center">
    <Typography variant="body1">
      {`${basicDetailsFormValues3.indivAdditionalDetails.indivCapital}`}
    </Typography>
    <Checkbox
      checked={checkIsFieldChecked('indivCapital',element.reviewId) || false} 
      onChange={(e) => handleCheckboxChange(e, 'indivCapital')} 
      inputProps={{ 'aria-label': 'Indiv Capital Checkbox' }} 
      disabled
    />
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1" style={{ display: 'inline' }}>
      Capital Document:
    </Typography>
  </Grid>
  <Grid item sm={6}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {basicDetailsFormValues3.applicationDocument
        .filter(doc => doc.documentTitle === "capitalDocument") // Filter for capitalDocument
        .map((doc, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Link
              onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Change the handler function if needed
              sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }} // Set text color to red and underline
            >
              View
            </Link>
            <Checkbox
               checked={checkIsDocChecked(doc.appDocId, element.reviewId) || false}
              onChange={(e) => handleCheckboxChanges(e, 'capitalDocument', doc.appDocId)} // Pass appDocId here
              inputProps={{ 'aria-label': 'Capital Document Checkbox' }}
              sx={{ ml: 1 }} 
              disabled
            />
          </Box>
        ))}
    </Box>
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
        checked={checkIsFieldChecked('bankName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'bankName')}
        inputProps={{ 'aria-label': 'Bank Name Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('branchName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'branchName')}
        inputProps={{ 'aria-label': 'Branch Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('bankAccountNo',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'bankAccountNo')}
        inputProps={{ 'aria-label': 'Bank Account No Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('bankAccountType',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'bankAccountType')}
        inputProps={{ 'aria-label': 'Bank Account Type Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('bankName',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'bankName')}
        inputProps={{ 'aria-label': 'Bank Name Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('draftNumber',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'draftNumber')}
        inputProps={{ 'aria-label': 'Draft Number Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('issueDate',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'issueDate')}
        inputProps={{ 'aria-label': 'Issue Date Checkbox' }}
        disabled
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
        checked={checkIsFieldChecked('amount',element.reviewId) || false}
        onChange={(e) => handleCheckboxChange(e, 'amount')}
        inputProps={{ 'aria-label': 'Amount Checkbox' }}
        disabled
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
                checked={checkIsFieldChecked(location.locationName,element.reviewId) || false}
                disabled
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
          onClick={() => handleDownload(cpsDocument?.appDocId, cpsDocument.documentTitle)}
          sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '12px' }} // Increased margin
        >
          View
        </Link>
      )}
       <Checkbox
       disabled
       checked={checkIsDocChecked(cpsDocument?.appDocId, element.reviewId)}
      onChange={(e) => handleCheckboxChanges(e, 'individualCPSDocument', cpsDocument?.appDocId)} // Pass appDocId here
      inputProps={{ 'aria-label': 'Certification Practice Statement Checkbox' }}
    />
    </Box>
  </Grid>
</Grid>

</Box>
          <Grid container spacing={2}>
  <Grid item xs={12}>
    <Typography variant="h6" style={{ marginTop: '10px' }}>
      Remarks
    </Typography>
    <TextField
      multiline
      rows={4} 
      disabled
      variant="outlined"
      value={element?.remarks}
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


export default ViewCessationApplication;
