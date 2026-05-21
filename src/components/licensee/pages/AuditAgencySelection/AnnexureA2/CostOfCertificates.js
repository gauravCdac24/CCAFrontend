import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, TextField, Button, Collapse, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import showAlert from '../../../../global/common/MessageBox/AlertService';

const CostOfCertificates = () => {
  const [open, setOpen] = useState(false);
  const [costData, setCostData] = useState({
    certCostId: '',
    avgDscIssuMaintenanceCost: '',
    avgFeeChargedByCA: '',
    explanationForCostMismatch: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);

  const getAnnualAuditPeriodDetails = async () => {
    setLoading(true);
    try {
      const response = await AnnexureService.getCertificateDetails(); // Assuming it's a function call
      setLoading(false);
     
      if (response.data) {
        setCostData(response.data);
      }
    } catch (err) {
      console.error('Error fetching ASP details:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnnualAuditPeriodDetails();
  }, []);

  // Validation patterns
  const STRING_PATTERN = /^[A-Za-z0-9().,&\- ]+$/;
  const DIGITS_PATTERN = /^[0-9]+$/;

  const handleChange = (field, value) => {
    setCostData({
      ...costData,
      [field]: value
    });
  };

  const validateFields = () => {
    let valid = true;
    let newErrors = {};

    // Validate avgDscIssuMaintenanceCost
    if (!costData.avgDscIssuMaintenanceCost.trim()) {
      newErrors.avgDscIssuMaintenanceCost = 'Maintenance cost cannot be empty.';
      valid = false;
    } else if (!DIGITS_PATTERN.test(costData.avgDscIssuMaintenanceCost)) {
      newErrors.avgDscIssuMaintenanceCost = 'Only digits are allowed.';
      valid = false;
    } else if (parseInt(costData.avgDscIssuMaintenanceCost) > 25000) {
      newErrors.avgDscIssuMaintenanceCost = 'Maximum cost should not exceed 25000.';
      valid = false;
    }

    // Validate avgFeeChargedByCA
    if (!costData.avgFeeChargedByCA.trim()) {
      newErrors.avgFeeChargedByCA = 'Fee charged cannot be empty.';
      valid = false;
    } else if (!DIGITS_PATTERN.test(costData.avgFeeChargedByCA)) {
      newErrors.avgFeeChargedByCA = 'Only digits are allowed.';
      valid = false;
    } else if (parseInt(costData.avgFeeChargedByCA) > 25000) {
      newErrors.avgFeeChargedByCA = 'Maximum fee should not exceed 25000.';
      valid = false;
    }

    // Validate explanationForCostMismatch
    if (!costData.explanationForCostMismatch.trim()) {
      newErrors.explanationForCostMismatch = 'Explanation cannot be empty';
      valid = false;
    } else if (costData.explanationForCostMismatch.length < 3 || costData.explanationForCostMismatch.length > 250) {
      newErrors.explanationForCostMismatch = 'The length must be between 3 and 250 characters.';
      valid = false;
    } else if (!STRING_PATTERN.test(costData.explanationForCostMismatch)) {
      newErrors.explanationForCostMismatch = 'Only alphabets, numbers, characters ().,&- are allowed';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      console.log('Form submitted:', costData);
      try {
        setLoading(true);
        // Send data to backend
        const response = await AnnexureService.addCertificateDetails(costData);

        showAlert({
          messageTitle: 'Success',
          messageContent: response.data || 'Data submitted successfully!',
          confirmText: 'Ok',
        });

        getAnnualAuditPeriodDetails();
      } catch (err) {
        console.error('Submission error:', err);
        showAlert({
          messageTitle: 'Error',
          messageContent: err.response?.data || 'Your request cannot be processed at this time.',
          confirmText: 'Ok',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          14. Cost of Certificates issued during audit period
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
                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>1</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    Average expenditure for issuance of one DSC and maintenance of the details for a period of 7 years after expiry of DSC
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      fullWidth
                      value={costData.avgDscIssuMaintenanceCost}
                      onChange={(e) => handleChange('avgDscIssuMaintenanceCost', e.target.value)}
                      variant="outlined"
                      placeholder="Enter value"
                      error={Boolean(errors.avgDscIssuMaintenanceCost)}
                      helperText={errors.avgDscIssuMaintenanceCost}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>2</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    Average fee charged for one DSC by CA
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      fullWidth
                      value={costData.avgFeeChargedByCA}
                      onChange={(e) => handleChange('avgFeeChargedByCA', e.target.value)}
                      variant="outlined"
                      placeholder="Enter value"
                      error={Boolean(errors.avgFeeChargedByCA)}
                      helperText={errors.avgFeeChargedByCA}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>3</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    Detailed explanation, sustainability plan if the average fee charged is less than average cost of certificates
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      fullWidth
                      value={costData.explanationForCostMismatch}
                      onChange={(e) => handleChange('explanationForCostMismatch', e.target.value)}
                      variant="outlined"
                      placeholder="Enter value"
                      error={Boolean(errors.explanationForCostMismatch)}
                      helperText={errors.explanationForCostMismatch}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

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

export default CostOfCertificates;
