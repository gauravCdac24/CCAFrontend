import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, TextField, Button, Collapse, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../service/AnnexureA2Service/AnnexureService';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';

const STRING_PATTERN = /^[A-Za-z0-9().,&\- ]+$/;
const DIGITS_PATTERN = /^[0-9]+$/;

const DownTimeAuditPeriod = () => {

  const {id}=useParams();
  const applicantUserName = decrypt(id);

  const [open, setOpen] = useState(false);
  const [caData, setCaData] = useState({
    downTimeId: '',
    reasonAndMeasuresTaken: '',
    downTimeHour: '',
    downTimeMinute: '',
    downTimeSecond: ''
  });

  const [annexure, setAnnexure] = useState({
    userName: applicantUserName,
    apiNum: '17',
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

  const [isLoading, setLoading] = useState(false);

  const countWords = (str) => {

      return str.trim().split(/\s+/).filter(Boolean).length;

  }

  const getCASoftwareDetailsDetails = async () =>{

      setLoading(true);
      try{
          const response = await AnnexureService.getAuditorVerification(annexure);

          console.log('CA Software details:', response.data);
          if(response.data){


              setCaData(response.data);
              setAnnexure(prevState => ({
                ...prevState,
                auditorVerification: response.data.auditorVerification
            }));

          }

          setLoading(false);


      }catch(err){
          setLoading(false);
      }

  }

  useEffect(()=>{

    getCASoftwareDetailsDetails();

  }, [])


  const handleChange = (field, value) => {
    setCaData({ ...caData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    let newErrors = {};
    
    if (!caData.downTimeSecond.trim()) {
      newErrors.downTimeSecond = 'Second cannot be empty.';
    } else if (!DIGITS_PATTERN.test(caData.downTimeSecond)) {
      newErrors.downTimeSecond = 'Only digits are allowed.';
    } else if (parseInt(caData.downTimeSecond) > 59) {
      newErrors.downTimeSecond = 'Maximum 59 seconds.';
    }
    
    if (!caData.downTimeMinute.trim()) {
      newErrors.downTimeMinute = 'Minute cannot be empty.';
    } else if (!DIGITS_PATTERN.test(caData.downTimeMinute)) {
      newErrors.downTimeMinute = 'Only digits are allowed.';
    } else if (parseInt(caData.downTimeMinute) > 59) {
      newErrors.downTimeMinute = 'Maximum 59 minutes.';
    }
    
    if (!caData.downTimeHour.trim()) {
      newErrors.downTimeHour = 'Hour cannot be empty.';
    } else if (!DIGITS_PATTERN.test(caData.downTimeHour)) {
      newErrors.downTimeHour = 'Only digits are allowed.';
    } else if (caData.downTimeHour.length > 4) {
      newErrors.downTimeHour = 'Only 4 digits are allowed.';
    }
    
    if (!caData.reasonAndMeasuresTaken.trim()) {
      newErrors.reasonAndMeasuresTaken = 'Explanation cannot be empty.';
    } else if (caData.reasonAndMeasuresTaken.length < 3 || caData.reasonAndMeasuresTaken.length > 500) {
      newErrors.reasonAndMeasuresTaken = 'The length must be between 3 and 500 characters.';
    } else if (!STRING_PATTERN.test(caData.reasonAndMeasuresTaken)) {
      newErrors.reasonAndMeasuresTaken = 'Only alphabets, numbers, characters ().,&- are allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async() => {
   // if (validate()) {
      console.log('Form submitted:', caData);
      try {
        setLoading(true);
  
        // Send data to backend
        const response = await AnnexureService.addAuditorVerification(annexure);
  
        showAlert({
          messageTitle: 'Success',
          messageContent: response.data || 'Data submitted successfully!',
          confirmText: 'Ok',
        });
  
        getCASoftwareDetailsDetails();
      } catch (err) {
        console.error("Submission error:", err);
        showAlert({
          messageTitle: 'Error',
          messageContent: err.response?.data || 'Your request cannot be processed at this time.',
          confirmText: 'Ok',
        });
      } finally {
        setLoading(false);
      }
    //}
  };

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          17. Down time during the Audit period
        </Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton onClick={() => setOpen(!open)} sx={{ color: 'primary.main' }}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={open}>
        <Box mt={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'tablecolor.main', color: 'tablecolor.text' }}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>S. No.</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ backgroundColor: 'tablecolor.main', color: 'tablecolor.text' }}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>1</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>Total service down time during the audit period, if any.</TableCell>
                  <TableCell sx={{ display: 'flex', gap: 1 ,border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      value={caData.downTimeHour}
                      onChange={(e) => handleChange('downTimeHour', e.target.value)}
                      variant="outlined"
                      placeholder="HH"
                      sx={{ width: 60 }}
                      error={!!errors.downTimeHour}
                      helperText={errors.downTimeHour}
                    />
                    <TextField
                      disabled
                      value={caData.downTimeMinute}
                      onChange={(e) => handleChange('downTimeMinute', e.target.value)}
                      variant="outlined"
                      placeholder="MM"
                      sx={{ width: 60 }}
                      error={!!errors.downTimeMinute}
                      helperText={errors.downTimeMinute}
                    />
                    <TextField
                      disabled
                      value={caData.downTimeSecond}
                      onChange={(e) => handleChange('downTimeSecond', e.target.value)}
                      variant="outlined"
                      placeholder="SS"
                      sx={{ width: 60 }}
                      error={!!errors.downTimeSecond}
                      helperText={errors.downTimeSecond}
                    />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: 'tablecolor.main', color: 'tablecolor.text' }}>
                  <TableCell  sx={{ border: 0.5, borderColor: 'grey.500' }}>2</TableCell>
                  <TableCell  sx={{ border: 0.5, borderColor: 'grey.500' }}>Reason for non-availability of service and remedial measures taken.</TableCell>
                  <TableCell  sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      fullWidth
                      multiline
                      rows={4}
                      value={caData.reasonAndMeasuresTaken}
                      onChange={(e) => handleChange('reasonAndMeasuresTaken', e.target.value)}
                      variant="outlined"
                      placeholder="Enter reason and measures taken"
                      error={!!errors.reasonAndMeasuresTaken}
                      helperText={errors.reasonAndMeasuresTaken}
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

          <Box display="flex" justifyContent="right" mt={3}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              ADD
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DownTimeAuditPeriod;
