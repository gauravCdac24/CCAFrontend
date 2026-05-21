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
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AuditControlService from "../../../../service/AdminService/AuditControlService";
import showAlert from "../../../global/common/MessageBox/AlertService";
import LoaderProgress from "../../../global/common/LoaderProgress";
import FormWrapper from "../../../global/util/FormWrapper";
import { useParams } from "react-router-dom";
import { decrypt } from "../../../global/util/EncryptDecrypt";
import AuditService from "../../../../service/AuditService/AuditService";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';




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

const ApplicationAuditControls = () => {
  const { id } = useParams();
  const ApplicantUserName = decrypt(id);
  const [open, setOpen] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [fileInputKey3, setFileInputKey3] = useState(Date.now());
  const [radioValue, setRadioValue] = useState({
    compliance: "",
    applicantUserName: ApplicantUserName,
    creteriaId:'',
    remarks:'',
    file3:null,
  });
  const [selectedFiles, setSelectedFiles] = useState([]); // Track files per row

 

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
  }, []);

  const handleToggle = (index) => {
    setOpen((prev) => {
      const updatedOpen = [...prev];
      updatedOpen[index] = !updatedOpen[index];
      return updatedOpen;
    });
  };

  const [complianceValues, setComplianceValues] = useState([]); // Array to track compliance for each row

const handleRadioChange = (value, controlIndex) => {
  setComplianceValues((prev) => {
    const updatedCompliance = [...prev]; // Create a copy of the previous state
    updatedCompliance[controlIndex] = value; // Set the compliance value for the specific row (controlIndex)

    setRadioValue((prev) => ({
      ...prev,
      compliance: updatedCompliance,
    }));

    return updatedCompliance;
  });
};


  const [errors, setErrors] = useState({});
    const handleChanges = (e, fieldName) => {
        const { value } = e.target;
      
        setRadioValue((prev) => ({
          ...prev,
          remarks: value,
        }));
        // Reset error for the current field
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: "",
        }));
      
        // Basic validation
        if (value === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: `${fieldName} cannot be empty`,
          }));
          return;
        }
    }

  // Handle file change for each row
  const handleFileChange = (event, controlIndex) => {
    const selectedFile = event.target.files[0];
    const updatedFiles = [...selectedFiles];
    updatedFiles[controlIndex] = selectedFile; // Track file per row
    setSelectedFiles(updatedFiles);
  };

  console.log("gdhfj===>",radioValue , "uwyeio++++====>",selectedFiles)

// Function to reset the form data
const resetFormData = () => {
  setRadioValue({ compliance: [], applicantUserName: '' }); // Reset the radioValue state
  setSelectedFiles([]); // Clear the selected files array
  console.log("Form data has been reset.");
};

  
const [applicantCriteria, setApplicantCriteria] = useState([]);
const[fileName,setFileName]=useState([]);


const [fileName3, setFileName3] = useState('');

const[fileError,setFileError]=useState(" ")
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



const handleSubmit = (e) => {
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
    onConfirm: () => handleConfrimSubmit(),
  });
};





const handleConfrimSubmit = () => {
  
  const applicantRemarks=new FormData();

  applicantRemarks.append("remarks", radioValue.remarks);
  applicantRemarks.append("applicantUserName", radioValue.applicantUserName || ApplicantUserName);
  applicantRemarks.append("file", radioValue.file3);
  AuditService.changestatusToReviewer(applicantRemarks)
  .then((response) => {
    //console.log(response.data)
      showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          onConfirm: () => window.location.href = '/applicant/applicationform',
      });
      
      // Reset the form values
      resetFormData();
  })
  .catch((err) => {
      const data = err.response?.data;
      const errorMessage =
        (typeof data === 'string' && data) ||
        data?.message ||
        (err.response?.status === 404
          ? 'No NC review record found. Ensure the audit agency has submitted the NC report, or the Review Committee has added remarks, before you submit your response.'
          : 'Request failed. Please try again later.');
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
      <FormWrapper headingText="Review NC Report">
        <Box component="form" noValidate onSubmit={handleSubmit}>
        
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
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: '10px' }}>Remarks</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                onChange={(e) => handleChanges(e, 'remarks')}

                InputProps={{
                  style: {
                    padding: '10px',
                  },
                }}
                error={!!errors.remarks} // Shows red border if there's an error
      helperText={errors.remarks || ''} // Displays the error message
              />
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

          </Grid>

          <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
                        <Grid item  >
                            <Button type="submit" fullWidth variant="contained" sx={{ maxWidth: '120px' }}>
                                Submit
                            </Button>
                        </Grid>
                        <Grid item  >
                            <Button type="button"  color="reset" fullWidth variant="contained" sx={{ maxWidth: '120px', color: "#FFFFFF" }}>
                                Reset
                            </Button>
                        </Grid>
                    </Grid>


        </Box>
      </FormWrapper>
    </>
  );
};

export default ApplicationAuditControls;
