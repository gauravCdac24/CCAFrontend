import React, { useEffect, useState } from "react";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import AuditControlService from "../../../service/AdminService/AuditControlService";
import showAlert from "../../global/common/MessageBox/AlertService";
import LoaderProgress from "../../global/common/LoaderProgress";
import FormWrapper from "../../global/util/FormWrapper";
import useAnnualAuditRoute from "../../global/util/useAnnualAuditRoute";
import AnnualAuditService from "../../../service/AnnualAuditService/AnnualAuditService";

const VisuallyHiddenInput = styled("input")({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  border: "0",
});

const extractMasterControlId = (auditControlId) => {
  if (auditControlId == null) {
    return "";
  }
  const value = String(auditControlId).trim();
  const lastDash = value.lastIndexOf("-");
  if (lastDash >= 0 && lastDash < value.length - 1) {
    return value.substring(lastDash + 1).trim();
  }
  return value;
};

const filterTreeByControlIds = (tree, idSet) => {
  if (!Array.isArray(tree) || !(idSet instanceof Set) || idSet.size === 0) {
    return [];
  }

  return tree
    .map((criteria) => ({
      ...criteria,
      auditSubCriteria: (criteria.auditSubCriteria || [])
        .map((subCriteria) => ({
          ...subCriteria,
          auditParameterPayload: (subCriteria.auditParameterPayload || [])
            .map((parameter) => ({
              ...parameter,
              auditControlPayload: (parameter.auditControlPayload || []).filter((control) => {
                const masterId = String(control?.auditControllId ?? "").trim();
                return masterId && idSet.has(masterId);
              }),
            }))
            .filter((parameter) => (parameter.auditControlPayload || []).length > 0),
        }))
        .filter((subCriteria) => (subCriteria.auditParameterPayload || []).length > 0),
    }))
    .filter((criteria) => (criteria.auditSubCriteria || []).length > 0);
};

const collectRelevantMasterControlIds = (criteriaRows, actionRows) => {
  const ids = new Set();

  (criteriaRows || []).forEach((item) => {
    const masterId = extractMasterControlId(item?.auditControlId);
    if (masterId) {
      ids.add(masterId);
    }
  });

  (actionRows || []).forEach((item) => {
    const raw = item?.auditReportCriteriaEntity?.auditControlId;
    const masterId = extractMasterControlId(raw);
    if (masterId) {
      ids.add(masterId);
    }
  });

  return ids;
};

const ActionTakenByApplicant = () => {
  const { userName: ApplicantUserName } = useAnnualAuditRoute();
  const userName = useSelector((state) => state.jwtAuthentication.username);
  const rejectLockKey = `annual-nc-review-rejected:${ApplicantUserName}`;

  const [open, setOpen] = useState([]);
  const [openSubCriteria, setOpenSubCriteria] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [controlsLoadError, setControlsLoadError] = useState("");
  const [applicantCriteria, setApplicantCriteria] = useState([]);
  const [applicantActionTaken, setApplicantActionTaken] = useState([]);
  const [complianceValues, setComplianceValues] = useState({});
  const [auditorRemarksByControl, setAuditorRemarksByControl] = useState({});
  const [initialAuditorRemarks, setInitialAuditorRemarks] = useState({});
  const [closureFiles, setClosureFiles] = useState({});
  const [closureFileNames, setClosureFileNames] = useState({});
  const [ncReviewRejected, setNcReviewRejected] = useState(
    () => sessionStorage.getItem(`annual-nc-review-rejected:${ApplicantUserName}`) === "1"
  );
  const [auditNCReport, setAuditNCReport] = useState({});

  const expandNcControlSections = (criteriaList) => {
    if (!Array.isArray(criteriaList) || criteriaList.length === 0) {
      setOpen([]);
      setOpenSubCriteria({});
      return;
    }

    const openCriteria = [];
    const openSubs = {};

    criteriaList.forEach((criteria, criteriaIndex) => {
      const subList = criteria?.auditSubCriteria || [];
      let criteriaHasControls = false;

      subList.forEach((subCriteria, subIndex) => {
        const controlCount = (subCriteria?.auditParameterPayload || []).reduce(
          (total, parameter) => total + (parameter?.auditControlPayload?.length || 0),
          0
        );
        if (controlCount > 0) {
          criteriaHasControls = true;
          openSubs[`${criteriaIndex}-${subIndex}`] = true;
        }
      });

      openCriteria[criteriaIndex] = criteriaHasControls || subList.length > 0;
    });

    setOpen(openCriteria);
    setOpenSubCriteria(openSubs);
  };

  useEffect(() => {
    const loadControls = async () => {
      if (!ApplicantUserName) {
        return;
      }
      setLoading(true);
      setControlsLoadError("");
      try {
        const [treeResponse, criteriaResponse, actionResponse] = await Promise.all([
          AuditControlService.data(ApplicantUserName, { includeAllControls: true }).catch(() => ({ data: [] })),
          AnnualAuditService.getReportCriteriaByApplicant(ApplicantUserName).catch(() => ({ data: [] })),
          AnnualAuditService.getApplicantActionTaken(ApplicantUserName).catch(() => ({ data: [] })),
        ]);

        const criteriaRows = Array.isArray(criteriaResponse?.data) ? criteriaResponse.data : [];
        const actionRows = Array.isArray(actionResponse?.data) ? actionResponse.data : [];
        setApplicantCriteria(criteriaRows);
        setApplicantActionTaken(actionRows);

        const idSet = collectRelevantMasterControlIds(criteriaRows, actionRows);
        const fullTree = Array.isArray(treeResponse?.data) ? treeResponse.data : [];
        const criteriaList = filterTreeByControlIds(fullTree, idSet);
        setAllAuditControlList(criteriaList);
        expandNcControlSections(criteriaList);

        const savedRemarks = {};
        actionRows.forEach((item) => {
          const masterId = extractMasterControlId(item?.auditReportCriteriaEntity?.auditControlId);
          if (masterId && item?.auditorRemarks) {
            savedRemarks[masterId] = item.auditorRemarks;
          }
        });
        setAuditorRemarksByControl(savedRemarks);
        setInitialAuditorRemarks(savedRemarks);

        if (actionRows.some((item) => String(item?.status || "").toLowerCase() === "inactive")) {
          sessionStorage.setItem(rejectLockKey, "1");
          setNcReviewRejected(true);
        }

        if (criteriaList.length === 0) {
          setControlsLoadError(
            "No NC detailed audit controls are available for review yet. Controls appear here after the auditor saves NC findings and the applicant submits action-taken responses."
          );
        }
      } catch (err) {
        console.error("Error loading NC audit controls:", err);
        setControlsLoadError("Error fetching audit control list. Please try again later.");
        showAlert({
          messageTitle: "Error",
          messageContent: "Error fetching audit control list. Please try again later.",
          confirmText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };

    loadControls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ApplicantUserName]);

  useEffect(() => {
    if (!ApplicantUserName) {
      return;
    }
    AnnualAuditService.auditNCReport(ApplicantUserName)
      .then((response) => setAuditNCReport(response.data || {}))
      .catch(() => setAuditNCReport({}));
  }, [ApplicantUserName]);

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
    setComplianceValues((prev) => ({
      ...prev,
      [parameterKey]: value,
    }));
  };

  const handleAuditorRemarksChange = (masterId, value) => {
    setAuditorRemarksByControl((prev) => ({
      ...prev,
      [masterId]: value,
    }));
  };

  const handleClosureFileChange = (event, masterId) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.type !== "application/pdf") {
      showAlert({
        messageTitle: "Validation Error",
        messageContent: "Only PDF files are allowed.",
        confirmText: "OK",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showAlert({
        messageTitle: "Validation Error",
        messageContent: "File size should not exceed 5 MB.",
        confirmText: "OK",
      });
      return;
    }
    setClosureFiles((prev) => ({ ...prev, [masterId]: file }));
    setClosureFileNames((prev) => ({ ...prev, [masterId]: file.name }));
  };

  const downloadBlob = async (request, documentTitle) => {
    if (!documentTitle) {
      return;
    }
    try {
      const response = await request;
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

  const reviewControl = (controlId, masterId, compliance, reject) => {
    const formData = new FormData();
    formData.append("controlId", controlId);
    formData.append("remarks", auditorRemarksByControl[masterId] || "");
    formData.append("applicantUserName", ApplicantUserName);
    if (!reject) {
      formData.append("compliance", compliance || "");
    }
    if (closureFiles[masterId]) {
      formData.append("file", closureFiles[masterId]);
    }

    setLoading(true);
    const request = reject
      ? AnnualAuditService.rejectApplicantNc(formData)
      : AnnualAuditService.approveApplicantNc(formData);

    request
      .then((response) => {
        if (reject) {
          sessionStorage.setItem(rejectLockKey, "1");
          setNcReviewRejected(true);
        }
        showAlert({
          messageTitle: "Success",
          messageContent: response.data,
          confirmText: "Ok",
        });
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.response?.data || "Request failed. Please try again later.";
        showAlert({
          messageTitle: "Error",
          messageContent: typeof errorMessage === "string" ? errorMessage : "Request failed. Please try again later.",
          confirmText: "Ok",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleApproveData = (e, controlId, masterId, compliance) => {
    e.preventDefault();
    if (ncReviewRejected) {
      return;
    }
    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure, you want to approved the data?",
      confirmText: "Yes",
      closeText: "No",
      onConfirm: () => reviewControl(controlId, masterId, compliance, false),
    });
  };

  const handleRejectData = (e, controlId, masterId) => {
    e.preventDefault();
    if (ncReviewRejected) {
      return;
    }
    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure, you want to rejected the data?",
      confirmText: "Yes",
      closeText: "No",
      onConfirm: () => reviewControl(controlId, masterId, "", true),
    });
  };

  const handleReset = () => {
    setAuditorRemarksByControl(initialAuditorRemarks);
    setClosureFiles({});
    setClosureFileNames({});
    setComplianceValues({});
  };

  const handleConfrimSubmit = () => {
    const remarks = Object.values(auditorRemarksByControl).map((value) => String(value || "").trim()).filter(Boolean).join("\n");
    const closureFile = Object.values(closureFiles).find(Boolean) || null;
    const applicantRemarks = new FormData();
    applicantRemarks.append("userName", userName);
    applicantRemarks.append("remarks", remarks);
    applicantRemarks.append("applicantUserName", ApplicantUserName);
    if (closureFile) {
      applicantRemarks.append("file", closureFile);
    }

    setLoading(true);
    AnnualAuditService.changeTheStatus(applicantRemarks)
      .then((response) => {
        showAlert({
          messageTitle: "Success",
          messageContent: response.data,
          confirmText: "Ok",
          onConfirm: () => {
            window.location.href = "/auditagency/ncreports";
          },
        });
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.response?.data || "Request failed. Please try again later.";
        showAlert({
          messageTitle: "Error",
          messageContent: typeof errorMessage === "string" ? errorMessage : "Request failed. Please try again later.",
          confirmText: "Ok",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ncReviewRejected) {
      return;
    }
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

  let controlCounter = 0;

  return (
    <>
      <LoaderProgress open={isLoading} />
      <FormWrapper headingText="NC Closure Report">
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Typography variant="h5" sx={{ color: "rgb(80, 0, 0)", mt: 1, mb: 1 }}>
            NC Control List
          </Typography>
          {controlsLoadError ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              {controlsLoadError}
            </Alert>
          ) : null}

          {allAuditControlList.map((criteria, criteriaIndex) => (
            <React.Fragment key={`criteria-${criteriaIndex}`}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h5" sx={{ color: "rgb(80, 0, 0)", flexGrow: 1 }}>
                    {`3.${criteriaIndex + 1}. ${criteria.auditCriteria}`}
                  </Typography>
                  <IconButton
                    onClick={() => handleToggle(criteriaIndex)}
                    disableRipple
                    sx={{ backgroundColor: "rgb(120, 0, 0)", color: "white" }}
                  >
                    {open[criteriaIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                <Collapse in={open[criteriaIndex]}>
                  {criteria.auditSubCriteria?.map((subCriteria, subIndex) => {
                    controlCounter = 0;
                    return (
                      <React.Fragment key={`subCriteria-${subIndex}`}>
                        <Box sx={{ ml: 2, mt: 1, display: "flex", alignItems: "center" }}>
                          <Typography variant="h6" sx={{ color: "rgb(80, 0, 0)", mb: 2, flexGrow: 1 }}>
                            {`3.${criteriaIndex + 1}.${subIndex + 1}. ${subCriteria.auditSubCriteria}`}
                          </Typography>
                          <IconButton
                            onClick={() => handleToggleSubCriteria(criteriaIndex, subIndex)}
                            size="small"
                            disableRipple
                            sx={{ backgroundColor: "info.main", color: "white" }}
                          >
                            {openSubCriteria[`${criteriaIndex}-${subIndex}`] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                        <Collapse in={openSubCriteria[`${criteriaIndex}-${subIndex}`]}>
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
                                  <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Remarks</TableCell>
                                  <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Action Taken Report</TableCell>
                                  <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Applicant Remarks</TableCell>
                                  <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Auditor Remarks</TableCell>
                                  <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>NC Closure Document</TableCell>
                                  <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {subCriteria.auditParameterPayload?.map((parameter, paramIndex) => (
                                  <React.Fragment key={`parameter-${paramIndex}`}>
                                    <TableRow>
                                      <TableCell colSpan={13} sx={{ border: 0.5, fontWeight: "bold" }}>
                                        {parameter.auditParameter === "No Any Parameter Available" ? "" : parameter.auditParameter}
                                      </TableCell>
                                    </TableRow>
                                    {parameter.auditControlPayload?.map((control, controlIndex) => {
                                      controlCounter += 1;
                                      const parameterKey = `3.${criteriaIndex + 1}.${subIndex + 1}.${controlCounter}`;
                                      const masterId = String(control.auditControllId);
                                      const matchedData = applicantCriteria.find(
                                        (item) =>
                                          extractMasterControlId(item?.auditControlId) === masterId ||
                                          item?.auditControlId === `${parameterKey}-${control.auditControllId}`
                                      );
                                      const actionTakenData = applicantActionTaken.find((item) => {
                                        const auditControlId = item?.auditReportCriteriaEntity?.auditControlId;
                                        if (!auditControlId) {
                                          return false;
                                        }
                                        return (
                                          extractMasterControlId(auditControlId) === masterId ||
                                          auditControlId === `${parameterKey}-${control.auditControllId}`
                                        );
                                      });
                                      const complianceValue =
                                        complianceValues[parameterKey] ?? matchedData?.compliance ?? "";
                                      const savedClosure = actionTakenData?.auditorClosureDocument || "";
                                      const applicantRemarkText = actionTakenData?.remarks || auditNCReport.remarks || "";
                                      const applicantActionFile = actionTakenData?.actionReport || auditNCReport.ncs || "";
                                      const downloadApplicantFile = () => {
                                        if (actionTakenData?.actionReport) {
                                          downloadBlob(
                                            AnnualAuditService.viewApplicantActionTaken(actionTakenData.actionReport),
                                            actionTakenData.actionReport
                                          );
                                          return;
                                        }
                                        downloadBlob(
                                          AnnualAuditService.viewAuditNCReport(auditNCReport.ncs),
                                          auditNCReport.ncs
                                        );
                                      };

                                      return (
                                        <TableRow key={`control-${controlIndex}`}>
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
                                                    checked={complianceValue === option}
                                                    onChange={() => handleRadioChange(option, parameterKey)}
                                                    value={option}
                                                    name={`compliance-${parameterKey}`}
                                                    disabled={ncReviewRejected}
                                                  />
                                                }
                                                label={option}
                                              />
                                            ))}
                                          </TableCell>
                                          <TableCell sx={{ border: 0.5 }}>
                                            <a
                                              onClick={() =>
                                                downloadBlob(
                                                  AnnualAuditService.viewDocumentName(matchedData?.document || ""),
                                                  matchedData?.document || ""
                                                )
                                              }
                                              style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
                                            >
                                              <span>{matchedData?.document || ""}</span>
                                            </a>
                                          </TableCell>
                                          <TableCell sx={{ border: 0.5 }}>{matchedData?.remarks}</TableCell>
                                          <TableCell sx={{ border: 0.5 }}>
                                            <a
                                              onClick={downloadApplicantFile}
                                              style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
                                            >
                                              <span>{applicantActionFile}</span>
                                            </a>
                                          </TableCell>
                                          <TableCell sx={{ border: 0.5 }}>{applicantRemarkText}</TableCell>
                                          <TableCell sx={{ border: 0.5 }}>
                                            <TextField
                                              multiline
                                              rows={4}
                                              variant="outlined"
                                              value={auditorRemarksByControl[masterId] ?? ""}
                                              onChange={(e) => handleAuditorRemarksChange(masterId, e.target.value)}
                                              disabled={ncReviewRejected}
                                              fullWidth
                                              InputProps={{ style: { padding: "5px", width: "160px" } }}
                                            />
                                          </TableCell>
                                          <TableCell sx={{ border: 0.5 }}>
                                            <Button
                                              component="label"
                                              variant="contained"
                                              size="small"
                                              startIcon={<CloudUploadIcon />}
                                              disabled={ncReviewRejected}
                                            >
                                              Upload file
                                              <VisuallyHiddenInput
                                                type="file"
                                                accept="application/pdf"
                                                onChange={(event) => handleClosureFileChange(event, masterId)}
                                              />
                                            </Button>
                                            <Typography variant="body2" sx={{ mt: 1, maxWidth: 160, wordBreak: "break-word" }}>
                                              {closureFileNames[masterId] || savedClosure}
                                            </Typography>
                                            {savedClosure ? (
                                              <a
                                                onClick={() =>
                                                  downloadBlob(
                                                    AnnualAuditService.viewAuditorClosureDocument(savedClosure),
                                                    savedClosure
                                                  )
                                                }
                                                style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
                                              >
                                                Download
                                              </a>
                                            ) : null}
                                          </TableCell>
                                          <TableCell sx={{ border: 0.5 }}>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                              <Button
                                                variant="contained"
                                                color="primary"
                                                disabled={ncReviewRejected}
                                                onClick={(e) =>
                                                  handleApproveData(
                                                    e,
                                                    `${parameterKey}-${control.auditControllId}`,
                                                    masterId,
                                                    complianceValue
                                                  )
                                                }
                                              >
                                                Approve
                                              </Button>
                                              <Button
                                                variant="contained"
                                                color="secondary"
                                                disabled={ncReviewRejected}
                                                onClick={(e) =>
                                                  handleRejectData(
                                                    e,
                                                    `${parameterKey}-${control.auditControllId}`,
                                                    masterId
                                                  )
                                                }
                                              >
                                                Rejected
                                              </Button>
                                            </Box>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </React.Fragment>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Collapse>
                      </React.Fragment>
                    );
                  })}
                </Collapse>
              </Box>
            </React.Fragment>
          ))}

          <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
              <Button type="submit" variant="contained" sx={{ maxWidth: "120px" }} disabled={ncReviewRejected}>
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="button"
                color="reset"
                variant="contained"
                disabled={ncReviewRejected}
                onClick={handleReset}
                sx={{ maxWidth: "120px", color: "#FFFFFF" }}
              >
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
