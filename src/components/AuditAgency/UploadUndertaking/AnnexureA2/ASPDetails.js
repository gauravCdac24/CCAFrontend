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
  Button,
  Collapse,
  IconButton,
  Grid,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../service/AnnexureA2Service/AnnexureService';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import { useParams } from 'react-router-dom';

const ASPDetails = () => {

  const {id}=useParams();
  const applicantUserName = decrypt(id);

  const [aspData, setAspData] = useState([
    {
      id: 1,
      description: 'No of ASPs',
      aspCount: null, // For file input
    },
    {
      id: 2,
      description: 'No of ASPs whose audit exceed more than One year',
      aspsAuditOverdueCount: null, // For file input
    },
  ]);

  const [annexure, setAnnexure] = useState({
    userName: applicantUserName,
    apiNum: '12',
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

  const [auditorRemarks, setAuditorRemarks] = useState('');
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({}); // State for validation errors

  const [isLoading, setLoading] = useState(false);
  const getAnnualAuditPeriodDetails = async () => {
    setLoading(true);
    try {
        const response = await AnnexureService.getAuditorVerification(annexure); // API Call
        setLoading(false);

        console.log("hbdh=--->",response.data)
        if (response.data) {
            // Extract necessary fields
            const fetchedData = response.data;

            // Map the API response to the expected format in state
            const updatedAspData = [
                {
                    id: 1,
                    description: 'No of ASPs',
                    aspCount: fetchedData.aspCount ? { name: fetchedData.aspCount } : null,
                },
                {
                    id: 2,
                    description: 'No of ASPs whose audit exceed more than One year',
                    aspsAuditOverdueCount: fetchedData.aspsAuditOverdueCount ? { name: fetchedData.aspsAuditOverdueCount } : null,
                },
            ];

            // Set state with fetched data
            setAspData(updatedAspData);
            setAnnexure(prevState => ({
              ...prevState,
              auditorVerification: response?.data?.auditorVerification
          }));
        }
    } catch (err) {
        console.error("Error fetching ASP details:", err);
        setLoading(false);
    }
};

 
  useEffect(()=>{

      getAnnualAuditPeriodDetails();

  }, [])




  // Handle field changes for ASP data
  const handleFileChange = (id, field, file) => {
    const updatedErrors = { ...errors };
    let error = '';

    // File validation
    if (!file) {
      error = 'Please upload a file.';
    } else if (file.size > 5 * 1024 * 1024) { // 5MB max file size
      error = 'File size exceeds 5MB.';
    } else if (!file.name.endsWith('.xlsx')) {
      error = 'Only .xlsx files are allowed.';
    }

    updatedErrors[id] = { ...updatedErrors[id], [field]: error };
    setErrors(updatedErrors);

    setAspData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, [field]: file } : row
      )
    );
  };

  // Handle remarks change
  const handleRemarksChange = (value) => {
    setAuditorRemarks(value);
  };

  const handleSubmit = async () => {
   

    try {
      setLoading(true);  // Start loading

      // Send data to the backend
      const response = await AnnexureService.addAuditorVerification(annexure);
      setLoading(false); // Stop loading

      // Show success message
      showAlert({
        messageTitle: 'Add ASP Details',
        messageContent: response.data,
        confirmText: 'Ok',
      });

      // Assuming you want to fetch updated details after submission
      getAnnualAuditPeriodDetails();
    } catch (err) {
      setLoading(false);  // Stop loading on error

      // Show error message
      showAlert({
        messageTitle: 'Error',
        messageContent: err.response?.data 
          ? (typeof err.response.data === 'object' 
            ? 'Your request cannot be processed at this time. Please try again later.' 
            : err.response.data) 
          : 'Your request cannot be processed at this time. Please try again later.',
        confirmText: 'Ok',
      });
    }

    // Optional: Log the form data after successful submission
    console.log('ASP Data:', aspData);
};


  return (
    <Box>
      {/* Header with Collapse Toggle */}
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          12. Details of ASP
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
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>
                  S. No.
                </TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>
                  Description
                </TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>
                  Details
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aspData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.id}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.description}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    {/* File input */}
                    <input
                    disabled
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          row.id,
                          row.id === 1 ? 'aspCount' : 'aspsAuditOverdueCount',
                          e.target.files[0]
                        )
                      }
                    />
           <Typography sx={{ color: 'text.secondary', mt: 1 }}>
          {row?.aspCount?.name || row?.aspCount} {/* Extract name if it's an object */}
          {row?.aspsAuditOverdueCount?.name || row?.aspsAuditOverdueCount}
        </Typography>
                    {/* Display errors related to aspCount or aspsAuditOverdueCount */}
                    {errors[row.id]?.aspCount && (
                      <Typography color="error">{errors[row.id].aspCount}</Typography>
                    )}
                    {errors[row.id]?.aspsAuditOverdueCount && (
                      <Typography color="error">{errors[row.id].aspsAuditOverdueCount}</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
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

        {/* Submit Button */}
        <Box display="flex" justifyContent="right" mt={3}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            ADD
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ASPDetails;
