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
import useAnnualAuditRoute from "../../global/util/useAnnualAuditRoute";
import AuditService from "../../../service/AuditService/AuditService";
import AnnualAuditService from "../../../service/AnnualAuditService/AnnualAuditService";

const AuditorControls = () => {
  const { userName: ApplicantUserName } = useAnnualAuditRoute();
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
  const [selectedFiles, setSelectedFiles] = useState({}); // Track files per control key

  // Fetching audit control data
  const getAllAuditControl = () => {
    setLoading(true);
    AuditControlService.data(ApplicantUserName)
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

  const handleRadioChange = (value, parameterKey) => {
    setComplianceValues((prev) => {
      const updatedCompliance = { ...prev, [parameterKey]: value };

      setRadioValue((prevRadio) => ({
        ...prevRadio,
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
  const handleFileChange = (event, parameterKey) => {
    const selectedFile = event.target.files[0];
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [parameterKey]: selectedFile,
    }));
  };

  console.log("gdhfj===>",radioValue , "uwyeio++++====>",selectedFiles)

// Function to reset the form data
const resetFormData = () => {
  setRadioValue({ compliance: {}, applicantUserName: ApplicantUserName, creteriaId: '', remarks: '' });
  setSelectedFiles({});
  setComplianceValues({});
  setErrors({});
};

  const saveData = (id) => {
    const parameterKey = id.split('-')[0];
    const validCompliance = complianceValues[parameterKey] || '';
    const validFile = selectedFiles[parameterKey];

    if (!validFile) {
      showAlert({
        messageTitle: 'Error',
        messageContent: 'Please upload a document before saving.',
        confirmText: 'Ok',
      });
      return;
    }

    const formData = new FormData();
    formData.append('controlId', id);
    formData.append('compliance', validCompliance);
    formData.append('file', validFile);
    formData.append('applicantUserName', radioValue.applicantUserName);
    formData.append('selectedMultipartFile', fileName[parameterKey] || '');

    setLoading(true);
    AnnualAuditService.AuditNCForm(formData)
        .then((response) => {
            showAlert({
                messageTitle: 'Success',
                messageContent: response.data,
                confirmText: 'Ok',
            });
        })
        .catch((err) => {
            const errorMessage = err.response?.data?.message || err.response?.data || 'Request failed. Please try again later.';
            showAlert({
                messageTitle: 'Error',
                messageContent: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
                confirmText: 'Ok',
            });
        })
        .finally(() => setLoading(false));
};
//temporary state
const [applicantCriteria, setApplicantCriteria] = useState([]);
const [fileName, setFileName] = useState({});


useEffect(() => {
  if (allAuditControlList?.length > 0) {
    getAllCriteria();
  }
}, [allAuditControlList]);

const getAllCriteria = () => {
  AnnualAuditService.getAllDatas()
    .then((response) => {
      const getAllData = response.data || [];
      setApplicantCriteria(getAllData);

      const complianceMap = {};
      const fileNamesMap = {};
      const criteriaIdMap = {};

      allAuditControlList?.forEach((criteria, criteriaIndex) => {
        criteria?.auditSubCriteria?.forEach((subCriteria, subIndex) => {
          subCriteria?.auditParameterPayload?.forEach((parameter, paramIndex) => {
            parameter?.auditControlPayload?.forEach((control, controlIndex) => {
              const parameterKey = `3.${criteriaIndex + 1}.${subIndex + 1}.${paramIndex + 1}.${controlIndex + 1}`;
              const controlRef = `${parameterKey}-${control.auditControllId}`;
              const matchedControl = getAllData.find(
                (data) => String(data.auditControlId) === controlRef
              );

              if (matchedControl) {
                complianceMap[parameterKey] = matchedControl.compliance || '';
                fileNamesMap[parameterKey] = matchedControl.document || '';
                criteriaIdMap[parameterKey] = matchedControl.criteriaId || '';
              }
            });
          });
        });
      });

      setComplianceValues(complianceMap);
      setFileName(fileNamesMap);
      setRadioValue((prev) => ({
        ...prev,
        creteriaId: criteriaIdMap,
      }));
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};





const handleSubmit = (e) => {
  e.preventDefault();

  if (!radioValue.remarks || radioValue.remarks.trim() === '') {
    setErrors((prevErrors) => ({
      ...prevErrors,
      remarks: 'Please enter the remarks',
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
  });
};

const downloadApplicationForm = (response) => {
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'AuditorReport.pdf');
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

const handleConfrimSubmit = () => {
  const applicantRemarks = new FormData();
  applicantRemarks.append('remarks', radioValue.remarks);
  applicantRemarks.append('applicantUserName', radioValue.applicantUserName);

  setLoading(true);

  AnnualAuditService.changeTheStatusByApplicantUserName(applicantRemarks)
    .then(() => AnnualAuditService.downloadAuditorReport(ApplicantUserName))
    .then((response) => {
      downloadApplicationForm(response);
      showAlert({
          messageTitle: 'Success',
          messageContent: 'Remarks submitted and auditor report generated successfully.',
          confirmText: 'Ok',
          onConfirm: () => { window.location.href = '/auditagency/uploadannualundertaking'; },
      });
      resetFormData();
    })
    .catch((err) => {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Request failed. Please try again later.';
      showAlert({
          messageTitle: 'Error',
          messageContent: typeof errorMessage === 'string' ? errorMessage : 'Request failed. Please try again later.',
          confirmText: 'Ok',
      });
    })
    .finally(() => setLoading(false));
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
                                                onClick={() => saveData(`${parameterKey}-${control.auditControllId}`)}
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

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: '10px' }}>Remarks</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={radioValue.remarks}
                onChange={(e) => handleChanges(e, 'remarks')}
                InputProps={{
                  style: {
                    padding: '10px',
                  },
                }}
                error={!!errors.remarks}
                helperText={errors.remarks || ''}
              />
            </Grid>
          </Grid>

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
