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
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);



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

 const [auditorRemarks, setAuditorRemarks] = useState([])
  // Fetching audit control data
  const getAllRemarksAuditor = () => {
    setLoading(true);
    AuditService.getByAllAuditorRemarksByApplicantUserName(ApplicantUserName)
      .then((response) => {
        setAuditorRemarks(response.data);
      })
      .catch((err) => {

      })
      .finally(() => {
        setLoading(false);
      });
  };


  useEffect(() => {
    getAllMinimumAttempt();
    getAllShortComming();
    getAllRemarksReviewer();
    getAllRemarksAuditor();
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

const downloadAuditorReviewDocument = async (filename) => {

    try {
      const response = await AuditService.viewAuditReport(filename);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers['content-disposition'];


      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : "AuditReviewReport.pdf";



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

  const handleApprovedSubmit = (e) => {
    e.preventDefault();

    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure you want to submit?",
      confirmText: "Yes",
      closeText: "No",
      // fullWidth: true,
      // maxWidth: "sm",
      onConfirm: () => handleSubmit(),
    });
  };





  const handleSubmit = () => {

    const applicantRemarks = new FormData();
    applicantRemarks.append("remarks", radioValue.remarks);
    applicantRemarks.append("applicantUserName", radioValue.applicantUserName);
    AuditService.changeTheStatusApprove(applicantRemarks)
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


  return (
    <>
      <LoaderProgress open={isLoading} />
      <FormWrapper headingText="Review NC Details ">
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
            {auditorRemarks.map((item, index) => (
              <React.Fragment key={index}> {/* Use Fragment to wrap all elements for each item */}
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ marginTop: '10px' }}>
                    Auditor Remarks
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
                        Auditor Report:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                        onClick={() => downloadAuditorReviewDocument(item.auditorReviewReport	)}
                      >
                        {item.auditorReviewReport}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>




          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: '10px' }}>Reviewer Remarks</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                value={radioValue.remarks}
                fullWidth
                onChange={handleChange}

                InputProps={{
                  style: {
                    padding: '10px',
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
            <Grid item  >
              <Button type="submit" fullWidth variant="contained" sx={{ maxWidth: '120px' }} onClick={handleApprovedSubmit} >
                Approve
              </Button>
            </Grid>
            <Grid item  >
              <Button type="button" color="reset" fullWidth variant="contained" sx={{
                maxWidth: 'auto',
                color: "#FFFFFF",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }} onClick={handleRejectedSubmit}>
                {applicationReview <= allShortComming.length ? 'Recommand for Rejection' : 'Rejected'}
              </Button>
            </Grid>
          </Grid>

        </Box>
      </FormWrapper>
    </>
  );
};

export default AuditorControls;
