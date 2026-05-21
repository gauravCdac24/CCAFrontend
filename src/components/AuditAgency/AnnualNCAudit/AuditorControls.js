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
import AnnualAuditService from "../../../service/AnnualAuditService/AnnualAuditService";

const AuditorControls = () => {
  const { id } = useParams();
  const ApplicantUserName = decrypt(id);
  const [open, setOpen] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [openSubCriteria, setOpenSubCriteria] = useState({});
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
        console.log("allAuditControlList===>", response.data);
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
  }, []);

  const handleToggle = (index) => {
    setOpen((prev) => {
      const updatedOpen = [...prev];
      updatedOpen[index] = !updatedOpen[index];
      return updatedOpen;
    });
  };

  const handleToggleSubCriteria = (criteriaIndex, subIndex) => {
    const key = `${criteriaIndex}-${subIndex}`;
    setOpenSubCriteria((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const [complianceValues, setComplianceValues] = useState({}); // Array to track compliance for each row

  const handleRadioChange = (value, controlIndex) => {
    setComplianceValues((prev) => {
      // Create a shallow copy of the array
      const updatedCompliance = [...prev];
  
      // Update the value at the specific controlIndex
      updatedCompliance[controlIndex] = value;
  
      console.log("Updated Compliance Array:", updatedCompliance);
  
      // Dynamically update `radioValue` state
      setRadioValue((prevRadio) => ({
        ...prevRadio,
        compliance: updatedCompliance, // Ensure compliance has only updated values
      }));
  
      return updatedCompliance; // Return the updated array as the new state
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
    console.log("formData===>",radioValue.compliance)

    const validCompliance = Object.entries(complianceValues)
    .filter(([key, value]) => value) // Non-empty values only
    .map(([key, value]) => ({ key, value }));

  validCompliance.forEach(({ key, value }) => {
    formData.append(`compliance`, value);
    console.log(`Appended: compliance[${key}] = ${value}`);
  });


console.log("validCompliance===>",validCompliance[id])
// Append valid values to formData

    //formData.append('compliance', validCompliance[id]|| ''); 

    
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
    AnnualAuditService.AuditNCForm(formData)
        .then((response) => {
          //console.log(response.data)
            showAlert({
                messageTitle: 'Success',
                messageContent: response.data,
                confirmText: 'Ok',
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
};
//temporary state
const [applicantCriteria, setApplicantCriteria] = useState([]);
const[fileName,setFileName]=useState([]);


useEffect(() => {
  getAllCriteria();
}, []);

const getAllCriteria = () => {
  AnnualAuditService.getAllDatas()
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

                      //suggested by mk
                      const obj={
                        compliance: matchedControl.compliance,
                        auditControlId: matchedControl.auditControlId,
                        file: null,
                        document: matchedControl.document,
                        criteriaId: matchedControl.criteriaId,
                      }
                      emp.push(obj)
                      //

                      //emp.push(matchedControl.compliance)
                      fileNames.push(matchedControl.document)
                      criteriaId.push(matchedControl.criteriaId)
                     
                    }else{

                       //suggested by mk
                       const obj={
                        compliance: '',
                        auditControlId: control.auditControllId,
                        file: null,
                        document: '',
                        criteriaId: '',
                      }
                      emp.push(obj)
                   

                       const newObj='';
                      // emp.push(newObj)
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
       // compliance: emp,
        creteriaId:criteriaId,
      }));
      setFileName(fileNames)

    })
    .catch((error) => {
      // Handle error if necessary
      console.error("Error fetching data:", error);
    });
};





const handleSubmit = (e) => {
  e.preventDefault()
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
  

  AnnualAuditService.downloadAuditorReport()
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
      downloadApplicationForm();
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

const downloadApplicationForm = async () => {
  try {

      const response = await  AnnualAuditService.downloadAuditorReport();
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers['content-disposition'];
      const filename = "ApplicationForm";

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  } catch (error) {
      console.error('Error viewing file:', error);
  }
};




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
      {isLoading && <LoaderProgress open={isLoading} />}
      {!isLoading && (
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom sx={{ color: "rgb(80, 0, 0)" }}>
            3. Detailed Audit Controls
          </Typography>
          {allAuditControlList.map((criteria, criteriaIndex) => (
            <React.Fragment key={`criteria-${criteriaIndex}`}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="h5"
                    sx={{ color: "rgb(80, 0, 0)", flexGrow: 1 }}
                  >
                    {`3.${criteriaIndex + 1}. ${criteria.auditCriteria}`}
                  </Typography>
                  <IconButton
                    onClick={() => handleToggle(criteriaIndex)}
                    sx={{
                      backgroundColor: "rgb(120, 0, 0)",
                      color: "white",
                    }}
                  >
                    {open[criteriaIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                <Collapse in={open[criteriaIndex]}>
                  {criteria.auditSubCriteria?.map((subCriteria, subIndex) => (
                    <React.Fragment key={`subCriteria-${subIndex}`}>
                      <Box
                        sx={{
                          ml: 2,
                          mt: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "rgb(80, 0, 0)", mb: 2, flexGrow: 1 }}
                        >
                          {`3.${criteriaIndex + 1}.${subIndex + 1}. ${subCriteria.auditSubCriteria}`}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            handleToggleSubCriteria(criteriaIndex, subIndex)
                          }
                          sx={{
                            backgroundColor: "rgb(120, 0, 0)",
                            color: "white",
                          }}
                        >
                          {openSubCriteria[`${criteriaIndex}-${subIndex}`] ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Box>
                      <Collapse in={openSubCriteria[`${criteriaIndex}-${subIndex}`]}>
                        <TableContainer sx={{ marginTop: "10px" }}>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: "tablecolor.main" }}>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Control No.
                                </TableCell>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Control
                                </TableCell>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Audit Checks
                                </TableCell>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Control Type
                                </TableCell>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  References
                                </TableCell>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Compliance
                                </TableCell>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Document
                                </TableCell>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Remarks
                                </TableCell>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {subCriteria.auditParameterPayload?.map(
                                (parameter, paramIndex) => (
                                  <React.Fragment key={`parameter-${paramIndex}`}>
                                    <TableRow>
                                      <TableCell
                                        colSpan={9}
                                        sx={{ border: 0.5, fontWeight: "bold" }}
                                      >
                                        {parameter.auditParameter}
                                      </TableCell>
                                    </TableRow>
                                    {parameter.auditControlPayload?.map(
                                      (control, controlIndex) => {
                                        const parameterKey = `3.${criteriaIndex + 1}.${
                                          subIndex + 1
                                        }.${paramIndex + 1}.${controlIndex + 1}`;
                                        return (
                                          <TableRow key={`control-${controlIndex}`}>
                                            <TableCell sx={{ border: 0.5 }}>
                                              {parameterKey}
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html: control.auditControl,
                                                }}
                                              />
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html: control.auditCheck,
                                                }}
                                              />
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              {control.controlType}
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              {control.references}
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              <FormControlLabel
                                                control={
                                                  <Radio
                                                    checked={
                                                      complianceValues[parameterKey] === "Yes"
                                                    }
                                                    onChange={() =>
                                                      handleRadioChange("Yes", parameterKey)
                                                    }
                                                    value="Yes"
                                                    name={`compliance-${parameterKey}`}
                                                  />
                                                }
                                                label="Yes"
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Radio
                                                    checked={
                                                      complianceValues[parameterKey] === "No"
                                                    }
                                                    onChange={() =>
                                                      handleRadioChange("No", parameterKey)
                                                    }
                                                    value="No"
                                                    name={`compliance-${parameterKey}`}
                                                  />
                                                }
                                                label="No"
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Radio
                                                    checked={
                                                      complianceValues[parameterKey] === "N/A"
                                                    }
                                                    onChange={() =>
                                                      handleRadioChange("N/A", parameterKey)
                                                    }
                                                    value="N/A"
                                                    name={`compliance-${parameterKey}`}
                                                  />
                                                }
                                                label="N/A"
                                              />
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              <input
                                                type="file"
                                                onChange={(event) =>
                                                  handleFileChange(event, parameterKey)
                                                }
                                              />
                                              {fileName[parameterKey] && (
                                                <a
                                                  onClick={() =>
                                                    console.log("Download:", fileName[parameterKey])
                                                  }
                                                  style={{
                                                    textDecoration: "none",
                                                    color: "blue",
                                                  }}
                                                >
                                                  <span>{fileName[parameterKey]}</span>
                                                </a>
                                              )}
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              <TextField
                                                multiline
                                                rows={10}
                                                variant="outlined"
                                                fullWidth
                                                InputProps={{
                                                  style: { padding: "5px", width: "150px"  },
                                                }}
                                              ></TextField>
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => saveData(parameterKey)}
                                                disabled={!selectedFiles[parameterKey]}
                                              >
                                                Save
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )}
                                  </React.Fragment>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </Collapse>
              </Box>
            </React.Fragment>
          ))}
          <Grid container justifyContent="center" sx={{ mt: 4 }} spacing={2}>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                sx={{ maxWidth: "120px" }}
              >
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="button"
                color="reset"
                variant="contained"
                sx={{ maxWidth: "120px", color: "#FFFFFF" }}
                onClick={() => console.log("Reset")}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default AuditorControls;
