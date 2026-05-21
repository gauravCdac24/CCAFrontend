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
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';

const createDefaultAspRows = (aspDetailsId = null) => [
  {
    id: 1,
    description: 'No of ASPs',
    aspCountFile: null,
    aspCountFileName: '',
    aspDetailsId,
  },
  {
    id: 2,
    description: 'No of ASPs whose audit exceed more than One year',
    aspsAuditOverdueCountFile: null,
    aspsAuditOverdueCountFileName: '',
    aspDetailsId,
  },
];

const ASPDetails = () => {
  const [aspData, setAspData] = useState(createDefaultAspRows());
  const [open, setOpen] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);

  const loadASPDetails = async () => {
    setLoading(true);
    try {
      const response = await AnnexureService.getASPDetails();
      const apiData = response?.data;

      if (apiData && !Array.isArray(apiData) && typeof apiData === 'object') {
        const aspDetailsId = apiData.aspDetailsId ?? null;
        setAspData([
          {
            id: 1,
            description: 'No of ASPs',
            aspCountFile: null,
            aspCountFileName: apiData.aspCount ?? '',
            aspDetailsId,
          },
          {
            id: 2,
            description: 'No of ASPs whose audit exceed more than One year',
            aspsAuditOverdueCountFile: null,
            aspsAuditOverdueCountFileName: apiData.aspsAuditOverdueCount ?? '',
            aspDetailsId,
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching ASP details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadASPDetails();
  }, []);

  const handleFileChange = (id, field, file) => {
    const updatedErrors = { ...errors };
    let error = '';

    if (!file) {
      const row = aspData.find((r) => r.id === id);
      const hasExisting =
        field === 'aspCountFile'
          ? row?.aspCountFileName
          : row?.aspsAuditOverdueCountFileName;
      if (!hasExisting) {
        error = 'Please upload a file.';
      }
    } else if (file.size > 5 * 1024 * 1024) {
      error = 'File size exceeds 5MB.';
    } else if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
      error = 'Only .xls or .xlsx files are allowed.';
    }

    updatedErrors[id] = { ...updatedErrors[id], [field]: error };
    setErrors(updatedErrors);

    setAspData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, [field]: file || null } : row
      )
    );
  };

  const handleSubmit = async () => {
    const row1 = aspData.find((r) => r.id === 1);
    const row2 = aspData.find((r) => r.id === 2);
    const submitErrors = {};

    if (!row1?.aspCountFile && !row1?.aspCountFileName) {
      submitErrors[1] = { aspCountFile: 'Please upload a file.' };
    }
    if (!row2?.aspsAuditOverdueCountFile && !row2?.aspsAuditOverdueCountFileName) {
      submitErrors[2] = { aspsAuditOverdueCountFile: 'Please upload a file.' };
    }

    if (Object.keys(submitErrors).length > 0) {
      setErrors(submitErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await AnnexureService.addASPDetails(aspData);
      const hasExisting = Boolean(row1?.aspDetailsId);

      showAlert({
        messageTitle: hasExisting ? 'Update ASP Details' : 'Add ASP Details',
        messageContent: response.data,
        confirmText: 'Ok',
      });

      loadASPDetails();
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

  const hasExistingData = aspData.some((row) => row.aspDetailsId);

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          12. Details of ASP
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
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>
                  S. No.
                </TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>
                  Description
                </TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>
                  Details
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aspData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.id}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.description}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <input
                      type="file"
                      accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      onChange={(e) =>
                        handleFileChange(
                          row.id,
                          row.id === 1 ? 'aspCountFile' : 'aspsAuditOverdueCountFile',
                          e.target.files[0]
                        )
                      }
                    />
                    {row.id === 1 && row.aspCountFileName && !row.aspCountFile && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Uploaded: {row.aspCountFileName}
                      </Typography>
                    )}
                    {row.id === 2 && row.aspsAuditOverdueCountFileName && !row.aspsAuditOverdueCountFile && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Uploaded: {row.aspsAuditOverdueCountFileName}
                      </Typography>
                    )}
                    {errors[row.id]?.aspCountFile && (
                      <Typography color="error">{errors[row.id].aspCountFile}</Typography>
                    )}
                    {errors[row.id]?.aspsAuditOverdueCountFile && (
                      <Typography color="error">{errors[row.id].aspsAuditOverdueCountFile}</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="right" mt={3}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
            {hasExistingData ? 'UPDATE' : 'ADD'}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ASPDetails;
