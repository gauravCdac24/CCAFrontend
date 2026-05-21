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
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../service/AnnexureA2Service/AnnexureService';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';

const DCDetails = () => {
  const {id}=useParams();
  const applicantUserName = decrypt(id);
  const [dcData, setDcData] = useState([
    {
      locationDetailsId: 1,
      description: 'Main Site',
      location: '',
      caAdministratorCount: '',
      sysAdministratorCount: '',
      caOperatorsCount: '',
      verificationOfficersCount: '',
      caManpowerCount: '',
    },
    {
      locationDetailsId: 2,
      description: 'DR Site',
      location: '',
      caAdministratorCount: '',
      sysAdministratorCount: '',
      caOperatorsCount: '',
      verificationOfficersCount: '',
      caManpowerCount: '',
    },
    {
      locationDetailsId: 3,
      description: 'Any other location',
      location: '',
      caAdministratorCount: '',
      sysAdministratorCount: '',
      caOperatorsCount: '',
      verificationOfficersCount: '',
      caManpowerCount: '',
    },
  ]);

  useEffect(() => {
    getCaLocationDetails();
  }, []);

  const [annexure, setAnnexure] = useState({
    userName: applicantUserName,
    apiNum: '10',
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

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

   // Fetching CA location details
   const getCaLocationDetails = async () => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const response = await AnnexureService.getAuditorVerification(annexure);
      console.log('CA Location details:', response.data);

      const data=response?.data?.locationDetails
      // Assuming the response data has the structure you expect, we will map the data to the dcData structure
      if (data && data.length > 0) {
        const updatedData = data.map((item, index) => ({
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
        setDcData(updatedData);
      }

      setAnnexure(prevState => ({
        ...prevState,
        auditorVerification: response?.data?.auditorVerification
    }));

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Error fetching CA Location details:', err);
    }
  };

 


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

  const handleChange = (id, field, value) => {
    setDcData((prevData) =>
      prevData.map((row) =>
        row.locationDetailsId === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleFileChange = (id, field, file) => {
    setDcData((prevData) =>
      prevData.map((row) =>
        row.locationDetailsId === id ? { ...row, [field]: file } : row
      )
    );
  };

  const handleSubmit = async () => {
   
   

      setLoading(true);
      try {
        const response = await AnnexureService.addAuditorVerification(annexure);
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
                      disabled
                      value={row.location}
                      onChange={(e) => handleChange(row.locationDetailsId, 'location', e.target.value)}
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
                      disabled
                      type="file"
                      onChange={(e) => handleFileChange(row.locationDetailsId, 'caAdministratorCount', e.target.files[0])}
                    />
                    {row.caAdministratorCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.caAdministratorCount} {/* Display the file name */}
    </Typography>
  )}
                    {errors[row.locationDetailsId]?.caAdministratorCount && (
                      <Typography color="error">{errors[row.locationDetailsId].caAdministratorCount}</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
  <input
    disabled
    type="file"
    onChange={(e) => handleFileChange(row.locationDetailsId, 'sysAdministratorCount', e.target.files[0])}
  />
  {row.sysAdministratorCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.sysAdministratorCount} {/* Display the file name */}
    </Typography>
  )}
  {errors[row.locationDetailsId]?.sysAdministratorCount && (
    <Typography color="error">{errors[row.locationDetailsId].sysAdministratorCount}</Typography>
  )}
</TableCell>

<TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
  <input
    disabled
    type="file"
    onChange={(e) => handleFileChange(row.locationDetailsId, 'caOperatorsCount', e.target.files[0])}
  />
  {row.caOperatorsCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.caOperatorsCount} {/* Display the file name */}
    </Typography>
  )}
  {errors[row.locationDetailsId]?.caOperatorsCount && (
    <Typography color="error">{errors[row.locationDetailsId].caOperatorsCount}</Typography>
  )}
</TableCell>

<TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
  <input
    disabled
    type="file"
    onChange={(e) => handleFileChange(row.locationDetailsId, 'verificationOfficersCount', e.target.files[0])}
  />
  {row.verificationOfficersCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.verificationOfficersCount} {/* Display the file name */}
    </Typography>
  )}
  {errors[row.locationDetailsId]?.verificationOfficersCount && (
    <Typography color="error">{errors[row.locationDetailsId].verificationOfficersCount}</Typography>
  )}
</TableCell>

<TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
  <input
    disabled
    type="file"
    onChange={(e) => handleFileChange(row.locationDetailsId, 'caManpowerCount', e.target.files[0])}
  />
  {row.caManpowerCount && (
    <Typography sx={{ color: 'text.secondary', mt: 1 }}>
      {row.caManpowerCount} {/* Display the file name */}
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
