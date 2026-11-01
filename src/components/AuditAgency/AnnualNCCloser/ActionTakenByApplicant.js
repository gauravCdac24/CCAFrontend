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
  Grid,
  TextField,
  Tooltip,
  InputLabel,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import AuditControlService from "../../../service/AdminService/AuditControlService";
import showAlert from "../../global/common/MessageBox/AlertService";
import LoaderProgress from "../../global/common/LoaderProgress";
import FormWrapper from "../../global/util/FormWrapper";
import useAnnualAuditRoute from "../../global/util/useAnnualAuditRoute";
import { useSelector } from "react-redux";
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

const hasNcOrApplicantData = (matchedData, applicantAction) =>
  Boolean(
    (matchedData?.compliance && String(matchedData.compliance).trim()) ||
      (matchedData?.document && String(matchedData.document).trim()) ||
      (matchedData?.remarks && String(matchedData.remarks).trim()) ||
      (applicantAction?.actionReport && String(applicantAction.actionReport).trim()) ||
      (applicantAction?.remarks && String(applicantAction.remarks).trim())
  );

const buildCriteriaMap = (criteriaList) => {
  const map = new Map();
  if (!Array.isArray(criteriaList)) {
    return map;
  }
  criteriaList.forEach((item) => {
    if (!item?.auditControlId) {
      return;
    }
    map.set(String(item.auditControlId), item);
    const [parameterKey, controlIdPart] = String(item.auditControlId).split("-");
    if (parameterKey) {
      map.set(parameterKey, item);
    }
    if (controlIdPart) {
      map.set(controlIdPart, item);
    }
    if (item.criteriaId != null) {
      map.set(`criteria:${item.criteriaId}`, item);
    }
  });
  return map;
};

const buildActionTakenByCriteriaId = (actionList) => {
  const map = new Map();
  if (!Array.isArray(actionList)) {
    return map;
  }
  actionList.forEach((action) => {
    const criteriaId =
      action?.auditReportCriteriaEntity?.criteriaId ??
      action?.auditReportCriteriaEntity?.criteria_id ??
      action?.criteriaId;
    if (criteriaId != null) {
      map.set(String(criteriaId), action);
    }
  });
  return map;
};

const subCriteriaHasReviewData = (
  subCriteria,
  criteriaIndex,
  subIndex,
  criteriaMap,
  actionByCriteriaId
) => {
  let controlCounter = 0;
  for (const parameter of subCriteria?.auditParameterPayload || []) {
    for (const control of parameter?.auditControlPayload || []) {
      controlCounter += 1;
      const parameterKey = `3.${criteriaIndex + 1}.${subIndex + 1}.${controlCounter}`;
      const controlRowId = `${parameterKey}-${control.auditControllId}`;
      const matchedData =
        criteriaMap.get(controlRowId) ||
        criteriaMap.get(String(control.auditControllId)) ||
        criteriaMap.get(parameterKey);
      const criteriaId = matchedData?.criteriaId;
      const applicantAction =
        criteriaId != null ? actionByCriteriaId.get(String(criteriaId)) : null;
      if (hasNcOrApplicantData(matchedData, applicantAction)) {
        return true;
      }
    }
  }
  return false;
};

const SubCriteriaControlsTable = ({
  subCriteria,
  criteriaIndex,
  subIndex,
  criteriaMap,
  actionByCriteriaId,
  onDownloadAuditorDoc,
  onDownloadApplicantDoc,
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
          No audit parameters or controls are configured for this section.
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
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Compliance</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Auditor Document</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Auditor Remarks</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Applicant Document</TableCell>
            <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Applicant Remarks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subCriteria.auditParameterPayload?.map((parameter, paramIndex) => (
            <React.Fragment key={`parameter-${paramIndex}`}>
              <TableRow>
                <TableCell colSpan={7} sx={{ border: 0.5, fontWeight: "bold" }}>
                  {parameter.auditParameter === "No Any Parameter Available"
                    ? ""
                    : parameter.auditParameter}
                </TableCell>
              </TableRow>
              {parameter.auditControlPayload?.map((control, controlIndex) => {
                controlCounter += 1;
                const parameterKey = `3.${criteriaIndex + 1}.${subIndex + 1}.${controlCounter}`;
                const controlRowId = `${parameterKey}-${control.auditControllId}`;
                const matchedData =
                  criteriaMap.get(controlRowId) ||
                  criteriaMap.get(String(control.auditControllId)) ||
                  criteriaMap.get(parameterKey);
                const criteriaId = matchedData?.criteriaId;
                const applicantAction =
                  criteriaId != null ? actionByCriteriaId.get(String(criteriaId)) : null;

                return (
                  <TableRow key={`control-${control.auditControllId || controlIndex}`}>
                    <TableCell sx={{ border: 0.5 }}>{parameterKey}</TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      <div dangerouslySetInnerHTML={{ __html: control.auditControl }} />
                    </TableCell>
                    <TableCell sx={{ border: 0.5 }}>{matchedData?.compliance || ""}</TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      {matchedData?.document ? (
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => onDownloadAuditorDoc(matchedData.document)}
                          sx={{ textTransform: "none" }}
                        >
                          {matchedData.document}
                        </Button>
                      ) : null}
                    </TableCell>
                    <TableCell sx={{ border: 0.5 }}>{matchedData?.remarks || ""}</TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      {applicantAction?.actionReport ? (
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => onDownloadApplicantDoc(applicantAction.actionReport)}
                          sx={{ textTransform: "none" }}
                        >
                          {applicantAction.actionReport}
                        </Button>
                      ) : null}
                    </TableCell>
                    <TableCell sx={{ border: 0.5 }}>{applicantAction?.remarks || ""}</TableCell>
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

const ActionTakenByApplicant = () => {
  const { userName: applicantUserName } = useAnnualAuditRoute();
  const loggedInUser = useSelector((state) => state.jwtAuthentication.username);

  const [open, setOpen] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [openSubCriteria, setOpenSubCriteria] = useState({});
  const [applicantCriteria, setApplicantCriteria] = useState([]);
  const [actionTakenList, setActionTakenList] = useState([]);
  const [closureRemarks, setClosureRemarks] = useState("");
  const [closureFile, setClosureFile] = useState(null);
  const [closureFileName, setClosureFileName] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState("");

  const criteriaMap = useMemo(() => buildCriteriaMap(applicantCriteria), [applicantCriteria]);
  const actionByCriteriaId = useMemo(
    () => buildActionTakenByCriteriaId(actionTakenList),
    [actionTakenList]
  );

  const loadPageData = useCallback(async () => {
    if (!applicantUserName) {
      setLoadError("Invalid application reference. Please return to NC Reports and try again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");
    try {
      const [controlResponse, criteriaResponse, actionResponse] = await Promise.all([
        AuditControlService.data(applicantUserName),
        AnnualAuditService.getByApplicantUserNames(applicantUserName).catch(() => ({ data: [] })),
        AnnualAuditService.getByApplicantActionTaken(applicantUserName).catch(() => ({ data: [] })),
      ]);
      setAllAuditControlList(sanitizeAuditControlTree(controlResponse.data));
      setApplicantCriteria(Array.isArray(criteriaResponse.data) ? criteriaResponse.data : []);
      setActionTakenList(Array.isArray(actionResponse.data) ? actionResponse.data : []);
    } catch (err) {
      console.error("Failed to load NC review controls:", err);
      setLoadError(
        err.response?.data?.message ||
          "Unable to load NC review details. Please refresh or try again later."
      );
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

  const handleRemarksChange = (e) => {
    const value = e.target.value;
    setClosureRemarks(value);
    setErrors((prev) => ({
      ...prev,
      remarks: value.trim() === "" ? "Please enter the remarks" : "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setClosureFile(null);
      setClosureFileName("");
      return;
    }
    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size should not exceed 5 MB.");
      return;
    }
    setFileError("");
    setClosureFile(file);
    setClosureFileName(file.name);
  };

  const resetFormData = () => {
    setClosureRemarks("");
    setClosureFile(null);
    setClosureFileName("");
    setFileInputKey(Date.now());
    setErrors({});
    setFileError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!closureRemarks || closureRemarks.trim() === "") {
      setErrors((prev) => ({ ...prev, remarks: "Please enter the remarks" }));
      hasError = true;
    }
    if (!closureFile) {
      setFileError("Please select a file.");
      hasError = true;
    }
    if (hasError) {
      return;
    }
    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure you want to submit the NC Closure Report?",
      confirmText: "Yes",
      closeText: "No",
      fullWidth: true,
      maxWidth: "sm",
      onConfirm: () => handleConfirmSubmit(),
    });
  };

  const handleConfirmSubmit = () => {
    const formData = new FormData();
    formData.append("userName", loggedInUser);
    formData.append("remarks", closureRemarks);
    formData.append("applicantUserName", applicantUserName);
    formData.append("file", closureFile);

    setLoading(true);
    AnnualAuditService.changeTheStatus(formData)
      .then((response) => {
        showAlert({
          messageTitle: "Success",
          messageContent: response.data || "Submitted successfully.",
          confirmText: "Ok",
          onConfirm: () => {
            window.location.href = "/auditagency/ncreports";
          },
        });
        resetFormData();
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response.data : null) ||
          "Request failed. Please try again later.";
        showAlert({
          messageTitle: "Error",
          messageContent: errorMessage,
          confirmText: "Ok",
        });
      })
      .finally(() => setLoading(false));
  };

  const downloadAuditorDoc = async (documentTitle) => {
    if (!documentTitle) {
      return;
    }
    try {
      const response = await AnnualAuditService.viewDocumentName(documentTitle);
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", documentTitle);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading auditor document:", error);
      showAlert({
        messageTitle: "Error",
        messageContent: "Unable to download auditor document.",
        confirmText: "Ok",
      });
    }
  };

  const downloadApplicantDoc = async (documentTitle) => {
    if (!documentTitle) {
      return;
    }
    try {
      const response = await AnnualAuditService.viewApplicantActionTaken(documentTitle);
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", documentTitle);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading applicant document:", error);
      showAlert({
        messageTitle: "Error",
        messageContent: "Unable to download applicant document.",
        confirmText: "Ok",
      });
    }
  };

  return (
    <FormWrapper headingText="Review NC Report">
      <LoaderProgress open={isLoading} />

      {loadError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      ) : null}

      {!loadError && !isLoading && allAuditControlList.length === 0 ? (
        <Alert severity="info">No audit controls are available for this application.</Alert>
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
                  sx={{ backgroundColor: "rgb(120, 0, 0)", color: "white" }}
                >
                  {criteriaOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              {criteriaOpen ? (
                <Collapse in={criteriaOpen} unmountOnExit>
                  {criteria.auditSubCriteria?.map((subCriteria, subIndex) => {
                    const subKey = `${criteriaIndex}-${subIndex}`;
                    const subOpen = Boolean(openSubCriteria[subKey]);
                    const hasReviewData = subCriteriaHasReviewData(
                      subCriteria,
                      criteriaIndex,
                      subIndex,
                      criteriaMap,
                      actionByCriteriaId
                    );

                    return (
                      <Box
                        key={`subCriteria-${subCriteria.auditSubCriteriaId || subIndex}`}
                        sx={{ ml: 2, mt: 1 }}
                      >
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
                            title={
                              hasReviewData
                                ? "NC / applicant response available"
                                : "No NC data for this section"
                            }
                            sx={{
                              backgroundColor: hasReviewData ? "success.main" : "info.main",
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
                              criteriaMap={criteriaMap}
                              actionByCriteriaId={actionByCriteriaId}
                              onDownloadAuditorDoc={downloadAuditorDoc}
                              onDownloadApplicantDoc={downloadApplicantDoc}
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
          <>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Typography variant="h6">NC Closure Remarks</Typography>
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={closureRemarks}
                  onChange={handleRemarksChange}
                  error={!!errors.remarks}
                  helperText={errors.remarks || ""}
                  InputProps={{ style: { padding: "10px" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel shrink={false}>
                  <Typography variant="body1">
                    Attached NC Closure Document (Only PDF and Max allowed size 5 MB)*
                  </Typography>
                </InputLabel>
                <Grid
                  container
                  direction="row"
                  sx={{ border: "1px solid #cfcfcf", borderRadius: "5px" }}
                >
                  <Grid item>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                      Upload file
                      <VisuallyHiddenInput
                        key={fileInputKey}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    {closureFileName ? (
                      <Tooltip title={closureFileName} placement="top">
                        <Typography
                          variant="body2"
                          sx={{
                            display: "inline-block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {closureFileName}
                        </Typography>
                      </Tooltip>
                    ) : null}
                  </Grid>
                </Grid>
                {fileError ? (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {fileError}
                  </Typography>
                ) : null}
              </Grid>
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: 4 }} spacing={2}>
              <Grid item>
                <Button type="submit" variant="contained" sx={{ maxWidth: "120px" }}>
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  color="reset"
                  variant="contained"
                  sx={{ maxWidth: "120px", color: "#FFFFFF" }}
                  onClick={resetFormData}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Box>
    </FormWrapper>
  );
};

export default ActionTakenByApplicant;
