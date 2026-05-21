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
  Collapse,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';

const CAServiceDetails = () => {
  const [caData, setCaData] = useState([
    {
      caServicesDetailsId: '',
      description: 'eSign service based on Aadhaar',
      internalOnly: '',
      externalOnly: '',
      aspOrgCount: '',
      aspOrgCountFile: null, // This will be for the file input
    },
    {
      caServicesDetailsId: '',
      description: 'eSign service based on CA eKYC service',
      internalOnly: '',
      externalOnly: '',
      aspOrgCount: '',
      aspOrgCountFile: null,
    },
    {
      caServicesDetailsId: '',
      description: 'Timestamping',
      internalOnly: '',
      externalOnly: '',
      aspOrgCount: '',
      aspOrgCountFile: null,
    },
  ]);

  const [errors, setErrors] = useState({});
  const [auditorRemarks, setAuditorRemarks] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const countWords = (str) => {

      return str.trim().split(/\s+/).filter(Boolean).length;

  }

  const getCaServicesDetails = async () => {
    setLoading(true);  // Start loading
    try {
      const response = await AnnexureService.getCaServicesDetails();
  
      console.log('CA Software details:', response.data);
  
      // Transform the response data to match your caData state structure
      const updatedData = response.data.map((item) => ({
        caServicesDetailsId: item.caServicesDetailsId.toString(),
        description: item.description,
        internalOnly: item.internalOnly,
        externalOnly: item.externalOnly,
        aspOrgCount: item.aspOrgCount.toString(), // Ensure it's a string for consistency
        aspOrgCountFile: item.aspOrgCountFile ? item.aspOrgCountFile : null, // File name or null
      }));
  
      // Set the state to the transformed data
      
      if(response.data.length > 0){
        setCaData(updatedData);
       }
      setLoading(false);  // Stop loading
    } catch (err) {
      setLoading(false);  // Stop loading in case of an error
      console.error('Error fetching CA Software details:', err);
    }
  };
  
  useEffect(()=>{

    getCaServicesDetails();

  }, [])

  // Validation Patterns
  const DIGITS_PATTERN = /^[0-9]+$/;
  const DESCRIPTION_PATTERN = /^[A-Za-z0-9 ()&.,-]+$/;

  // Handle field changes for caData
  const handleChange = (index, field, value) => {
    setCaData((prevData) =>
      prevData.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleFileChange = (index, field, file) => {
    const updatedErrors = { ...errors };
  
    // File validation
    if (!file) {
      updatedErrors[index] = {
        ...updatedErrors[index],
        [field]: 'Please upload a file.',
      };
    } else if (file.size > 5 * 1024 * 1024) {
      updatedErrors[index] = {
        ...updatedErrors[index],
        [field]: 'File size exceeds 5MB.',
      };
    } else if (!file.name.endsWith('.xlsx')) {
      updatedErrors[index] = {
        ...updatedErrors[index],
        [field]: 'Only xlsx files are allowed.',
      };
    } else {
      updatedErrors[index] = {
        ...updatedErrors[index],
        [field]: '', // Clear error if file is valid
      };
    }
  
    setErrors(updatedErrors); // Update errors state
  
    // Now, update the caData state to store the file for the specific row
    setCaData((prevData) =>
      prevData.map((row, i) =>
        i === index
          ? { ...row, [field]: file } // Update the specific field with the file
          : row
      )
    );
  };
  
  

  const validateData = () => {
    let valid = true;
    const newErrors = {}; // Create an empty object to store error messages

    caData.forEach((row, index) => {
      const rowErrors = {};

      // Validate description
      if (!row.description || row.description.trim().length === 0) {
        rowErrors.description = 'Description cannot be empty';
      } else if (row.description.length < 3 || row.description.length > 50) {
        rowErrors.description = 'Description length must be between 3 and 50 characters';
      } else if (!DESCRIPTION_PATTERN.test(row.description)) {
        rowErrors.description = 'Only alphabets, numbers, and characters ( ),&.- are allowed';
      }

      // Validate internalOnly
      if (!row.internalOnly || (row.internalOnly !== 'Yes' && row.internalOnly !== 'No')) {
        rowErrors.internalOnly = 'Please select Yes or No for Internal Only';
      }

      // Validate externalService
      if (!row.externalOnly || (row.externalOnly !== 'Yes' && row.externalOnly !== 'No')) {
        rowErrors.externalOnly = 'Please select Yes or No for External Service';
      }

      // Validate ASP count
      if (!row.aspOrgCount || row.aspOrgCount.trim().length === 0) {
        rowErrors.aspOrgCount = 'No of ASPs/Organizations cannot be empty';
      } else if (!DIGITS_PATTERN.test(row.aspOrgCount)) {
        rowErrors.aspOrgCount = 'Only digits are allowed';
      } else if (row.aspOrgCount.length > 9) {
        rowErrors.aspOrgCount = 'Maximum 9 digits are allowed';
      }

      // // Validate file upload (if a file is provided)
      // if (row.aspOrgCountFile == null && row.aspOrgCount.trim().length > 0) {
      //   rowErrors.aspOrgCountFile = 'Please upload a file';
      // } else if (row.aspOrgCountFile && row.aspOrgCountFile.size > 5 * 1024 * 1024) {
      //   rowErrors.aspOrgCountFile = 'File size cannot exceed 5MB';
      // } else if (row.aspOrgCountFile && !row.aspOrgCountFile.name.endsWith('.xlsx')) {
      //   rowErrors.aspOrgCountFile = 'Only .xlsx files are allowed';
      // }

      // If there are errors for this row, add them to newErrors
      if (Object.keys(rowErrors).length > 0) {
        newErrors[row.caServicesDetailsId] = rowErrors;
        valid = true;
      }
    });

    setErrors(newErrors); // Update the errors state
    return valid;
  };

  const handleSubmit = async() => {
    const formErrors = validateData();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
    
      setLoading(true); 
      try {
       
        

        const response = await AnnexureService.addCAServicesDetails(caData);
        
       
        setLoading(false);
  
       
        showAlert({
          messageTitle: 'Add   CA Services',
          messageContent: response.data,
          confirmText: 'Ok',
        });
  
      
        getCaServicesDetails();
  
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
      console.log('Form has errors:', formErrors);
    }
  };


  return (
    <Box>
      {/* Header with Collapse Toggle */}
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          11. Details of CA Services
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
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Internal Only</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>External Service</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>No of ASPs/ Organizations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {caData.map((row, index) => (
                <TableRow key={row.caServicesDetailsId || index}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{index + 1}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  {row.description}
                  </TableCell>

                  {/* Internal Only Radio Button */}
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={row.internalOnly}
                        onChange={(e) => handleChange(index, 'internalOnly', e.target.value)}
                        row
                      >
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                    {errors[index]?.internalOnly && <Typography color="error">{errors[index]?.internalOnly}</Typography>}
                  </TableCell>

                  {/* External Service Radio Button */}
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={row.externalOnly}
                        onChange={(e) => handleChange(index, 'externalOnly', e.target.value)}
                        row
                      >
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                    {errors[index]?.externalOnly && <Typography color="error">{errors[index]?.externalOnly}</Typography>}
                  </TableCell>

                  {/* No of ASPs/ Organizations */}
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  <TextField
                    value={row.aspOrgCount}
                    onChange={(e) => handleChange(index, 'aspOrgCount', e.target.value)}
                    error={!!errors[index]?.aspOrgCount}
                    helperText={errors[index]?.aspOrgCount}
                    sx={{ marginBottom: 2 }} // Added margin-bottom to add space between "Count" and file input
                  />

                 
                  {/* File input */}
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(index, 'aspOrgCountFile', e.target.files[0])}
                    style={{ marginTop: '8px' }}
                    disabled={!!row.aspOrgCountFile}
                  />

                    {row.aspOrgCountFile && (
                        <Typography sx={{ color: 'text.secondary', mt: 1 }}>
                          {row.aspOrgCountFile instanceof File ? row.aspOrgCountFile.name : row.aspOrgCountFile} 
                        </Typography>
                      )}

                   {/* Error message for aspOrgCountFile */}
                   {errors[index]?.aspOrgCountFile && (
                    <Typography color="error" sx={{ marginTop: '4px' }}>
                      {errors[index]?.aspOrgCountFile}
                    </Typography>
                  )}

                </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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

export default CAServiceDetails;
