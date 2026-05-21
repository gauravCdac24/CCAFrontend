import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControlLabel,
  Radio,
  Grid,
  TextField,
  Tooltip,
  InputLabel,
  Link,
  Dialog, DialogContent
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AuditControlService from "../../../service/AdminService/AuditControlService";
import showAlert from "../../global/common/MessageBox/AlertService";
import LoaderProgress from "../../global/common/LoaderProgress";
import FormWrapper from "../../global/util/FormWrapper";
import { useParams } from "react-router-dom";
import { decrypt } from "../../global/util/EncryptDecrypt";
import AuditService from "../../../service/AuditService/AuditService";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import MinimumAttempt from "../../../service/AdminService/MinimumAttempt";
import dateFormatter from "../../global/util/DateFormatter";
import CloseIcon from "@mui/icons-material/Close";
import EsignService from "../../../service/EsignService/EsignService";



const VisuallyHiddenInput = styled('input')({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: '0',
});

const AuditorControls = () => {
  const { id } = useParams();
  const ApplicantUserName = decrypt(id);
  const [isLoading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [radioValue, setRadioValue] = useState({
    compliance: "",
    applicantUserName: ApplicantUserName,
    creteriaId: '',
    remarks: '',
    isreject: false,
    file3:null,
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);

  const [fileInputKey3, setFileInputKey3] = useState(Date.now());

  useEffect(() => {
    console.log("open:", open);
    console.log("pdfUrl:", pdfUrl);
  }, [open, pdfUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
        console.log("Revoked URL on unmount:", pdfUrl);
      }
    };
  }, [pdfUrl]);
  const handleViewDocument = async () => {
    try {
      // Fetch signed document ID
      const response = await AuditService.getEsignedDocumentId(ApplicantUserName);
      const signedDocId = response.data?.signedDocId;

      if (!signedDocId) {
        console.error("No signed document ID found.");
        return;
      }

      const pdfBlob = await EsignService.viewDigitallySignedDocument(signedDocId);

      const url = window.URL.createObjectURL(pdfBlob);
      //alert("PDF URL: " + url); // Log the URL to the console
      setPdfUrl(url);

      setOpen(true);

    } catch (error) {
      console.error("Error fetching and downloading file:", error);
    }
  };


  const [fileName3, setFileName3] = useState('');

  const [fileError, setFileError] = useState(" ")
  const handleFileChange3 = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check if the file is a PDF
      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are allowed.");
        return;
      }

      // Check if the file size exceeds 5 MB
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setFileError(`File size should not exceed ${maxSizeInMB} MB.`);
        return;
      }

      // If valid, update state
      setRadioValue(prevValues => ({
        ...prevValues,
        file3: file
      }));
      setFileName3(file.name);
    } else {
      // Clear state if no file is selected
      setRadioValue(prevValues => ({
        ...prevValues,
        file3: null
      }));
      setFileName3('');
    }
  };

  const handleDownloadDocument = async () => {
    try {
      // Fetch signed document ID
      const response = await AuditService.getEsignedDocumentId(ApplicantUserName);
      const signedDocId = response.data?.signedDocId;

      if (!signedDocId) {
        console.error("No signed document ID found.");
        return;
      }

      const pdfBlob = await EsignService.downloadDigitallySignedDocument(signedDocId, "finalSignedDocument");

      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      setPdfUrl(url);

    } catch (error) {
      console.error("Error fetching and downloading file:", error);
    }
  };


  const handleChange = (event) => {
    setRadioValue((prevState) => ({
      ...prevState,
      remarks: event.target.value,
    }));
  };



  const [allMinimumAttemptList, setAllMinimumAttemptsList] = useState([]);

  const getAllMinimumAttempt = () => {
    setLoading(true);
    MinimumAttempt.getAllActiveMinimumAttemptList()
      .then((response) => {
        console.log("Fetched Minimum Attempts list:", response.data);
        setAllMinimumAttemptsList(() => {
          return response.data.map((obj, index) => {
            obj['id'] = index + 1;
            obj['created'] = dateFormatter(obj.created);
            obj['updated'] = dateFormatter(obj.updated);
            return obj;
          });
        });
      })
      .catch((err) => {
        console.error("Error fetching Minimum Attempts list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [allShortComming, setAllShortComming] = useState([]);
  const [applicationReview, setApplicationReview] = useState({});
  const getAllShortComming = () => {
    setLoading(true);
    AuditService.getAllShortComming(ApplicantUserName)
      .then((response) => {
        console.log("Fetched Short Comming list:", response.data);
        setAllShortComming(response.data)
      })
      .catch((err) => {
        console.error("Error fetching Short Comming list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [reviewRemarks, setReviewRemarks] = useState([])
  // Fetching audit control data
  const getAllRemarksReviewer = () => {
    setLoading(true);
    AuditService.getByAllShortCommingReportApplicantUserName(ApplicantUserName)
      .then((response) => {
        setReviewRemarks(response.data);
      })
      .catch((err) => {

      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [errors, setErrors] = useState({});


  useEffect(() => {
    getAllMinimumAttempt();
    getAllShortComming();
    getAllRemarksReviewer();
  }, []);

  useEffect(() => {
    if (allMinimumAttemptList.length > 0) {
      const counts = {};
      allMinimumAttemptList.forEach((app) => {
        const reviewId = app.applicationAudit; // Adjust according to your data structure
        console.log("reviewId=======>", reviewId);
        setApplicationReview(reviewId);
      });

    }
  }, [allMinimumAttemptList]);

  const handleRejectedSubmit = (e) => {
    e.preventDefault();
    if (applicationReview <= allShortComming.length) {
      radioValue.isreject = true;
    }

    if (!radioValue.remarks.trim()) {
      showAlert({
        messageTitle: "Error",
        messageContent: "Please enter remarks before rejecting.",
        confirmText: "Ok",
      });
      return;
    }

    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure you want to submit?",
      confirmText: "Yes",
      closeText: "No",
      // fullWidth: true,
      // maxWidth: "sm",
      onConfirm: () => handleConfrimSubmit(),
    });
  };


  const downloadDigitallySignedDocument = async (filename) => {

    try {
      const response = await AuditService.downloadShortCommingDocument(filename);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers['content-disposition'];


      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : "ShortCommingReport.pdf";



      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error('Error downloading file:', error);

    }

  }






  const handleConfrimSubmit = () => {

    const applicantRemarks = new FormData();
    applicantRemarks.append("remarks", radioValue.remarks);
    applicantRemarks.append("applicantUserName", radioValue.applicantUserName);
    applicantRemarks.append("isreject", radioValue.isreject)
    AuditService.changeTheStatusRejected(applicantRemarks)
      .then((response) => {
        //console.log(response.data)
        showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          onConfirm: () => window.location.href = '/applicationreviewcommittee/ncreport',
        });

      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || 'Request failed. Please try again later.';
        showAlert({
          messageTitle: 'Error',
          messageContent: errorMessage,
          confirmText: 'Ok',
        });
      })
      .finally(() => setLoading(false));

  }

  const handleConfrimSubmits = (e) => {
  e.preventDefault();
  let hasError = false;
  if (!radioValue.remarks || radioValue.remarks.trim() === "") {
    setErrors((prevErrors) => ({
      ...prevErrors,
      remarks: "Please enter the remarks",
    }));
    hasError = true;
  }

  if (radioValue.file3=== null) {
    setFileError("Please select a file.");
    hasError = true;
  }

  if (hasError) {
    return; 
  }

  showAlert({
    messageTitle: "Confirm",
    messageContent: "Are you sure you want to submit?",
    confirmText: "Yes",
    closeText: "No",
    // fullWidth: true,
    // maxWidth: "sm",
    onConfirm: () => handleSubmits(),
  });
};





const handleSubmits = () => {
  
  const applicantRemarks=new FormData();

  applicantRemarks.append("remarks",radioValue.remarks);
  applicantRemarks.append("applicantUserName",radioValue.applicantUserName);
  applicantRemarks.append("file",radioValue.file3);
  AuditService.getAuditorRemarksToReviewer(applicantRemarks)
  .then((response) => {
    //console.log(response.data)
      showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          onConfirm: () => window.location.href = '/auditagency/reviewauditreport',
         // onConfirm: () => window.location.href = '/auditagency/reviewauditreport',

      });
      
  })
  .catch((err) => {
      const errorMessage = err.response?.data?.message || 'Request failed. Please try again later.';
      showAlert({
          messageTitle: 'Error',
          messageContent: errorMessage,
          confirmText: 'Ok',
      });
  })
  .finally(() => setLoading(false));

}

// Accept NC Report - breaks the loop and moves to NC Closure stage
const handleAccept = () => {
  const applicantRemarks = new FormData();
  applicantRemarks.append("remarks", radioValue.remarks);
  applicantRemarks.append("applicantUserName", radioValue.applicantUserName);
  applicantRemarks.append("file", radioValue.file3);
  
  setLoading(true);
  AuditService.acceptAuditorRemarks(applicantRemarks)
    .then((response) => {
      showAlert({
        messageTitle: 'Success',
        messageContent: response.data,
        confirmText: 'Ok',
        onConfirm: () => window.location.href = '/auditagency/reviewauditreport',
      });
    })
    .catch((err) => {
      const errorMessage = err.response?.data?.message || 'Request failed. Please try again later.';
      showAlert({
        messageTitle: 'Error',
        messageContent: errorMessage,
        confirmText: 'Ok',
      });
    })
    .finally(() => setLoading(false));
}

const handleAcceptSubmit = (e) => {
  e.preventDefault();
  let hasError = false;
  if (!radioValue.remarks || radioValue.remarks.trim() === "") {
    setErrors((prevErrors) => ({
      ...prevErrors,
      remarks: "Please enter the remarks",
    }));
    hasError = true;
  }

  if (radioValue.file3 === null) {
    setFileError("Please select a file.");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  showAlert({
    messageTitle: "Confirm",
    messageContent: "Are you sure you want to ACCEPT and close this NC Report?",
    confirmText: "Yes, Accept",
    closeText: "No",
    onConfirm: () => handleAccept(),
  });
};



  return (
    <>
      <LoaderProgress open={isLoading} />
      <FormWrapper headingText="Review Audit Report ">
        <Box component="form" noValidate>


          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h6" style={{ marginTop: "10px" }}>
                Final eSigned Report:
              </Typography>
            </Grid>

            <Grid item>
              <Grid container spacing={2} direction="row">
                <Grid item>
                  <Button variant="text" color="primary" onClick={handleViewDocument} sx={{ "&:hover": { backgroundColor: "transparent", textDecoration: "none" } }}
                  >
                    View
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="text" color="primary" onClick={handleDownloadDocument} sx={{ "&:hover": { backgroundColor: "transparent", textDecoration: "none" } }}
                  >
                    Download
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>



          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogContent style={{ padding: 0, overflow: "hidden" }}>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                style={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
              {pdfUrl ? (
                <div>
                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="600px"
                    style={{ border: "none" }}
                    title="PDF Preview"
                  />
                  <Typography>
                    If the PDF does not display,{" "}
                    <a href={pdfUrl} download="document.pdf">
                      download it here
                    </a>.
                  </Typography>
                </div>
              ) : (
                <Typography>Loading PDF...</Typography>
              )}
            </DialogContent>
          </Dialog>

          <Grid container spacing={2}>
            {reviewRemarks.map((item, index) => (
              <Grid item xs={12} key={index}> {/* Use index or a unique identifier */}
                <Typography variant="h6" style={{ marginTop: '10px' }}>Reviewer Remarks</Typography>
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  value={item.remarks}
                  disabled
                  fullWidth
                  InputProps={{
                    style: {
                      padding: '10px',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>


          <Grid container spacing={2}>
            {reviewRemarks.map((item, index) => (
              <React.Fragment key={index}> {/* Use Fragment to wrap all elements for each item */}
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ marginTop: '10px' }}>
                    Applicant Remarks
                  </Typography>
                  <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    value={item.remarks}
                    disabled
                    fullWidth
                    InputProps={{
                      style: {
                        padding: '10px',
                      },
                    }}
                  />
                </Grid>


                <Grid item xs={12}>
                  <Grid container spacing={1} direction="row" alignItems="center">
                    <Grid item>
                      <Typography variant="h6" style={{ marginTop: "10px" }}>
                        Applicant Report:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                        onClick={() => downloadDigitallySignedDocument(item.shortcomingReport)}
                      >
                        {item.shortcomingReport}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>





          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: '10px' }}>Auditor Remarks</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                value={radioValue.remarks}
                fullWidth
                onChange={handleChange}
                error={!!errors.remarks} // Shows red border if there's an error
                helperText={errors.remarks || ''} // Displays the error message
                InputProps={{
                  style: {
                    padding: '10px',
                  },
                }}
              />
            </Grid>
          </Grid>


          <Grid item xs={12} sm>
            <InputLabel shrink={false} htmlFor={"netWorthDoc"}>
              <Typography variant='body1'>Attached Any Document (Only PDF and Max allowed size 5 MB)*</Typography>
            </InputLabel>

            <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px' }}>
              <Grid item >
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput
                    key={fileInputKey3}
                    type="file"
                    name="file3"
                    onChange={handleFileChange3}
                  />
                </Button>

              </Grid>
              <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {fileName3 && (
                  <Tooltip title={fileName3} placement="top">
                    <Typography variant='body2' sx={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      verticalAlign: 'middle',
                      textAlign: 'center'
                    }}>
                      {fileName3}
                    </Typography>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
            {fileError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {fileError}
              </Typography>
            )}


          </Grid>


          <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
            <Grid item  >
              <Button type="submit" fullWidth variant="contained" sx={{ maxWidth: '150px' }} onClick={handleConfrimSubmits} >
                Send Back
              </Button>
            </Grid>
            <Grid item  >
              <Button type="submit" fullWidth variant="contained" color="success" sx={{ maxWidth: '150px' }} onClick={handleAcceptSubmit} >
                Accept NC
              </Button>
            </Grid>
          </Grid>

        </Box>
      </FormWrapper>
    </>
  );
};

export default AuditorControls;
