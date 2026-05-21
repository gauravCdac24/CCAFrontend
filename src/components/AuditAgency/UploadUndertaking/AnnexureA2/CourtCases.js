import React, { useEffect, useState } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Typography, Grid,Collapse,TableContainer, IconButton } from '@mui/material';
import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../service/AnnexureA2Service/AnnexureService';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Regex Pattern to validate allowed characters
const STRING_PATTERN = /^[A-Za-z0-9().,&\-\s]+$/;

const CourtCases = () => {

  const {id}=useParams();
 const applicantUserName = decrypt(id);


  const [initialRAAuditData, setInitialRAAuditData] = useState({
    activeCourtCases: '',
    courtCasesCount: '',
    policeComplaintsCount: '',
  });

  const [annexure, setAnnexure] = useState({
    userName: applicantUserName,
    apiNum: '6',
    auditorVerification:''
})

useEffect(() => {
     
  setAnnexure((prevState) => ({
      ...prevState,
      userName: applicantUserName,
  }));
}, [applicantUserName]); 


const handleChanges = (e, field) => {
  setAnnexure(prevState => ({
      ...prevState,
      auditorVerification: field === 'remarks' ? e.target.value : prevState.auditorVerification
  }));
};

  const [errors, setErrors] = useState({});
 const [open, setOpen] = useState(false);
const [isLoading, setLoading] = useState(false);

 const getCourtCases = async () => {
  setLoading(true);  // Set loading to true while fetching data
  try {
      const response = await AnnexureService.getAuditorVerification(annexure);
      
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
          setAnnexure(prevState => ({
            ...prevState,
            auditorVerification: data.auditorVerification,
          }));
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


  console.log('EKYC details:',annexure); 

  const handleSubmit = async() => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
    
      setLoading(true); 
      try {
       
        console.log('RA Audit Details:', annexure);

        const response = await AnnexureService.addAuditorVerification(annexure);
        
       
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
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
        6. No of Court Cases / Police Complaints
      </Typography>
      <IconButton onClick={() => setOpen(!open)} sx={{ color: 'primary.main' }}>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </Box><Collapse in={open}>
        <Box mt={2}>
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
                {[
                  {
                    id: 1,
                    description: 'Number of active court cases related to verification prior to issuance of DSC (Exists before the audit period)',
                    value: initialRAAuditData.activeCourtCases,
                    error: errors?.activeCourtCases,
                    field: 'activeCourtCases',
                  },
                  {
                    id: 2,
                    description: 'Number of court cases related to verification prior to issuance of DSC (Registered during the audit period)',
                    value: initialRAAuditData.courtCasesCount,
                    error: errors?.courtCasesCount,
                    field: 'courtCasesCount',
                  },
                  {
                    id: 3,
                    description: 'Number of police complaints against CA on DSC issuance/verification related activities',
                    value: initialRAAuditData.policeComplaintsCount,
                    error: errors?.policeComplaintsCount,
                    field: 'policeComplaintsCount',
                  },
                ].map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.id}</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.description}</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                      <TextField
                        disabled
                        value={row.value}
                        onChange={(e) => handleChange(row.field, e.target.value)}
                        fullWidth
                        error={!!row.error}
                        helperText={row.error} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Auditor Remarks Section */}
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Auditor Remarks</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={annexure?.auditorVerification || ''} // Ensure it's not undefined
                onChange={(e) => handleChanges(e, 'remarks')}
                InputProps={{ style: { padding: '10px' } }} />
            </Grid>
          </Grid>
        </Box>

        {/* Submit Button */}
        <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            ADD
          </Button>
        </Box>
      </Collapse>
      </>
  );
};
export default CourtCases;
