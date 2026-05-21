import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, Grid, RadioGroup, Radio, FormControlLabel, Link, TableCell, TableRow, TableBody, Table, TableHead, TableContainer, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import ApplicationForm from '../../../../service/RenewLicenseService/ApplicationForm';
import DownloadIcon from '@mui/icons-material/Download';
import FirmApplicationForm from '../../../../service/RenewLicenseService/FirmApplicationForm';
import StateService from '../../../../service/AdminService/StateService';
import CityService from '../../../../service/AdminService/CityService';
import CountryService from '../../../../service/AdminService/CountryService';

const FirmViewData = ({userName}) => {
   

    // const userName = useSelector((state)=>state.jwtAuthentication.username);
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
          const { appFirmApplication,applicationDocuments } = response.data;

          console.log("applicationDocuments",applicationDocuments)

          // Set state with the firm application details
          setBasicDetailsFormValues2({
            ...appFirmApplication, // Include other relevant data if needed
            applicationDocuments:applicationDocuments.filter(doc => 
              doc.documentTitle.startsWith('firm')
            ),
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
console.log("basicDetailsFormValues2",basicDetailsFormValues2)




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
      console.log(userName);
      setLoading(true);

      FirmApplicationForm.getAllFirmApplication4(userName)
        .then((response) => {
          const filteredAppLocations = response.data?.addressDTOs || [];
          const FirmAuthorizedRepresentative=response.data?.FirmAuthorizedRepresentative	||[];
          console.log("FirmAuthorizedRepresentative:", FirmAuthorizedRepresentative);
          const updatedLocations = filteredAppLocations.map((location) => {
            console.log("Location:", location); // Log each location object

            // Get the first addressDTO if available
            const addressDTO = location || {}; 
            console.log("addressDTO:", addressDTO); 
            const firmAuthorizedRepresentative = FirmAuthorizedRepresentative.map(rep => ({
              name: `${rep.salutation} ${rep.firstName} ${rep.middleName} ${rep.lastName}`.trim(),
              telephoneNo: rep.telephoneNo,
              fax: rep.fax,
              nationality: rep.nationality,
              natureOfBusiness: rep.natureOfBusiness,
            }));

            return {
              ...location,
              addressDTO: addressDTO, // Directly use the first addressDTO
              firmAuthorizedRepresentative: firmAuthorizedRepresentative || [],
            };
          });

          // Structure the data for display
          const authorizedRepresentativeData = updatedLocations.map((location) => ({
            name: location.firmAuthorizedRepresentative[0]?.name || '',
            blockNo: location.addressDTO?.blockNo || '',
            village: location.addressDTO?.village || '',
            postOffice: location.addressDTO?.postOffice || '',
            subDivision: location.addressDTO?.subDivision || '',
            city: `${location.addressDTO?.city || ''}`,
            state: ` ${location.addressDTO?.state || ''}`,
            pin: ` ${location.addressDTO?.pin || ''}`,
            telephoneNo: location.firmAuthorizedRepresentative[0]?.telephoneNo || '',
            fax: location.firmAuthorizedRepresentative[0]?.fax || '',
            natureOfBusiness: location.firmAuthorizedRepresentative[0]?.natureOfBusiness || '',
          }));

          setBasicDetailsFormValues8(authorizedRepresentativeData);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userName]);

  
  

  console.log("basicDetailsFormValues8",basicDetailsFormValues8);

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

<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <Typography variant="h4" sx={{  overflow: 'hidden', textOverflow: 'ellipsis' }}>
        For Company/Firm/Body of Individuals/Association of Persons/Local Authority
    </Typography>
    <Box sx={{ borderBottom: '2px solid #000', width: '93%', marginTop: '1px' }} />
</Box>

<Box display="flex" alignItems="center">
  <Typography variant="h6" style={{ marginRight: '8px' ,marginTop:'10px'}}>18. Registration Number*:</Typography>
  <Typography variant="body1" style={{ marginRight: '8px' ,marginTop:'10px'}}>{basicDetailsFormValues?.firmApplication?.registrationNo || 'N/A'}</Typography>
</Box>
<Box display="flex" alignItems="center">
  <Typography variant="h6" style={{ marginRight: '8px' ,marginTop:'10px'}}>19. Date of Incorporation/Agreement/Partnership *:</Typography>
  <Typography variant="body1" style={{ marginRight: '8px' ,marginTop:'10px'}}>{formatDate(basicDetailsFormValues?.firmApplication?.incorporationDate || 'N/A')}</Typography>
</Box>


          <Box >
             <Typography variant="h6" style={{ marginTop:'10px'}} >20.  Particulars of Business, if any:*</Typography>
             <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Name of Office:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.firmApplication.officeName || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Flat/Door/Block No.:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.residential.blockNo || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Name of Premises/Building/Village:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.residential.village || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.residential.postOffice || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Area/Locality/Taluka/Sub-Division:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.residential.subDivision || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Town/City/District:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {getCityNameById(basicDetailsFormValues.residential.city || 'N/A')}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Pin:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.residential.pin || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">State/Union Territory:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {getStateNameById(basicDetailsFormValues.residential.state || 'N/A')}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Telephone No.:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.firmApplication.telephoneNo || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Fax:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.firmApplication.fax || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Web page URL address, if any:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.firmApplication.webPageURL || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">No. of Branches:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.firmApplication.noOfBranches || 'N/A'}
        </Typography>
    </Grid>
    </Grid>
    <Grid container spacing={2} sx={{ ml: 1 }}>
    <Grid item sm={6}>
        <Typography variant="body1">Nature of Business:</Typography>
    </Grid>
    <Grid item sm={6}>
        <Typography variant="body1">
            {basicDetailsFormValues.firmApplication.natureOfBusiness || 'N/A'}
        </Typography>
    </Grid>
</Grid>
</Box>
<Box>
      <Grid container spacing={2}>
        {/* Income Tax PAN No */}
        <Grid item sm={6}>
          <Typography variant="h6"style={{ marginTop:'10px'}}>21. Income Tax PAN No.:*</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1" style={{ marginTop:'10px'}}>{basicDetailsFormValues2.pan}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Turnover in the last financial year */}
        <Grid item sm={8}>
          <Typography variant="h6"style={{ marginTop:'10px'}}>22. Turnover in the last financial year (Rs):*</Typography>
        </Grid>
        <Grid item sm={4}>
          <Typography variant="body1" style={{ marginTop:'10px'}}>{basicDetailsFormValues2.firmTurnover}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Net Worth */}
        <Grid item sm={5}>
          <Typography variant="h6" style={{ marginTop:'10px'}}>23. Net Worth (Rs):*</Typography>
        </Grid>
        <Grid item sm={6} container alignItems="center">
        <Grid item sm={5}>
          <Typography variant="body1">{basicDetailsFormValues2.firmNetWorth}</Typography>
          </Grid>
          <Grid item sm={7}>
          {basicDetailsFormValues2.applicationDocuments?.map((doc, index) => 
            doc.documentTitle === "firmNetWorthDocument" && (

            <Link
            onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Change the handler function if needed
            sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }} // Set text color to red and underline
        >
            View
        </Link>
            )
          )}
        </Grid>
        </Grid>
      </Grid>

     
      <Grid container spacing={2} >
        {/* Paid Up Capital */}
        <Grid item sm={5} >
          <Typography variant="h6" style={{ marginTop:'10px'}}>24. Paid Up Capital (Rs):*</Typography>
        </Grid>
        <Grid item sm={6} container alignItems="center">
          <Grid item sm={5}>
            <Typography variant="body1">{basicDetailsFormValues2.paidUpCapital}</Typography>
          </Grid>
          <Grid item sm={7}>
            {basicDetailsFormValues2.applicationDocuments?.map((doc, index) => 
              doc.documentTitle === "firmPanCardDocument" && (
                <Link
                onClick={() => handleDownload(doc.appDocId, doc.documentTitle)} // Change the handler function if needed
                sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }} // Set text color to red and underline
            >
                View
            </Link>
              )
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* <Grid container spacing={2} sx={{ ml: 1 }}> */}
        {/* Insurance Details */}
       
          <Typography variant="h6" style={{ marginTop:'10px'}}>25. Insurance Details:</Typography>
          <Grid container spacing={2} sx={{ ml: 1 }} >
        <Grid item sm={6}>
          <Typography variant="body1">Insurance Policy No.*:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">{basicDetailsFormValues2.insurancePolicyNo}</Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Insurer Company*:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">{basicDetailsFormValues2.insuranceCompany}</Typography>
        </Grid>
      </Grid>
    </Box>
          

          {basicDetailsFormValues8.map((data, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
         
         <Typography variant="h6" style={{ marginTop:'10px'}}>27. Authorized Representative*</Typography>
          <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Name:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {data.name || 'N/A'}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Flat/Door/Block No.:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {data.blockNo || 'N/A'}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Name of Premises/Building/Village:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {data.village || 'N/A'}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Road/Street/Lane/Post Office:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {data.postOffice || 'N/A'}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Area/Locality/Taluka/Sub-Division:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {data.subDivision || 'N/A'}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Town/City/District:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {getCityNameById(data.city || 'N/A')}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Pin:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {data.pin || 'N/A'}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">State/Union Territory:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {getStateNameById(data.state || 'N/A')}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Telephone No.:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {data.telephoneNo || 'N/A'}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Fax:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {data.fax || 'N/A'}
          </Typography>
        </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ml: 1 }}>
        <Grid item sm={6}>
          <Typography variant="body1">Nature of Business:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1">
            {data.natureOfBusiness || 'N/A'}
          </Typography>
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
                  1. Whoever makes any misrepresentation to, or suppresses any material fact from the Controller or the Certifying Authority for obtaining any licence or Electronic Signature Certificate, as the case may be, shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both.
                </Typography>
              </Box>
            </Grid>
          </Grid>

            {/* Notes Section */}
            {/* <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Typography variant="h6"style={{ marginTop: '10px' }}>
                  <b>Note:</b> All documents that you have uploaded must be submitted in physical copy along with application form.
                </Typography>
              </Box>
            </Grid>
          </Grid> */}
        </Box>

  );
};

export default FirmViewData;
