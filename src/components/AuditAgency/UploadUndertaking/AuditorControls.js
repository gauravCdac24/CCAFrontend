import React, { useEffect, useState, useRef } from "react";
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



const parseVisible = (value) => {
  if (value === true || value === "TRUE" || value === "true" || value === "Yes" || value === "yes") {
    return true;
  }
  if (value === false || value === "FALSE" || value === "false" || value === "No" || value === "no") {
    return false;
  }
  return null;
};

/** Hide only when Admin explicitly set Inactive or Visible = No. Otherwise keep the row. */
const shouldHideSubCriteria = (subCriteria) => {
  if (!subCriteria) {
    return true;
  }
  const statusRaw = subCriteria.status;
  if (statusRaw != null && String(statusRaw).trim() !== "") {
    if (String(statusRaw).trim().toLowerCase() === "inactive") {
      return true;
    }
  }
  const visible = parseVisible(subCriteria.visible ?? subCriteria.isVisible);
  return visible === false;
};

const sanitizeAuditControlTree = (criteriaList) => {
  if (!Array.isArray(criteriaList)) {
    return [];
  }
  return criteriaList
    .map((criteria) => ({
      ...criteria,
      auditSubCriteria: (criteria.auditSubCriteria || []).filter(
        (subCriteria) => !shouldHideSubCriteria(subCriteria)
      ),
    }))
    .filter((criteria) => criteria.auditSubCriteria.length > 0);
};

const countControlsInSubCriteria = (subCriteria) => {
  if (!subCriteria?.auditParameterPayload?.length) {
    return 0;
  }
  return subCriteria.auditParameterPayload.reduce(
    (total, parameter) => total + (parameter?.auditControlPayload?.length || 0),
    0
  );
};

const AuditorControls = () => {
  const { id } = useParams();
  const ApplicantUserName = decrypt(id);
  const [lastSubIndex, setLastSubIndex] = useState(null);
  //alert(ApplicantUserName);
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
  const [controlsAssigned, setControlsAssigned] = useState(false); // Track if controls have been assigned
  let controlCounter = 0;
  
  // Function to assign all active audit criteria to the applicant
  const assignAuditControlsToApplicant = async () => {
    try {
      // Get all active audit criteria from admin service
      const criteriaResponse = await AuditControlService.getAllAuditControlList();
      const allCriteria = criteriaResponse.data || [];
      
      if (allCriteria.length === 0) {
        console.log("No audit criteria found in the system");
        return;
      }
      
      // Filter only active criteria and create request objects
      const activeCriteria = allCriteria.filter(c => c.status === "Active");
      
      // Create the request payload with criteriaId (using auditCriteriaId from the response)
      const auditControlRequests = activeCriteria.map(criteria => ({
        controlId: criteria.auditControlId, // Use the control ID
        userName: ApplicantUserName,
        status: "Active"
      }));
      
      if (auditControlRequests.length > 0) {
        // Call the save-audit-control endpoint to assign controls to the applicant
        await AuditService.addNewAuditControl(auditControlRequests);
        console.log("Audit controls assigned to applicant:", ApplicantUserName);
      }
    } catch (error) {
      console.error("Error assigning audit controls:", error);
      // Don't show error to user - this is a background operation
    }
  };
  
  // Fetching audit control data
  const getAllAuditControl = async () => {
    setLoading(true);
    try {
      // First, ensure controls are assigned to this applicant
      if (!controlsAssigned) {
        await assignAuditControlsToApplicant();
        setControlsAssigned(true);
      }
      
      const response = await AuditControlService.data(ApplicantUserName);
      setAllAuditControlList(sanitizeAuditControlTree(response.data));
    } catch (err) {
      showAlert({
        messageTitle: 'Error',
        messageContent: 'Error fetching audit control list. Please try again later.',
        confirmText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAuditControl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (index) => {
    setOpen((prev) => {
      const updatedOpen = [...prev];
      updatedOpen[index] = !updatedOpen[index];
      return updatedOpen;
    });
  };

  const [complianceValues, setComplianceValues] = useState([]); // Array to track compliance for each row

  const handleRadioChange = (value, parameterKey) => {
    setComplianceValues((prev) => {
      const updatedCompliance = { ...prev };
      updatedCompliance[parameterKey] = value;
  
      console.log("Updated Compliance Values:", updatedCompliance);
  
      setRadioValue((prevRadioValue) => {
        const newRadioValue = {
          ...prevRadioValue,
          compliance: updatedCompliance,
        };
        console.log("Updated Radio Values:", newRadioValue);
        return newRadioValue;
      });
  
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
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [`${controlIndex}`]: selectedFile,
  }));
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
    formData.append("remarks", radioValue.remarks);


const validCompliance = radioValue?.compliance[id.split('-')[0]];
formData.append('compliance', validCompliance);

const validFile = selectedFiles[id.split('-')[0]];
formData.append('file', validFile);
    
    formData.append("applicantUserName", radioValue.applicantUserName);
    

    // Append valid files to formData
    
        formData.append('selectedMultipartFile', '');
    
    
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

const getByApplicantUserNames = () => {
  //setLoading(true);
  AuditService.getByApplicantUserNames(ApplicantUserName)
    .then((response) => {
      setApplicantCriteria(response.data);
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
  getByApplicantUserNames();
}, []);



const handleSubmit = (e) => {
  e.preventDefault()

  // if (!radioValue.remarks || radioValue.remarks.trim() === "") {
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     remarks: "Please enter the remarks",
  //   }));
  //   return;
  // }
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
const handleToggleSubCriteria = (criteriaIndex, subIndex) => {
  const key = `${criteriaIndex}-${subIndex}`;
  setOpenSubCriteria((prevState) => ({
    ...prevState,
    [key]: !prevState[key],
  }));
};




const handleConfrimSubmit = () => {
  
  const applicantRemarks=new FormData();

  applicantRemarks.append("remarks",radioValue.remarks);
  applicantRemarks.append("applicantUserName",radioValue.applicantUserName);

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

useEffect(() => {
  const initialComplianceValues = {};
  
  allAuditControlList.forEach((criteria, criteriaIndex) => {
    criteria.auditSubCriteria?.forEach((subCriteria, subIndex) => {
      let controlCounter = 0; // Reset controlCounter for each subCriteria
      
      subCriteria.auditParameterPayload?.map(
        (parameter, paramIndex) => {
          parameter.auditControlPayload?.map(
            (control, controlIndex) => {
          controlCounter++; // Increment for each control

          const parameterKey = `3.${criteriaIndex + 1}.${subIndex + 1}.${controlCounter}`;
//console.log(parameterKey)
          const matchedData = applicantCriteria.find(
            (item) => item.auditControlId.split("-")[0] === parameterKey
          );

          if (matchedData) {
            initialComplianceValues[parameterKey] = matchedData?.compliance || "";
          }
        });
      });
    });
  });

  setComplianceValues(initialComplianceValues);
}, [allAuditControlList, applicantCriteria]);




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
                    disableRipple 
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
                     controlCounter = 0,
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
                          size="small"
                          disableRipple 
                          sx={{
                            backgroundColor: "info.main",
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
                        {countControlsInSubCriteria(subCriteria) === 0 ? (
                          <Box
                            sx={{
                              ml: 2,
                              mt: 2,
                              mb: 2,
                              p: 2,
                              border: "1px dashed #cfcfcf",
                              borderRadius: 1,
                              backgroundColor: "#fafafa",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              No audit parameters or controls are configured for this section in
                              Audit Master (Admin). The expand panel only renders rows from
                              linked Audit Parameters and Audit Controls — there is no separate
                              form component for this point in this screen.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Ask your administrator to add Audit Parameter(s) and Audit
                              Control(s) under this sub-criteria, or use the annexure / report
                              upload area on the NC Report screen where applicable (e.g. Annexure
                              VI, Annexure VIII).
                            </Typography>
                          </Box>
                        ) : (
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
                                      sx={{
                                        border: 0.5,
                                        fontWeight: "bold",
                                        
                                      }}
                                    >
                                      {parameter.auditParameter === "No Any Parameter Available" ? "" : parameter.auditParameter}
                                    </TableCell>
                                  </TableRow>

                                    {parameter.auditControlPayload?.map(
                                      (control, controlIndex) => {

                                        controlCounter++;

                                        const parameterKey = `3.${
                                          criteriaIndex + 1
                                        }.${subIndex + 1}.${controlCounter}`;

                                        const matchedData = applicantCriteria.find(
                                          (item) => item.auditControlId.split("-")[0] === parameterKey
                                        );
                                
                                      // complianceValues[controlIndex] = matchedData?.compliance || ""; 

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
                                                    checked={complianceValues[parameterKey] === "Yes"} // Check if the compliance value for this row is "Yes"
                                                    onChange={() => handleRadioChange("Yes", parameterKey)} 
                                                    value="Yes" 
                                                    name={`compliance-${parameterKey}`} 
                                                  />
                                                }
                                                label="Yes"
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Radio
                                                    checked={complianceValues[parameterKey] === "No"}
                                                    onChange={() => handleRadioChange("No", parameterKey)} 
                                                    value="No"
                                                    name={`compliance-${parameterKey}`}
                                                  />
                                                }
                                                label="No"
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Radio
                                                    checked={complianceValues[parameterKey] === "N/A"} 
                                                    onChange={() => handleRadioChange("N/A", parameterKey)} 
                                                    value="N/A" 
                                                    name={`compliance-${parameterKey}`}
                                                  />
                                                }
                                                label="N/A"
                                              />
                                          </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                      <input type="file" onChange={(event) => handleFileChange(event, parameterKey)} />
                                   

                                      <a 
                                            onClick={() => downloadfile(  matchedData?.document || '')} 
                                            style={{ textDecoration: 'none', color: 'blue' }} // Optional styling
                                        >
                                            <span>{ matchedData?.document || ''}</span>
                                        </a>
                                    </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              <TextField
                                                multiline
                                                rows={10}
                                                variant="outlined"
                                               value={matchedData?.remarks}
                                                onChange={(e) => handleChanges(e, "remarks")}
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
                                        onClick={() => saveData(`${parameterKey}-${control.auditControllId}`)}
                                        disabled={!selectedFiles[parameterKey]} // Disable if file is not selected for this row
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
                        )}
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
          </Grid>
        </Box>
      )}
    </>
  );
};


export default AuditorControls;
