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
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import stringToDateFormat from '../../../../global/util/DateUtil';

const DIGITS_PATTERN = /^[0-9]{1,9}$/; 
const STRING_PATTERN = /^[a-zA-Z0-9 .,\\-]{3,200}$/;

const RAAuditDetails = () => {
  const [initialRAAuditData, setInitialRAAuditData] = useState({
    raAuditMainId: '',
    totalRA: '',
    activeRA: '',
    datesOfRAAudit: '',
    ncReportedByRA: '',
    caActionTaken: ''
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
 const [isLoading, setLoading] = useState(false);

 const getRAAudit = async () => {
  setLoading(true);  // Set loading to true while fetching data
  try {
      const response = await AnnexureService.getRAAudit();
      
      console.log('EKYC details:', response.data); 
      
      if (response?.data) {
          const data = response?.data; 

          // Now we update the state with the response data
          setInitialRAAuditData({
              raAuditMainId: data?.raAuditMainId || '',
              totalRA: data?.totalRA || '',
              activeRA: data?.activeRA || '',
              datesOfRAAudit: data?.datesOfRAAudit || '',
              ncReportedByRA: data?.ncReportedByRA || '',
              caActionTaken: data?.caActionTaken || ''
          });
      }

      setLoading(false);  
  } catch (err) {
      setLoading(false); 
      console.error('Error fetching EKYC details:', err);  
  }
};


console.log(initialRAAuditData);  

  
  
  
  
  useEffect(()=>{
  
    getRAAudit();
  
  }, [])

  // Validation function
  const validateField = (field, value) => {
    let errorMessage = '';

    if (field === 'totalRA' || field === 'activeRA') {
      if (!value) {
        errorMessage = `${field === 'totalRA' ? 'Total' : 'Active'} RA cannot be empty`;
      } else if (!DIGITS_PATTERN.test(value)) {
        errorMessage = 'Only numbers are allowed (max 9 digits)';
      }
    } else if (field === 'datesOfRAAudit' || field === 'ncReportedByRA' || field === 'caActionTaken') {
      if (!value.trim()) {
        errorMessage = `${field.replace(/([A-Z])/g, ' $1')} cannot be empty`;
      } else if (value.length < 3 || value.length > 200) {
        errorMessage = 'Length must be between 3 and 200 characters';
      } else if (!STRING_PATTERN.test(value)) {
        errorMessage = 'Only alphabets, numbers, characters .,- are allowed';
      }
    }

    return errorMessage;
  };

  const handleChange = (field, value) => {
    setInitialRAAuditData((prevData) => ({
      ...prevData,
      [field]: value
    }));

 
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateField(field, value)
    }));
  };

  const handleSubmit = async() => {
    let hasError = false;
    let newErrors = {};

    Object.keys(initialRAAuditData).forEach((field) => {
      newErrors[field] = validateField(field, initialRAAuditData[field]);
      if (newErrors[field]) hasError = true;
    });

    setErrors(newErrors);

    if (!hasError) {
      setLoading(true); 
      try {
       
        console.log('RA Audit Details:', initialRAAuditData);

        const response = await AnnexureService.addRAAudit(initialRAAuditData);
        
       
        setLoading(false);
  
       
        showAlert({
          messageTitle: 'Add RA Audit Details.',
          messageContent: response.data,
          confirmText: 'Ok',
        });
  
      
        getRAAudit();
  
      } catch (err) {
        setLoading(false); 
  
       
        showAlert({
          messageTitle: 'Error',
          messageContent: err.response?.data
            ? typeof err.response.data === 'object'
              ? 'Your request cannot be processed at this time. Please try again later.'
              : err.response.data
            : 'Your request cannot be processed at this time. Please try again later.',
          confirmText: 'Ok',
        });
      }
    } else {
      alert('Please fix validation errors');
    }
  };

  return (
    <Box>
     
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          5. RA Audit Details – During the Annual Audit Period
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
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>S. No.</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Total & Active RAs */}
              <TableRow>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>1</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>Number of RAs</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1">Total RAs</Typography>
                    <TextField
                      value={initialRAAuditData.totalRA}
                      onChange={(e) => handleChange('totalRA', e.target.value)}
                      size="small"
                      sx={{ width: '80px' }}
                      error={!!errors.totalRA}
                      helperText={errors.totalRA}
                    />
                    <Typography variant="body1">Active RAs</Typography>
                    <TextField
                      value={initialRAAuditData.activeRA}
                      onChange={(e) => handleChange('activeRA', e.target.value)}
                      size="small"
                      sx={{ width: '80px' }}
                      error={!!errors.activeRA}
                      helperText={errors.activeRA}
                    />
                  </Box>
                </TableCell>
              </TableRow>

              {/* Dates of RA Audit */}
              <TableRow>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>2</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>Dates of RA Audit</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    value={initialRAAuditData.datesOfRAAudit}
                    onChange={(e) => handleChange('datesOfRAAudit', e.target.value)}
                    fullWidth
                    error={!!errors.datesOfRAAudit}
                    helperText={errors.datesOfRAAudit}
                  />
                </TableCell>
              </TableRow>

              {/* NC Reported by RA */}
              <TableRow>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>3</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>Details of Non-Compliance reported by RAs</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    value={initialRAAuditData.ncReportedByRA}
                    onChange={(e) => handleChange('ncReportedByRA', e.target.value)}
                    fullWidth
                    error={!!errors.ncReportedByRA}
                    helperText={errors.ncReportedByRA}
                  />
                </TableCell>
              </TableRow>

              {/* CA Action Taken */}
              <TableRow>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>4</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>Action Taken by CAs</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    value={initialRAAuditData.caActionTaken}
                    onChange={(e) => handleChange('caActionTaken', e.target.value)}
                    fullWidth
                    error={!!errors.caActionTaken}
                    helperText={errors.caActionTaken}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            ADD
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default RAAuditDetails;
