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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import stringToDateFormat from '../../../../global/util/DateUtil';
import ValidatePattern from '../../../../global/util/ValidatePattern';

const errorMsg = {

  summary: {
      blank: "Observation cannot be empty.",
      length: "The length must be between 3 and 500 characters.",
      format: "Only alphabet, numbers, characters ().,-& and spaces are allowed.",
      words: "Maximum 50 words are allowed."
  },

  fromDate: {
      blank: "Please select from date.",
      diff: "From Date must be less than to date."
  },

  toDate: {
      blank: "Please select to date.",
      diff: "To date must be greater than from date."
  },
  auditorDetails: {
      blank: "Details of auditor cannot be empty.",
      length: "The length must be between 3 and 64 characters.",
      format: "Only alphabet, numbers, characters ().,-& and spaces are allowed.",
  },
}

const EKYCAuditDetails = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [auditData, setAuditData] = useState(
    Array.from({ length: 12 }, (_, index) => ({
      serialNo: index + 1,
      eKYCAcMonthId: null,
      month: months[index],
      fromDate: '',
      toDate: '',
      observations: '',
      auditorDetails: '',
    }))
  );

   const [open, setOpen] = useState(true); 
      const [formErrors, setFormErrors] = useState({});
      const [isLoading, setLoading] = useState(false);

  const handleChange = (serialNo, field, value) => {
    setAuditData((prevData) =>
      prevData.map((row) =>
        row.serialNo === serialNo ? { ...row, [field]: value } : row
      )
    );
  };

  const countWords = (str) => {

    return str.trim().split(/\s+/).filter(Boolean).length;

}

const getEKYCAcMonthDetails = async () => {
  setLoading(true);
  try {
      const response = await AnnexureService.getEKYCAcMonthDetails();

      console.log('EKYC details:', response.data);
      

      if (Array.isArray(response?.data) && response.data.length > 0) {
          const byMonth = response.data.reduce((acc, item) => {
            if (!item?.month) {
              return acc;
            }
            const existing = acc[item.month];
            if (!existing || (item.eKYCAcMonthId > existing.eKYCAcMonthId)) {
              acc[item.month] = item;
            }
            return acc;
          }, {});

          const list = months.map((monthName, index) => {
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
          });
          setAuditData(list);
      }
      setLoading(false);
  } catch (err) {
      setLoading(false);
      console.error('Error fetching EKYC details:', err);
  }
};




useEffect(()=>{

  getEKYCAcMonthDetails();

}, [])

const validateForm = () => {

    const errors = [];

    auditData.map((item, index)=>{

        if (!errors[index]) {
            errors[index] = {};
        }

      
        if (!item.observations) {
            errors[index].observations = errorMsg.summary.blank;
        }else if (countWords(item.observations) > 50){
            errors[index].observations = errorMsg.summary.words;
        } 
        else if (item.observations.length < 3 || item.observations.length > 500) {
            errors[index].observations = errorMsg.summary.length;
        } else if (!/^[A-Za-z0-9\(\).,&\- ]+$/.test(item.observations)) {
            errors[index].observations = errorMsg.summary.format;
        }

        //From Date & To Date

         if (!item.fromDate) {
            errors[index].fromDate = errorMsg.fromDate.blank;
        }else if(item.fromDate >= item.toDate){
            errors[index].fromDate = errorMsg.fromDate.diff
            
        }
        
        if (!item.toDate) {
            errors[index].toDate = errorMsg.toDate.blank;
        }else if(item.fromDate >= item.toDate){
            
            errors[index].toDate = errorMsg.toDate.diff
        }

        //Auditor Details
        if (!item.auditorDetails) {
            errors[index].auditorDetails = errorMsg.auditorDetails.blank;
        }
        else if (item.auditorDetails.length < 3 || item.auditorDetails.length > 64) {
            errors[index].auditorDetails = errorMsg.auditorDetails.length;
        } else if (!/^[A-Za-z0-9\(\).,&\- ]+$/.test(item.auditorDetails)) {
            errors[index].auditorDetails = errorMsg.auditorDetails.format;
        }

       
    });

    let isError = false;
    for(let i=0; i<errors.length; i++){
        if(Object.keys(errors[i]).length !== 0){
            isError = true;
        }
    }
    if(!isError)
        return {};

   return errors;


}

const handleSubmit = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
        setFormErrors({});
        setLoading(true);
        try{

          
           
            const response = await AnnexureService.addEKYCAcMonthDetails(auditData);
            setLoading(false);

            const hasExisting = auditData.some((row) => row.eKYCAcMonthId);
            showAlert({
                messageTitle: hasExisting ? 'Update EKYC Account Month Details' : 'Add EKYC Account Month Details',
                messageContent: response.data,
                confirmText: 'Ok',
            })

            getEKYCAcMonthDetails();

        }catch(err){
            setLoading(false);

            

            showAlert({
                messageTitle: 'Error',
                messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
                confirmText: 'Ok',
            })
        }

            

    } else {
        setFormErrors(errors);
    }
};
  return (
    <Box>
      {/* Header with Collapse Toggle */}
      <Box display="flex" alignItems="center">
        <Typography variant="h6"sx={{color:"primary.main"}} gutterBottom>3. eKYC Account Audit Details of last one year - Month-wise</Typography>
         {/* Add gap between Typography and IconButton */}
    <Box sx={{ marginLeft: 'auto' }}>
        <IconButton
            onClick={() => setOpen(!open)}
           sx={{color:"primary.main"}}
        >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
    </Box>
      </Box>

      {/* Collapsible Section */}
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
              {auditData.map((row,index) => (
                <TableRow key={row.month}>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.serialNo}</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                  {row.month}
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      type="date"
                      value={row.fromDate}
                      onChange={(e) => handleChange(row.serialNo, 'fromDate', e.target.value)}
                      fullWidth
                      error={!!formErrors[index]?.fromDate}
                      helperText={formErrors[index]?.fromDate || ''}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      type="date"
                      value={row.toDate}
                      onChange={(e) => handleChange(row.serialNo, 'toDate', e.target.value)}
                      fullWidth
                      error={!!formErrors[index]?.toDate}
                      helperText={formErrors[index]?.toDate || ''}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      multiline
                      rows={2}
                      value={row.observations}
                      onChange={(e) => handleChange(row.serialNo, 'observations', e.target.value)}
                      fullWidth
                      error={!!formErrors[index]?.observations}
                      helperText={formErrors[index]?.observations || ''}
                      onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.\-& ]+$/)}
                      slotProps={{
                          htmlInput: { maxLength: 500 }, 
                        }}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                    <TextField
                      multiline
                      rows={2}
                      value={row.auditorDetails}
                      onChange={(e) => handleChange(row.serialNo, 'auditorDetails', e.target.value)}
                      fullWidth
                      error={!!formErrors[index]?.auditorDetails}
                      helperText={formErrors[index]?.auditorDetails || ''}
                      onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.\-& ]+$/)}
                      slotProps={{
                          htmlInput: { maxLength: 64 }, 
                        }}                              
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
                           <Button
                           variant="contained"
                           color="primary"
                           onClick={handleSubmit}
                       >
                           {auditData.some((row) => row.eKYCAcMonthId) ? 'UPDATE' : 'ADD'}
                       </Button>
                   </Box>
       
      </Collapse>
    </Box>
  );
};

export default EKYCAuditDetails;
