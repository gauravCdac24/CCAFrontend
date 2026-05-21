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
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../service/AnnexureA2Service/AnnexureService';
import stringToDateFormat from '../../../global/util/DateUtil';
import ValidatePattern from '../../../global/util/ValidatePattern';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const buildDefaultEkycRows = () =>
  MONTHS.map((monthName, index) => ({
    serialNo: index + 1,
    eKYCAcMonthId: null,
    month: monthName,
    fromDate: '',
    toDate: '',
    observations: '',
    auditorDetails: '',
  }));

const EKYCAuditDetails = () => {
  const { id } = useParams();
  const applicantUserName = id ? decrypt(decodeURIComponent(id)) : '';

  const [auditData, setAuditData] = useState(buildDefaultEkycRows());
  const [open, setOpen] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [annexure, setAnnexure] = useState({
    userName: applicantUserName,
    apiNum: '3',
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

  const getEKYCAcMonthDetails = async () => {
    if (!applicantUserName) {
      return;
    }
    setLoading(true);
    try {
      const response = await AnnexureService.getAuditorVerification(annexure);
      const data = response?.data?.details || [];

      if (Array.isArray(data) && data.length > 0) {
        const byMonth = data.reduce((acc, item) => {
          if (!item?.month) {
            return acc;
          }
          const existing = acc[item.month];
          if (!existing || (item.eKYCAcMonthId > existing.eKYCAcMonthId)) {
            acc[item.month] = item;
          }
          return acc;
        }, {});

        setAuditData(
          MONTHS.map((monthName, index) => {
            const obj = byMonth[monthName];
            return {
              serialNo: index + 1,
              eKYCAcMonthId: obj?.eKYCAcMonthId ?? null,
              month: monthName,
              fromDate: obj?.fromDate ? stringToDateFormat(obj.fromDate, 'yyyy-MM-dd') : '',
              toDate: obj?.toDate ? stringToDateFormat(obj.toDate, 'yyyy-MM-dd') : '',
              observations: obj?.observations ?? '',
              auditorDetails: obj?.auditorDetails ?? '',
            };
          })
        );
      }

      setAnnexure((prevState) => ({
        ...prevState,
        auditorVerification: response?.data?.auditorVerification ?? '',
      }));
    } catch (err) {
      console.error('Error fetching EKYC details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicantUserName) {
      getEKYCAcMonthDetails();
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
      getEKYCAcMonthDetails();
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
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          3. eKYC Account Audit Details of last one year - Month-wise
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
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Month</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>From</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>To</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Summary of Observations</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Details of Auditors</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditData.map((row, index) => (
                <TableRow key={row.serialNo}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.serialNo}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.month}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      type="date"
                      value={row.fromDate}
                      fullWidth
                      error={!!formErrors[index]?.fromDate}
                      helperText={formErrors[index]?.fromDate || ''}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      type="date"
                      value={row.toDate}
                      fullWidth
                      error={!!formErrors[index]?.toDate}
                      helperText={formErrors[index]?.toDate || ''}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      multiline
                      rows={2}
                      value={row.observations}
                      fullWidth
                      onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.\-& ]+$/)}
                      slotProps={{ htmlInput: { maxLength: 500 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      disabled
                      multiline
                      rows={2}
                      value={row.auditorDetails}
                      fullWidth
                      onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.\-& ]+$/)}
                      slotProps={{ htmlInput: { maxLength: 64 } }}
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
      </Collapse>
    </Box>
  );
};

export default EKYCAuditDetails;
