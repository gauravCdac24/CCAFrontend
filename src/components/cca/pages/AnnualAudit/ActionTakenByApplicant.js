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
import AuditControlService from "../../../service/AdminService/AuditControlService";
import showAlert from "../../global/common/MessageBox/AlertService";
import LoaderProgress from "../../global/common/LoaderProgress";
import FormWrapper from "../../global/util/FormWrapper";
import { useParams } from "react-router-dom";
import { decrypt } from "../../global/util/EncryptDecrypt";
import AuditService from "../../../service/AuditService/AuditService";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";




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


const ActionTakenByApplicant = () => {
  const { id } = useParams();
  const ApplicantUserName = decrypt(id);

  const userName = useSelector((state) => state.jwtAuthentication.username);
  const [open, setOpen] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [radioValue, setRadioValue] = useState({
    compliance: "",
    applicantUserName: ApplicantUserName,
    creteriaId:'',
    remarks:'',
    file3:null,
  });
  const [fileInputKey3, setFileInputKey3] = useState(Date.now());
  const [selectedFiles, setSelectedFiles] = useState([]); // Track files per row

  // Fetching audit control data
  const getAllAuditControl = () => {
    setLoading(true);
    AuditControlService.data()
      .then((response) => {
        setAllAuditControlList(response.data);
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

  useEffect(() => {
    getAllAuditControl();
  }, [isLoading]);

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

  const saveData = (id) => {
    console.log(`Saving data for control ID: ${id}`);
    
    const formData = new FormData();
    formData.append("controlId", id);
    
    const validCompliance = radioValue.compliance.filter(value => value !== "");

// Append valid values to formData
validCompliance.forEach((value) => {
    formData.append('compliance', value);
});
    
    formData.append("applicantUserName", radioValue.applicantUserName);
    
    selectedFiles.forEach((file) => {
        formData.append(`file`, file);
    });

    const validFiles = fileName.filter(file => file !== "");

    // Append valid files to formData
    validFiles.forEach((file) => {
        formData.append('selectedMultipartFile', file);
    });
    
    // Log formData content
    console.log("FormData content:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    // Call the API
    AuditService.AuditNCForm(formData)
        .then((response) => {
          //console.log(response.data)
            showAlert({
                messageTitle: 'Success',
                messageContent: response.data,
                confirmText: 'Ok',
            });
            
            // Reset the form values
            resetFormData();
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
};
//temporary state
const [applicantCriteria, setApplicantCriteria] = useState([]);
const[fileName,setFileName]=useState([]);

const getAllCriteria = () => {
  AuditService.getAllDatas()
    .then((response) => {
      const getAllData = response.data; // Assuming this is the array containing the required data

      setApplicantCriteria(getAllData);

      console.log("getAllData===>", getAllData);
      console.log("allAuditControlList===>", allAuditControlList);


      const emp = [];
const fileNames=[];

const criteriaId=[];

      // Step 1: Iterate over allAuditControlList to filter based on auditControllId
      allAuditControlList?.forEach((criteria) => {
        // Step 2: Check if auditSubCriteria exists and is an array before iterating
        if (criteria?.auditSubCriteria && Array.isArray(criteria?.auditSubCriteria)) {
          criteria?.auditSubCriteria?.forEach((subCriteria) => {
            // Step 3: Iterate over auditParameterPayload
            if (subCriteria?.auditParameterPayload && Array.isArray(subCriteria?.auditParameterPayload)) {
              subCriteria?.auditParameterPayload?.forEach((parameter) => {
                // Step 4: Iterate over auditControlPayload to access auditControllId
                if (parameter?.auditControlPayload && Array.isArray(parameter?.auditControlPayload)) {
                  
                  parameter?.auditControlPayload?.forEach((control) => {
                    // Check if control.auditControllId matches getAllData.auditControlId
                    const matchedControl = getAllData.find(
                      (data) => data.auditControlId === parseInt(control.auditControllId, 10)
                    );

                    

                    if (matchedControl) {
                      // Update the radioValue state with the matched compliance value

                      emp.push(matchedControl.compliance)
                      fileNames.push(matchedControl.document)
                      criteriaId.push(matchedControl.criteriaId)
                      console.log("fileNames=====-==->"+JSON.stringify(fileNames))
                      console.log("fileNames=====-==->"+JSON.stringify(emp))
                      console.log("criteriaId=====-==->"+JSON.stringify(criteriaId))
                    }else{
                      const newObj='';
                      emp.push(newObj)
                      criteriaId.push(newObj)
                      fileNames.push(newObj)
                    }
                  });

                  
                }
              });
            }
          });
        }
      });


      setComplianceValues(emp);
      setRadioValue((prev) => ({
        ...prev,
        compliance: emp,
        creteriaId:criteriaId,
      }));
      setFileName(fileNames)

    })
    .catch((error) => {
      // Handle error if necessary
      console.error("Error fetching data:", error);
    });
};


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


useEffect(() => {
  getAllCriteria();
}, [isLoading]);


const handleSubmit = (e) => {
  e.preventDefault()

  if (!radioValue.remarks || radioValue.remarks.trim() === "") {
    setErrors((prevErrors) => ({
      ...prevErrors,
      remarks: "Please enter the remarks",
    }));
    return;
  }
  showAlert({
      messageTitle: 'Confirm',
      messageContent: 'Are you sure, you want to submit?',
      confirmText: 'Yes',
      closeText: 'No',
      fullWidth: true,
      maxWidth: 'sm',
      onConfirm: () => handleConfrimSubmit()
  })


};




const handleConfrimSubmit = () => {
  
  const applicantRemarks=new FormData();

  applicantRemarks.append("userName",userName)
  applicantRemarks.append("remarks",radioValue.remarks);
  applicantRemarks.append("applicantUserName",radioValue.applicantUserName);
  applicantRemarks.append("file",radioValue.file3);
  AuditService.changeTheStatus(applicantRemarks)
  .then((response) => {
    //console.log(response.data)
      showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          onConfirm: () => window.location.href = '/auditagency/uploadundertaking',
      });
      
      // Reset the form values
      resetFormData();
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

const downloadfile = async ( documentTitle) => {
  try {
      // Fetch the file from the server
      const response = await AuditService.viewAuditNCReport(documentTitle);

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      // Extract the filename from the Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];

      console.log(JSON.stringify(contentDisposition))

      const filename = documentTitle;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  } catch (error) {
      console.error('Error downloading file:', error);
  }
};


const [auditNCReport,setAuditNCReport]=useState({})
const getAllAuditNCReport = () => {
  setLoading(true);
  AuditService.auditNCReport(ApplicantUserName)
    .then((response) => {
      setAuditNCReport(response.data);
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

useEffect(() => {
  getAllAuditNCReport();
}, [isLoading]);



  return (
    <>
      <LoaderProgress open={isLoading} />
      <FormWrapper headingText="NC Closure Report">
        <Box component="form" noValidate onSubmit={handleSubmit}>
         
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: '10px' }}>Applicant Remarks</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={auditNCReport.remarks}
                
disabled
                InputProps={{
                  style: {
                    padding: '10px',
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="row" alignItems="center">
  <Grid item>
    <Typography variant="h6" >
      Applicant NC Document:
    </Typography>
  </Grid>
  <Grid item>
    <a
      onClick={() => downloadfile(auditNCReport.ncs)}
      style={{ textDecoration: 'none', color: 'blue',  }} // Optional styling
    >
      <span>{auditNCReport.ncs}</span>
    </a>
  </Grid>
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
                        <Typography variant='body1'>Attached NC Closure Document (Only PDF and Max allowed size 5 MB)*</Typography>
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

export default ActionTakenByApplicant;
