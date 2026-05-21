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

const AuditorControls = () => {
  const { id } = useParams();
  const ApplicantUserName = decrypt(id);
  console.log("ApplicantUserName"+ApplicantUserName)
  const [open, setOpen] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [radioValue, setRadioValue] = useState({
    compliance: "",
    applicantUserName: ApplicantUserName,
    creteriaId:'',
    remarks:'',
  });
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

  alert()

  applicantRemarks.append("remarks",radioValue.remarks);
  applicantRemarks.append("applicantUserName",ApplicantUserName);

  AuditService.changeTheStatusByApplicantUserName(applicantRemarks)
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
      const response = await AuditService.viewDocumentName(documentTitle);

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


  return (
    <>
      <LoaderProgress open={isLoading} />
      <FormWrapper headingText="Auditors Controls">
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom sx={{ color: 'rgb(80, 0, 0)' }}>
            3. Detailed Audit Controls
          </Typography>

          {allAuditControlList.map((criteria, criteriaIndex) => (
            <React.Fragment key={`criteria-${criteriaIndex}`}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h5" sx={{ color: "rgb(80, 0, 0)", flexGrow: 1 }}>
                    {`3.${criteriaIndex + 1}. ${criteria.auditCriteria}`}
                  </Typography>
                  <IconButton onClick={() => handleToggle(criteriaIndex)} sx={{ backgroundColor: "rgb(120, 0, 0)", color: "white" }}>
                    {open[criteriaIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={open[criteriaIndex]}>
                  {criteria.auditSubCriteria?.map((subCriteria, subIndex) => (

                    <React.Fragment key={`subCriteria-${subIndex}`}>
                      <Box sx={{ ml: 2, mt: 1 }}>
                        <Typography variant="h6" sx={{ color: "rgb(80, 0, 0)", mb: 2 }}>
                          {`3.${criteriaIndex + 1}.${subIndex + 1}. ${subCriteria.auditSubCriteria}`}
                        </Typography>
                      </Box>

                      <TableContainer sx={{ marginTop: "10px" }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "tablecolor.main" }}>
                              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Control No.</TableCell>
                              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Control</TableCell>
                              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Audit Checks</TableCell>
                              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Control Type</TableCell>
                              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>References</TableCell>
                              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Compliance</TableCell>
                              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Document</TableCell>
                              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {subCriteria.auditParameterPayload?.map((parameter, paramIndex) => {

                              return(
                              <React.Fragment key={`parameter-${paramIndex}`}>
                               <TableRow
  sx={{
    pointerEvents: parameter.isDisabled ? "none" : "auto", // Disable interaction if `isDisabled` is true
    opacity: parameter.isDisabled ? 0.5 : 1,             // Reduce opacity for a disabled look
  }}
>
  <TableCell
    colSpan={8}
    sx={{
      border: 0.5,
      fontWeight: "bold",
      color: parameter.isDisabled ? "gray" : "inherit",  // Muted color if disabled
    }}
  >
    {parameter.auditParameter}
  </TableCell>
</TableRow>

                                {parameter.auditControlPayload?.map((control, controlIndex) => {

                                  return(
                                  <TableRow key={`control-${controlIndex}`}>
                                    <TableCell sx={{ border: 0.5 }}>
                                      {`3.${subIndex + 1}.${paramIndex + 1}.${controlIndex + 1}`}
                                    </TableCell>
                                    <TableCell sx={{ border: 0.5 }}>
                                      <div dangerouslySetInnerHTML={{ __html: control.auditControl }} />
                                    </TableCell>
                                    <TableCell sx={{ border: 0.5 }}>
                                      <div dangerouslySetInnerHTML={{ __html: control.auditCheck }} />
                                    </TableCell>
                                    <TableCell sx={{ border: 0.5 }}>{control.controlType}</TableCell>
                                    <TableCell sx={{ border: 0.5 }}>{control.references}</TableCell>
                                    <TableCell sx={{ border: 0.5 }}>

                                      
  <FormControlLabel
    control={
      <Radio
        checked={complianceValues[controlIndex] === "Yes"} // Check if the compliance value for this row is "Yes"
        onChange={() => handleRadioChange("Yes", controlIndex)} // Update the compliance value for this row
        value="Yes" // Set the value for "Yes"
        name={`compliance-${controlIndex}`} // Unique name for each radio group
      />
    }
    label="Yes"
  />
  <FormControlLabel
    control={
      <Radio
        checked={complianceValues[controlIndex] === "No"} // Check if the compliance value for this row is "No"
        onChange={() => handleRadioChange("No", controlIndex)} // Update the compliance value for this row
        value="No" // Set the value for "No"
        name={`compliance-${controlIndex}`}
      />
    }
    label="No"
  />
  <FormControlLabel
    control={
      <Radio
        checked={complianceValues[controlIndex] === "N/A"} // Check if the compliance value for this row is "N/A"
        onChange={() => handleRadioChange("N/A", controlIndex)} // Update the compliance value for this row
        value="N/A" // Set the value for "N/A"
        name={`compliance-${controlIndex}`}
      />
    }
    label="N/A"
  />
</TableCell>

                                    <TableCell sx={{ border: 0.5 }}>
                                      <input type="file" onChange={(event) => handleFileChange(event, controlIndex)} />
                                      {/* {<span>{fileName[controlIndex]}</span>} */}

                                      <a 
        onClick={() => downloadfile( fileName[controlIndex])} 
        style={{ textDecoration: 'none', color: 'blue' }} // Optional styling
    >
        <span>{fileName[controlIndex]}</span>
    </a>
                                    </TableCell>
                                    <TableCell sx={{ border: 0.5 }}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => saveData(control.auditControllId)}
                                        disabled={!selectedFiles[controlIndex]} // Disable if file is not selected for this row
                                      >
                                        Save
                                      </Button>
                                    </TableCell>
                                  </TableRow>













                                )})}
                              </React.Fragment>









                            )})}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </React.Fragment>
                  ))}
                </Collapse>
              </Box>
            </React.Fragment>
          ))}

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

export default AuditorControls;
