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
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import stringToDateFormat from '../../../../global/util/DateUtil';

// Regex validation patterns
const NAME_PATTERN = /^[A-Za-z, ]+$/;
const STRING_PATTERN = /^[A-Za-z0-9().,&\-\s]+$/;
const DESCRIPTION_PATTERN = /^[A-Za-z0-9 ]+$/;

const CADetails = () => {
  const [caData, setCaData] = useState([
    { id: 1, description: 'CA Software', developedBy: '', databaseUsed: '', certification: '', lastSecurityAudit: '' },
    { id: 2, description: 'OCSP', developedBy: '', databaseUsed: '', certification: '', lastSecurityAudit: '' },
    { id: 3, description: 'TSA', developedBy: '', databaseUsed: '', certification: '', lastSecurityAudit: '' },
    { id: 4, description: 'RA Software', developedBy: '', databaseUsed: '', certification: '', lastSecurityAudit: '' },
    { id: 5, description: 'eSign service software', developedBy: '', databaseUsed: '', certification: '', lastSecurityAudit: '' },
    { id: 6, description: 'Website', developedBy: '', databaseUsed: '', certification: '', lastSecurityAudit: '' },
  ]);

  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true); // Track form validity

  const [isLoading, setLoading] = useState(false);

  const countWords = (str) => {

      return str.trim().split(/\s+/).filter(Boolean).length;

  }

  const getCASoftwareDetailsDetails = async () =>{

      setLoading(true);
      try{
          const response = await AnnexureService.getCASoftwareDetailsDetails();

          console.log('CA Software details:', response.data);
          if(response.data.length===6){

              
              const list = response.data.map((obj, index) => {
                  obj['id'] = index + 1;
                  obj['lastSecurityAudit'] = stringToDateFormat(obj.lastSecurityAudit, "yyyy-MM-dd");
                  return obj;
              });

              setCaData(list);

          }

          setLoading(false);


      }catch(err){
          setLoading(false);
      }

  }

  useEffect(()=>{

    getCASoftwareDetailsDetails();

  }, [])

  // Handle field changes and validate input
  const handleChange = (id, field, value) => {
    setCaData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Validate form fields — format/length only when value present
  const validateForm = () => {
    let errorMsgs = {};

    caData.forEach((row) => {
      if (row.description && row.description.trim()) {
        if (row.description.length < 3 || row.description.length > 50) {
          errorMsgs[`${row.id}-description`] = 'Description length must be between 3 and 50 characters';
        } else if (!DESCRIPTION_PATTERN.test(row.description)) {
          errorMsgs[`${row.id}-description`] = 'Only alphabets, numbers, and spaces are allowed';
        }
      }

      if (row.developedBy && row.developedBy.trim()) {
        if (row.developedBy.length < 3 || row.developedBy.length > 64) {
          errorMsgs[`${row.id}-developedBy`] = 'Length must be between 3 and 64 characters';
        } else if (!NAME_PATTERN.test(row.developedBy)) {
          errorMsgs[`${row.id}-developedBy`] = 'Only alphabets, commas, and spaces are allowed';
        }
      }

      if (row.databaseUsed && row.databaseUsed.trim()) {
        if (row.databaseUsed.length < 3 || row.databaseUsed.length > 30) {
          errorMsgs[`${row.id}-databaseUsed`] = 'Length must be between 3 and 30 characters';
        } else if (!NAME_PATTERN.test(row.databaseUsed)) {
          errorMsgs[`${row.id}-databaseUsed`] = 'Only alphabets, commas, and spaces are allowed';
        }
      }

      if (row.certification && row.certification.trim()) {
        if (row.certification.length < 3 || row.certification.length > 64) {
          errorMsgs[`${row.id}-certification`] = 'Length must be between 3 and 64 characters';
        } else if (!STRING_PATTERN.test(row.certification)) {
          errorMsgs[`${row.id}-certification`] = 'Only alphabets, numbers, characters ().,&- are allowed';
        }
      }
    });

    const valid = Object.keys(errorMsgs).length === 0;
    setErrors(errorMsgs);
    setIsFormValid(valid);
    return errorMsgs;
  };

  // Handle Add button click
  const handleAdd = async() => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
     
      setLoading(true); 
      try {
       
        const response = await AnnexureService.addCASoftwareDetailsDetails(caData);
        
        setLoading(false);
  
        showAlert({
          messageTitle: 'Add CA Software/Website',
          messageContent: response.data,
          confirmText: 'Ok',
        });
  
        getCASoftwareDetailsDetails();
  
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
      setErrors(formErrors);
    }
  };

  return (
    <Box>
      {/* Header with Collapse Toggle */}
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          9. Details of CA Software/Website
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
                <TableCell sx={{ border: 0.5, fontWeight: 'bold' }}>S. No.</TableCell>
                <TableCell sx={{ border: 0.5, fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ border: 0.5, fontWeight: 'bold' }}>Developed By</TableCell>
                <TableCell sx={{ border: 0.5, fontWeight: 'bold' }}>Database Used</TableCell>
                <TableCell sx={{ border: 0.5, fontWeight: 'bold' }}>Certification</TableCell>
                <TableCell sx={{ border: 0.5, fontWeight: 'bold' }}>Last Security Audit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {caData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ border: 0.5 }}>{row.id}</TableCell>
                  <TableCell sx={{ border: 0.5 }}>{row.description}</TableCell>
                  <TableCell sx={{ border: 0.5 }}>
                    <TextField
                      value={row.developedBy}
                      onChange={(e) => handleChange(row.id, 'developedBy', e.target.value)}
                      fullWidth
                      error={!!errors[`${row.id}-developedBy`]}
                      helperText={errors[`${row.id}-developedBy`]}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5 }}>
                    <TextField
                      value={row.databaseUsed}
                      onChange={(e) => handleChange(row.id, 'databaseUsed', e.target.value)}
                      fullWidth
                      error={!!errors[`${row.id}-databaseUsed`]}
                      helperText={errors[`${row.id}-databaseUsed`]}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5 }}>
                    <TextField
                      value={row.certification}
                      onChange={(e) => handleChange(row.id, 'certification', e.target.value)}
                      fullWidth
                      error={!!errors[`${row.id}-certification`]}
                      helperText={errors[`${row.id}-certification`]}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5 }}>
                    <TextField
                      type="date"
                      value={row.lastSecurityAudit}
                      onChange={(e) => handleChange(row.id, 'lastSecurityAudit', e.target.value)}
                      fullWidth
                      error={!!errors[`${row.id}-lastSecurityAudit`]}
                      helperText={errors[`${row.id}-lastSecurityAudit`]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Button */}
        <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            ADD
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CADetails;
