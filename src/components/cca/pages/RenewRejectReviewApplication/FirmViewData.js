import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Typography, Button, Box, Grid, RadioGroup, Radio, FormControlLabel, Link, TableCell, Tabs, Tab, IconButton, TableRow, TableBody, Table, TableHead, TableContainer, Paper, Checkbox, TextField, Collapse, InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import DownloadIcon from '@mui/icons-material/Download';
import FirmApplicationForm from '../../../../service/NewLicenseService/FirmApplicationForm';
import StateService from '../../../../service/AdminService/StateService';
import CityService from '../../../../service/AdminService/CityService';
import CountryService from '../../../../service/AdminService/CountryService';
import ApplicationReview from '../../../../service/NewLicenseService/ApplicationReview';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import CustomTabPanel from '../../../global/util/CustomTabPanel';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoaderProgress from '../../../global/common/LoaderProgress';
import dateFormatter from '../../../global/util/DateFormatter';

const FirmViewData = () => {
  const { id } = useParams();
  const userName = decrypt(id);
  console.log(userName);
  const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

  const reviewerUserName = useSelector((state) => state.jwtAuthentication.username);
  const [checkedRows, setCheckedRows] = useState({
    userName: userName,
    reviewerUserName: reviewerUserName,
    isRejected: true,
  });


  const [tabValue, setTabValue] = useState(0);
  const [collapseItem, setCollapseItem] = useState([]);
  const [basicDetailsFormValuess, setBasicDetailsFormValuess] = useState({})
  // get first application form by userName
  useEffect(() => {
    if (userName) {
      setLoading(true);
      ApplicationForm.getApplicationFormByUsername(userName)
        .then((response) => {

          setBasicDetailsFormValuess(response.data); // Set the parsed or direct object

        })
        .catch((error) => {
          console.error("Error fetching application form:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userName]);


  const [basicDetailesValues, setBasicDetailesValues] = useState({
    reviewApplications: [], reviewDocuments
      : [],
    reviewFields
      : []
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
  //-----------------------------------

  console.log("checkedRows--=-==--->", checkedRows);
  // alert(userName)
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({});




  // get first application form by userName
  useEffect(() => {
    if (userName) {
      setLoading(true);
      FirmApplicationForm.getAllFirmApplication(userName)
        .then((response) => {
          const { indivAddressDTO, appFirmApplication } = response.data;

          // Set residential and appFirmApplication data into the form values
          setBasicDetailsFormValues({
            residential: indivAddressDTO?.residential || {}, // Set residential address data
            firmApplication: appFirmApplication || {},      // Set firm application data
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

  console.log(basicDetailsFormValues);



  useEffect(() => {
    StateService.getAllStateList().then(data => {
      console.log(data.data)
      setStates(data.data);
    }).catch(error => {
      console.error("Error fetching states:", error);
    });
  }, []);

  useEffect(() => {
    CountryService.getAllCountryList().then(data => {
      console.log(data.data)
      setCountries(data.data);
    }).catch(error => {
      console.error("Error fetching countries:", error);
    });
  }, []);

  const getStateNameById = (id) => {
    console.log('State ID:', id);
    console.log('Available States:', states); // Log all states
    const state = states.find(s => {
      console.log(`Comparing ${s.stateId} with ${id}`); // Log comparison
      return s.stateId === Number(id);
    });
    console.log('Found state:', state); // Log the found state object
    return state ? state.stateName : 'Unknown';
  };
  const stateId = basicDetailsFormValues?.residential?.state || 'N/A'; // Use a fallback
  console.log('Residential State ID:', stateId);

  const getCityNameById = (id) => {
    const city = cities.find(c => c.cityId === Number(id));
    return city ? city.cityName : 'Unknown';
  };
  const getCountryNameById = (id) => {
    const country = countries.find(c => c.countryId === Number(id));
    return country ? country.countryName : 'Unknown';
  };

  useEffect(() => {
    CityService.getAllCityList().then(data => {
      console.log(data.data)
      setCities(data.data);
    }).catch(error => {
      console.error("Error fetching cities:", error);
    });
  }, []);

  const [basicDetailsFormValues2, setBasicDetailsFormValues2] = useState({})
  // get second application form by userName
  useEffect(() => {
    if (userName) {
      console.log(userName);
      setLoading(true);

      FirmApplicationForm.getAllFirmApplication2(userName)
        .then((response) => {
          console.log(response.data);

          // Destructure the response data
          const { appFirmApplication, applicationDocuments } = response.data;

          console.log("applicationDocuments", applicationDocuments)

          // Set state with the firm application details
          setBasicDetailsFormValues2({
            ...appFirmApplication, // Include other relevant data if needed
            applicationDocuments: applicationDocuments
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
  console.log("basicDetailsFormValues2", basicDetailsFormValues2)

  const [basicDetailsFormValues7, setBasicDetailsFormValues7] = useState({});
  const [filteredAppLocations, setFilteredAppLocations] = useState([]);

  useEffect(() => {
    if (userName) {
      console.log(userName);
      setLoading(true);

      FirmApplicationForm.getAllFirmApplication3(userName)
        .then((response) => {
          console.log(response.data);

          const filteredAppLocations = response.data.filteredAppLocations || [];

          // Mapping over the filteredAppLocations to extract addressDTO and appFirmApplication
          const updatedLocations = filteredAppLocations.map(location => {
            const matchingAddressDTO = location.addressDTOs?.find(
              (addressDTO) => addressDTO.addressId === location.addressId
            );

            const matchingAppFirmApplication = location.appFirmApplication?.find(
              (firmApp) => firmApp.addressId === location.addressId
            );

            return {
              ...location,
              addressDTO: matchingAddressDTO || {}, // Set empty object if no match found
              appFirmApplication: matchingAppFirmApplication || {}, // Set empty object if no match found
            };
          });

          // Extract appFirmApplication details
          const appFirmApplicationData = updatedLocations.map(location => ({
            partnerDetailId: location.appFirmApplication.partnerDetailId,
            salutation: location.appFirmApplication.salutation,
            firstName: location.appFirmApplication.firstName,
            middleName: location.appFirmApplication.middleName,
            lastName: location.appFirmApplication.lastName,
            telephoneNo: location.appFirmApplication.telephoneNo,
            mobileNo: location.appFirmApplication.mobileNo,
            fax: location.appFirmApplication.fax,
            emailId: location.appFirmApplication.emailId,
            passportNo: location.appFirmApplication.passportNo,
            nationality: location.appFirmApplication.nationality,
            personalWebPage: location.appFirmApplication.personalWebPage,
          }));

          // Set the state with both filteredAppLocations and appFirmApplication
          setFilteredAppLocations(updatedLocations);

          setBasicDetailsFormValues7({

            filteredAppLocations: updatedLocations,
            appFirmApplication: appFirmApplicationData, // Include the extracted appFirmApplication data
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

  console.log(basicDetailsFormValues7)

  const [basicDetailsFormValues8, setBasicDetailsFormValues8] = useState([]);

  useEffect(() => {
    if (userName) {
      console.log("Fetching data for user:", userName); // Log the userName to check it's being set
      setLoading(true);

      FirmApplicationForm.getAllFirmApplication4(userName)
        .then((response) => {
          console.log("Full API Response:", response.data); // Log the full response to verify the structure

          // Extract addressDTOs and FirmAuthorizedRepresentative data
          const filteredAppLocations = response.data?.addressDTOs || [];
          const FirmAuthorizedRepresentative = response?.data?.FirmAuthorizedRepresentative;

          console.log("Filtered Locations:", filteredAppLocations);
          console.log("Firm Authorized Representative:", FirmAuthorizedRepresentative);

          // Ensure both arrays contain data
          if (filteredAppLocations.length === 0 || FirmAuthorizedRepresentative.length === 0) {
            console.log("No data found in one of the arrays.");
            setBasicDetailsFormValues8([]);
            setLoading(false);
            return;
          }

          const updatedData = filteredAppLocations.map((location) => {
            console.log("Location addressId:", location.addressId, "Type:", typeof location.addressId);

            // Directly access the FirmAuthorizedRepresentative object instead of iterating over it
            const representative = FirmAuthorizedRepresentative ? {
              name: `${FirmAuthorizedRepresentative.salutation} ${FirmAuthorizedRepresentative.firstName} ${FirmAuthorizedRepresentative.middleName} ${FirmAuthorizedRepresentative.lastName}`.trim(),
              telephoneNo: FirmAuthorizedRepresentative.telephoneNo,
              fax: FirmAuthorizedRepresentative.fax,
              nationality: FirmAuthorizedRepresentative.nationality,
              natureOfBusiness: FirmAuthorizedRepresentative.natureOfBusiness,

            } : null;
            console.log("Representative:", representative);
            // Check if the location addressId matches the representative's addressId (directly compare)
            if (location.addressId === decrypt(FirmAuthorizedRepresentative?.addressId)) {
              return {
                name: `${FirmAuthorizedRepresentative.salutation} ${FirmAuthorizedRepresentative.firstName} ${FirmAuthorizedRepresentative.middleName} ${FirmAuthorizedRepresentative.lastName}`.trim(),
                telephoneNo: FirmAuthorizedRepresentative.telephoneNo,
                fax: FirmAuthorizedRepresentative.fax,
                nationality: FirmAuthorizedRepresentative.nationality,
                natureOfBusiness: FirmAuthorizedRepresentative.natureOfBusiness,
                addressId: location.addressId,
                blockNo: location.blockNo,
                postOffice: location.postOffice,
                subDivision: location.subDivision,
                village: location.village,
                pin: location.pin,
                city: location.city,
                state: location.state,
                country: location.country,
                addressType: location.addressType,

              };
            }

            return null; // If no match, return null
          }).filter(data => data !== null); // Filter out null values


          console.log("Updated Combined Data:", updatedData);

          // Set the combined data to the state
          setBasicDetailsFormValues8(updatedData);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("User name is not set.");
    }
  }, [userName]);




  console.log("basicDetailsFormValues8", basicDetailsFormValues8);

  const [basicDetailsFormValues3, setBasicDetailsFormValues3] = useState({
    indivAdditionalDetails: {},
    applicationDocument: []
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
  const [documents, setDocuments] = useState();
  useEffect(() => {
    if (userName) {
      setLoading(true);
      ApplicationForm.getApplicationForm6ByUsername(userName)
        .then((response) => {
          console.log(response.data);
          const documents = response.data.documents;
          setDocuments(documents);
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
    if (obj) {
      updatedObj = { ...checkedRows };
      delete updatedObj[rowId];
      setCheckedRows((updatedObj));

    } else {

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


  //   const handleFormSubmit = () => {
  //     ApplicationReview.addFirmApplicationReview(checkedRows)
  //         .then((response) => {
  //             console.log(response.data);
  //             showAlert({
  //                 messageTitle: 'Submitted',
  //                 messageContent: "Data to be submitted to user",
  //                 confirmText: 'Ok',
  //             });
  //         })
  //         .catch((err) => {
  //             showAlert({
  //                 messageTitle: 'Error',
  //                 messageContent: err.response?.data 
  //                     ? (typeof err.response.data === 'object' 
  //                         ? 'Your request cannot be processed at this time. Please try again later.' 
  //                         : err.response.data)
  //                     : 'Your request cannot be processed at this time. Please try again later.',
  //                 confirmText: 'Ok',
  //             });
  //         })
  //         .finally(() => {
  //             setLoading(false);  // Set loading state to false after the operation completes
  //         });
  // };

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

    const formData = new FormData();

    Object.entries(checkedRows).forEach(([key, value]) => {
      if (key === 'file1') {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    ApplicationForm.addAllAproved(formData)
      .then((response) => {
        //console.log(response.data)
        showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          onConfirm: () => window.location.href = '/cca/approvedreviewapplication',
        });

      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || 'Request failed. Please try again later.';
        showAlert({
          messageTitle: 'submited',
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




  const handleSubmit = () => {

    if (2 <= basicDetailesValues?.reviewApplications.length) {
      checkedRows.isreject = true;
    }
    ApplicationReview.addFirmApplicationReview(checkedRows)
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
          basicDetailesValues?.reviewApplications && Array.isArray(basicDetailesValues?.reviewApplications) && basicDetailesValues?.reviewApplications.length > 0 ? (<>
            {
              basicDetailesValues?.reviewApplications
                .filter(element => element.status === "Active")
                .map((element, index) => (
                  <Box component="form" noValidate sx={{ mt: 2, p: 2 }} autoComplete>
                    <Box sx={{ width: '100%' }}>


                      <Typography variant="h4" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        For Company/Firm/Body of Individuals/Association of Persons/Local Authority
                      </Typography>
                      <Box sx={{ borderBottom: '2px solid #000', width: '93%', marginTop: '1px' }} />
                    </Box>

                    <Box display="flex" alignItems="center">
                      <Typography variant="h6" style={{ marginRight: '8px', marginTop: '10px' }}>18. Registration Number*:</Typography>
                      <Typography variant="body1" style={{ marginRight: '8px', marginTop: '10px' }}>{basicDetailsFormValues?.firmApplication?.registrationNo || 'N/A'}</Typography>
                      <Checkbox
                        checked={checkIsFieldChecked('registrationNumber', element.reviewId) || false}
                        disabled
                        onChange={(e) => handleCheckboxChange(e, 'registrationNumber')}
                        inputProps={{ 'aria-label': 'Registration Number Checkbox' }}
                        style={{ marginTop: '10px' }}

                      />
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6" style={{ marginRight: '8px', marginTop: '10px' }}>19. Date of Incorporation/Agreement/Partnership *:</Typography>
                      <Typography variant="body1" style={{ marginRight: '8px', marginTop: '10px' }}>{formatDate(basicDetailsFormValues?.firmApplication?.incorporationDate || 'N/A')}</Typography>
                      <Checkbox
                        checked={checkIsFieldChecked('dateofPartnership', element.reviewId) || false}
                        disabled
                        onChange={(e) => handleCheckboxChange(e, 'dateofPartnership')}
                        inputProps={{ 'aria-label': 'Date of Partnership Checkbox' }}
                        style={{ marginTop: '10px' }}
                      />
                    </Box>
                    <Box >
                      <Typography variant="h6" style={{ marginTop: '10px' }} >20.  Particulars of Business, if any:*</Typography>
                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Name of Office:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.firmApplication.officeName || 'N/A'}
                            </Typography>
                          </Grid>

                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('officeName', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'officeName')}
                              inputProps={{ 'aria-label': 'Name of Office Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Flat/Door/Block No.:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.residential.blockNo || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('blockNo', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'blockNo')}
                              inputProps={{ 'aria-label': 'Flat/Door/Block No. Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Name of Premises/Building/Village:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.residential.village || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('premisesName', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'premisesName')}
                              inputProps={{ 'aria-label': 'Name of Premises Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.residential.postOffice || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('road', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'road')}
                              inputProps={{ 'aria-label': 'Road/Street/Lane Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Area/Locality/Taluka/Sub-Division:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.residential.subDivision || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('subDivision', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'subDivision')}
                              inputProps={{ 'aria-label': 'Area/Locality/Taluka/Sub-Division Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Town/City/District:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {getCityNameById(basicDetailsFormValues.residential.city || 'N/A')}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('city', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'city')}
                              inputProps={{ 'aria-label': 'Town/City/District Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Pin:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.residential.pin || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('pin', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'pin')}
                              inputProps={{ 'aria-label': 'Pin Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">State/Union Territory:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {getStateNameById(basicDetailsFormValues.residential.state || 'N/A')}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('state', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'state')}
                              inputProps={{ 'aria-label': 'State/Union Territory Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Telephone No.:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.firmApplication.telephoneNo || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('telephoneNo', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'telephoneNo')}
                              inputProps={{ 'aria-label': 'Telephone No. Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Fax:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.firmApplication.fax || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('fax', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'fax')}
                              inputProps={{ 'aria-label': 'Fax Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Web page URL address, if any:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.firmApplication.webPageURL || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('webPageURL', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'webPageURL')}
                              inputProps={{ 'aria-label': 'Web page URL Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">No. of Branches:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.firmApplication.noOfBranches || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('noOfBranches', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'noOfBranches')}
                              inputProps={{ 'aria-label': 'No. of Branches Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        <Grid item sm={5}>
                          <Typography variant="body1">Nature of Business:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues.firmApplication.natureOfBusiness || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('natureOfBusiness', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'natureOfBusiness')}
                              inputProps={{ 'aria-label': 'Nature of Business Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                    </Box>


                    <Box>
                      <Grid container spacing={2}>
                        {/* Paid Up Capital */}
                        <Grid item sm={5}>
                          <Typography variant="h6" style={{ marginTop: '10px' }}>
                            21. Income Tax PAN No.:*
                          </Typography>
                        </Grid>

                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues2.pan || 'N/A'}
                            </Typography>
                          </Grid>

                          <Grid item sm={4} container alignItems="center">
                            {(() => {
                              // Find the latest firmPanCardDocument
                              const latestDoc = basicDetailsFormValues2.applicationDocuments
                                ?.filter(doc => doc.documentTitle === 'firmPanCardDocument')
                                .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))[0]; // Sort in descending order

                              if (latestDoc) {
                                return (
                                  <React.Fragment key={latestDoc.appDocId}>
                                    <Link
                                      onClick={() => handleDownload(latestDoc.appDocId, latestDoc.documentTitle)}
                                      sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '8px' }}
                                    >
                                      View
                                    </Link>

                                    <Checkbox
                                      checked={checkIsDocChecked(latestDoc?.appDocId, element.reviewId)}
                                      onChange={(e) => handleCheckboxChanges(e, 'firmPanCardDocument', latestDoc.appDocId)}
                                      inputProps={{ 'aria-label': 'Income Tax PAN Checkbox' }}
                                      disabled
                                    />
                                  </React.Fragment>
                                );
                              }
                              return null;
                            })()}
                          </Grid>

                        </Grid>
                      </Grid>



                      <Grid container spacing={2}>
                        {/* Turnover in the last financial year */}
                        <Grid item sm={8}>
                          <Typography variant="h6" style={{ marginTop: '10px' }}>
                            22. Turnover in the last financial year (Rs):*
                          </Typography>
                        </Grid>
                        <Grid item sm={4} container alignItems="center">
                          <Grid item sm={8}>
                            <Typography variant="body1" style={{ marginTop: '10px' }}>
                              {basicDetailsFormValues2.firmTurnover || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={4} justifyContent="flex-start">
                            <Checkbox
                              checked={checkIsFieldChecked('Turnover', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'Turnover')}
                              inputProps={{ 'aria-label': 'Turnover Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>


                      <Grid container spacing={2}>
                        {/* Net Worth */}
                        <Grid item sm={5}>
                          <Typography variant="h6" style={{ marginTop: '10px' }}>
                            23. Net Worth (Rs):*
                          </Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues2.firmNetWorth || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} container alignItems="center">
                            {(() => {
                              // Find the latest document with status "Active"
                              const latestDoc = basicDetailsFormValues2.applicationDocuments
                                ?.filter(doc => doc.documentTitle === "firmNetWorthDocument")
                                .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))[0]; // Sorting in descending order

                              if (latestDoc) {
                                return (
                                  <React.Fragment key={latestDoc.appDocId}>
                                    <Link
                                      onClick={() => handleDownload(latestDoc.appDocId, latestDoc.documentTitle)}
                                      sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                      View
                                    </Link>
                                    <Grid item sm={3} container justifyContent="flex-start">
                                      <Checkbox
                                        checked={checkIsDocChecked(latestDoc?.appDocId, element.reviewId)}
                                        onChange={(e) => handleCheckboxChanges(e, 'firmNetWorthDocument', latestDoc.appDocId)}
                                        inputProps={{ 'aria-label': 'Net Worth Checkbox' }}
                                        disabled
                                      />
                                    </Grid>
                                  </React.Fragment>
                                );
                              }
                              return null;
                            })()}
                          </Grid>

                        </Grid>
                      </Grid>


                      <Grid container spacing={2}>
                        {/* Paid Up Capital */}
                        <Grid item sm={5}>
                          <Typography variant="h6" style={{ marginTop: '10px' }}>
                            24. Paid Up Capital (Rs):*
                          </Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues2.paidUpCapital || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7} container alignItems="center">
                            {(() => {
                              // Find the latest document based on updateDate
                              const latestDoc = basicDetailsFormValues2.applicationDocuments
                                ?.filter(doc => doc.documentTitle === "paidUpCapitalDocument")
                                .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))[0]; // Sorting in descending order

                              if (latestDoc) {
                                return (
                                  <React.Fragment key={latestDoc.appDocId}>
                                    <Link
                                      onClick={() => handleDownload(latestDoc.appDocId, latestDoc.documentTitle)}
                                      sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '8px' }}
                                    >
                                      View
                                    </Link>
                                    <Grid item sm={3} container justifyContent="flex-start">
                                      <Checkbox
                                        checked={checkIsDocChecked(latestDoc?.appDocId, element.reviewId)}
                                        onChange={(e) => handleCheckboxChanges(e, 'firmPaidUpCapitalDocument', latestDoc.appDocId)}
                                        inputProps={{ 'aria-label': 'Paid Up Capital Checkbox' }}
                                        disabled
                                      />
                                    </Grid>
                                  </React.Fragment>
                                );
                              }
                              return null;
                            })()}
                          </Grid>

                        </Grid>
                      </Grid>

                      {/* <Grid container spacing={2} sx={{ ml: 1 }}> */}
                      {/* Insurance Details */}

                      <Typography variant="h6" style={{ marginTop: '10px' }}>25. Insurance Details:</Typography>
                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        {/* Insurance Policy No. */}
                        <Grid item sm={6}>
                          <Typography variant="body1">Insurance Policy No.*:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues2.insurancePolicyNo || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7}>
                            <Checkbox
                              checked={checkIsFieldChecked('insurancePolicyNo', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'insurancePolicyNo')}
                              inputProps={{ 'aria-label': 'Insurance Policy No Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ ml: 1 }}>
                        {/* Insurer Company */}
                        <Grid item sm={6}>
                          <Typography variant="body1">Insurer Company*:</Typography>
                        </Grid>
                        <Grid item sm={6} container alignItems="center">
                          <Grid item sm={5}>
                            <Typography variant="body1">
                              {basicDetailsFormValues2.insuranceCompany || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item sm={7}>
                            <Checkbox
                              checked={checkIsFieldChecked('insuranceCompany', element.reviewId) || false}
                              disabled
                              onChange={(e) => handleCheckboxChange(e, 'insuranceCompany')}
                              inputProps={{ 'aria-label': 'Insurer Company Checkbox' }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                    </Box>


                    {basicDetailsFormValues8.map((data, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>

                        <Typography variant="h6" style={{ marginTop: '10px' }}>27. Authorized Representative*</Typography>
                        {/* Name */}
                        <Grid container spacing={2} sx={{ ml: 1 }}>
                          <Grid item sm={6}>
                            <Typography variant="body1">Name:</Typography>
                          </Grid>
                          <Grid item sm={6} container alignItems="center">
                            <Grid item sm={5}>
                              <Typography variant="body1">{data.name || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationName', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationName')}
                                inputProps={{ 'aria-label': 'authorizedReprestationName Checkbox' }}
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
                              <Typography variant="body1">{data.blockNo || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationBlockNo', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationBlockNo')}
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
                              <Typography variant="body1">{data.village || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationVillage', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationVillage')}
                                inputProps={{ 'aria-label': 'Village Checkbox' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Road/Street/Lane/Post Office */}
                        <Grid container spacing={2} sx={{ ml: 1 }}>
                          <Grid item sm={6}>
                            <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
                          </Grid>
                          <Grid item sm={6} container alignItems="center">
                            <Grid item sm={5}>
                              <Typography variant="body1">{data.postOffice || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationPostOffice', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationPostOffice')}
                                inputProps={{ 'aria-label': 'Post Office Checkbox' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Area/Locality/Taluka/Sub-Division */}
                        <Grid container spacing={2} sx={{ ml: 1 }}>
                          <Grid item sm={6}>
                            <Typography variant="body1">Area/Locality/Taluka/Sub-Division:</Typography>
                          </Grid>
                          <Grid item sm={6} container alignItems="center">
                            <Grid item sm={5}>
                              <Typography variant="body1">{data.subDivision || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationSubDivision', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationSubDivision')}
                                inputProps={{ 'aria-label': 'Sub Division Checkbox' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Town/City/District */}
                        <Grid container spacing={2} sx={{ ml: 1 }}>
                          <Grid item sm={6}>
                            <Typography variant="body1">Town/City/District:</Typography>
                          </Grid>
                          <Grid item sm={6} container alignItems="center">
                            <Grid item sm={5}>
                              <Typography variant="body1">{getCityNameById(data.city) || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationCity', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationCity')}
                                inputProps={{ 'aria-label': 'City Checkbox' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Pin */}
                        <Grid container spacing={2} sx={{ ml: 1 }}>
                          <Grid item sm={6}>
                            <Typography variant="body1">Pin:</Typography>
                          </Grid>
                          <Grid item sm={6} container alignItems="center">
                            <Grid item sm={5}>
                              <Typography variant="body1">{data.pin || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationPin', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationPin')}
                                inputProps={{ 'aria-label': 'Pin Checkbox' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* State/Union Territory */}
                        <Grid container spacing={2} sx={{ ml: 1 }}>
                          <Grid item sm={6}>
                            <Typography variant="body1">State/Union Territory:</Typography>
                          </Grid>
                          <Grid item sm={6} container alignItems="center">
                            <Grid item sm={5}>
                              <Typography variant="body1">{getStateNameById(data.state) || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationState', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationState')}
                                inputProps={{ 'aria-label': 'State Checkbox' }}
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
                              <Typography variant="body1">{data.telephoneNo || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationTelephoneNo', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationTelephoneNo')}
                                inputProps={{ 'aria-label': 'Telephone No Checkbox' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Fax */}
                        <Grid container spacing={2} sx={{ ml: 1 }}>
                          <Grid item sm={6}>
                            <Typography variant="body1">Fax:</Typography>
                          </Grid>
                          <Grid item sm={6} container alignItems="center">
                            <Grid item sm={5}>
                              <Typography variant="body1">{data.fax || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationFax', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationFax')}
                                inputProps={{ 'aria-label': 'Fax Checkbox' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Nature of Business */}
                        <Grid container spacing={2} sx={{ ml: 1 }}>
                          <Grid item sm={6}>
                            <Typography variant="body1">Nature of Business:</Typography>
                          </Grid>
                          <Grid item sm={6} container alignItems="center">
                            <Grid item sm={5}>
                              <Typography variant="body1">{data.natureOfBusiness || 'N/A'}</Typography>
                            </Grid>
                            <Grid item sm={7}>
                              <Checkbox
                                checked={checkIsFieldChecked('authorizedReprestationNatureOfBusiness', element.reviewId) || false}
                                disabled
                                onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationNatureOfBusiness')}
                                inputProps={{ 'aria-label': 'Nature of Business Checkbox' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}

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
                              checked={checkIsFieldChecked('bankName', element.reviewId) || false}
                              disabled
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
                              checked={checkIsFieldChecked('branchName', element.reviewId) || false}
                              disabled
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
                              checked={checkIsFieldChecked('bankAccountNo', element.reviewId) || false}
                              disabled
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
                              checked={checkIsFieldChecked('bankAccountType', element.reviewId) || false}
                              disabled
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
                                  checked={checkIsFieldChecked('bankName', element.reviewId) || false}
                                  disabled
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
                                  checked={checkIsFieldChecked('draftNumber', element.reviewId) || false}
                                  disabled
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
                                  checked={checkIsFieldChecked('issueDate', element.reviewId) || false}
                                  disabled
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
                                  checked={checkIsFieldChecked('amount', element.reviewId) || false}
                                  disabled
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
                                    checked={checkIsFieldChecked(location.locationName, element.reviewId) || false}
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
                                onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)}
                                sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '12px' }} // Increased margin
                              >
                                View
                              </Link>
                            )}
                            <Checkbox
                              checked={checkIsDocChecked(cpsDocument?.appDocId, element.reviewId)}
                              disabled
                              onChange={(e) => handleCheckboxChanges(e, 'firmCPSDocument', cpsDocument.appDocId)} // Pass appDocId here
                              inputProps={{ 'aria-label': 'Certification Practice Statement Checkbox' }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box sx={{ marginTop: '20px' }}>
                      <Grid container direction="column" spacing={2}>
                        {/* Static Label for Additional Documents */}
                        <Grid item xs={12}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            35. Additional Document*:
                          </Typography>
                        </Grid>

                        {/* Only render if documents is an array */}
                        {Array.isArray(documents) && documents.length > 0 ? (
                          documents.map((cpsDocument) => (
                            <Grid container alignItems="center" spacing={2} key={cpsDocument.appDocId}>
                              {/* Conditionally render the document title */}
                              {cpsDocument.documentTitle !== 'CPSDocument' && (
                                <Grid item sm={4} xs={12} sx={{ ml: 4 }}>
                                  <Typography variant="body1" sx={{ display: 'inline', fontWeight: 'normal' }}>
                                    {cpsDocument.documentTitle}
                                  </Typography>
                                </Grid>
                              )}

                              <Grid item sm={4} xs={12}>
                                {cpsDocument.documentTitle !== 'CPSDocument' && cpsDocument && (
                                  <Box display="flex" alignItems="center" justifyContent="space-between">
                                    {/* Conditionally render the "View" link if the document title is not "CPSDocument" */}
                                    <Link
                                      onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)}
                                      sx={{
                                        color: 'red',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        marginRight: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      View
                                    </Link>

                                    {/* Render the checkbox for every document */}
                                    <Checkbox
                                      checked={checkIsFieldChecked(cpsDocument?.appDocId, element.reviewId) || false}
                                      disabled
                                      onChange={(e) => handleCheckboxChanges(e, cpsDocument.documentTitle, cpsDocument.appDocId)}
                                      inputProps={{ 'aria-label': 'Document Checkbox' }}
                                    />
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          ))
                        ) : (
                          <Typography>No documents available.</Typography> // Fallback message if documents is empty
                        )}
                      </Grid>
                    </Box>


                    <Typography variant="body1" gutterBottom >
                      <b>Undertakings:</b>
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box>
                          <Typography variant="body1">
                            1. Whoever makes any misrepresentation to, or suppresses any material fact from the Controller or the Certifying Authority for obtaining any licence or Electronic Signature Certificate, as the case may be, shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
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
                          rows={4}
                          // disabled
                          variant="outlined"
                          value={element?.ccaRemarks}
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


                    {/* Buttons */}
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
                      {/* <Grid item>
              <Button
                type="button"
                variant="contained"
                sx={{ maxWidth: '120px', height: '40px', color: '#FFFFFF', backgroundColor: 'black' }}
                aria-label="Reset"
               onClick={handleApprovedSubmit}
              >
               {2<=  basicDetailesValues?.reviewApplications.length? 'Recommand for Rejection' : 'Rejected'}
              </Button>
            </Grid> */}
                    </Grid>
                  </Box>
                ))
            }</>) : (<Box sx={{ textAlign: 'center', mt: 4 }}>
              No Records Found
            </Box>)

        }
      </CustomTabPanel >

      <CustomTabPanel value={tabValue} index={1}>

        {
          basicDetailesValues?.reviewApplications && Array.isArray(basicDetailesValues?.reviewApplications) && basicDetailesValues?.reviewApplications.length > 0 ? (<>
            {
              basicDetailesValues?.reviewApplications
                .filter(element => element?.ccaRemarks) // Only elements with non-null ccaRemarks
                .map((element, index) => (

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

                    <Collapse in={collapseItem[index]} sx={{ pl: 1, pr: 1, backgroundColor: 'primary.light', color: 'bodycolor.text' }}>
                      <Box component="form" noValidate sx={{ mt: 2, p: 2 }} autoComplete>
                        <Box sx={{ width: '100%' }}>


                          <Typography variant="h4" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            For Company/Firm/Body of Individuals/Association of Persons/Local Authority
                          </Typography>
                          <Box sx={{ borderBottom: '2px solid #000', width: '93%', marginTop: '1px' }} />
                        </Box>

                        <Box display="flex" alignItems="center">
                          <Typography variant="h6" style={{ marginRight: '8px', marginTop: '10px' }}>18. Registration Number*:</Typography>
                          <Typography variant="body1" style={{ marginRight: '8px', marginTop: '10px' }}>{basicDetailsFormValues?.firmApplication?.registrationNo || 'N/A'}</Typography>
                          <Checkbox
                            checked={checkIsFieldChecked('registrationNumber', element.reviewId) || false}
                            disabled
                            onChange={(e) => handleCheckboxChange(e, 'registrationNumber')}
                            inputProps={{ 'aria-label': 'Registration Number Checkbox' }}
                            style={{ marginTop: '10px' }}

                          />
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h6" style={{ marginRight: '8px', marginTop: '10px' }}>19. Date of Incorporation/Agreement/Partnership *:</Typography>
                          <Typography variant="body1" style={{ marginRight: '8px', marginTop: '10px' }}>{formatDate(basicDetailsFormValues?.firmApplication?.incorporationDate || 'N/A')}</Typography>
                          <Checkbox
                            checked={checkIsFieldChecked('dateofPartnership', element.reviewId) || false}
                            disabled
                            onChange={(e) => handleCheckboxChange(e, 'dateofPartnership')}
                            inputProps={{ 'aria-label': 'Date of Partnership Checkbox' }}
                            style={{ marginTop: '10px' }}
                          />
                        </Box>
                        <Box >
                          <Typography variant="h6" style={{ marginTop: '10px' }} >20.  Particulars of Business, if any:*</Typography>
                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Name of Office:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.firmApplication.officeName || 'N/A'}
                                </Typography>
                              </Grid>

                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('officeName', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'officeName')}
                                  inputProps={{ 'aria-label': 'Name of Office Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Flat/Door/Block No.:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.residential.blockNo || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('blockNo', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'blockNo')}
                                  inputProps={{ 'aria-label': 'Flat/Door/Block No. Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Name of Premises/Building/Village:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.residential.village || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('premisesName', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'premisesName')}
                                  inputProps={{ 'aria-label': 'Name of Premises Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.residential.postOffice || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('road', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'road')}
                                  inputProps={{ 'aria-label': 'Road/Street/Lane Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Area/Locality/Taluka/Sub-Division:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.residential.subDivision || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('subDivision', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'subDivision')}
                                  inputProps={{ 'aria-label': 'Area/Locality/Taluka/Sub-Division Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Town/City/District:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {getCityNameById(basicDetailsFormValues.residential.city || 'N/A')}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('city', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'city')}
                                  inputProps={{ 'aria-label': 'Town/City/District Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Pin:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.residential.pin || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('pin', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'pin')}
                                  inputProps={{ 'aria-label': 'Pin Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">State/Union Territory:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {getStateNameById(basicDetailsFormValues.residential.state || 'N/A')}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('state', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'state')}
                                  inputProps={{ 'aria-label': 'State/Union Territory Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Telephone No.:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.firmApplication.telephoneNo || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('telephoneNo', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'telephoneNo')}
                                  inputProps={{ 'aria-label': 'Telephone No. Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Fax:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.firmApplication.fax || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('fax', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'fax')}
                                  inputProps={{ 'aria-label': 'Fax Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Web page URL address, if any:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.firmApplication.webPageURL || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('webPageURL', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'webPageURL')}
                                  inputProps={{ 'aria-label': 'Web page URL Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">No. of Branches:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.firmApplication.noOfBranches || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('noOfBranches', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'noOfBranches')}
                                  inputProps={{ 'aria-label': 'No. of Branches Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            <Grid item sm={5}>
                              <Typography variant="body1">Nature of Business:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues.firmApplication.natureOfBusiness || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('natureOfBusiness', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'natureOfBusiness')}
                                  inputProps={{ 'aria-label': 'Nature of Business Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                        </Box>


                        <Box>
                          <Grid container spacing={2}>
                            {/* Paid Up Capital */}
                            <Grid item sm={5}>
                              <Typography variant="h6" style={{ marginTop: '10px' }}>
                                21. Income Tax PAN No.:*
                              </Typography>
                            </Grid>

                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues2.pan || 'N/A'}
                                </Typography>
                              </Grid>

                              <Grid item sm={4} container alignItems="center">
                                {basicDetailsFormValues2.applicationDocuments?.map((doc, index) =>
                                  doc.documentTitle === 'firmPanCardDocument' && doc.status === "Active" && (
                                    <React.Fragment key={index}>
                                      <Link
                                        onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Change the handler function if needed
                                        sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '8px' }} // Set text color to red and underline
                                      >
                                        View
                                      </Link>

                                      <Checkbox
                                        checked={checkIsDocChecked(doc.appDocId, element.reviewId)}
                                        onChange={(e) => handleCheckboxChanges(e, 'firmPanCardDocument', doc.appDocId)} // Pass appDocId here
                                        inputProps={{ 'aria-label': 'Income Tax PAN Checkbox' }}
                                        disabled
                                      />
                                    </React.Fragment>
                                  )
                                )}
                              </Grid>
                            </Grid>
                          </Grid>



                          <Grid container spacing={2}>
                            {/* Turnover in the last financial year */}
                            <Grid item sm={8}>
                              <Typography variant="h6" style={{ marginTop: '10px' }}>
                                22. Turnover in the last financial year (Rs):*
                              </Typography>
                            </Grid>
                            <Grid item sm={4} container alignItems="center">
                              <Grid item sm={8}>
                                <Typography variant="body1" style={{ marginTop: '10px' }}>
                                  {basicDetailsFormValues2.firmTurnover || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={4} justifyContent="flex-start">
                                <Checkbox
                                  checked={checkIsFieldChecked('Turnover', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'Turnover')}
                                  inputProps={{ 'aria-label': 'Turnover Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>


                          <Grid container spacing={2}>
                            {/* Net Worth */}
                            <Grid item sm={5}>
                              <Typography variant="h6" style={{ marginTop: '10px' }}>
                                23. Net Worth (Rs):*
                              </Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues2.firmNetWorth || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} container alignItems="center">
                                {basicDetailsFormValues2.applicationDocuments?.map((doc, index) =>
                                  doc.documentTitle === "firmNetWorthDocument" && doc.status === "Active" && (
                                    <React.Fragment key={index}>
                                      <Link
                                        onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Change the handler function if needed
                                        sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }} // Set text color to red and underline
                                      >
                                        View
                                      </Link>
                                      <Grid item sm={3} container justifyContent="flex-start">


                                        <Checkbox
                                          checked={checkIsDocChecked(doc.appDocId, element.reviewId)}
                                          onChange={(e) => handleCheckboxChanges(e, 'firmNetWorthDocument', doc.appDocId)} // Pass appDocId here
                                          inputProps={{ 'aria-label': 'Net Worth Checkbox' }}
                                          disabled
                                        />
                                      </Grid>
                                    </React.Fragment>
                                  )
                                )}
                              </Grid>
                            </Grid>
                          </Grid>


                          <Grid container spacing={2}>
                            {/* Paid Up Capital */}
                            <Grid item sm={5}>
                              <Typography variant="h6" style={{ marginTop: '10px' }}>
                                24. Paid Up Capital (Rs):*
                              </Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues2.paidUpCapital || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7} container alignItems="center">
                                {basicDetailsFormValues2.applicationDocuments?.map((doc, index) => {
                                  // Check if the document title matches "firmPaidUpCapitalDocument"
                                  if (doc.documentTitle === "paidUpCapitalDocument" && doc.status === "Active") {
                                    return (
                                      <React.Fragment key={index}>
                                        <Link
                                          onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Change the handler function if needed
                                          sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '8px' }} // Set text color to red and underline, add margin
                                        >
                                          View
                                        </Link>
                                        <Grid item sm={3} container justifyContent="flex-start">
                                          {/* <Checkbox
      checked={checkedRows['firmPaidUpCapitalDocument'] === basicDetailsFormValues2.applicationDocuments?.find(doc => doc.documentTitle ==='firmPaidUpCapitalDocument')?.appDocId || false}
      onChange={(e) => handleCheckboxChangesForDocument(e, basicDetailsFormValues2.applicationDocuments?.find(doc => doc.documentTitle ==='firmPaidUpCapitalDocument')?.appDocId,'firmPaidUpCapitalDocument')}
      inputProps={{ 'aria-label': 'Paid Up Capital Checkbox' }}
    /> */}

                                          <Checkbox
                                            checked={checkIsDocChecked(doc.appDocId, element.reviewId)}
                                            onChange={(e) => handleCheckboxChanges(e, 'firmPaidUpCapitalDocument', doc.appDocId)} // Pass appDocId here
                                            inputProps={{ 'aria-label': 'Paid Up Capital Checkbox' }}
                                            disabled
                                          />
                                        </Grid>
                                      </React.Fragment>
                                    );
                                  }
                                  // Return null for other documents to avoid rendering checkboxes for them
                                  return null;
                                })}
                              </Grid>
                            </Grid>
                          </Grid>

                          {/* <Grid container spacing={2} sx={{ ml: 1 }}> */}
                          {/* Insurance Details */}

                          <Typography variant="h6" style={{ marginTop: '10px' }}>25. Insurance Details:</Typography>
                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            {/* Insurance Policy No. */}
                            <Grid item sm={6}>
                              <Typography variant="body1">Insurance Policy No.*:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues2.insurancePolicyNo || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7}>
                                <Checkbox
                                  checked={checkIsFieldChecked('insurancePolicyNo', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'insurancePolicyNo')}
                                  inputProps={{ 'aria-label': 'Insurance Policy No Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={2} sx={{ ml: 1 }}>
                            {/* Insurer Company */}
                            <Grid item sm={6}>
                              <Typography variant="body1">Insurer Company*:</Typography>
                            </Grid>
                            <Grid item sm={6} container alignItems="center">
                              <Grid item sm={5}>
                                <Typography variant="body1">
                                  {basicDetailsFormValues2.insuranceCompany || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item sm={7}>
                                <Checkbox
                                  checked={checkIsFieldChecked('insuranceCompany', element.reviewId) || false}
                                  disabled
                                  onChange={(e) => handleCheckboxChange(e, 'insuranceCompany')}
                                  inputProps={{ 'aria-label': 'Insurer Company Checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                        </Box>


                        {basicDetailsFormValues8.map((data, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>

                            <Typography variant="h6" style={{ marginTop: '10px' }}>27. Authorized Representative*</Typography>
                            {/* Name */}
                            <Grid container spacing={2} sx={{ ml: 1 }}>
                              <Grid item sm={6}>
                                <Typography variant="body1">Name:</Typography>
                              </Grid>
                              <Grid item sm={6} container alignItems="center">
                                <Grid item sm={5}>
                                  <Typography variant="body1">{data.name || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationName', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationName')}
                                    inputProps={{ 'aria-label': 'authorizedReprestationName Checkbox' }}
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
                                  <Typography variant="body1">{data.blockNo || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationBlockNo', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationBlockNo')}
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
                                  <Typography variant="body1">{data.village || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationVillage', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationVillage')}
                                    inputProps={{ 'aria-label': 'Village Checkbox' }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            {/* Road/Street/Lane/Post Office */}
                            <Grid container spacing={2} sx={{ ml: 1 }}>
                              <Grid item sm={6}>
                                <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
                              </Grid>
                              <Grid item sm={6} container alignItems="center">
                                <Grid item sm={5}>
                                  <Typography variant="body1">{data.postOffice || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationPostOffice', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationPostOffice')}
                                    inputProps={{ 'aria-label': 'Post Office Checkbox' }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            {/* Area/Locality/Taluka/Sub-Division */}
                            <Grid container spacing={2} sx={{ ml: 1 }}>
                              <Grid item sm={6}>
                                <Typography variant="body1">Area/Locality/Taluka/Sub-Division:</Typography>
                              </Grid>
                              <Grid item sm={6} container alignItems="center">
                                <Grid item sm={5}>
                                  <Typography variant="body1">{data.subDivision || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationSubDivision', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationSubDivision')}
                                    inputProps={{ 'aria-label': 'Sub Division Checkbox' }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            {/* Town/City/District */}
                            <Grid container spacing={2} sx={{ ml: 1 }}>
                              <Grid item sm={6}>
                                <Typography variant="body1">Town/City/District:</Typography>
                              </Grid>
                              <Grid item sm={6} container alignItems="center">
                                <Grid item sm={5}>
                                  <Typography variant="body1">{getCityNameById(data.city) || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationCity', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationCity')}
                                    inputProps={{ 'aria-label': 'City Checkbox' }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            {/* Pin */}
                            <Grid container spacing={2} sx={{ ml: 1 }}>
                              <Grid item sm={6}>
                                <Typography variant="body1">Pin:</Typography>
                              </Grid>
                              <Grid item sm={6} container alignItems="center">
                                <Grid item sm={5}>
                                  <Typography variant="body1">{data.pin || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationPin', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationPin')}
                                    inputProps={{ 'aria-label': 'Pin Checkbox' }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            {/* State/Union Territory */}
                            <Grid container spacing={2} sx={{ ml: 1 }}>
                              <Grid item sm={6}>
                                <Typography variant="body1">State/Union Territory:</Typography>
                              </Grid>
                              <Grid item sm={6} container alignItems="center">
                                <Grid item sm={5}>
                                  <Typography variant="body1">{getStateNameById(data.state) || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationState', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationState')}
                                    inputProps={{ 'aria-label': 'State Checkbox' }}
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
                                  <Typography variant="body1">{data.telephoneNo || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationTelephoneNo', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationTelephoneNo')}
                                    inputProps={{ 'aria-label': 'Telephone No Checkbox' }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            {/* Fax */}
                            <Grid container spacing={2} sx={{ ml: 1 }}>
                              <Grid item sm={6}>
                                <Typography variant="body1">Fax:</Typography>
                              </Grid>
                              <Grid item sm={6} container alignItems="center">
                                <Grid item sm={5}>
                                  <Typography variant="body1">{data.fax || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationFax', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationFax')}
                                    inputProps={{ 'aria-label': 'Fax Checkbox' }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            {/* Nature of Business */}
                            <Grid container spacing={2} sx={{ ml: 1 }}>
                              <Grid item sm={6}>
                                <Typography variant="body1">Nature of Business:</Typography>
                              </Grid>
                              <Grid item sm={6} container alignItems="center">
                                <Grid item sm={5}>
                                  <Typography variant="body1">{data.natureOfBusiness || 'N/A'}</Typography>
                                </Grid>
                                <Grid item sm={7}>
                                  <Checkbox
                                    checked={checkIsFieldChecked('authorizedReprestationNatureOfBusiness', element.reviewId) || false}
                                    disabled
                                    onChange={(e) => handleCheckboxChange(e, 'authorizedReprestationNatureOfBusiness')}
                                    inputProps={{ 'aria-label': 'Nature of Business Checkbox' }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}

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
                                  checked={checkIsFieldChecked('bankName', element.reviewId) || false}
                                  disabled
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
                                  checked={checkIsFieldChecked('branchName', element.reviewId) || false}
                                  disabled
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
                                  checked={checkIsFieldChecked('bankAccountNo', element.reviewId) || false}
                                  disabled
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
                                  checked={checkIsFieldChecked('bankAccountType', element.reviewId) || false}
                                  disabled
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
                                      checked={checkIsFieldChecked('bankName', element.reviewId) || false}
                                      disabled
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
                                      checked={checkIsFieldChecked('draftNumber', element.reviewId) || false}
                                      disabled
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
                                      checked={checkIsFieldChecked('issueDate', element.reviewId) || false}
                                      disabled
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
                                      checked={checkIsFieldChecked('amount', element.reviewId) || false}
                                      disabled
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
                                        checked={checkIsFieldChecked(location.locationName, element.reviewId) || false}
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
                                    onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)}
                                    sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', marginRight: '12px' }} // Increased margin
                                  >
                                    View
                                  </Link>
                                )}
                                <Checkbox
                                  checked={checkIsDocChecked(cpsDocument.appDocId, element.reviewId)}
                                  disabled
                                  onChange={(e) => handleCheckboxChanges(e, 'firmCPSDocument', cpsDocument.appDocId)} // Pass appDocId here
                                  inputProps={{ 'aria-label': 'Certification Practice Statement Checkbox' }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                        <Box sx={{ marginTop: '20px' }}>
                          <Grid container direction="column" spacing={2}>
                            {/* Static Label for Additional Documents */}
                            <Grid item xs={12}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                35. Additional Document*:
                              </Typography>
                            </Grid>

                            {/* Only render if documents is an array */}
                            {Array.isArray(documents) && documents.length > 0 ? (
                              documents.map((cpsDocument) => (
                                <Grid container alignItems="center" spacing={2} key={cpsDocument.appDocId}>
                                  {/* Conditionally render the document title */}
                                  {cpsDocument.documentTitle !== 'CPSDocument' && (
                                    <Grid item sm={4} xs={12} sx={{ ml: 4 }}>
                                      <Typography variant="body1" sx={{ display: 'inline', fontWeight: 'normal' }}>
                                        {cpsDocument.documentTitle}
                                      </Typography>
                                    </Grid>
                                  )}

                                  <Grid item sm={4} xs={12}>
                                    {cpsDocument.documentTitle !== 'CPSDocument' && cpsDocument && (
                                      <Box display="flex" alignItems="center" justifyContent="space-between">
                                        {/* Conditionally render the "View" link if the document title is not "CPSDocument" */}
                                        <Link
                                          onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)}
                                          sx={{
                                            color: 'red',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            marginRight: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                          }}
                                        >
                                          View
                                        </Link>

                                        {/* Render the checkbox for every document */}
                                        <Checkbox
                                          checked={checkIsFieldChecked(cpsDocument.appDocId, element.reviewId) || false}
                                          disabled
                                          onChange={(e) => handleCheckboxChanges(e, cpsDocument.documentTitle, cpsDocument.appDocId)}
                                          inputProps={{ 'aria-label': 'Document Checkbox' }}
                                        />
                                      </Box>
                                    )}
                                  </Grid>
                                </Grid>
                              ))
                            ) : (
                              <Typography>No documents available.</Typography> // Fallback message if documents is empty
                            )}
                          </Grid>
                        </Box>


                        <Typography variant="body1" gutterBottom >
                          <b>Undertakings:</b>
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box>
                              <Typography variant="body1">
                                1. Whoever makes any misrepresentation to, or suppresses any material fact from the Controller or the Certifying Authority for obtaining any licence or Electronic Signature Certificate, as the case may be, shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both.
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
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
                              rows={4}
                              // disabled
                              variant="outlined"
                              value={element?.ccaRemarks}
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
            }</>) : (<Box sx={{ textAlign: 'center', mt: 4 }}>
              No Records Found
            </Box>)

        }

      </CustomTabPanel>
    </Box>

  );
};

export default FirmViewData;
