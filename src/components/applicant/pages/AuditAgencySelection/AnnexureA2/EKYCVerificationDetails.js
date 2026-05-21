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




const hasValue = (value) => value !== null && value !== undefined && value !== '';

const formatDateField = (value) => {
  if (!hasValue(value)) {
    return '';
  }
  const formatted = stringToDateFormat(value, 'yyyy-MM-dd');
  return formatted === 'Invalid Date' ? '' : formatted;
};

const formatExtraDataField = (fieldKey, value) => {
  if (!hasValue(value)) {
    return '';
  }
  if (fieldKey === 'nameOfBanks') {
    return String(value);
  }
  return formatDateField(value);
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
    1: { approvalDate: 'approvalDateOfflineAadhaar', noDSC: 'offlineAadhaarDSCCount', detailsExternalService: 'extServOffAadhar' },
    2: { approvalDate: 'approvalDateOnlineAadhar', noDSC: 'onlineAadharDSCCount', extraData: 'kuaLicenseDate', detailsExternalService: 'extServOnAadhar' },
    3: { approvalDate: 'approvalDatePAN', noDSC: 'panDSCCount', extraData: 'panServDetails', detailsExternalService: 'extServPAN' },
    4: { approvalDate: 'approvalDateCA', noDSC: 'caDSCCount', detailsExternalService: 'extServCA' },
    5: { approvalDate: 'approvalDateOrganisational', noDSC: 'organisationalDSCCount', extraData: 'gstServiceDetails', detailsExternalService: 'extServOrg' },
    6: { approvalDate: 'approvalDateBanking', noDSC: 'bankingDSCCount', extraData: 'nameOfBanks', detailsExternalService: 'extServBanking' },
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
  const [open, setOpen] = useState(true);
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

  const loadAccountBasedDetails = async () => {
    setLoading(true);

    try {
      const response = await AnnexureService.getAccountBasedDetails();
      const apiData = response?.data;

      // Backend may return null (no record) or [] on legacy errors — both mean "no saved data"
      if (!apiData || Array.isArray(apiData) || typeof apiData !== 'object') {
        return;
      }

      const loadedData = {
        ekycAcMainId: apiData.ekycAcMainId ?? '',
        approvalDateOfflineAadhaar: formatDateField(apiData.approvalDateOfflineAadhaar),
        approvalDateOnlineAadhar: formatDateField(apiData.approvalDateOnlineAadhar),
        approvalDatePAN: formatDateField(apiData.approvalDatePAN),
        approvalDateCA: formatDateField(apiData.approvalDateCA),
        approvalDateOrganisational: formatDateField(apiData.approvalDateOrganisational),
        approvalDateBanking: formatDateField(apiData.approvalDateBanking),
        offlineAadhaarDSCCount: hasValue(apiData.offlineAadhaarDSCCount) ? String(apiData.offlineAadhaarDSCCount) : '',
        onlineAadharDSCCount: hasValue(apiData.onlineAadharDSCCount) ? String(apiData.onlineAadharDSCCount) : '',
        panDSCCount: hasValue(apiData.panDSCCount) ? String(apiData.panDSCCount) : '',
        caDSCCount: hasValue(apiData.caDSCCount) ? String(apiData.caDSCCount) : '',
        organisationalDSCCount: hasValue(apiData.organisationalDSCCount) ? String(apiData.organisationalDSCCount) : '',
        bankingDSCCount: hasValue(apiData.bankingDSCCount) ? String(apiData.bankingDSCCount) : '',
        kuaLicenseDate: formatDateField(apiData.kuaLicenseDate),
        panServDetails: formatDateField(apiData.panServDetails),
        gstServiceDetails: formatDateField(apiData.gstServiceDetails),
        nameOfBanks: apiData.nameOfBanks ?? '',
        extServOffAadhar: apiData.extServOffAadhar ?? '',
        extServOnAadhar: apiData.extServOnAadhar ?? '',
        extServPAN: apiData.extServPAN ?? '',
        extServCA: apiData.extServCA ?? '',
        extServOrg: apiData.extServOrg ?? '',
        extServBanking: apiData.extServBanking ?? '',
      };

      setData(loadedData);

      const updatedVerificationData = verificationData.map((item) => {
        const mapping = fieldMapping[item.id];
        if (!mapping) {
          return item;
        }

        const { approvalDate, noDSC, extraData, detailsExternalService } = mapping;
        const updatedItem = { ...item };

        if (approvalDate) {
          updatedItem.approvalDate = loadedData[approvalDate] ?? '';
        }
        if (noDSC) {
          updatedItem.noDSC = loadedData[noDSC] ?? '';
        }
        if (extraData) {
          updatedItem.extraData = formatExtraDataField(extraData, apiData[extraData]);
        }
        if (detailsExternalService) {
          updatedItem.detailsExternalService = loadedData[detailsExternalService] ?? '';
        }

        return updatedItem;
      });

      setVerificationData(updatedVerificationData);
    } catch (err) {
      console.error('Error fetching account-based verification details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    loadAccountBasedDetails();
  }, []);
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

  


  const buildSubmitPayload = () => {
    const payload = { ...data };

    verificationData.forEach((row) => {
      const mapping = fieldMapping[row.id];
      if (!mapping) {
        return;
      }

      if (mapping.approvalDate) {
        payload[mapping.approvalDate] = row.approvalDate || null;
      }
      if (mapping.noDSC) {
        payload[mapping.noDSC] = row.noDSC;
      }
      if (mapping.detailsExternalService) {
        payload[mapping.detailsExternalService] = row.detailsExternalService ?? '';
      }
      // Only map extraData when it is a separate backend field (not shared with detailsExternalService)
      if (mapping.extraData && mapping.extraData !== mapping.detailsExternalService) {
        payload[mapping.extraData] = row.extraData || null;
      }
    });

    return payload;
  };

  const handleAdd = async() => {
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
        setErrors({});
        setLoading(true);
        try{

            const submitPayload = buildSubmitPayload();
            const response = await AnnexureService.addAccountBasedDetails(submitPayload);
            setLoading(false);

            showAlert({
                messageTitle: submitPayload.ekycAcMainId ? 'Update eKYC Account-based Verification Details' : 'Add eKYC Account-based Verification Details',
                messageContent: response.data,
                confirmText: 'Ok',
            });

            loadAccountBasedDetails();

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
          <Button variant="contained" color="primary" onClick={handleAdd} disabled={isLoading}>
            {data.ekycAcMainId ? 'UPDATE' : 'ADD'}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EKYCVerificationDetails;
