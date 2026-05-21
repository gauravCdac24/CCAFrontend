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
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../service/AnnexureA2Service/AnnexureService';
import ValidatePattern from '../../../global/util/ValidatePattern';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';

const DEFAULT_PUBLIC_INFO_ROWS = [
  { serialNo: 1, description: 'CA certificates', webLink: '' },
  { serialNo: 2, description: 'CA CRLs', webLink: '' },
  { serialNo: 3, description: 'Repository', webLink: '' },
  { serialNo: 4, description: 'CA help desk', webLink: '' },
  { serialNo: 5, description: 'DSC price List', webLink: '' },
  { serialNo: 6, description: 'Interface for DSC applicants to apply for DSC', webLink: '' },
  { serialNo: 7, description: 'CA Licensing Details', webLink: '' },
  { serialNo: 8, description: 'CA current CPS & earlier versions', webLink: '' },
];

const PublicInformationWebsite = () => {
  const { id } = useParams();
  const applicantUserName = id ? decrypt(decodeURIComponent(id)) : '';

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [caData, setCaData] = useState(DEFAULT_PUBLIC_INFO_ROWS);

  const [annexure, setAnnexure] = useState({
    userName: applicantUserName,
    apiNum: '13',
    auditorVerification: '',
  });

  useEffect(() => {
    setAnnexure((prevState) => ({
      ...prevState,
      userName: applicantUserName,
    }));
  }, [applicantUserName]);

  const handleChanges = (e, field) => {
    setAnnexure((prevState) => ({
      ...prevState,
      auditorVerification: field === 'remarks' ? e.target.value : prevState.auditorVerification,
    }));
  };

  const getPublicInfoDetails = async () => {
    if (!applicantUserName) {
      return;
    }
    setLoading(true);
    try {
      const response = await AnnexureService.getAuditorVerification(annexure);
      const fetchedData = response?.data?.publicInfoDetails;

      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        const byDescription = fetchedData.reduce((acc, item) => {
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
              webLink: saved?.webLink ?? '',
            };
          })
        );
      }

      setAnnexure((prevState) => ({
        ...prevState,
        auditorVerification: response?.data?.auditorVerification ?? '',
      }));
    } catch (err) {
      console.error('Error fetching public info details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicantUserName) {
      getPublicInfoDetails();
    }
  }, [applicantUserName]);

  const handleSubmit = async () => {
    if (!annexure.auditorVerification?.trim()) {
      showAlert({
        messageTitle: 'Validation Error',
        messageContent: 'Please enter auditor remarks before saving.',
        confirmText: 'Ok',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await AnnexureService.addAuditorVerification(annexure);
      showAlert({
        messageTitle: 'Remarks Saved',
        messageContent: typeof response.data === 'string' ? response.data : 'Remarks saved successfully.',
        confirmText: 'Ok',
      });
      getPublicInfoDetails();
    } catch (err) {
      showAlert({
        messageTitle: 'Error',
        messageContent:
          typeof err.response?.data === 'string'
            ? err.response.data
            : 'Your request cannot be processed at this time.',
        confirmText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  };

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
                      <TextField disabled fullWidth value={row.webLink} />
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
                  onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.\-& ]+$/)}
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                  InputProps={{ style: { padding: '10px' } }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
              SAVE REMARKS
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default PublicInformationWebsite;
