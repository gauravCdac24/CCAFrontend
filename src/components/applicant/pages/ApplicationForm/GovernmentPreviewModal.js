import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, Grid, RadioGroup, Radio, FormControlLabel, TableCell,Table, TableBody, TableContainer, TableHead, TableRow, IconButton, Link } from '@mui/material';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import DownloadIcon from '@mui/icons-material/Download';
import FirmApplicationForm from '../../../../service/NewLicenseService/FirmApplicationForm';
import GovernmentAgencyForm from '../../../../service/NewLicenseService/GovernmentAgencyForm';
import CityService from '../../../../service/AdminService/CityService';
import CountryService from '../../../../service/AdminService/CountryService';
import StateService from '../../../../service/AdminService/StateService';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Importing View Icon
import { useSelector } from 'react-redux';


const GovernmentPreviewModal = ({checkedState,data}) => {
  
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const userName = useSelector((state)=>state.jwtAuthentication.username);
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

  useEffect(() => {
      CityService.getAllCityList().then(data => {
        console.log(data.data)
          setCities(data.data);
      }).catch(error => {
          console.error("Error fetching cities:", error);
      });
  }, []);




const getCountryNameById = (id) => {
      const country = countries.find(c => c.countryId === Number(id));
      return country ? country.countryName : 'Unknown';
  };
  
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
    
const [basicDetailsFormValues2, setBasicDetailsFormValues2] = useState({})
  // get second application form by userName
  useEffect(() => {
    if (userName) {
        console.log(userName);
        setLoading(true);

        FirmApplicationForm.getAllFirmApplication2(userName)
            .then((response) => {
                console.log(response.data);

              

                // Set state with both residential and official addresses
                setBasicDetailsFormValues2({
                    ...response.data, // Include other relevant data if needed
                    
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

const [basicDetailsFormValues7, setBasicDetailsFormValues7] = useState({ })
    // get second application form by userName
    useEffect(() => {
      if (userName) {
          console.log(userName);
          setLoading(true);
  
          FirmApplicationForm.getAllFirmApplication3(userName)
              .then((response) => {
                  console.log(response.data);
  
                
  
                  // Set state with both residential and official addresses
                  setBasicDetailsFormValues7({
                      ...response.data, // Include other relevant data if needed
                      
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

  const [basicDetailsFormValues8, setBasicDetailsFormValues8] = useState({ })
    // get second application form by userName
    useEffect(() => {
      if (userName) {
          console.log(userName);
          setLoading(true);
  
          FirmApplicationForm.getAllFirmApplication4(userName)
              .then((response) => {
                  console.log(response.data);
  
                
  
                  // Set state with both residential and official addresses
                  setBasicDetailsFormValues8({
                      ...response.data, // Include other relevant data if needed
                      
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
  console.log(basicDetailsFormValues8)

const handleDownloads = async (appDocId, documentTitle) => {
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

const [documents, setDocuments] = useState([]);
    useEffect(() => {
        if (userName) {
            setLoading(true);
            ApplicationForm.getApplicationForm6ByUsername(userName)
                .then((response) => {
                    console.log(response.data);
                    const documents = response.data.documents;
                    setDocuments(documents);
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

    return (
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
          
          <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Name of Organisation:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.orgName || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Administrative Ministry/Department:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.administrativeMinistry || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Under State/Central Government:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.orgType || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Flat/Door/Block No.:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.residential?.blockNo || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Name of Premises/Building/Village:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.residential?.village || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.residential?.postOffice || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Area/Locality/Taluka/Sub-Division:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.residential?.subDivision || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Town/City/District:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {getCityNameById(basicDetailsFormValues?.residential?.city)}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Pin:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.residential?.pin || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">State/Union Territory:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {getStateNameById(basicDetailsFormValues?.residential?.state || 'N/A')}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Telephone No.:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.telephoneNo || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Fax No.:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.fax || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Web page URL Address:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.webPageURL || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Name of the Head of Organisation:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {`${basicDetailsFormValues?.appGovtOrganizationApplication?.firstName || ''} ${basicDetailsFormValues?.appGovtOrganizationApplication?.middleName || ''} ${basicDetailsFormValues?.appGovtOrganizationApplication?.lastName || ''}`.trim() || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Designation:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.designation || 'N/A'}
      </Typography>
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">E-mail Address:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {basicDetailsFormValues?.appGovtOrganizationApplication?.emailId || 'N/A'}
      </Typography>
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
    <Grid item sm={6}>
        <Typography variant="body1">{bankDetails?.bankName || 'N/A'}</Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Branch*:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">{bankDetails?.branchName || 'N/A'}</Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Bank Account No.*:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">{bankDetails?.bankAccountNo || 'N/A'}</Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Type of Bank Account*:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">{bankDetails?.bankAccountType || 'N/A'}</Typography>
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
    <Grid item sm={6}>
        <Typography variant="body1">{bankDraft?.bankName || 'N/A'}</Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Draft/Pay Order No.:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">{bankDraft?.draftNumber || 'N/A'}</Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Date of Issue:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">{bankDraft?.issueDate || 'N/A'}</Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Amount:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">{bankDraft?.amount || 'N/A'}</Typography>
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
<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}style={{ marginTop: '10px' }}>
    34. Whether Certification Practice Statement is enclosed * : {cpsDocument ? 'Y' : 'N'}
    
    {/* Adding a Box to contain the link */}
    {cpsDocument && (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Link
                onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)} // Change the handler function if needed
                sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }} // Set text color to red and underline
            >
                view
            </Link>
        </Box>
    )}
</Typography>
 
</Box>


<Box sx={{ marginTop: '20px' }}>
  <Grid container direction="column" spacing={2}>
    {/* Static Label for Additional Documents */}
    <Grid item xs={12}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
       35. Document*:
      </Typography>
    </Grid>

    {/* Only render if documents is an array */}
    {Array.isArray(documents) && documents.length > 0 ? (
      documents.map((cpsDocument,index) => (
        <Grid container alignItems="center" spacing={2} key={cpsDocument.appDocId}>
          {/* Conditionally render the document title */}
          {cpsDocument.documentTitle !== 'CPSDocument' && (
            <Grid item sm={4} xs={12} sx={{ml:4}}>
              <Typography variant="body1">
               {index}. {cpsDocument.documentTitle}
              </Typography>
            </Grid>
          )}

          <Grid item sm={4} xs={12}>
            {cpsDocument.documentTitle !== 'CPSDocument' && cpsDocument && (
              <Box sx={{ display: 'flex', ml: 4 }}>
                {/* Conditionally render the "View" link if the document title is not "CPSDocument" */}
                <Link
                  onClick={() => handleDownloads(cpsDocument.appDocId, cpsDocument.documentTitle)}
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
              <Box>
                <Typography variant="h6"style={{ marginTop: '10px' }}>
                  <b>Note:</b> All documents that you have uploaded must be submitted in physical copy along with application form.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      );
    };
    

export default GovernmentPreviewModal;
