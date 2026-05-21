import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  TextField,
  Link,
  Dialog, DialogContent
} from "@mui/material";
import showAlert from "../../../global/common/MessageBox/AlertService";
import LoaderProgress from "../../../global/common/LoaderProgress";
import FormWrapper from "../../../global/util/FormWrapper";
import { useParams } from "react-router-dom";
import { decrypt } from "../../../global/util/EncryptDecrypt";
import AuditService from "../../../../service/AuditService/AuditService";
import { styled } from '@mui/material/styles';
import CloseIcon from "@mui/icons-material/Close";
import EsignService from "../../../../service/EsignService/EsignService";



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

const SendToRejection = () => {
  const { id } = useParams();
  const ApplicantUserName = decrypt(id);
  const [open, setOpen] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [radioValue, setRadioValue] = useState({
    compliance: "",
    applicantUserName: ApplicantUserName,
    creteriaId:'',
    remarks:'',
    file3:null,
  });
 

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
  
        const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
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
        //setPdfUrl(url);
  
      } catch (error) {
        console.error("Error fetching and downloading file:", error);
      }
    };
  

    const downloadDigitallySignedDocument  = async ( filename) => {

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


  const[remarks,setRemarks]=useState([])
   // Fetching audit control data
   const getAllRemarksAuditControl = () => {
    setLoading(true);
    AuditService.viewRemarks(ApplicantUserName)
      .then((response) => {
        setRemarks(response.data);
      })
      .catch((err) => {
        showAlert({
          messageTitle: 'Error',
          messageContent: 'Error fetching audit control list. Please try again later.',
          confirmText: 'OK',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const[reviewRemarks,setReviewRemarks]=useState([])
  // Fetching audit control data
  const getAllRemarksReviewer = () => {
   setLoading(true);
   AuditService.viewReviewerRemarks(ApplicantUserName)
     .then((response) => {
        setReviewRemarks(response.data);
     })
     .catch((err) => {
       showAlert({
         messageTitle: 'Error',
         messageContent: 'Error fetching audit control list. Please try again later.',
         confirmText: 'OK',
       });
     })
     .finally(() => {
       setLoading(false);
     });
 };

  console.log("remarks===>",remarks)

  useEffect(() => {
    getAllRemarksAuditControl();
    getAllRemarksReviewer();
    getAllRemarkesReviewer();
  }, []);

  
 
const [reviewRemarkes, setReviewRemarkes] = useState([])
  // Fetching audit control data
  const getAllRemarkesReviewer = () => {
    setLoading(true);
    AuditService.getByAllShortCommingReportApplicantUserName(ApplicantUserName)
      .then((response) => {
        setReviewRemarkes(response.data);
      })
      .catch((err) => {

      })
      .finally(() => {
        setLoading(false);
      });
  };



const handleRejectedSubmit = (e) => {
  e.preventDefault();
  showAlert({
    messageTitle: "Confirm",
    messageContent: "Are you sure you want to send this to the applicant?",
    confirmText: "Yes",
    closeText: "No",
    fullWidth: true,
    maxWidth: "sm",
    onConfirm: () => handleConfrimSubmit(),
  });
};

const handleConfrimSubmit = () => {
  
  const applicantRemarks=new FormData();
  const remarks="Application has been rejected"
  const isreject=false;
  applicantRemarks.append("remarks",remarks);
  applicantRemarks.append("applicantUserName",radioValue.applicantUserName);
  applicantRemarks.append("isreject",isreject);
  AuditService.changeTheStatusRejected(applicantRemarks)
  .then((response) => {
    //console.log(response.data)
      showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          onConfirm: () => window.location.href = '/cca/auditorlicense',
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
  e.preventDefault()
  showAlert({
      messageTitle: 'Confirm',
      messageContent: 'Are you sure, you want to reject this application?',
      confirmText: 'Yes',
      closeText: 'No',
      fullWidth: true,
      maxWidth: 'sm',
      onConfirm: () => handleRejectionSubmit()
  })


};

const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



const handleRejectionSubmit = () => {
  
  const applicantRemarks=new FormData();

 // alert()

 // applicantRemarks.append("remarks",radioValue.remarks);
  applicantRemarks.append("applicantUserName",ApplicantUserName);

  AuditService.applicationRejected(applicantRemarks)
  .then((response) => {
    //console.log(response.data)
      showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          onConfirm: () => window.location.href = '/cca/auditorlicense',
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
      <FormWrapper headingText="Auditors Controls">
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
                  <Link href="#" onClick={handleViewDocument}>
                    View
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" onClick={handleDownloadDocument}>
                    Download
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>



          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogContent>
              {/* Close Button */}
              <IconButton
                aria-label="close"
                onClick={handleClose}
                style={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>

              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
                  title="PDF Preview"
                ></iframe>
              ) : (
                <Typography>Loading PDF...</Typography>
              )}
            </DialogContent>
          </Dialog>


          <Grid container spacing={2}>
            {reviewRemarkes.map((item, index) => (
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
                      <Typography variant="body1" style={{ marginLeft: '10px' }} onClick={downloadDigitallySignedDocument(item.shortcomingReport)} href="#">
                        {item.shortcomingReport}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>

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


<Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
  <Grid item>
    <Button
      type="submit"
      variant="contained"
      sx={{ maxWidth: 'auto', height: '40px' }} 
      onClick={handleApprovedSubmit}
      aria-label="Application Rejection"
    >
      Application Rejection
    </Button>
  </Grid>
  
  <Grid item>
    <Button
      type="button"
      variant="contained"
      sx={{
        maxWidth: 'auto', 
        height: '40px',
        color: '#FFFFFF',
        backgroundColor: '#FF5722', 
      }}
      onClick={handleRejectedSubmit}
      aria-label="Send To Applicant"
    >
      Send To Applicant
    </Button>
  </Grid>
</Grid>


        </Box>
      </FormWrapper>
    </>
  );
};

export default SendToRejection;
