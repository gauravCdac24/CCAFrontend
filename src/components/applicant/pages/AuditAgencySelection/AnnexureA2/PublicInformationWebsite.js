import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Collapse,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';

const DEFAULT_PUBLIC_INFO_ROWS = [
  { serialNo: 1, description: 'CA certificates', webLink: '', dbPublicInfoDetailsId: null },
  { serialNo: 2, description: 'CA CRLs', webLink: '', dbPublicInfoDetailsId: null },
  { serialNo: 3, description: 'Repository', webLink: '', dbPublicInfoDetailsId: null },
  { serialNo: 4, description: 'CA help desk', webLink: '', dbPublicInfoDetailsId: null },
  { serialNo: 5, description: 'DSC price List', webLink: '', dbPublicInfoDetailsId: null },
  { serialNo: 6, description: 'Interface for DSC applicants to apply for DSC', webLink: '', dbPublicInfoDetailsId: null },
  { serialNo: 7, description: 'CA Licensing Details', webLink: '', dbPublicInfoDetailsId: null },
  { serialNo: 8, description: 'CA current CPS & earlier versions', webLink: '', dbPublicInfoDetailsId: null },
];

const PublicInformationWebsite = () => {
  const [open, setOpen] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [caData, setCaData] = useState(DEFAULT_PUBLIC_INFO_ROWS);

  const WEBLINK_PATTERN = /^[A-Za-z0-9().,:&\-\s]+$/;

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
    return '';
  };

  const loadPublicInfoDetails = async () => {
    setLoading(true);
    try {
      const response = await AnnexureService.getPublicInfoDetails();
      const list = Array.isArray(response?.data) ? response.data : [];

      if (list.length > 0) {
        const byDescription = list.reduce((acc, item) => {
          if (item?.description) {
            acc[item.description.trim().toLowerCase()] = item;
          }
          return acc;
        }, {});

        setCaData(
          DEFAULT_PUBLIC_INFO_ROWS.map((row) => {
            const saved = byDescription[row.description.trim().toLowerCase()];
            return {
              ...row,
              dbPublicInfoDetailsId: saved?.publicInfoDetailsId ?? null,
              webLink: saved?.webLink ?? '',
            };
          })
        );
      }
    } catch (err) {
      console.error('Error fetching public info details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicInfoDetails();
  }, []);

  const handleChange = (serialNo, field, value) => {
    setCaData((prevData) =>
      prevData.map((row) =>
        row.serialNo === serialNo ? { ...row, [field]: value } : row
      )
    );

    if (field === 'webLink') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [serialNo]: { ...prevErrors[serialNo], webLink: validateWebLink(value) },
      }));
    }
  };

  const handleSubmit = async () => {
    let hasError = false;
    const newErrors = {};

    caData.forEach((row) => {
      const webLinkError = validateWebLink(row.webLink);
      if (webLinkError) {
        hasError = true;
        newErrors[row.serialNo] = { webLink: webLinkError };
      }
    });

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    try {
      setLoading(true);
      const response = await AnnexureService.addPublicInfoDetails(caData);
      const hasExisting = caData.some((row) => row.dbPublicInfoDetailsId);

      showAlert({
        messageTitle: hasExisting ? 'Update Public Information' : 'Add Public Information',
        messageContent:
          typeof response.data === 'string' ? response.data : 'Data submitted successfully!',
        confirmText: 'Ok',
      });

      loadPublicInfoDetails();
    } catch (err) {
      showAlert({
        messageTitle: 'Error',
        messageContent:
          typeof err.response?.data === 'string'
            ? err.response.data
            : 'Your request cannot be processed at this time. Please try again later.',
        confirmText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  };

  const hasExistingData = caData.some((row) => row.dbPublicInfoDetailsId);

  return (
    <Box>
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
                  <TableRow key={row.serialNo}>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.serialNo}</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.description}</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                      <TextField
                        fullWidth
                        value={row.webLink}
                        onChange={(e) => handleChange(row.serialNo, 'webLink', e.target.value)}
                        error={Boolean(errors[row.serialNo]?.webLink)}
                        helperText={errors[row.serialNo]?.webLink}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
              {hasExistingData ? 'UPDATE' : 'ADD'}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default PublicInformationWebsite;
