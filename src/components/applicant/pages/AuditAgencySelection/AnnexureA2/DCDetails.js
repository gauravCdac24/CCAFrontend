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
  IconButton,
  Button,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import showAlert from '../../../../global/common/MessageBox/AlertService';

const DCDetails = () => {
  const [dcData, setDcData] = useState([
    {
      locationDetailsId: '',
      description: 'Main Site',
      location: '',
      caAdministratorCount: '',
      sysAdministratorCount: '',
      caOperatorsCount: '',
      verificationOfficersCount: '',
      caManpowerCount: '',
    },
    {
      locationDetailsId: '',
      description: 'DR Site',
      location: '',
      caAdministratorCount: '',
      sysAdministratorCount: '',
      caOperatorsCount: '',
      verificationOfficersCount: '',
      caManpowerCount: '',
    },
    {
      locationDetailsId: '',
      description: 'Any other location',
      location: '',
      caAdministratorCount: '',
      sysAdministratorCount: '',
      caOperatorsCount: '',
      verificationOfficersCount: '',
      caManpowerCount: '',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

   // Fetching CA location details
   const getCaLocationDetails = async () => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const response = await AnnexureService.getCaLocationDetails();
      console.log('CA Location details:', response.data);

      // Assuming the response data has the structure you expect, we will map the data to the dcData structure
      const updatedData = response.data.map((item, index) => ({
        locationDetailsId: item.locationDetailsId || index + 1, // Ensure unique ID
        description: item.description || '',
        location: item.location || '',
        caAdministratorCount: item.caAdministratorCount || '',
        sysAdministratorCount: item.sysAdministratorCount	 || '',
        caOperatorsCount: item.caOperatorsCount	 || '',
        verificationOfficersCount: item.verificationOfficersCount	 || '',
        caManpowerCount: item.caManpowerCount	 || '',
      }));

      console.log('Updated CA Location details:', updatedData);
      // Update dcData state with the fetched data
     if(response.data.length === 3){
      setDcData(updatedData);
     }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Error fetching CA Location details:', err);
    }
  };

  useEffect(() => {
    getCaLocationDetails();
  }, []);

  // Validation functions
  const validateLocation = (location) => {
    const pattern = /^[A-Za-z0-9().,&\-\s]+$/;
    if (!location || location.trim() === '') {
      return 'Location cannot be empty.';
    } else if (location.length < 3 || location.length > 100) {
      return 'Location length must be between 3 and 100 characters.';
    } else if (!pattern.test(location)) {
      return 'Location can only contain alphabets, numbers, and characters ().,&-';
    }
    return '';
  };

  const validateFile = (file) => {
    if (!file) return 'Please upload a file.';
    if (!file.name.endsWith('.xlsx')) return 'Invalid file format. Only .xlsx files are allowed.';
    if (file.size > 5 * 1024 * 1024) return 'File size must be less than 5 MB.';
    return '';
  };

  const handleChange = (index, field, value) => {
    setDcData((prevData) =>
      prevData.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleFileChange = (index, field, file) => {
    setDcData((prevData) =>
      prevData.map((row, i) =>
        i === index ? { ...row, [field]: file } : row
      )
    );
  };

  const handleSubmit = async () => {
    let isValid = true;
    const newErrors = {};

    const updatedData = dcData.map((row) => {
      const errors = {};

      // Validate Location
      const locationError = validateLocation(row.location);
      if (locationError) errors.location = locationError;

      // Validate Files
      const caAdminFileError = validateFile(row.caAdministratorCount);
      if (caAdminFileError) errors.caAdministratorCount = caAdminFileError;

      const sysAdminFileError = validateFile(row.sysAdministratorCount);
      if (sysAdminFileError) errors.sysAdministratorCount = sysAdminFileError;

      const caOperatorsFileError = validateFile(row.caOperatorsCount);
      if (caOperatorsFileError) errors.caOperatorsCount = caOperatorsFileError;

      const verificationOfficersFileError = validateFile(row.verificationOfficersCount);
      if (verificationOfficersFileError) errors.verificationOfficersCount = verificationOfficersFileError;

      const caManpowerFileError = validateFile(row.caManpowerCount);
      if (caManpowerFileError) errors.caManpowerCount = caManpowerFileError;

      // If there are errors, mark the form as invalid
      if (Object.keys(errors).length > 0) {
        isValid = true;
      }

      return { ...row, errors };
    });

    setErrors(updatedData.reduce((acc, row) => {
      acc[row.locationDetailsId] = row.errors;
      return acc;
    }, {}));
    //alert(isValid);

    if (isValid) {
      console.log('DC & DR Site Data:', dcData);

      setLoading(true);
      try {
        const response = await AnnexureService.addLocationDetails(dcData);
        setLoading(false);

        showAlert({
          messageTitle: 'Add DC & DR Site',
          messageContent: response.data,
          confirmText: 'Ok',
        });

        getCaLocationDetails();
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
      console.log('Validation failed');
      setErrors(updatedData.reduce((acc, row) => {
        acc[row.locationDetailsId] = row.errors;
        return acc;
      }, {}));
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          10. Details of DC & DR Site
        </Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton onClick={() => setOpen(!open)} sx={{ color: 'primary.main' }}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={open}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'tablecolor.main', color: 'tablecolor.text' }}>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>S. No.</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>No of CA Administrators</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>No of System Administrators</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>No of CA Operators</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>No of Verification Officers</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Total CA Manpower</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dcData.map((row, index) => (
                <TableRow key={row.locationDetailsId || index}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{index + 1}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.description}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      value={row.location}
                      onChange={(e) => handleChange(index, 'location', e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors[row.locationDetailsId]?.location}
                      helperText={errors[row.locationDetailsId]?.location}
                      sx={{ width: '230px' }}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
  <input
    type="file"
    onChange={(e) => handleFileChange(index, 'caAdministratorCount', e.target.files[0])}
    disabled={!!row.caAdministratorCount}
  />
  {row.caAdministratorCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.caAdministratorCount instanceof File ? row.caAdministratorCount.name : row.caAdministratorCount}
    </Typography>
  )}
  {errors[row.locationDetailsId]?.caAdministratorCount && (
    <Typography color="error">{errors[row.locationDetailsId].caAdministratorCount}</Typography>
  )}
</TableCell>

<TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
  <input
    type="file"
    onChange={(e) => handleFileChange(index, 'sysAdministratorCount', e.target.files[0])}
    disabled={!!row.sysAdministratorCount}
  />
  {row.sysAdministratorCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.sysAdministratorCount instanceof File ? row.sysAdministratorCount.name : row.sysAdministratorCount}
    </Typography>
  )}
  {errors[row.locationDetailsId]?.sysAdministratorCount && (
    <Typography color="error">{errors[row.locationDetailsId].sysAdministratorCount}</Typography>
  )}
</TableCell>

<TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
  <input
    type="file"
    onChange={(e) => handleFileChange(index, 'caOperatorsCount', e.target.files[0])}
    disabled={!!row.caOperatorsCount}
  />
  {row.caOperatorsCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.caOperatorsCount instanceof File ? row.caOperatorsCount.name : row.caOperatorsCount}
    </Typography>
  )}
  {errors[row.locationDetailsId]?.caOperatorsCount && (
    <Typography color="error">{errors[row.locationDetailsId].caOperatorsCount}</Typography>
  )}
</TableCell>

<TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
  <input
    type="file"
    onChange={(e) => handleFileChange(index, 'verificationOfficersCount', e.target.files[0])}
    disabled={!!row.verificationOfficersCount}
  />
  {row.verificationOfficersCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.verificationOfficersCount instanceof File ? row.verificationOfficersCount.name : row.verificationOfficersCount}
    </Typography>
  )}
  {errors[row.locationDetailsId]?.verificationOfficersCount && (
    <Typography color="error">{errors[row.locationDetailsId].verificationOfficersCount}</Typography>
  )}
</TableCell>

<TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
  <input
    type="file"
    onChange={(e) => handleFileChange(index, 'caManpowerCount', e.target.files[0])}
    disabled={!!row.caManpowerCount}
  />
  {row.caManpowerCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.caManpowerCount instanceof File ? row.caManpowerCount.name : row.caManpowerCount}
    </Typography>
  )}
  {errors[row.locationDetailsId]?.caManpowerCount && (
    <Typography color="error">{errors[row.locationDetailsId].caManpowerCount}</Typography>
  )}
</TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="right" mt={3}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            ADD
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DCDetails;
