import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
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

const buildApplicantCriteriaMap = (criteriaList) => {
  const map = new Map();
  if (!Array.isArray(criteriaList)) {
    return map;
  }
  criteriaList.forEach((item) => {
    const key = item?.auditControlId?.split("-")?.[0];
    if (key) {
      map.set(key, item);
    }
  });
  return map;
};

const buildInitialComplianceValues = (criteriaList, criteriaMap) => {
  const initialComplianceValues = {};

  criteriaList.forEach((criteria, criteriaIndex) => {
    criteria.auditSubCriteria?.forEach((subCriteria, subIndex) => {
      let controlCounter = 0;

      subCriteria.auditParameterPayload?.forEach((parameter) => {
        parameter.auditControlPayload?.forEach(() => {
          controlCounter += 1;
          const parameterKey = `3.${criteriaIndex + 1}.${subIndex + 1}.${controlCounter}`;
          const matchedData = criteriaMap.get(parameterKey);
          if (matchedData) {
            initialComplianceValues[parameterKey] = matchedData.compliance || "";
          }
        });
      });
    });
  });

  return initialComplianceValues;
};

const buildInitialRemarksValues = (criteriaList, criteriaMap) => {
  const initialRemarksValues = {};

  criteriaList.forEach((criteria, criteriaIndex) => {
    criteria.auditSubCriteria?.forEach((subCriteria, subIndex) => {
      let controlCounter = 0;

      subCriteria.auditParameterPayload?.forEach((parameter) => {
        parameter.auditControlPayload?.forEach(() => {
          controlCounter += 1;
          const parameterKey = `3.${criteriaIndex + 1}.${subIndex + 1}.${controlCounter}`;
          const matchedData = criteriaMap.get(parameterKey);
          if (matchedData?.remarks) {
            initialRemarksValues[parameterKey] = matchedData.remarks;
          }
        });
      });
    });
  });

  return initialRemarksValues;
};

const SubCriteriaControlsTable = ({
  subCriteria,
  criteriaIndex,
  subIndex,
  applicantCriteriaMap,
  complianceValues,
  remarksValues,
  selectedFiles,
  onRadioChange,
  onFileChange,
  onRemarksChange,
  onSave,
  onDownload,
}) => {
  if (countControlsInSubCriteria(subCriteria) === 0) {
    return (
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
          No audit parameters or controls are configured for this section in Audit Master
          (Admin).
        </Typography>
      </Box>
    );
  }

  let controlCounter = 0;

  return (
    <TableContainer sx={{ marginTop: "10px" }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "tablecolor.main" }}>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Control No.</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Control</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Audit Checks</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Control Type</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>References</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Compliance</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Document</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Remarks</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subCriteria.auditParameterPayload?.map((parameter, paramIndex) => (
            <React.Fragment key={`parameter-${paramIndex}`}>
              <TableRow>
                <TableCell colSpan={9} sx={{ border: 0.5, fontWeight: "bold" }}>
                  {parameter.auditParameter === "No Any Parameter Available"
                    ? ""
                    : parameter.auditParameter}
                </TableCell>
              </TableRow>

              {parameter.auditControlPayload?.map((control, controlIndex) => {
                controlCounter += 1;
                const parameterKey = `3.${criteriaIndex + 1}.${subIndex + 1}.${controlCounter}`;
                const matchedData = applicantCriteriaMap.get(parameterKey);

                return (
                  <TableRow key={`control-${control.auditControllId || controlIndex}`}>
                    <TableCell sx={{ border: 0.5 }}>{parameterKey}</TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      <div dangerouslySetInnerHTML={{ __html: control.auditControl }} />
                    </TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      <div dangerouslySetInnerHTML={{ __html: control.auditCheck }} />
                    </TableCell>
                    <TableCell sx={{ border: 0.5 }}>{control.controlType}</TableCell>
                    <TableCell sx={{ border: 0.5 }}>{control.references}</TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      {["Yes", "No", "N/A"].map((option) => (
                        <FormControlLabel
                          key={option}
                          control={
                            <Radio
                              checked={complianceValues[parameterKey] === option}
                              onChange={() => onRadioChange(option, parameterKey)}
                              value={option}
                              name={`compliance-${parameterKey}`}
                            />
                          }
                          label={option}
                        />
                      ))}
                    </TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      <input type="file" onChange={(event) => onFileChange(event, parameterKey)} />
                      {matchedData?.document ? (
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => onDownload(matchedData.document)}
                          sx={{ display: "block", textTransform: "none" }}
                        >
                          {matchedData.document}
                        </Button>
                      ) : null}
                    </TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      <TextField
                        multiline
                        rows={4}
                        variant="outlined"
                        value={remarksValues[parameterKey] ?? ""}
                        onChange={(e) => onRemarksChange(parameterKey, e.target.value)}
                        fullWidth
                        InputProps={{
                          style: { padding: "5px", width: "150px" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          onSave(`${parameterKey}-${control.auditControllId}`)
                        }
                        disabled={!selectedFiles[parameterKey]}
                      >
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const AuditorControls = () => {
  const { id } = useParams();
  const applicantUserName = decrypt(id);

  const [open, setOpen] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [openSubCriteria, setOpenSubCriteria] = useState({});
  const [radioValue, setRadioValue] = useState({
    compliance: "",
    applicantUserName,
    creteriaId: "",
    remarks: "",
  });
  const [selectedFiles, setSelectedFiles] = useState({});
  const [complianceValues, setComplianceValues] = useState({});
  const [remarksValues, setRemarksValues] = useState({});
  const [errors, setErrors] = useState({});
  const [applicantCriteria, setApplicantCriteria] = useState([]);

  const applicantCriteriaMap = useMemo(
    () => buildApplicantCriteriaMap(applicantCriteria),
    [applicantCriteria]
  );

  const loadPageData = useCallback(async () => {
    if (!applicantUserName) {
      setLoadError("Invalid applicant reference. Please return to the application list and try again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");

    try {
      const [controlResponse, criteriaResponse] = await Promise.all([
        AuditControlService.data(applicantUserName),
        AuditService.getByApplicantUserNames(applicantUserName).catch(() => ({ data: [] })),
      ]);

      const sanitizedControls = sanitizeAuditControlTree(controlResponse.data);
      const savedCriteria = Array.isArray(criteriaResponse.data) ? criteriaResponse.data : [];
      const criteriaMap = buildApplicantCriteriaMap(savedCriteria);

      setAllAuditControlList(sanitizedControls);
      setApplicantCriteria(savedCriteria);
      setComplianceValues(buildInitialComplianceValues(sanitizedControls, criteriaMap));
      setRemarksValues(buildInitialRemarksValues(sanitizedControls, criteriaMap));
    } catch (err) {
      console.error("Failed to load audit controls:", err);
      setLoadError(
        err.response?.data?.message ||
          "Unable to load audit controls. Please refresh or try again later."
      );
      showAlert({
        messageTitle: "Error",
        messageContent: "Error fetching audit control list. Please try again later.",
        confirmText: "OK",
      });
    } finally {
      setLoading(false);
    }
  }, [applicantUserName]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

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

  const handleRadioChange = (value, parameterKey) => {
    setComplianceValues((prev) => {
      const updatedCompliance = { ...prev, [parameterKey]: value };
      setRadioValue((prevRadioValue) => ({
        ...prevRadioValue,
        compliance: updatedCompliance,
      }));
      return updatedCompliance;
    });
  };

  const handleRemarksChange = (parameterKey, value) => {
    setRemarksValues((prev) => ({
      ...prev,
      [parameterKey]: value,
    }));
    setRadioValue((prev) => ({
      ...prev,
      remarks: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      remarks: value === "" ? "remarks cannot be empty" : "",
    }));
  };

  const handleFileChange = (event, controlIndex) => {
    const selectedFile = event.target.files[0];
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [controlIndex]: selectedFile,
    }));
  };

  const resetFormData = () => {
    setRadioValue({ compliance: [], applicantUserName, remarks: "" });
    setSelectedFiles({});
  };

  const saveData = (controlKey) => {
    const formData = new FormData();
    const parameterKey = controlKey.split("-")[0];

    formData.append("controlId", controlKey);
    formData.append("remarks", remarksValues[parameterKey] || "");
    formData.append("compliance", complianceValues[parameterKey] || "");
    formData.append("file", selectedFiles[parameterKey] || "");
    formData.append("applicantUserName", radioValue.applicantUserName);
    formData.append("selectedMultipartFile", "");

    setLoading(true);
    AuditService.AuditNCForm(formData)
      .then((response) => {
        showAlert({
          messageTitle: "Success",
          messageContent: response.data,
          confirmText: "Ok",
        });
        return AuditService.getByApplicantUserNames(applicantUserName);
      })
      .then((response) => {
        const savedCriteria = Array.isArray(response?.data) ? response.data : [];
        const criteriaMap = buildApplicantCriteriaMap(savedCriteria);
        setApplicantCriteria(savedCriteria);
        setRemarksValues((prev) => ({
          ...prev,
          ...buildInitialRemarksValues(allAuditControlList, criteriaMap),
        }));
      })
      .catch((err) => {
        showAlert({
          messageTitle: "Error",
          messageContent:
            err.response?.data?.message || "Request failed. Please try again later.",
          confirmText: "Ok",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure, you want to submit?",
      confirmText: "Yes",
      closeText: "No",
      fullWidth: true,
      maxWidth: "sm",
      onConfirm: () => handleConfrimSubmit(),
    });
  };

  const handleConfrimSubmit = () => {
    const applicantRemarks = new FormData();
    applicantRemarks.append("remarks", radioValue.remarks);
    applicantRemarks.append("applicantUserName", radioValue.applicantUserName);

    setLoading(true);
    AuditService.changeTheStatusByApplicantUserName(applicantRemarks)
      .then((response) => {
        showAlert({
          messageTitle: "Success",
          messageContent: response.data,
          confirmText: "Ok",
          onConfirm: () => {
            window.location.href = "/auditagency/uploadundertaking";
          },
        });
        resetFormData();
      })
      .catch((err) => {
        showAlert({
          messageTitle: "Error",
          messageContent:
            err.response?.data?.message || "Request failed. Please try again later.",
          confirmText: "Ok",
        });
      })
      .finally(() => setLoading(false));
  };

  const downloadfile = async (documentTitle) => {
    if (!documentTitle) {
      return;
    }

    try {
      const response = await AuditService.viewDocumentName(documentTitle);
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", documentTitle);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <FormWrapper headingText="3. Detailed Audit Controls">
      <LoaderProgress open={isLoading} />

      {loadError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      ) : null}

      {!loadError && !isLoading && allAuditControlList.length === 0 ? (
        <Alert severity="info">No audit controls are available for this applicant.</Alert>
      ) : null}

      <Box component="form" noValidate onSubmit={handleSubmit}>
        {allAuditControlList.map((criteria, criteriaIndex) => {
          const criteriaOpen = Boolean(open[criteriaIndex]);

          return (
            <Box key={`criteria-${criteria.auditCriteria}-${criteriaIndex}`} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" sx={{ color: "rgb(80, 0, 0)", flexGrow: 1 }}>
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
                  {criteriaOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              {criteriaOpen ? (
                <Collapse in={criteriaOpen} unmountOnExit>
                  {criteria.auditSubCriteria?.map((subCriteria, subIndex) => {
                    const subKey = `${criteriaIndex}-${subIndex}`;
                    const subOpen = Boolean(openSubCriteria[subKey]);

                    return (
                      <Box key={`subCriteria-${subCriteria.auditSubCriteriaId || subIndex}`} sx={{ ml: 2, mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="h6"
                            sx={{ color: "rgb(80, 0, 0)", mb: 2, flexGrow: 1 }}
                          >
                            {`3.${criteriaIndex + 1}.${subIndex + 1}. ${subCriteria.auditSubCriteria}`}
                          </Typography>
                          <IconButton
                            onClick={() => handleToggleSubCriteria(criteriaIndex, subIndex)}
                            size="small"
                            disableRipple
                            sx={{
                              backgroundColor: "info.main",
                              color: "white",
                            }}
                          >
                            {subOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>

                        {subOpen ? (
                          <Collapse in={subOpen} unmountOnExit>
                            <SubCriteriaControlsTable
                              subCriteria={subCriteria}
                              criteriaIndex={criteriaIndex}
                              subIndex={subIndex}
                              applicantCriteriaMap={applicantCriteriaMap}
                              complianceValues={complianceValues}
                              remarksValues={remarksValues}
                              selectedFiles={selectedFiles}
                              onRadioChange={handleRadioChange}
                              onFileChange={handleFileChange}
                              onRemarksChange={handleRemarksChange}
                              onSave={saveData}
                              onDownload={downloadfile}
                            />
                          </Collapse>
                        ) : null}
                      </Box>
                    );
                  })}
                </Collapse>
              ) : null}
            </Box>
          );
        })}

        {allAuditControlList.length > 0 ? (
          <Grid container justifyContent="center" sx={{ mt: 4 }} spacing={2}>
            <Grid item>
              <Button type="submit" variant="contained" sx={{ maxWidth: "120px" }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </Box>
    </FormWrapper>
  );
};

export default AuditorControls;
