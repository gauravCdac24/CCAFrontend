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
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../service/AnnexureA2Service/AnnexureService';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';

// Regex Pattern for validation
const STRING_PATTERN = /^[A-Za-z0-9().,&\-\s]+$/;  // Allows alphabets, numbers, and specific characters
const DIGITS_PATTERN = /^[0-9]{1,9}$/;  // Only digits, max length 9

const RevocationDSC = () => {

  const {id}=useParams();
  const applicantUserName = decrypt(id);

  const [revocationData, setRevocationData] = useState({
    dscRevokedCount: '',
    revocReqReason: '',
    dscRevokedReason: '',
  });

  const [annexure, setAnnexure] = useState({
    userName: applicantUserName,
    apiNum: '7',
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
  const [auditorRemarks, setAuditorRemarks] = useState('');
  const [open, setOpen] = useState(false);

  const [isLoading, setLoading] = useState(false);
  
   const getRevocationDetails = async () => {
    setLoading(true);  // Set loading to true while fetching data
    try {
        const response = await AnnexureService.getAuditorVerification(annexure);
        
        console.log('EKYC details:', response.data); 
        
        if (response?.data) {
            const data = response?.data; 
  
            // Now we update the state with the response data
            setRevocationData({
              revocationMainId: data?.revocationMainId || '',
              dscRevokedCount: data?.dscRevokedCount || '',
              revocReqReason: data?.revocReqReason || '',
              dscRevokedReason: data?.dscRevokedReason || '',
            });
            setAnnexure(prevState => ({
              ...prevState,
              auditorVerification:data.auditorVerification
          }));
        }
  
        setLoading(false);  
    } catch (err) {
        setLoading(false); 
        console.error('Error fetching EKYC details:', err);  
    }
  };
  
  
  console.log(revocationData);  
 
    
    useEffect(()=>{
    
      getRevocationDetails();
    
    }, [])

  const handleChange = (field, value) => {
    setRevocationData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleRemarksChange = (value) => {
    setAuditorRemarks(value);
  };

  // Validation function
  const validateForm = () => {
    let newErrors = {};

    // Validate DSC Revoked Count
    if (!revocationData.dscRevokedCount || revocationData.dscRevokedCount.trim().length === 0) {
      newErrors.dscRevokedCount = 'Number of DSCs revoked cannot be empty';
    } else if (!DIGITS_PATTERN.test(revocationData.dscRevokedCount)) {
      newErrors.dscRevokedCount = 'Only digits are allowed, maximum 9 digits';
    }

    // Validate Revocation Request Reason
    if (!revocationData.revocReqReason || revocationData.revocReqReason.trim().length === 0) {
      newErrors.revocReqReason = 'Revocation request reasons cannot be empty';
    } else if (revocationData.revocReqReason.length < 3 || revocationData.revocReqReason.length > 200) {
      newErrors.revocReqReason = 'The length must be between 3 and 200 characters';
    } else if (!STRING_PATTERN.test(revocationData.revocReqReason)) {
      newErrors.revocReqReason = 'Only alphabets, numbers, and characters (.,&-) are allowed';
    }

    // Validate DSC Revoked Reason
    if (!revocationData.dscRevokedReason || revocationData.dscRevokedReason.trim().length === 0) {
      newErrors.dscRevokedReason = 'DSC revoked reasons cannot be empty';
    } else if (revocationData.dscRevokedReason.length < 3 || revocationData.dscRevokedReason.length > 200) {
      newErrors.dscRevokedReason = 'The length must be between 3 and 200 characters';
    } else if (!STRING_PATTERN.test(revocationData.dscRevokedReason)) {
      newErrors.dscRevokedReason = 'Only alphabets, numbers, and characters (.,&-) are allowed';
    }

    return newErrors;
  };

  const handleAdd = async() => {
    // const formErrors = validateForm();
    // setErrors(formErrors);

   // if (Object.keys(formErrors).length === 0) {
     
      setLoading(true); 
      try {
       
        const response = await AnnexureService.addAuditorVerification(annexure);
        
        setLoading(false);
  
        showAlert({
          messageTitle: 'Add Revocation of DSC',
          messageContent: response.data,
          confirmText: 'Ok',
        });
  
        getRevocationDetails();
  
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
    // } else {
    //   console.log('Form has errors:', formErrors);
    //   setErrors(formErrors);
    // }
  };

  return (
    <Box>
      {/* Header with Collapse Toggle */}
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          7. No of Revocation of DSC during the Audit Period
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
              <TableRow>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>1</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>Number of DSCs revoked</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    disabled
                    value={revocationData.dscRevokedCount}
                    onChange={(e) => handleChange('dscRevokedCount', e.target.value)}
                    fullWidth
                    error={!!errors.dscRevokedCount}
                    helperText={errors.dscRevokedCount}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>2</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  Number of revocation requests received from subscriber/organizations & reasons
                </TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    disabled
                    value={revocationData.revocReqReason}
                    onChange={(e) => handleChange('revocReqReason', e.target.value)}
                    fullWidth
                    error={!!errors.revocReqReason}
                    helperText={errors.revocReqReason}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>3</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>Number of DSCs revoked by CAs & reasons</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    disabled
                    value={revocationData.dscRevokedReason}
                    onChange={(e) => handleChange('dscRevokedReason', e.target.value)}
                    fullWidth
                    error={!!errors.dscRevokedReason}
                    helperText={errors.dscRevokedReason}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: '10px' }}>Auditor Remarks</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                value={annexure.auditorVerification}
                fullWidth
                onChange={(e) => handleChanges(e, 'remarks')}

                InputProps={{
                  style: {
                    padding: '10px',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

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

export default RevocationDSC;
