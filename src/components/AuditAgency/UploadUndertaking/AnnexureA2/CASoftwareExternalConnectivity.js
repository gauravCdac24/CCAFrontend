import React, { useState, useEffect } from 'react';
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
import LoaderProgress from '../../../global/common/LoaderProgress';
import ValidatePattern from '../../../global/util/ValidatePattern';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';

const DEFAULT_CONNECTIVITY_ROWS = [
  {
    serialNo: 1,
    connectivityDetailsId: null,
    name: 'Type of each type of external connectivity allowed and details such as access location person etc. Also reference to the coverage under the audit, risk assessment etc',
    description: '',
  },
  {
    serialNo: 2,
    connectivityDetailsId: null,
    name: 'Frequency of backup synchronization with DR Site',
    description: '',
  },
  {
    serialNo: 3,
    connectivityDetailsId: null,
    name: 'Data loss occurred during the audit period?',
    description: '',
  },
  {
    serialNo: 4,
    connectivityDetailsId: null,
    name: 'If data loss occurred, how it was addressed?',
    description: '',
  },
];

const CASoftwareExternalConnectivity = () => {
  const { id } = useParams();
  const applicantUserName = id ? decrypt(decodeURIComponent(id)) : '';

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [caData, setCaData] = useState(DEFAULT_CONNECTIVITY_ROWS);

  const [annexure, setAnnexure] = useState({
    userName: applicantUserName,
    apiNum: '16',
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

  const getCASoftwareDetailsDetails = async () => {
    if (!applicantUserName) {
      return;
    }
    setLoading(true);
    try {
      const response = await AnnexureService.getAuditorVerification(annexure);
      const data = response?.data?.connectivityDetails || [];

      if (Array.isArray(data) && data.length > 0) {
        const byName = data.reduce((acc, item) => {
          if (item?.name) {
            acc[item.name.trim().toLowerCase()] = item;
          }
          return acc;
        }, {});

        setCaData(
          DEFAULT_CONNECTIVITY_ROWS.map((row) => {
            const saved = byName[row.name.trim().toLowerCase()];
            return {
              ...row,
              connectivityDetailsId: saved?.connectivityDetailsId ?? null,
              description: saved?.description ?? '',
            };
          })
        );
      }

      setAnnexure((prevState) => ({
        ...prevState,
        auditorVerification: response?.data?.auditorVerification ?? '',
      }));
    } catch (err) {
      console.error('Error fetching connectivity details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicantUserName) {
      getCASoftwareDetailsDetails();
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

    setLoading(true);
    try {
      const response = await AnnexureService.addAuditorVerification(annexure);
      showAlert({
        messageTitle: 'Remarks Saved',
        messageContent: response.data,
        confirmText: 'Ok',
      });
      getCASoftwareDetailsDetails();
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

  return (
    <>
      <LoaderProgress open={isLoading} />
      <Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
            16. CA Software and external connectivity
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
                  {caData.map((row) => (
                    <TableRow key={row.serialNo}>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.serialNo}</TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.name}</TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField
                          disabled
                          fullWidth
                          value={row.description}
                          variant="outlined"
                          placeholder="Enter details"
                          sx={{ minWidth: { lg: '300px' } }}
                          onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.?\-& ]+$/)}
                          slotProps={{ htmlInput: { maxLength: 250 } }}
                        />
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
    </>
  );
};

export default CASoftwareExternalConnectivity;
