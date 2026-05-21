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
import { decrypt, encrypt } from "../../../global/util/EncryptDecrypt";
import { useNavigate, useParams } from "react-router-dom";
import dateFormatter from "../../../global/util/DateFormatter";
import { useSelector } from "react-redux";

const PaymentProof = () => {

  const { id } = useParams();
const intentAppId = decrypt(id);


  const [requiredDoc, setRequiredDoc] = useState({
    intentAppId: "",
    file: null,
    amount: "",
    selectedDate: "",
    transactionNumber: "",
  });
  const [applicantPaymentProofList, setApplicantPaymentProofList] = useState({});
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Reset input on invalid file
  const [isLoading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Update requiredDoc once payment proof data is available
useEffect(() => {
  if (applicantPaymentProofList && Object.keys(applicantPaymentProofList).length > 0) {
    setRequiredDoc((prev) => ({
      ...prev,
      intentAppId,
      amount: applicantPaymentProofList.amount,
      transactionNumber: applicantPaymentProofList.transactionID,
      selectedDate: applicantPaymentProofList.dateOfPayment // adjust field name if different
    }));
  }
}, [applicantPaymentProofList, intentAppId]);



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



  const getApplicantPaymentProofByIntentId = () => {
 
         setLoading(true);
         ApplicationForm.getApplicantPaymentProofByIntentId(encrypt(intentAppId))
             .then((res) => {
              setApplicantPaymentProofList(res.data);
              console.log("res.data", res.data)
             })
             .catch((err) => {
 
             })
             .finally(() => {
                 setLoading(false);
             })
 
 
     }
     useEffect(() => {
      getApplicantPaymentProofByIntentId();
          
  }, []);

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
    } else if (requiredDoc.amount !== 25000) {
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
  
  const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`${routeRootPath}/paymentverification`, { replace: true })
  }


  const handleConfirmSubmit = () => {
    setLoading(true);
console.log(requiredDoc)

    ApplicationForm.getPaymentVerificationApplicationForm(requiredDoc)
      .then((response) => {
        showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          closeParent: true,
          onConfirm: ()=>handleBack()
        });
        // refreshApplication();
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

  console.log("requiredDoc", requiredDoc)
  const handleApprove = () => {
    const errors = validateForm();
    console.log(errors)
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


  const handleReject = () => {
   
    
  };



  return (
    <>
      <LoaderProgress open={isLoading} />
      <FormWrapper headingText="Payment Proof Verification Details">
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleApprove}>
          <Grid container spacing={2} sx={{ maxWidth: 600, margin: "auto", p: 3 }}>
            {/* File Upload */}

            <Grid item xs={12}>

{/* Date of Payment */}
<Box display="flex">
    <Typography variant="body1" sx={{ minWidth: 150 }}>
      <b>UserName*:</b>
    </Typography>
    <Typography variant="body1">
      {applicantPaymentProofList?.indivApplicationId?.userName}
    </Typography>
  </Box>

  {/* Amount */}
  <Box display="flex" mb={1}>
    <Typography variant="body1" sx={{ minWidth: 150 }}>
      <b>Amount*:</b>
    </Typography>
    <Typography variant="body1">
      {applicantPaymentProofList.amount}
    </Typography>
  </Box>

  {/* Transaction ID */}
  <Box display="flex">
    <Typography variant="body1" sx={{ minWidth: 150 }}>
      <b>Transaction Id*:</b>
    </Typography>
    <Typography variant="body1">
      {applicantPaymentProofList.transactionID}
    </Typography>
  </Box>
   {/* Date of Payment */}
   <Box display="flex">
    <Typography variant="body1" sx={{ minWidth: 150 }}>
      <b>Date Of Payment*:</b>
    </Typography>
    <Typography variant="body1">
      {dateFormatter(applicantPaymentProofList.dateOfPayment)}
    </Typography>
  </Box>
</Grid>







            <Grid item xs={12}>
              <InputLabel shrink={false} htmlFor="netWorthDoc">
                <Typography variant="body1">Upload Payment Verification Document (Only PDF, Max 5MB)*</Typography>
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

          </Grid>

          <Grid
            container
            direction="row"
            sx={{ mt: 4 }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ maxWidth: '120px' }}
                onClick={handleApprove}
              >
                Approve
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="button"
                color="reset"
                fullWidth
                variant="contained"
                sx={{ maxWidth: '120px',color:'white' }}
                onClick={handleReject}
              >
                Reject
              </Button>
            </Grid>
          </Grid>

        </Box>
      </FormWrapper>
    </>
  );
};

export default PaymentProof;
