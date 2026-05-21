import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import showAlert from '../../../global/common/MessageBox/AlertService';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import { useSelector } from 'react-redux';

const OfflinePaymentPage = forwardRef(({ cid }, ref) => {
  

  const [paymentMode, setPaymentMode] = useState('');
  const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({
    bankDraft: {
      bankName: '',
      draftNo: '',
      amount: '25000',
      issueDate: null,
      intentId: cid,
    },
  });

  const [formErrors, setFormErrors] = useState({
    bankDraft: {},
  });

  const bankNames = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Kotak Mahindra Bank",
    "Bank of India",
    "IndusInd Bank",
    "Central Bank of India",
    "Indian Bank",
    "Indian Overseas Bank",
    "Bank of Maharashtra"
  ];

  const isFieldEnabled = () => paymentMode === 'offline';

  const handlePaymentChange = (event) => {
    setPaymentMode(event.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    setBasicDetailsFormValues((prev) => ({
      ...prev,
      [keys[0]]: {
        ...prev[keys[0]],
        [keys[1]]: value,
      },
    }));
  };

  const handleDateChange = (key, value) => {
    setBasicDetailsFormValues((prev) => ({
      ...prev,
      bankDraft: {
        ...prev.bankDraft,
        [key]: value,
      },
    }));
  };

  const validatePattern = (e, pattern) => {
    if (!pattern.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateFields = () => {
    const errors = {
      bankDraft: {},
    };
    let isValid = true;
    const { bankName, draftNo, amount, issueDate } = basicDetailsFormValues.bankDraft;

    if (!bankName) {
      errors.bankDraft.bankName = 'Bank Name is required';
      isValid = false;
    }

    if (!draftNo || !/^\d+$/.test(draftNo)) {
      errors.bankDraft.draftNo = 'Valid Draft No. is required';
      isValid = false;
    }

    if (!amount || !/^\d+$/.test(amount)) {
      errors.bankDraft.amount = 'Valid Amount is required';
      isValid = false;
    }

    if (!issueDate) {
      errors.bankDraft.issueDate = 'Issue Date is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
    handleReset
  }));

  const handleSubmit = () => {
    if (!validateFields()) {
      showAlert({
        messageTitle: 'Validation Error',
        messageContent: 'Please fill all the required fields correctly.',
        confirmText: 'OK',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
      return;
    }

    showAlert({
        messageTitle: 'Confirm Offline Payment Submission',
        messageContent: "Once you submit the offline payment details, you cannot be edited. Please ensure all information is correct before proceeding. Do you want to continue?",
      confirmText: 'Yes',
      closeText: 'Cancel',
      maxWidth: 'sm',
      fullWidth: true,
      onConfirm: () => continues(),
      enableHeaderCloseBtn: true,
      disableOutsideKeyDown: true,
      closeParent: false,
    });
  };

  const continues = async () => {
    try {
      const response = await ApplicationForm.getApplicationPayment(basicDetailsFormValues);

      showAlert({
        messageTitle: 'Payment Done',
        messageContent: response.data,
        confirmText: 'Ok',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
        onConfirm: () => {handleRefresh();}
      });

    } catch (err) {
      showAlert({
        messageTitle: 'Error',
        messageContent: err.response?.data
          ? typeof err.response.data === 'object'
            ? 'Your request cannot be processed at this time. Please try again later.'
            : err.response.data
          : 'Your request cannot be processed at this time. Please try again later.',
        confirmText: 'Ok',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true
      });
    }
  };

  const handleReset = () => {
    setBasicDetailsFormValues({
      bankDraft: {
        bankName: '',
        draftNo: '',
        amount: '25000',
        issueDate: null,
        intentId: cid,
      },
    });
    setFormErrors({
      bankDraft: {},
    });
  };

   const handleRefresh = () => {
      window.location.href='/applicant/applicationform';
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Please Select Payment Mode
      </Typography>

      <FormControl component="fieldset">
        <RadioGroup row value={paymentMode} onChange={handlePaymentChange}>
          <FormControlLabel value="online" control={<Radio />} label={<Typography>Online</Typography>} disabled />
          <FormControlLabel value="offline" control={<Radio />} label={<Typography>Offline</Typography>} />
        </RadioGroup>
      </FormControl>

      {paymentMode === 'offline' && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>DD Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm>
              <InputLabel shrink={false}>Bank Name*</InputLabel>
              <FormControl fullWidth margin="dense" size="small" error={Boolean(formErrors.bankDraft?.bankName)}>
                <Select
                  name="bankDraft.bankName"
                  value={basicDetailsFormValues.bankDraft.bankName}
                  onChange={handleChange}
                  displayEmpty
                  disabled={!isFieldEnabled()}
                   MenuProps={{
                            disablePortal: true,
                            PaperProps: {
                            sx: {
                                zIndex: 110015, // Set high zIndex here
                            },
                            },
                        }}
                >
                  <MenuItem disabled value="">Bank Name</MenuItem>
                  {bankNames.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
                </Select>
                {formErrors.bankDraft?.bankName && <FormHelperText>{formErrors.bankDraft.bankName}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm>
              <InputLabel shrink={false}>Draft No.*</InputLabel>
              <TextField
                name="bankDraft.draftNo"
                value={basicDetailsFormValues.bankDraft.draftNo}
                onChange={handleChange}
                fullWidth
                margin="dense"
                variant="outlined"
                size="small"
                disabled={!isFieldEnabled()}
                onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                inputProps={{ maxLength: 10 }}
                error={Boolean(formErrors.bankDraft?.draftNo)}
                helperText={formErrors.bankDraft?.draftNo}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm>
              <InputLabel shrink={false}>Amount*</InputLabel>
              <TextField
                name="bankDraft.amount"
                value={basicDetailsFormValues.bankDraft.amount}
                onChange={handleChange}
                fullWidth
                margin="dense"
                variant="outlined"
                size="small"
                inputProps={{ readOnly: true }}
                disabled
                error={Boolean(formErrors.bankDraft?.amount)}
                helperText={formErrors.bankDraft?.amount}
              />
            </Grid>

            <Grid item xs={12} sm>
              <InputLabel shrink={false}>Issue Date*</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disableFuture
                  maxDate={dayjs()}
                  name="bankDraft.issueDate"
                  value={basicDetailsFormValues.bankDraft.issueDate ? dayjs(basicDetailsFormValues.bankDraft.issueDate) : null}
                  onChange={(date) => handleDateChange('issueDate', date)}
                  disabled={!isFieldEnabled()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      margin: 'dense',
                      error: Boolean(formErrors.bankDraft?.issueDate),
                      helperText: formErrors.bankDraft?.issueDate || '',
                    },
                    popper: { style: { zIndex: 110015 } },
                  }}
                  sx={{ mt: 1 }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
});

export default OfflinePaymentPage;
