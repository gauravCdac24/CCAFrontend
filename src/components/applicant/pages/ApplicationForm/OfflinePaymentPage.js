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

const TRANSACTION_TYPES = {
  DEMAND_DRAFT: 'Demand Draft',
  BANKERS_CHEQUE: "Banker's check",
  UTR: 'UTR',
};

const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.DEMAND_DRAFT]: {
    sectionTitle: 'DD Details',
    numberLabel: 'Draft No.',
    numberError: 'Valid Draft No. is required',
    numberPattern: /^[0-9]+$/,
    keyDownPattern: /^[0-9]+$/,
    maxLength: 10,
  },
  [TRANSACTION_TYPES.BANKERS_CHEQUE]: {
    sectionTitle: 'Cheque Details',
    numberLabel: 'Cheque No',
    numberError: 'Valid Cheque No is required',
    numberPattern: /^[0-9]+$/,
    keyDownPattern: /^[0-9]+$/,
    maxLength: 10,
  },
  [TRANSACTION_TYPES.UTR]: {
    sectionTitle: 'Payment Details',
    numberLabel: 'UTR No',
    numberError: 'Valid UTR No is required',
    numberPattern: /^[A-Za-z0-9]+$/,
    keyDownPattern: /^[A-Za-z0-9]+$/,
    maxLength: 30,
  },
};

const OfflinePaymentPage = forwardRef(({ cid, submitPayment, redirectPath = '/applicant/applicationform' }, ref) => {
  const [paymentMode, setPaymentMode] = useState('');
  const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({
    bankDraft: {
      transactionType: '',
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
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'Kotak Mahindra Bank',
    'Bank of India',
    'IndusInd Bank',
    'Central Bank of India',
    'Indian Bank',
    'Indian Overseas Bank',
    'Bank of Maharashtra',
  ];

  const isFieldEnabled = () => paymentMode === 'offline';
  const transactionType = basicDetailsFormValues.bankDraft.transactionType;
  const typeLabels = TRANSACTION_TYPE_LABELS[transactionType] || TRANSACTION_TYPE_LABELS[TRANSACTION_TYPES.DEMAND_DRAFT];
  const showPaymentFields = paymentMode === 'offline' && Boolean(transactionType);

  const handlePaymentChange = (event) => {
    const mode = event.target.value;
    setPaymentMode(mode);
    setBasicDetailsFormValues((prev) => ({
      ...prev,
      bankDraft: {
        ...prev.bankDraft,
        transactionType: mode === 'offline' ? prev.bankDraft.transactionType : '',
      },
    }));
    setFormErrors({ bankDraft: {} });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    setBasicDetailsFormValues((prev) => ({
      ...prev,
      [keys[0]]: {
        ...prev[keys[0]],
        [keys[1]]: value,
        ...(keys[1] === 'transactionType' ? { draftNo: '' } : {}),
      },
    }));
    if (keys[1] === 'transactionType') {
      setFormErrors((prev) => ({
        ...prev,
        bankDraft: { ...prev.bankDraft, draftNo: undefined, transactionType: undefined },
      }));
    }
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
    if (e.key.length === 1 && !pattern.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateFields = () => {
    const errors = {
      bankDraft: {},
    };
    let isValid = true;
    const { transactionType: txnType, bankName, draftNo, amount, issueDate } = basicDetailsFormValues.bankDraft;
    const labels = TRANSACTION_TYPE_LABELS[txnType];

    if (paymentMode !== 'offline') {
      errors.bankDraft.paymentMode = 'Please select Offline payment mode';
      setFormErrors(errors);
      return false;
    }

    if (!txnType) {
      errors.bankDraft.transactionType = 'Transaction Type is required';
      isValid = false;
    }

    if (!bankName) {
      errors.bankDraft.bankName = 'Bank Name is required';
      isValid = false;
    }

    if (!draftNo || !labels || !labels.numberPattern.test(draftNo)) {
      errors.bankDraft.draftNo = labels?.numberError || 'Valid number is required';
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
    handleReset,
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
      messageContent:
        'Once you submit the offline payment details, you cannot be edited. Please ensure all information is correct before proceeding. Do you want to continue?',
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
      const payload = {
        bankDraft: {
          ...basicDetailsFormValues.bankDraft,
          issueDate: basicDetailsFormValues.bankDraft.issueDate
            ? dayjs(basicDetailsFormValues.bankDraft.issueDate).format('YYYY-MM-DD')
            : null,
        },
      };
      const paymentApi = submitPayment || ApplicationForm.getApplicationPayment;
      const response = await paymentApi(payload);

      showAlert({
        messageTitle: 'Payment Done',
        messageContent: response.data,
        confirmText: 'Ok',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
        onConfirm: () => {
          handleRefresh();
        },
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
        disableOutsideKeyDown: true,
      });
    }
  };

  const handleReset = () => {
    setPaymentMode('');
    setBasicDetailsFormValues({
      bankDraft: {
        transactionType: '',
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
    const path = String(redirectPath || '/')
      .trim()
      .replace(/^[a-z][a-z\d+\-.]*:\/\/[^/]*/i, '')
      .replace(/^\/+/, '/');
    const safePath = path.startsWith('/') ? path : `/${path}`;
    window.location.assign(`${window.location.origin}${safePath}`);
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputLabel shrink={false}>
                Transaction Type<span className="req-asterisk">*</span>
              </InputLabel>
              <FormControl
                fullWidth
                margin="dense"
                size="small"
                error={Boolean(formErrors.bankDraft?.transactionType)}
              >
                <Select
                  name="bankDraft.transactionType"
                  value={basicDetailsFormValues.bankDraft.transactionType}
                  onChange={handleChange}
                  displayEmpty
                  disabled={!isFieldEnabled()}
                  MenuProps={{
                    disablePortal: true,
                    PaperProps: {
                      sx: {
                        zIndex: 110015,
                      },
                    },
                  }}
                >
                  <MenuItem disabled value="">
                    Transaction Type
                  </MenuItem>
                  <MenuItem value={TRANSACTION_TYPES.DEMAND_DRAFT}>{TRANSACTION_TYPES.DEMAND_DRAFT}</MenuItem>
                  <MenuItem value={TRANSACTION_TYPES.BANKERS_CHEQUE}>{TRANSACTION_TYPES.BANKERS_CHEQUE}</MenuItem>
                  <MenuItem value={TRANSACTION_TYPES.UTR}>{TRANSACTION_TYPES.UTR}</MenuItem>
                </Select>
                {formErrors.bankDraft?.transactionType && (
                  <FormHelperText>{formErrors.bankDraft.transactionType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {showPaymentFields && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>
                {typeLabels.sectionTitle}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm>
                  <InputLabel shrink={false}>
                    Bank Name<span className="req-asterisk">*</span>
                  </InputLabel>
                  <FormControl
                    fullWidth
                    margin="dense"
                    size="small"
                    error={Boolean(formErrors.bankDraft?.bankName)}
                  >
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
                            zIndex: 110015,
                          },
                        },
                      }}
                    >
                      <MenuItem disabled value="">
                        Bank Name
                      </MenuItem>
                      {bankNames.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.bankDraft?.bankName && (
                      <FormHelperText>{formErrors.bankDraft.bankName}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm>
                  <InputLabel shrink={false}>
                    {typeLabels.numberLabel}
                    <span className="req-asterisk">*</span>
                  </InputLabel>
                  <TextField
                    name="bankDraft.draftNo"
                    value={basicDetailsFormValues.bankDraft.draftNo}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    size="small"
                    disabled={!isFieldEnabled()}
                    onKeyDown={(e) => validatePattern(e, typeLabels.keyDownPattern)}
                    inputProps={{ maxLength: typeLabels.maxLength }}
                    error={Boolean(formErrors.bankDraft?.draftNo)}
                    helperText={formErrors.bankDraft?.draftNo}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm>
                  <InputLabel shrink={false}>
                    Amount<span className="req-asterisk">*</span>
                  </InputLabel>
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
                  <InputLabel shrink={false}>
                    Issue Date<span className="req-asterisk">*</span>
                  </InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disableFuture
                      maxDate={dayjs()}
                      name="bankDraft.issueDate"
                      value={
                        basicDetailsFormValues.bankDraft.issueDate
                          ? dayjs(basicDetailsFormValues.bankDraft.issueDate)
                          : null
                      }
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
      )}
    </Box>
  );
});

export default OfflinePaymentPage;
