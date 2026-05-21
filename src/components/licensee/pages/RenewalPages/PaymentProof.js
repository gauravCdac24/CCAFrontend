import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { TextField, Button, Grid, Typography, InputLabel, Tooltip, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoaderProgress from "../../../global/common/LoaderProgress";
import FormWrapper from "../../../global/util/FormWrapper";
import showAlert from "../../../global/common/MessageBox/AlertService";
import ApplicationForm from "../../../../service/NewLicenseService/ApplicationForm";
import ValidatePattern from "../../../global/util/ValidatePattern";

const PaymentProof = forwardRef(({ intentAppId, refreshApplication }, ref) => {
  const [requiredDoc, setRequiredDoc] = useState({
    intentAppId: "",
    file: null,
    amount: "",
    selectedDate: "",
    transactionNumber: "",
  });

  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Reset input on invalid file
  const [isLoading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useImperativeHandle(ref, () => ({
    handleReset,
    handleFormSubmit,
  }));

  const handleReset = () => {
    setRequiredDoc({
      intentAppId: intentAppId,
      file: null,
      amount: "",
      selectedDate: "",
      transactionNumber: "",
    });
  
    setFileInputKey(Date.now()); // Reset file input field
    setFormErrors({});
  };

  useEffect(() => {
    if (intentAppId) {
      setRequiredDoc((prev) => ({ ...prev, intentAppId }));
    }
  }, [intentAppId]);


  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.type !== "application/pdf") {
        showAlert({
          messageTitle: "Error",
          messageContent: "Only PDF files are allowed.",
          confirmText: "Ok",
        });
        setFileInputKey(Date.now()); // Reset input
        return;
      }
      if (uploadedFile.size > 5 * 1024 * 1024) {
        showAlert({
          messageTitle: "Error",
          messageContent: "File size must be less than 5MB.",
          confirmText: "Ok",
        });
        setFileInputKey(Date.now()); // Reset input
        return;
      }
      setRequiredDoc((prev) => ({ ...prev, file: uploadedFile }));
    }
  };

  const handleDateChange = (date) => {
    setRequiredDoc((prev) => ({ ...prev, selectedDate: date ? date.toISOString() : "" }));
    setFormErrors((prev) => ({ ...prev, date: date ? "" : "Date is required" }));
  };

  const validateForm = () => {
    let errors = {};
  
    // File Validation
    if (!requiredDoc.file) errors.file = "File is required.";
  
    // Amount Validation (Only Numbers, Must be 6 Digits)
    if (!requiredDoc.amount) {
      errors.amount = "Amount is required.";
    } else if (requiredDoc.amount !== "25000") {
      errors.amount = "Amount must be exactly 25,000.";
  }
  
    // Transaction Number Validation (Max 30 chars, No Special Characters)
    if (!requiredDoc.transactionNumber) {
      errors.transactionNumber = "Transaction ID is required.";
    } else if (requiredDoc.transactionNumber.length > 30) {
      errors.transactionNumber = "Transaction ID must be 30 characters or less.";
    } else if (!/^[a-zA-Z0-9]+$/.test(requiredDoc.transactionNumber)) {
      errors.transactionNumber = "Transaction ID must contain only letters and numbers.";
    }
  
    // Date Validation
    if (!requiredDoc.selectedDate) errors.date = "Date is required.";
  
    setFormErrors(errors);
    return errors;
  };
  

  const handleConfirmSubmit = () => {
    setLoading(true);
console.log(requiredDoc)

    ApplicationForm.getPaymentProofApplicationForm(requiredDoc)
      .then((response) => {
        showAlert({
          messageTitle: "Document Upload",
          messageContent: response.data,
          confirmText: "Ok",
          enableHeaderCloseBtn: false,
          disableOutsideKeyDown: true,
          closeParent: true,
        });
        refreshApplication();
      })
      .catch((err) => {
        showAlert({
          messageTitle: "Error",
          messageContent:
            err.response.data && typeof err.response.data === "object"
              ? "Your request cannot be processed at this time. Please try again later."
              : err.response.data || "Your request cannot be processed at this time. Please try again later.",
          confirmText: "Ok",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFormSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      showAlert({
        messageTitle: "Confirm",
        messageContent:
          "Are you sure you want to submit? You cannot re-upload the documents again. Please verify before uploading.",
        confirmText: "Yes",
        closeText: "No",
        fullWidth: true,
        maxWidth: "sm",
        onConfirm: ()=>handleConfirmSubmit(),
      });
    }
  };

  return (
    <>
      <LoaderProgress open={isLoading} />
      <FormWrapper headingText="Fill Payment Proof Details">
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
          <Grid container spacing={2} sx={{ maxWidth: 600, margin: "auto", p: 3 }}>
            {/* File Upload */}
            <Grid item xs={12}>
              <InputLabel shrink={false} htmlFor="netWorthDoc">
                <Typography variant="body1">Upload Payment Proof Document (Only PDF, Max 5MB)*</Typography>
              </InputLabel>
              <Grid container direction="row" sx={{ border: "1px solid #cfcfcf", borderRadius: "5px" }}>
                <Grid item>
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload file
                    <input key={fileInputKey} type="file" name="file" hidden onChange={handleFileChange} />
                  </Button>
                </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {requiredDoc.file && (
                    <Tooltip title={requiredDoc.file.name} placement="top">
                      <Typography
                        variant="body2"
                        sx={{
                          display: "inline-block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        {requiredDoc.file.name}
                      </Typography>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              {formErrors.file && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {formErrors.file}
                </Typography>
              )}
            </Grid>

            {/* Amount Input */}
            <Grid item xs={12}>
              <InputLabel shrink={false} htmlFor="amount">
                <Typography variant="body1">Amount*</Typography>
              </InputLabel>
              <TextField
                fullWidth
                value={requiredDoc.amount}
                size="small"
                onChange={(e) => setRequiredDoc((prev) => ({ ...prev, amount: e.target.value }))}
                required
                error={!!formErrors.amount}
                helperText={formErrors.amount}
                onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
              />
            </Grid>

            {/* Transaction ID Input */}
            <Grid item xs={12}>
              <InputLabel shrink={false} htmlFor="transactionId">
                <Typography variant="body1">Transaction Id*</Typography>
              </InputLabel>
              <TextField
                fullWidth
                value={requiredDoc.transactionNumber}
                size="small"
                onChange={(e) => setRequiredDoc((prev) => ({ ...prev, transactionNumber: e.target.value }))}
                required
                error={!!formErrors.transactionNumber}
                helperText={formErrors.transactionNumber}
                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9]+$/)}
              />
            </Grid>

            {/* Date Picker */}
            <Grid item xs={12}>
              <InputLabel shrink={false} htmlFor="uploadDate">
                <Typography variant="body1">Date Of Payment*</Typography>
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="uploadDate"
                  disableFuture
                  maxDate={dayjs()}
                  onChange={handleDateChange}
                  value={requiredDoc.selectedDate ? dayjs(requiredDoc.selectedDate) : null}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      placeholder: "Select Date",
                      error: !!formErrors.date,
                      helperText: formErrors.date || "",
                    },
                    popper: {
                      style: { zIndex: 110015 },
                  },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      </FormWrapper>
    </>
  );
});

export default PaymentProof;
