import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, Grid, RadioGroup, Radio, FormControlLabel, TableCell,Table, TableBody, TableContainer, TableHead, TableRow, IconButton, Link } from '@mui/material';
import { useSelector } from 'react-redux';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import DownloadIcon from '@mui/icons-material/Download';
import CityService from '../../../../service/AdminService/CityService';
import CountryService from '../../../../service/AdminService/CountryService';
import StateService from '../../../../service/AdminService/StateService';

const PreviewModal = ({checkedState,data}) => {
   
  const userName = useSelector((state)=>state.jwtAuthentication.username);
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
  return (
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

  {/* <Grid item sm={6}>
    <Typography variant="body1">Salutation:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues.application.salutation1}`}</Typography>
  </Grid> */}

<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Last Name/Surname:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues.application.lastName1}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">First Name:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues.application.firstName1}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Middle Name:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues.application.middleName1}`}</Typography>
  </Grid>
</Grid>



         
             <Typography variant="h6" >2.  Have you ever been known by any other name? If Yes:</Typography>
             <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Last Name/Surname:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues.application.lastName2}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">First Name:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues.application.firstName2}`}</Typography>
  </Grid>
</Grid>
<Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Middle Name:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues.application.middleName2}`}</Typography>
  </Grid>
</Grid>



<Typography variant="h6">3. Address:</Typography>
<Typography variant="h6">A. Residential Address*:</Typography>
  
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Flat/Door/Block No:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.blockNo}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name Of Premises/Building/Village:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.village}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.postOffice}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Area/Locality/Taluka/Subdivision:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.subDivision}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Town/City/District:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${getCityNameById(basicDetailsFormValues2.residentialAddress.city)}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">State/Union Territory:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${getStateNameById(basicDetailsFormValues2.residentialAddress.state)}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Pin:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.pin}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Telephone No:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.telephoneNo}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Fax:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.fax}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Mobile Phone No:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.residentialAddress.mobile}`}</Typography>
  </Grid>
  </Grid>
  
  
    <Typography variant="h6">B. Office Address*:</Typography>
  
    <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Flat/Door/Block No:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.blockNo}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Name Of Premises/Building/Village:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.village}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.postOffice}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Area/Locality/Taluka/Subdivision:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.subDivision}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Town/City/District:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${getCityNameById(basicDetailsFormValues2.officialAddress.city)}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">State/Union Territory:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${getStateNameById(basicDetailsFormValues2.officialAddress.state)}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Pin:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.pin}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Telephone No:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.telephoneNo}`}</Typography>
  </Grid>
  </Grid>
  <Grid container spacing={2} sx={{ ml: 1 }}>
  <Grid item sm={6}>
    <Typography variant="body1">Fax:</Typography>
  </Grid>
  <Grid item sm={6}>
    <Typography variant="body1">{`${basicDetailsFormValues2.officialAddress.fax|| 'N/A'}`}</Typography>
  </Grid>
</Grid>
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

  {/* Salutation */}
  {/* <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">Salutation:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.fsalutation}`}
      </Typography>
    </Grid>
</Grid> */}
<Grid container spacing={2} sx={{ ml: 1 }}>
    {/* Last Name/Surname */}
    <Grid item sm={6}>
      <Typography variant="body1">Last Name/Surname:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.flastName}`}
      </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    {/* First Name */}
    <Grid item sm={6}>
      <Typography variant="body1">First Name:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.ffirstName}`}
      </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    {/* Middle Name */}
    <Grid item sm={6}>
      <Typography variant="body1">Middle Name:</Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {`${basicDetailsFormValues.application.fmiddleName}`}
      </Typography>
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
    <Grid item sm={6}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {formatDate(basicDetailsFormValues.application.dob)}
      </Typography>
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
    <Grid item sm={6}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {`${basicDetailsFormValues.application.nationality}`}
      </Typography>
    </Grid>
  </Grid>


 

    {/* Title */}
    
      <Typography variant="h6">
        9. Credit Card Details:
      </Typography>
    

    {/* Credit Card Type */}
    <Grid container spacing={2} sx={{ml:1}}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Credit Card Type: 
      </Typography>
      </Grid>
      <Grid item sm={6}>
      <Typography variant="body1">
       {`${basicDetailsFormValues3.indivAdditionalDetails.creditCardType}`}
      </Typography>
      </Grid>
    </Grid>
   
    {/* Credit Card Number */}
    <Grid container spacing={2} sx={{ml:1}}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Credit Card No.: 
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {`${basicDetailsFormValues3.indivAdditionalDetails.creditCardNo}`}
      </Typography>
    </Grid>
</Grid>
    {/* Issued By */}
    <Grid container spacing={2} sx={{ml:1}}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Issued By: 
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {`${basicDetailsFormValues3.indivAdditionalDetails.creditCardIssuedBy}`}
      </Typography>
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
    <Grid item sm={6}>
      <Typography variant="body1" sx={{ display: 'inline', marginLeft: '8px' }}>
        {/* Replace with actual data when available */}
        {/* {`${basicDetailsFormValues.application.webURL}`} */}
      </Typography>
    </Grid>
  </Grid>




  <Box sx={{ margin: '20px 0' }}>
  <Typography variant="h6">
    12. Passport Details#:
  </Typography>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    {/* Passport No */}
    <Grid item sm={6}>
      <Typography variant="body1">
        Passport No.: 
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
       {`${basicDetailsFormValues3.indivAdditionalDetails.passportNo}`}
      </Typography>
    </Grid>
    </Grid>
    {/* Passport Issuing Authority */}
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Passport Issuing Authority: 
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
     {`${basicDetailsFormValues3.indivAdditionalDetails.passportIssuingAuthority}`}
      </Typography>
    </Grid>
</Grid>
    {/* Passport Expiry Date */}
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Passport Expiry Date (dd/mm/yyyy):
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
          {formatDate(basicDetailsFormValues3.indivAdditionalDetails.passportExpiryDate)}
      </Typography>
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
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        {basicDetailsFormValues3.applicationDocument
          .filter(doc => doc.documentTitle === "passportDocument") // Filter for passportDocument
          .map((doc, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              {/* View Icon */}
              <Link
                onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)} // Change the handler function if needed
                sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }} // Set text color to red and underline
            >
                View
            </Link>
            </Box>
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
    <Grid item sm={6}>
      <Typography variant="body1">
  {`${basicDetailsFormValues3.indivAdditionalDetails.pan}`}
      </Typography>
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
        {basicDetailsFormValues3.applicationDocument
          .filter(doc => doc.documentTitle === "panDocument") // Filter for panDocument
          .map((doc, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              {/* View Icon */}
              <Link
                onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)} // Change the handler function if needed
                sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }} // Set text color to red and underline
            >
                View
            </Link>
            </Box>
          ))}
    </Grid>
  </Grid>



  <Typography variant="h6">
    15. ISP Details:
  </Typography>

  <Grid container spacing={2} sx={{ ml: 1 }}>
    {/* ISP Name */}
    <Grid item sm={6}>
      <Typography variant="body1">
        ISP Name*:
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
         {`${basicDetailsFormValues3.indivAdditionalDetails.ispName}`}
      </Typography>
    </Grid>
    </Grid>
    {/* ISP Website Address */}
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        ISP's Website Address: 
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
      {`${basicDetailsFormValues3.indivAdditionalDetails.ispWebsite}`}
      </Typography>
    </Grid>
    </Grid>
    {/* ISP Username */}
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
      <Typography variant="body1">
        Your User Name at ISP: 
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {`${basicDetailsFormValues3.indivAdditionalDetails.ispUsername}`}
      </Typography>
    </Grid>
  </Grid>



 
 
      <Typography variant="h6">
        16. Personal Web page URL address:
      </Typography>
    
      <Grid container spacing={2} sx={{ml:1}}>
      <Grid item sm={6}>
      <Typography variant="body1">
        Personal Web page URL address: 
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
        {`${basicDetailsFormValues3.indivAdditionalDetails.personalWebPage}`}
      </Typography>
    </Grid>
  </Grid>


  
      <Typography variant="h6">
        14. Capital in the business or profession *Rs:
      </Typography>
    
      <Grid container spacing={2} sx={{ml:1}}>
      <Grid item sm={6}>
      <Typography variant="body1">
        Capital in the business or profession *Rs.: 
      </Typography>
    </Grid>
    <Grid item sm={6}>
      <Typography variant="body1">
         {`${basicDetailsFormValues3.indivAdditionalDetails.indivCapital}`}
      </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ml:1}}>
    <Grid item sm={6}>
      <Typography variant="body1" style={{ display: 'inline' }}>
        Capital Document:
      </Typography>
      
    </Grid>
    <Grid item sm={6}>
      {basicDetailsFormValues3.applicationDocument
        .filter(doc => doc.documentTitle === "capitalDocument") // Filter for capitalDocument
        .map((doc, index) => (
          <Box key={index} sx={{ display: 'inline', marginLeft: '8px' }}>
              <Link
                onClick={() => handleDownload(cpsDocument.appDocId, cpsDocument.documentTitle)} // Change the handler function if needed
                sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }} // Set text color to red and underline
            >
                View
            </Link>
          </Box>
        ))}
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

          <Typography variant="body1" gutterBottom >
            <b>Undertakings:</b>
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Typography variant="body1">
                  { "1. Whoever makes any misrepresentation to, or suppresses any material fact from the Controller or the Certifying Authority for obtaining any licence or Electronic Signature Certificate, as the case may be, shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both."}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Typography variant="h6">
                <b>Note:</b> All documents that you have uploaded must be submitted in physical copy.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

  );
};

export default PreviewModal;