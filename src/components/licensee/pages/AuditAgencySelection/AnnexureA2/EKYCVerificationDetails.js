import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TextField,
  Button,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import stringToDateFormat from '../../../../global/util/DateUtil';

const errorMsg = {
  approvalDate: {
    offlineAadhar: "Please select offline Aadhar approval date.",
    onlineAadhar: "Please select online Aadhar approval date.",
    panEKYC: "Please select PAN eKYC approval date.",
    caEKYC: "Please select CA eKYC approval date.",
    organisationalEKYC: "Please select Organisational eKYC approval date.",
    bankingEKYC: "Please select Banking eKYC approval date.",
  },
  dscCount: {
    offlineAadhar: "Please enter DSC count for offline Aadhar.",
    onlineAadhar: "Please enter DSC count for online Aadhar.",
    panEKYC: "Please enter DSC count for PAN eKYC.",
    caEKYC: "Please enter DSC count for CA eKYC.",
    organisationalEKYC: "Please enter DSC count for Organisational eKYC.",
    bankingEKYC: "Please enter DSC count for Banking eKYC.",
    format: "Only digits are allowed.",
    length: "The length must not exceed 9 digits.",
  },
  externalService: {
    kuaLicenseDate: "Please enter KUA Licence Date.",
    panKYCServiceDetails: "Please enter PAN KYC service details.",
    gstServiceDetails: "Please enter GST service details.",
  },
  bankName: {
    blank: "Bank name cannot be empty.",
    length: "The length must be between 3 and 200 characters.",
    format: "Only alphabets, numbers, characters .-& and spaces are allowed.",
  },
  detailsExternalService: {
    blank: "Details of external services cannot be empty.",
    length: "The length must be between 3 and 200 characters.",
    format: "Only alphabets, numbers, characters ().,&- and spaces are allowed.",
  }
};




const EKYCVerificationDetails = () => {
  // ✅ Store the final data in a single object
  const [data, setData] = useState({
    ekycAcMainId: '',
    approvalDateOfflineAadhaar: '',
    approvalDateOnlineAadhar: '',
    approvalDatePAN: '',
    approvalDateCA: '',
    approvalDateOrganisational: '',
    approvalDateBanking: '',
    offlineAadhaarDSCCount: '',
    onlineAadharDSCCount: '',
    panDSCCount: '',
    caDSCCount: '',
    organisationalDSCCount: '',
    bankingDSCCount: '',
    kuaLicenseDate: '',
    panServDetails: '',
    gstServiceDetails: '',
    nameOfBanks: '',
    extServOffAadhar: '',
    extServOnAadhar: '',
    extServPAN: '',
    extServCA: '',
    extServOrg: '',
    extServBanking: '',
  });

  const fieldMapping = {
    1: { approvalDate: 'approvalDateOfflineAadhaar', noDSC: 'offlineAadhaarDSCCount', extraData: 'extServOffAadhar',detailsExternalService:'extServOffAadhar' },
    2: { approvalDate: 'approvalDateOnlineAadhar', noDSC: 'onlineAadharDSCCount', extraData: 'kuaLicenseDate' ,detailsExternalService:'extServOnAadhar'},
    3: { approvalDate: 'approvalDatePAN', noDSC: 'panDSCCount', extraData: 'panServDetails' ,detailsExternalService:'extServPAN'},
    4: { approvalDate: 'approvalDateCA', noDSC: 'caDSCCount', extraData: 'extServCA' ,detailsExternalService:'extServCA'},
    5: { approvalDate: 'approvalDateOrganisational', noDSC: 'organisationalDSCCount', extraData: 'gstServiceDetails' ,detailsExternalService:'extServOrg'},
    6: { approvalDate: 'approvalDateBanking', noDSC: 'bankingDSCCount', extraData: 'nameOfBanks',detailsExternalService:'extServBanking' },
  };

 
  const [verificationData, setVerificationData] = useState([
    { id: 1, option: 'Offline Aadhaar eKYC', approvalDate: '', noDSC: '', externalService: '',detailsExternalService:'', extraData: '', },
    { id: 2, option: 'Online Aadhaar eKYC', approvalDate: '', noDSC: '', externalService: 'KUA Licence date:' ,detailsExternalService:'', extraData: '',},
    { id: 3, option: 'PAN eKYC', approvalDate: '', noDSC: '', externalService: 'PAN KYC service details:',detailsExternalService:'' , extraData: '',},
    { id: 4, option: 'CA eKYC', approvalDate: '', noDSC: '', externalService: '' ,detailsExternalService:'', extraData: '',},
    { id: 5, option: 'Organisational eKYC', approvalDate: '', noDSC: '', externalService: 'GST Service Details',detailsExternalService:'', extraData: '', },
    { id: 6, option: 'Banking eKYC', approvalDate: '', noDSC: '', externalService: 'Name of Banks' ,detailsExternalService:'', extraData: '',},
  ]);

  const [auditorRemarks, setAuditorRemarks] = useState('');
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
   const [isLoading, setLoading] = useState(false);
  const handleTableChange = (rowId, field, value) => {
    setVerificationData((prevData) =>
      prevData.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );

    // Update `setData` dynamically
    const mappedField = fieldMapping[rowId]?.[field];
    if (mappedField) {
      setData((prevData) => ({
        ...prevData,
        [mappedField]: value,
      }));
    }
  };

  const getEKYCAcMonthDetails = async () => {
    setLoading(true);
  
    try {
      const response = await AnnexureService.getAccountBasedDetails();
      console.log("API Response Data:", response.data);  // Log the response data for debugging
  
      if (response?.data) {
        const updatedVerificationData = verificationData.map((item) => {
          // Get the mapping for this id from the fieldMapping
          const mapping = fieldMapping[item.id];
  
          // Initialize a new object to hold the updated values for this verification entry
          const updatedItem = { ...item };
  
          console.log("Mapping for ID",mapping);

          if (mapping) {
            const { approvalDate, noDSC, extraData, detailsExternalService } = mapping;
  
            if (approvalDate && response.data[approvalDate]) {
              // Convert the ISO date string to a human-readable format (if necessary)
              updatedItem.approvalDate = stringToDateFormat(response.data[approvalDate], "yyyy-MM-dd");
            }
  
            if (noDSC && response.data[noDSC]) {
              updatedItem.noDSC = response.data[noDSC];
            }
  
            if (extraData && response.data[extraData]) {
              const rawData = response.data[extraData];  
              const dateMatch = rawData.match(/\d{4}-\d{2}-\d{2}/); // Extracts YYYY-MM-DD format
              updatedItem.extraData = dateMatch ? stringToDateFormat(dateMatch[0], "yyyy-MM-dd") : rawData;
              
            }
  
            if (detailsExternalService && response.data[detailsExternalService]) {
              updatedItem.detailsExternalService = response.data[detailsExternalService];
            }
          }
  
          return updatedItem;
        });
  
        // Update the state with the newly mapped verification data
        setVerificationData(updatedVerificationData);
      } else {
        console.log("No data returned from API");
      }
  
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);  // Stop loading in case of error
    }
  };
  
  
  useEffect(() => {
    getEKYCAcMonthDetails();
  }, []);

  console.log("verificationData",verificationData);
  const validateForm = () => {
    const errors = [];

    verificationData.forEach((item, index) => {
      if (!errors[index]) {
        errors[index] = {};
      }

      // Validation for Approval Date
      if (!item.approvalDate) {
        switch (item.option) {
          case "Offline Aadhaar eKYC":
            errors[index].approvalDate = errorMsg.approvalDate.offlineAadhar;
            break;
          case "Online Aadhaar eKYC":
            errors[index].approvalDate = errorMsg.approvalDate.onlineAadhar;
            break;
          case "PAN eKYC":
            errors[index].approvalDate = errorMsg.approvalDate.panEKYC;
            break;
          case "CA eKYC":
            errors[index].approvalDate = errorMsg.approvalDate.caEKYC;
            break;
          case "Organisational eKYC":
            errors[index].approvalDate = errorMsg.approvalDate.organisationalEKYC;
            break;
          case "Banking eKYC":
            errors[index].approvalDate = errorMsg.approvalDate.bankingEKYC;
            break;
          default:
            break;
        }
      }

      // Validation for DSC Count
      if (!item.noDSC) {
        switch (item.option) {
          case "Offline Aadhaar eKYC":
            errors[index].noDSC = errorMsg.dscCount.offlineAadhar;
            break;
          case "Online Aadhaar eKYC":
            errors[index].noDSC = errorMsg.dscCount.onlineAadhar;
            break;
          case "PAN eKYC":
            errors[index].noDSC = errorMsg.dscCount.panEKYC;
            break;
          case "CA eKYC":
            errors[index].noDSC = errorMsg.dscCount.caEKYC;
            break;
          case "Organisational eKYC":
            errors[index].noDSC = errorMsg.dscCount.organisationalEKYC;
            break;
          case "Banking eKYC":
            errors[index].noDSC = errorMsg.dscCount.bankingEKYC;
            break;
          default:
            break;
        }
      } else if (!/^[0-9]+$/.test(item.noDSC)) {
        errors[index].noDSC = errorMsg.dscCount.format;
      } else if (item.noDSC.length > 9) {
        errors[index].noDSC = errorMsg.dscCount.length;
      }

      // Validation for External Service Details
      if (item.externalService === "KUA Licence date:" && !item.extraData) {
        errors[index].extraData = errorMsg.externalService.kuaLicenseDate;
      } else if (item.externalService === "PAN KYC service details:" && !item.extraData) {
        errors[index].extraData = errorMsg.externalService.panKYCServiceDetails;
      } else if (item.externalService === "GST Service Details" && !item.extraData) {
        errors[index].extraData = errorMsg.externalService.gstServiceDetails;
      }

      // Validation for Bank Name
      if (item.externalService === "Name of Banks") {
        if (!item.extraData) {
          errors[index].extraData = errorMsg.bankName.blank;
        } else if (item.extraData.length < 3 || item.extraData.length > 200) {
          errors[index].extraData = errorMsg.bankName.length;
        } else if (!/^[A-Za-z0-9.&\-\s]+$/.test(item.extraData)) {
          errors[index].extraData = errorMsg.bankName.format;
        }
      }

      // Validation for External Service Details
      if (!item.detailsExternalService) {
        errors[index].detailsExternalService = errorMsg.detailsExternalService.blank;
      } else if (item.detailsExternalService.length < 3 || item.detailsExternalService.length > 200) {
        errors[index].detailsExternalService = errorMsg.detailsExternalService.length;
      } else if (!/^[A-Za-z0-9().,&\-\s]+$/.test(item.detailsExternalService)) {
        errors[index].detailsExternalService = errorMsg.detailsExternalService.format;
      }
    });

    return errors.some(error => Object.keys(error).length > 0) ? errors : {}; // return errors if any
  };

  


  const handleAdd = async() => {
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
        setErrors({});
        setLoading(true);
        try{

          
           
            const response = await AnnexureService.addAccountBasedDetails(data);
            setLoading(false);

            showAlert({
                messageTitle: 'Add eKYC Account-based Verification Details.',
                messageContent: response.data,
                confirmText: 'Ok',
            })

            getEKYCAcMonthDetails();

        }catch(err){
            setLoading(false);

            

            showAlert({
                messageTitle: 'Error',
                messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
                confirmText: 'Ok',
            })
        }

            

    } else {
        setErrors(errors);
    }
  };

  return (
    <Box>
      {/* Header with Collapse Toggle */}
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: "primary.main" }} gutterBottom>
          4. eKYC Account-based Verification Enabled by CA - Details of the Audit Period
        </Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton onClick={() => setOpen(!open)} sx={{ color: "primary.main" }}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Collapsible Section */}
      <Collapse in={open}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'tablecolor.main', color: 'tablecolor.text' }}>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>S. No.</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Option</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Date of Approval by CCA</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>No DSCs Issued</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Associated External Service</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Details of external services</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {verificationData.map((row,index) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.id}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.option}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      type="date"
                      value={row.approvalDate}
                      onChange={(e) => handleTableChange(row.id, 'approvalDate', e.target.value)}
                      fullWidth
                      error={!!errors[index]?.approvalDate}
                      helperText={errors[index]?.approvalDate}
                    />
                   
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      value={row.noDSC}
                      onChange={(e) => handleTableChange(row.id, 'noDSC', e.target.value)}
                      fullWidth
                      error={!!errors[index]?.noDSC}
                    helperText={errors[index]?.noDSC}
                    />
                    
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    {row.externalService ? (
                      <>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>{row.externalService}</Typography>
                        <TextField
                          type={row.externalService === "Name of Banks" ? "text" : "date"}
                          value={row.extraData}
                          onChange={(event) => handleTableChange(row.id, 'extraData', event.target.value)}
                          placeholder={`Enter ${row.externalService}`}
                          fullWidth
                          error={!!errors[index]?.extraData}
                          helperText={errors[index]?.extraData}
                        />
                          
                      </>
                    ) : (
                      ''
                    )}
                  </TableCell>

                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      value={row.detailsExternalService}
                      onChange={(e) => handleTableChange(row.id, 'detailsExternalService', e.target.value)}
                      fullWidth
                      error={!!errors[index]?.detailsExternalService}
                     helperText={errors[index]?.detailsExternalService}
                    />
                    
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            ADD
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EKYCVerificationDetails;
