import React, { useEffect, useState } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Typography } from '@mui/material';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import showAlert from '../../../../global/common/MessageBox/AlertService';

// Regex Pattern to validate allowed characters
const STRING_PATTERN = /^[A-Za-z0-9().,&\-\s]+$/;

const CourtCases = () => {
  const [initialRAAuditData, setInitialRAAuditData] = useState({
    activeCourtCases: '',
    courtCasesCount: '',
    policeComplaintsCount: '',
  });

  const [errors, setErrors] = useState({});

const [isLoading, setLoading] = useState(false);

 const getCourtCases = async () => {
  setLoading(true);  // Set loading to true while fetching data
  try {
      const response = await AnnexureService.getCourtCases();
      
      console.log('EKYC details:', response.data); 
      
      if (response?.data) {
          const data = response?.data; 

          // Now we update the state with the response data
          setInitialRAAuditData({
            courtCasesMainId: data?.courtCasesMainId || '',
              activeCourtCases: data?.activeCourtCases || '',
              courtCasesCount: data?.courtCasesCount || '',
              policeComplaintsCount: data?.policeComplaintsCount || '',
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
  
    getCourtCases();
  
  }, [])

  const handleChange = (field, value) => {
    setInitialRAAuditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    // Validate activeCourtCases
    if (!initialRAAuditData.activeCourtCases || initialRAAuditData.activeCourtCases.trim().length === 0) {
      newErrors.activeCourtCases = 'Number of active court cases cannot be empty';
    } else if (initialRAAuditData.activeCourtCases.length < 3 || initialRAAuditData.activeCourtCases.length > 200) {
      newErrors.activeCourtCases = 'The length must be between 3 and 200 characters.';
    } else if (!STRING_PATTERN.test(initialRAAuditData.activeCourtCases)) {
      newErrors.activeCourtCases = 'Only alphabets, numbers, characters ().,&- are allowed';
    }

    // Validate courtCasesCount
    if (!initialRAAuditData.courtCasesCount || initialRAAuditData.courtCasesCount.trim().length === 0) {
      newErrors.courtCasesCount = 'Number of court cases cannot be empty';
    } else if (initialRAAuditData.courtCasesCount.length < 3 || initialRAAuditData.courtCasesCount.length > 200) {
      newErrors.courtCasesCount = 'The length must be between 3 and 200 characters.';
    } else if (!STRING_PATTERN.test(initialRAAuditData.courtCasesCount)) {
      newErrors.courtCasesCount = 'Only alphabets, numbers, characters ().,&- are allowed';
    }

    // Validate policeComplaintsCount
    if (!initialRAAuditData.policeComplaintsCount || initialRAAuditData.policeComplaintsCount.trim().length === 0) {
      newErrors.policeComplaintsCount = 'Number of police complaints cannot be empty';
    } else if (initialRAAuditData.policeComplaintsCount.length < 3 || initialRAAuditData.policeComplaintsCount.length > 200) {
      newErrors.policeComplaintsCount = 'The length must be between 3 and 200 characters.';
    } else if (!STRING_PATTERN.test(initialRAAuditData.policeComplaintsCount)) {
      newErrors.policeComplaintsCount = 'Only alphabets, numbers, characters ().,&- are allowed';
    }

    return newErrors;
  };

  const handleSubmit = async() => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
    
      setLoading(true); 
      try {
       
        console.log('RA Audit Details:', initialRAAuditData);

        const response = await AnnexureService.addCourtCases(initialRAAuditData);
        
       
        setLoading(false);
  
       
        showAlert({
          messageTitle: 'Add  Court Cases / Police Complaints',
          messageContent: response.data,
          confirmText: 'Ok',
        });
  
      
        getCourtCases();
  
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
      console.log('Form data:', initialRAAuditData);
    } else {
      console.log('Form has errors:', formErrors);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
        6. No ofCourt Cases / Police Complaints
      </Typography>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'tablecolor.main', color: 'tablecolor.text' }}>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>S. No.</TableCell>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Description</TableCell>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>1</TableCell>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
              Number of active court cases related to verification prior to issuance of DSC (Exists before the audit period)
            </TableCell>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
              <TextField
                value={initialRAAuditData.activeCourtCases}
                onChange={(e) => handleChange('activeCourtCases', e.target.value)}
                fullWidth
                error={!!errors.activeCourtCases}
                helperText={errors.activeCourtCases}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>2</TableCell>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
              Number of court cases related to verification prior to issuance of DSC (Registered during the audit period)
            </TableCell>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
              <TextField
                value={initialRAAuditData.courtCasesCount}
                onChange={(e) => handleChange('courtCasesCount', e.target.value)}
                fullWidth
                error={!!errors.courtCasesCount}
                helperText={errors.courtCasesCount}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>3</TableCell>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
              Number of police complaints against CA on DSC issuance/verification related activities
            </TableCell>
            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
              <TextField
                value={initialRAAuditData.policeComplaintsCount}
                onChange={(e) => handleChange('policeComplaintsCount', e.target.value)}
                fullWidth
                error={!!errors.policeComplaintsCount}
                helperText={errors.policeComplaintsCount}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          ADD
        </Button>
      </Box>
    </Box>
  );
};

export default CourtCases;
