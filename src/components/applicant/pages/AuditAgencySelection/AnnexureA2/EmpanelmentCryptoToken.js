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
  FormHelperText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import stringToDateFormat from '../../../../global/util/DateUtil';

const EmpanelmentCryptoToken = () => {
  const [cryptoData, setCryptoData] = useState([
    { id: 1, brandName: '', oemDetails: '', fipCertUpTo: '', auditFile: null, filename: '', cryptoTokDetailsId: null, makInPercentage: '' },
  ]);
  const [auditorRemarks, setAuditorRemarks] = useState('');
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState([]);

  const [isLoading, setLoading] = useState(false);

  const countWords = (str) => {

      return str.trim().split(/\s+/).filter(Boolean).length;

  }

  const getCryptoTokenDetails = async () =>{

      setLoading(true);
      try{
          const response = await AnnexureService.getCryptoTokenDetails();

          if (Array.isArray(response.data) && response.data.length > 0) {
              const list = response.data.map((obj, index) => ({
                  id: index + 1,
                  cryptoTokDetailsId: obj.cryptoTokDetailsId ?? null,
                  brandName: obj.brandName ?? '',
                  oemDetails: obj.oemDetails ?? '',
                  makInPercentage: obj.makInPercentage != null ? String(obj.makInPercentage) : '',
                  fipCertUpTo: obj.fipCertUpTo ? stringToDateFormat(obj.fipCertUpTo, 'yyyy-MM-dd') : '',
                  filename: obj.secAuditDetails ?? '',
                  auditFile: null,
              }));

              setCryptoData(list);
          }

          setLoading(false);


      }catch(err){
          setLoading(false);
      }

  }

  useEffect(()=>{

    getCryptoTokenDetails();

  }, [])


  // Validation patterns
  const STRING_PATTERN = /^[A-Za-z0-9().,&\- ]+$/;
  const DIGITS_PATTERN = /^[0-9]+$/;

  const validateForm = () => {
    const newErrors = [];

    cryptoData.forEach((item, index) => {
      let rowErrors = {};

      // Brand Name Validation
      if (!item.brandName.trim()) {
        rowErrors.brandName = "Brand name cannot be empty.";
      } else if (item.brandName.length < 3 || item.brandName.length > 50) {
        rowErrors.brandName = "Brand name length must be between 3 and 50 characters.";
      } else if (!STRING_PATTERN.test(item.brandName)) {
        rowErrors.brandName = "Brand name can only contain alphabets, numbers, and characters ().,&-.";
      }

      // OEM Details Validation
      if (!item.oemDetails.trim()) {
        rowErrors.oemDetails = "OEM details cannot be empty.";
      } else if (item.oemDetails.length < 3 || item.oemDetails.length > 100) {
        rowErrors.oemDetails = "OEM details must be between 3 and 100 characters.";
      }

      // Make-in Percentage Validation
      if (!item.makInPercentage.trim()) {
        rowErrors.makInPercentage = "Make-in percentage cannot be empty.";
      } else if (!DIGITS_PATTERN.test(item.makInPercentage)) {
        rowErrors.makInPercentage = "Make-in percentage must be a number.";
      } else if (item.makInPercentage.length < 1 || item.makInPercentage.length > 3) {
        rowErrors.makInPercentage = "Make-in percentage can only be between 1 and 3 digits.";
      }

      // FIP Cert Up To (Date) Validation
      if (!item.fipCertUpTo) {
        rowErrors.fipCertUpTo = "Please select FIP certificate expiry date.";
      }

      // Security Audit Details and File Validation
      if (!item.auditFile && !item.filename) {
        rowErrors.secAuditDetails = "Please upload details of security audit of crypto token.";
      } else if (item.auditFile && !isPdfAndSizeValid(item.auditFile)) {
        rowErrors.secAuditDetails = "Invalid file. It must be a PDF and not exceed 5 MB.";
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[index] = rowErrors;
      }
    });

    setErrors(newErrors);
    return !newErrors.some((error) => error && Object.keys(error).length > 0);
  };

  // Validate if the file is a PDF and within size limit
  const isPdfAndSizeValid = (file) => {
    return file.type === "application/pdf" && file.size <= 5 * 1024 * 1024;
  };

  // Handle field changes for cryptoData
  const handleChange = (id, field, value) => {
    setCryptoData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Handle file change
  const handleFileChange = (id, file) => {
    setCryptoData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, auditFile: file || null } : row))
    );
  };

  // Handle adding new row
  const handleAddRow = () => {
    const newRow = {
      id: cryptoData.length + 1,
      brandName: '',
      oemDetails: '',
      fipCertUpTo: '',
      auditFile: null,
      filename: '',
      cryptoTokDetailsId: null,
      makInPercentage: '',
    };
    setCryptoData([...cryptoData, newRow]);
  };

  // Handle removing a row
  const handleRemoveRow = (id) => {
    setCryptoData(cryptoData.filter((row) => row.id !== id));
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
  
    if (isValid) {
      setLoading(true);
      try {
        const response = await AnnexureService.addCryptoTokenDetails(cryptoData);
  
        setLoading(false);
        const hasExisting = cryptoData.some((row) => row.cryptoTokDetailsId);
        showAlert({
          messageTitle: hasExisting ? 'Update Crypto Tokens' : 'Add Crypto Tokens',
          messageContent: response.data,
          confirmText: 'Ok',
        });
        getCryptoTokenDetails();
  
      } catch (err) {
        setLoading(false);
        const errorMessage =
          typeof err.response?.data === 'string'
            ? err.response.data
            : err.response?.data?.message || 'Your request cannot be processed at this time. Please try again later.';
        showAlert({
          messageTitle: 'Error',
          messageContent: errorMessage,
          confirmText: 'Ok',
        });
      }
    }
  };
  

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          8. Empanelment of Crypto Token
        </Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton onClick={() => setOpen(!open)} sx={{ color: 'primary.main' }}>
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
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' ,width:'10%'}}>S. No.</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Brand Name of Token</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Details of OEM </TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Make in India Percentage</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>FIPs Certification up to</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Details of Security Audit Details of Crypto token</TableCell>
              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cryptoData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{index + 1}</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    value={row.brandName}
                    onChange={(e) => handleChange(row.id, 'brandName', e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    error={Boolean(errors[index]?.brandName)}
                    helperText={errors[index]?.brandName}
                  />
                </TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500'}}>
                  <TextField
                    value={row.oemDetails}
                    onChange={(e) => handleChange(row.id, 'oemDetails', e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    error={Boolean(errors[index]?.oemDetails)}
                    helperText={errors[index]?.oemDetails}
                  />
                </TableCell>

                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    value={row.makInPercentage}
                    onChange={(e) => handleChange(row.id, 'makInPercentage', e.target.value)}
                    fullWidth
                    error={Boolean(errors[index]?.makInPercentage)}
                    helperText={errors[index]?.makInPercentage}
                  />
                </TableCell>

                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    type="date"
                    value={row.fipCertUpTo}
                    onChange={(e) => handleChange(row.id, 'fipCertUpTo', e.target.value)}
                    fullWidth
                    error={Boolean(errors[index]?.fipCertUpTo)}
                    helperText={errors[index]?.fipCertUpTo}
                  />
                </TableCell>
                
                
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(row.id, e.target.files[0])}
                  />
                  {row.filename && !row.auditFile && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Uploaded: {row.filename}
                    </Typography>
                  )}
                  {errors[index]?.secAuditDetails && (
                    <FormHelperText error>{errors[index].secAuditDetails}</FormHelperText>
                  )}
                </TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  {/* Add or Remove Icon */}
                  {cryptoData.length > 1 && (
                    <IconButton color="error" onClick={() => handleRemoveRow(row.id)}>
                      <RemoveIcon />
                    </IconButton>
                  )}

                  {cryptoData.length === index + 1 && (
                    <IconButton color="primary" onClick={handleAddRow}>
                      <AddIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          </Table>
        </TableContainer>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
            {cryptoData.some((row) => row.cryptoTokDetailsId) ? 'UPDATE' : 'ADD'}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EmpanelmentCryptoToken;
