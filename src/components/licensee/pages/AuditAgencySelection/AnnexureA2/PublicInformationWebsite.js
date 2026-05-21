import React, { useState } from 'react';
import { 
  Box, Typography, IconButton, TextField, Button, Collapse, 
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';

const PublicInformationWebsite = () => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);

  // Static Predefined Data with auto-filled descriptions
  const [caData, setCaData] = useState([
    { publicInfoDetailsId: 1, description: 'CA certificates', webLink: '' },
    { publicInfoDetailsId: 2, description: 'CA CRLs', webLink: '' },
    { publicInfoDetailsId: 3, description: 'Repository', webLink: '' },
    { publicInfoDetailsId: 4, description: 'CA help desk', webLink: '' },
    { publicInfoDetailsId: 5, description: 'DSC price List', webLink: '' },
    { publicInfoDetailsId: 6, description: 'Interface for DSC applicants to apply for DSC', webLink: '' },
    { publicInfoDetailsId: 7, description: 'CA Licensing Details', webLink: '' },
    { publicInfoDetailsId: 8, description: 'CA current CPS & earlier versions', webLink: '' },
  ]);

  // Validation Patterns
  const WEBLINK_PATTERN = /^[A-Za-z0-9().,:&\-\s]+$/;

  // Validate fields (only for webLink)
  const validateWebLink = (value) => {
    if (!value.trim()) {
      return 'Weblink cannot be empty.';
    }
    if (value.length < 3 || value.length > 500) {
      return 'Weblink must be between 3 and 500 characters.';
    }
    if (!WEBLINK_PATTERN.test(value)) {
      return 'Only alphabets, numbers, and characters ().,:&- are allowed.';
    }
    return ''; // ✅ No error
  };

  // Handle input change with validation (only validate webLink)
  const handleChange = (id, field, value) => {
    setCaData((prevData) =>
      prevData.map((row) =>
        row.publicInfoDetailsId === id ? { ...row, [field]: value } : row
      )
    );

    // Validate webLink and update error state
    if (field === 'webLink') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: { ...prevErrors[id], webLink: validateWebLink(value) },
      }));
    }
  };

  // Handle form submission
  const handleSubmit =async () => {
    let hasError = false;
    let newErrors = {};

    // Validate each row and store errors (only webLink)
    caData.forEach((row) => {
      const webLinkError = validateWebLink(row.webLink);
      if (webLinkError) {
        hasError = true;
        newErrors[row.publicInfoDetailsId] = { webLink: webLinkError };
      }
    });

    setErrors(newErrors); // ✅ Update error state

    if (hasError) {
      console.log("Validation errors exist. Submission halted.", newErrors);
      return;
    }

    if (caData.length === 0) {
      showAlert({
        messageTitle: 'Error',
        messageContent: 'No data available to submit.',
        confirmText: 'Ok',
      });
      return;
    }
    try {
      setLoading(true);

      // Send data to backend
      const response = await AnnexureService.addPublicInfoDetails(caData);

      showAlert({
        messageTitle: 'Success',
        messageContent: response.data || 'Data submitted successfully!',
        confirmText: 'Ok',
      });

      //getAnnualAuditPeriodDetails();
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
  };

  return (
    <Box>
      {/* Header Section */}
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          13. Public Information maintained at the website of CA
        </Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton onClick={() => setOpen(!open)} sx={{ color: 'primary.main' }}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Collapsible Table */}
      <Collapse in={open}>
        <Box mt={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'tablecolor.main', color: 'tablecolor.text' }}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>S. No.</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Website Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {caData.map((row) => (
                  <TableRow key={row.publicInfoDetailsId}>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.publicInfoDetailsId}</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.description}</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                      <TextField
                        fullWidth
                        value={row.webLink}
                        onChange={(e) => handleChange(row.publicInfoDetailsId, 'webLink', e.target.value)}
                        error={Boolean(errors[row.publicInfoDetailsId]?.webLink)}
                        helperText={errors[row.publicInfoDetailsId]?.webLink}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Submit Button */}
          <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
              ADD
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default PublicInformationWebsite;
