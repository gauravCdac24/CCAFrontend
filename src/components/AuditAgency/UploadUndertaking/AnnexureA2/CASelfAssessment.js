import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, TextField, Button, Collapse, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../service/AnnexureA2Service/AnnexureService';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';

const CASelfAssessment = () => {
  const [open, setOpen] = useState(false);
  
  const {id}=useParams();
 const applicantUserName = decrypt(id);
  // Patterns for validation
  const STRING_PATTERN = /^[A-Za-z0-9().,&\-\s]+$/;
  const DIGITS_PATTERN = /^[0-9]+$/;

  // State for form data
  const [caData, setCaData] = useState({
    selfAssMainId: '',
    auditorVerification: '',
    dscIssuedCountWAppForm: '',
    ncReason: '',
    dscIssuedWFee: '',
    detailsDSCIssuedWFee: '',
    dscIssuedWPhysicalVer: '',
    dscIssuedWMatch: '',
    ncReasonWithMatch: '',
    isOTPSent: '',
    otpReasonNC: '',
    caSystemAccessDetails: '',
    ownNCDetails: '',
  });

  const [annexure, setAnnexure] = useState({
    userName: applicantUserName,
    apiNum: '15',
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


  const validate = () => {
    let newErrors = {};
    const digitPattern = /^[0-9]+$/;
    const stringPattern = /^[A-Za-z0-9().,&\-\s]+$/;

    if (!caData.dscIssuedCountWAppForm) {
      newErrors.dscIssuedCountWAppForm = "DSC issued count cannot be empty.";
    } else if (!digitPattern.test(caData.dscIssuedCountWAppForm)) {
      newErrors.dscIssuedCountWAppForm = "Only digits are allowed.";
    } else if (caData.dscIssuedCountWAppForm.length > 9) {
      newErrors.dscIssuedCountWAppForm = "Must not exceed 9 digits.";
    }

    if (!caData.ncReason) {
      newErrors.ncReason = "NC reason cannot be empty.";
    } else if (!stringPattern.test(caData.ncReason)) {
      newErrors.ncReason = "Only allowed characters are ( ), . , & -";
    } else if (caData.ncReason.length < 3 || caData.ncReason.length > 200) {
      newErrors.ncReason = "Must be between 3 and 200 characters.";
    }

    if (!caData.dscIssuedWFee) {
      newErrors.dscIssuedWFee = "DSC issued with fee cannot be empty.";
    } else if (!digitPattern.test(caData.dscIssuedWFee)) {
      newErrors.dscIssuedWFee = "Only digits are allowed.";
    } else if (caData.dscIssuedWFee.length > 9) {
      newErrors.dscIssuedWFee = "Must not exceed 9 digits.";
    }

    if (!caData.detailsDSCIssuedWFee) {
      newErrors.detailsDSCIssuedWFee = "Details cannot be empty.";
    } else if (!stringPattern.test(caData.detailsDSCIssuedWFee)) {
      newErrors.detailsDSCIssuedWFee = "Only allowed characters are ( ), . , & -";
    } else if (caData.detailsDSCIssuedWFee.length < 3 || caData.detailsDSCIssuedWFee.length > 200) {
      newErrors.detailsDSCIssuedWFee = "Must be between 3 and 200 characters.";
    }

    if (!caData.isOTPSent) {
      newErrors.isOTPSent = "OTP sent status cannot be empty.";
    } else if (caData.isOTPSent !== "Yes" && caData.isOTPSent !== "No") {
      newErrors.isOTPSent = "OTP sent must be Yes or No.";
    }

    if (caData.isOTPSent === "Yes" && !caData.otpReasonNC) {
      newErrors.otpReasonNC = "OTP reason cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setCaData({
      ...caData,
      [field]: value,
    });
  };

  const handleSubmit = async() => {
    // if (validate()) {
      console.log('Form submitted:', caData);
      try {
        //setLoading(true);
        // Send data to backend
        const response = await AnnexureService.addAuditorVerification(annexure);

        showAlert({
          messageTitle: 'Success',
          messageContent: response.data || 'Data submitted successfully!',
          confirmText: 'Ok',
        });

       // getAnnualAuditPeriodDetails();
      } catch (err) {
        console.error('Submission error:', err);
        showAlert({
          messageTitle: 'Error',
          messageContent: err.response?.data || 'Your request cannot be processed at this time.',
          confirmText: 'Ok',
        });
      } finally {
       // setLoading(false);
      }
    // }
  };
  return (
    <Box>
      {/* Box containing Typography and IconButton */}
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          15. CA Self-assessment for audit period
        </Typography>

        {/* Add gap between Typography and IconButton */}
        <Box sx={{ marginLeft: 'auto' }}>
          {/* IconButton that toggles between expand and collapse */}
          <IconButton onClick={() => setOpen(!open)} sx={{ color: 'primary.main' }}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Collapse content that toggles when the icon is clicked */}
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
                {/* Create table rows based on the new fields */}
                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>1</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>No of DSC issued without any DSC application Forms, if any &
                    reason for non-compliance.</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      fullWidth
                      value={caData.dscIssuedCountWAppForm}
                      onChange={(e) => handleChange('dscIssuedCountWAppForm', e.target.value)}
                      variant="outlined"
                      placeholder="Enter count"
                      error={!!errors.dscIssuedCountWAppForm}
                      helperText={errors.dscIssuedCountWAppForm}
                    />

                   <TextField
                      disabled
                      fullWidth
                      value={caData.ncReason}
                      onChange={(e) => handleChange('ncReason', e.target.value)}
                      variant="outlined"
                      placeholder="Enter Reason"
                      error={!!errors.ncReason}
                      helperText={errors.ncReason}
                    />

                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>2</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>No of DSC issued without charging fee, if any & details.</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      fullWidth
                      value={caData.dscIssuedWFee}
                      onChange={(e) => handleChange('dscIssuedWFee', e.target.value)}
                      variant="outlined"
                      placeholder="Enter count"
                      error={!!errors.dscIssuedWFee}
                      helperText={errors.dscIssuedWFee}
                    />
                     <TextField
                      disabled
                      fullWidth
                      value={caData.detailsDSCIssuedWFee}
                      onChange={(e) => handleChange('detailsDSCIssuedWFee', e.target.value)}
                      variant="outlined"
                      placeholder="Enter Details"
                      error={!!errors.detailsDSCIssuedWFee}
                      helperText={errors.detailsDSCIssuedWFee}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>3</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>No DSC issued without having physical verification(video/Biometric
                    Aadhaar) if any</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      fullWidth
                      value={caData.dscIssuedWPhysicalVer}
                      onChange={(e) => handleChange('dscIssuedWPhysicalVer', e.target.value)}
                      variant="outlined"
                      placeholder="Enter count"
                      error={!!errors.dscIssuedWPhysicalVer}
                      helperText={errors.dscIssuedWPhysicalVer}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>4</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>No of DSC issued(except for foreign nationals) whose name is not
                    matching with as that of in Aadhaar or PAN, if any & reason for
                    noncompliance</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      fullWidth
                      value={caData.dscIssuedWMatch}
                      onChange={(e) => handleChange('dscIssuedWMatch', e.target.value)}
                      variant="outlined"
                      placeholder="Enter count"
                      error={!!errors.dscIssuedWMatch}
                      helperText={errors.dscIssuedWMatch}
                    />
                     <TextField
                      disabled
                      fullWidth
                      value={caData.ncReasonWithMatch}
                      onChange={(e) => handleChange('ncReasonWithMatch', e.target.value)}
                      variant="outlined"
                      placeholder="Enter reason"
                      error={!!errors.ncReasonWithMatch}
                      helperText={errors.ncReasonWithMatch}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>5</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>Whether CA system allows sending common OTP to many customers? If
                    Yes, reason for such non-compliance</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <FormControl component="fieldset" disabled>
                      <RadioGroup
                        row
                        value={caData.isOTPSent}
                        onChange={(e) => handleChange('isOTPSent', e.target.value)}
                        error={!!errors.isOTPSent}
                        helperText={errors.isOTPSent}


                      >
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>

                      {/* Conditionally render comment box if 'Yes' is selected */}
                      {caData.isOTPSent === 'Yes' && (
                        <TextField
                          disabled
                          fullWidth
                          value={caData.otpReasonNC}
                          onChange={(e) => handleChange('otpReasonNC', e.target.value)}
                          variant="outlined"
                          placeholder="Enter comment"
                          error={!!errors.otpReasonNC}
                          helperText={errors.otpReasonNC}
                        />
                      )}
                    </FormControl>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>6</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>Whether access to CA system is based on single URL-point or allows
                    Link based access. If link-based access allowed, provide details in
                    respect of coverage of such access in the security audit, annual audit & internal
                    audit. The details of vulnerabilities and non-compliance noted for each
                    type of links.</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      fullWidth
                      value={caData.caSystemAccessDetails}
                      onChange={(e) => handleChange('caSystemAccessDetails', e.target.value)}
                      variant="outlined"
                      placeholder="Enter Reason"
                      error={!!errors.caSystemAccessDetails}
                      helperText={errors.caSystemAccessDetails}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>7</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>The effort taken by CA to find out the own-noncompliance and action
                    Taken during the audit period</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      fullWidth
                      value={caData.ownNCDetails}
                      onChange={(e) => handleChange('ownNCDetails', e.target.value)}
                      variant="outlined"
                      placeholder="Enter details"
                      error={!!errors.ownNCDetails}
                      helperText={errors.ownNCDetails}
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
          <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              ADD
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CASelfAssessment;
