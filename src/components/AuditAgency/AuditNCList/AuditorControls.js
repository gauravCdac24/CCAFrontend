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
  Alert,

} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AuditControlService from "../../../service/AdminService/AuditControlService";
import showAlert from "../../global/common/MessageBox/AlertService";
import LoaderProgress from "../../global/common/LoaderProgress";
import FormWrapper from "../../global/util/FormWrapper";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { decrypt, encrypt } from "../../global/util/EncryptDecrypt";
import AuditService from "../../../service/AuditService/AuditService";
import Esign from "../../global/pages/Esign";
import CallComponent from "../../global/common/CallComponent/CallComponent";
import AnnexureA2Main from "../UploadUndertaking/AnnexureA2/AnnexureA2Main";
import stringToDateFormat from "../../global/util/DateUtil";

const formatScheduleDate = (dateStr) => {
  if (!dateStr) {
    return "";
  }
  const formatted = stringToDateFormat(dateStr, "dd-MM-yyyy");
  return formatted && formatted !== "Unsupported Format" ? formatted : "";
};

const AuditorControls = () => {
  const { id } = useParams();
  const ApplicantUserName = decrypt(id);
  const signerFullName = useSelector((state) => state.jwtAuthentication.name);
  const signerUserName = useSelector((state) => state.jwtAuthentication.username);
  const [auditEsignStatus, setAuditEsignStatus] = useState({
    esignStatus: "NONE",
    canRetryEsign: false,
    workflowAdvanced: false,
  });
  const [lastSubIndex, setLastSubIndex] = useState(null);
  //alert(ApplicantUserName);
  const [open, setOpen] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [openSubCriteria, setOpenSubCriteria] = useState({});
  const [controlsLoadError, setControlsLoadError] = useState("");
  const [showAnnexureA2, setShowAnnexureA2] = useState(true);
  const [undertakingAuditForm, setUndertakingAuditForm] = useState({
    auditorDesscription: [],
    auditScope: [],
    undertakingFileName: "",
  });
  const [radioValue, setRadioValue] = useState({
    compliance: "",
    applicantUserName: ApplicantUserName,
    creteriaId: '',
    remarks: '',
    isRejected: false,
    auditCoverReport: null,
    annexureA5: null,
    annexureA6: null,
    annexureVI: null,
  });
  const rejectLockKey = `nc-review-rejected:${ApplicantUserName}`;
  const [ncReviewRejected, setNcReviewRejected] = useState(
    () => sessionStorage.getItem(`nc-review-rejected:${ApplicantUserName}`) === "1"
  );
  const [selectedFiles, setSelectedFiles] = useState([]); // Track files per row
  let controlCounter = 0;

  const extractMasterControlId = (auditControlId) => {
    if (!auditControlId || typeof auditControlId !== "string") {
      return "";
    }
    const value = auditControlId.trim();
    const lastDash = value.lastIndexOf("-");
    if (lastDash >= 0 && lastDash < value.length - 1) {
      return value.substring(lastDash + 1).trim();
    }
    return value;
  };

  // Auto-expand criteria/subcriteria that contain NC controls so auditor can
  // review applicant responses (Approve/Reject) without hunting nested collapses.
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
          (total, parameter) =>
            total + (parameter?.auditControlPayload?.length || 0),
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

  /**
   * Keep only controls whose master ids are in idSet (from saved NC criteria /
   * applicant action-taken). Used as a client-side fallback when /nc-data is empty.
   */
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

  // Fetching audit control data (NC tree + applicant action context)
  const getAllAuditControl = async () => {
    setLoading(true);
    setControlsLoadError("");

    try {
      const [ncResponse, criteriaResponse, actionResponse, fullTreeResponse] =
        await Promise.all([
          AuditControlService.NCData(ApplicantUserName).catch(() => ({ data: [] })),
          AuditService.getByApplicantUserNames(ApplicantUserName).catch(() => ({ data: [] })),
          AuditService.getByApplicantActionTaken(ApplicantUserName).catch(() => ({ data: [] })),
          AuditControlService.data(ApplicantUserName).catch(() => ({ data: [] })),
        ]);

      const criteriaRows = Array.isArray(criteriaResponse?.data) ? criteriaResponse.data : [];
      const actionRows = Array.isArray(actionResponse?.data) ? actionResponse.data : [];
      setApplicantCriteria(criteriaRows);
      setApplicantActionTaken(actionRows);

      let criteriaList = Array.isArray(ncResponse?.data) ? ncResponse.data : [];

      // Fallback: build NC review tree from full control master + saved criteria / action-taken
      if (criteriaList.length === 0) {
        const idSet = collectRelevantMasterControlIds(criteriaRows, actionRows);
        const fullTree = Array.isArray(fullTreeResponse?.data) ? fullTreeResponse.data : [];
        criteriaList = filterTreeByControlIds(fullTree, idSet);
      }

      setAllAuditControlList(criteriaList);
      expandNcControlSections(criteriaList);

      if (criteriaList.length === 0) {
        setControlsLoadError(
          "No NC detailed audit controls are available for review yet. Controls appear here after the auditor saves NC findings and/or the applicant submits action-taken responses."
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

  const [auditorTracker, setAuditorTracker] = useState(null);
  const getAllApplicationForm = () => {
    setLoading(true); // Start loading

    AuditService.getAllAuditorMain()
      .then((resannex) => {

        const annexureEntry = resannex.data.find(item => item.userName === ApplicantUserName);

        console.log("annexureEntry heeeeeeeeeeee-->", annexureEntry)
        if (annexureEntry) {
          setAuditorTracker(annexureEntry.auditorTracker); // assuming `auditorTracker` is a field
        }
      })
      .catch((err) => {
        console.error("Error fetching Annexure Main list:", err);
      })
      .finally(() => {
        // setAppTypeFound(true);
      });

  }



  const loadAuditEsignStatus = () => {
    AuditService.getAuditEsignStatus(ApplicantUserName)
      .then((response) => setAuditEsignStatus(response.data || {}))
      .catch(() =>
        setAuditEsignStatus({
          esignStatus: "NONE",
          canRetryEsign: false,
          workflowAdvanced: false,
        })
      );
  };

  const loadUndertakingAuditForm = () => {
    AuditService.getAuditorApplicationbyApplicatantUserName(ApplicantUserName)
      .then((response) => {
        const data = response?.data || {};
        setUndertakingAuditForm({
          auditorDesscription: Array.isArray(data.auditorDesscription)
            ? data.auditorDesscription.map((item) => ({
                auditorDescriptionId: item?.auditorDescriptionId ?? "",
                auditorName: item?.auditorName ?? "",
                certificateType: item?.certificateType ?? "",
                certificateName: item?.certificateName ?? "",
                certificateExpiry: formatScheduleDate(
                  item?.certificateExpiry || item?.date || ""
                ),
              }))
            : [],
          auditScope: Array.isArray(data.auditScope)
            ? data.auditScope.map((item) => ({
                auditScopeId: item?.auditScopeId ?? "",
                auditTitle: item?.auditTitle ?? "",
                description: item?.description ?? "",
                startDate: formatScheduleDate(item?.startDate),
                endDate: formatScheduleDate(item?.endDate),
              }))
            : [],
          undertakingFileName: data.undertakingFileName || "",
        });
      })
      .catch((err) => {
        console.error("Failed to load undertaking / CA details / schedule:", err);
      });
  };

  useEffect(() => {
    getAllAuditControl();
    getAllApplicationForm();
    loadAuditEsignStatus();
    loadUndertakingAuditForm();
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

  console.log("gdhfj===>", radioValue, "uwyeio++++====>", selectedFiles)

  // Function to reset the form data
  const resetFormData = () => {
    setRadioValue((prev) => ({
      ...prev,
      compliance: [],
      auditCoverReport: null,
      annexureA5: null,
      annexureA6: null,
      annexureVI: null,
    }));
    setSelectedFiles([]);
  };

  const handleRejectData = (e, controlId) => {

    e.preventDefault()


    showAlert({
      messageTitle: 'Confirm',
      messageContent: 'Are you sure, you want to rejected the data?',
      confirmText: 'Yes',
      closeText: 'No',
      //fullWidth: true,
      onConfirm: () => rejectedData(controlId)
    })
  }

  const rejectedData = (id) => {
    console.log(`Saving data for control ID: ${id}`);
    const formData = new FormData();
    formData.append("controlId", id);
    formData.append("remarks", radioValue.remarks);
    formData.append("applicantUserName", radioValue.applicantUserName);

    // Call the API
    AuditService.getAuditorRejectedData(formData)
      .then((response) => {
        sessionStorage.setItem(rejectLockKey, "1");
        setNcReviewRejected(true);
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


  const handleApproveData = (e, controlId) => {
    e.preventDefault()


    showAlert({
      messageTitle: 'Confirm',
      messageContent: 'Are you sure, you want to approved the data?',
      confirmText: 'Yes',
      closeText: 'No',
      //fullWidth: true,
      onConfirm: () => saveData(controlId)
    })


  };


  const saveData = (id) => {
    console.log(`Saving data for control ID: ${id}`);
    const formData = new FormData();
    formData.append("controlId", id);
    formData.append("remarks", radioValue.remarks);
    const parameterKey = id.lastIndexOf("-") > 0 ? id.substring(0, id.lastIndexOf("-")) : id;
    const editedCompliance = radioValue?.compliance && typeof radioValue.compliance === "object"
      ? radioValue.compliance[parameterKey]
      : "";
    let validCompliance = editedCompliance || complianceValues?.[parameterKey] || "";
    if (validCompliance === "undefined" || validCompliance === "null") {
      validCompliance = "";
    }
    formData.append("compliance", validCompliance);
    formData.append("applicantUserName", radioValue.applicantUserName);

    // Call the API
    AuditService.getAuditorApprovedData(formData)
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
  // temporary state — populated by getAllAuditControl()
  const [applicantCriteria, setApplicantCriteria] = useState([]);
  const [fileName, setFileName] = useState([]);
  const [applicantActionTaken, setApplicantActionTaken] = useState([]);


  const handleForwordToApplicant = (e) => {

    e.preventDefault()

    showAlert({
      messageTitle: 'Confirm',
      messageContent: 'Are you sure, you want to forword to applicant?',
      confirmText: 'Yes',
      closeText: 'No',
      //fullWidth: true,
      onConfirm: () => handleAuditorForwordApplicant()
    })
  }

  const handleAuditorForwordApplicant = () => {
    const formData = new FormData();
    formData.append("applicantUserName", radioValue.applicantUserName);

    AuditService.forwordToApplicant(formData)
      .then((response) => {
        //console.log(response.data)
        showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          onConfirm: () => window.location.href = '/auditagency/auditnclist',
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



  const [coverLetterDoc, setCoverLetterDoc] = useState({
    file: null,
    fid: '',

  });





  const handleToggleSubCriteria = (criteriaIndex, subIndex) => {
    const key = `${criteriaIndex}-${subIndex}`;
    setOpenSubCriteria((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const buildAuditReportFormData = (preview) => {
    const formData = new FormData();
    formData.append("applicantUserName", radioValue.applicantUserName);
    formData.append("auditCoverReport", radioValue.auditCoverReport);
    if (radioValue.annexureA5) {
      formData.append("annexureA5", radioValue.annexureA5);
    }
    if (radioValue.annexureA6) {
      formData.append("annexureA6", radioValue.annexureA6);
    }
    if (radioValue.annexureVI) {
      formData.append("annexureVI", radioValue.annexureVI);
    }
    if (preview) {
      formData.append("preview", "true");
    }
    return formData;
  };

  const requireCoverReport = () => {
    if (!radioValue.auditCoverReport || radioValue.auditCoverReport.size === 0) {
      showAlert({
        messageTitle: 'Validation Error',
        messageContent: 'Please upload the Audit Cover Report.',
        confirmText: 'OK',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
      return false;
    }
    return true;
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (ncReviewRejected) {
    return;
  }

  if (!requireCoverReport()) {
    return;
  }

  showAlert({
    messageTitle: 'Confirm',
    messageContent: 'Are you sure you want to submit and eSign the audit report?',
    confirmText: 'Yes',
    closeText: 'No',
    onConfirm: handleConfrimSubmit,
  });
};

  const handlePreview = async (e) => {
    e.preventDefault();
    if (ncReviewRejected || !requireCoverReport()) {
      return;
    }

    try {
      setLoading(true);
      const response = await AuditService.downloadDocument(buildAuditReportFormData(true));
      const blob = new Blob([response.data], { type: "application/pdf" });
      const previewUrl = window.URL.createObjectURL(blob);
      setLoading(false);
      showAlert({
        messageTitle: "Audit Report Preview",
        messageContent: (
          <Box sx={{ height: "75vh", overflow: "auto" }}>
            <iframe
              title="Audit Report Preview"
              src={previewUrl}
              width="100%"
              height="100%"
              style={{ border: "none", minWidth: "1100px" }}
            />
          </Box>
        ),
        confirmText: "Close",
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
        maxWidth: "lg",
        fullWidth: true,
        onConfirm: () => window.URL.revokeObjectURL(previewUrl),
      });
    } catch (error) {
      console.error("Error generating audit report preview:", error);
      showAlert({
        messageTitle: "Error",
        messageContent: "Unable to generate the audit report preview. Please try again.",
        confirmText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleConfrimSubmit = async () => {
    try {
      setLoading(true);


      if (!coverLetterDoc.file) {
        const response = await AuditService.downloadDocument(buildAuditReportFormData(false));


        console.log("rowid", response)
        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        const contentDisposition = response.headers['content-disposition'];

        //alert(contentDisposition)

        const rowid = contentDisposition.split('filename=')[1].replace(/"/g, '');

        // alert(rowid)

        const updatedCoverLetterDoc = { ...coverLetterDoc, file: blob, fid: rowid };
        setCoverLetterDoc(updatedCoverLetterDoc);


        initiateSigning(blob, rowid);
      } else if (coverLetterDoc.file) {

        initiateSigning(coverLetterDoc.file, coverLetterDoc.fid);
      } else {

        showAlert({
          messageTitle: 'Error',
          messageContent: "Document not available for signing.",
          enableHeaderCloseBtn: false,
          disableOutsideKeyDown: true,
          confirmText: 'Ok',
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      showAlert({
        messageTitle: 'Error',
        messageContent: "An unexpected error occurred. Please try again.",
        enableHeaderCloseBtn: false,
        disableOutsideKeyDown: true,
        confirmText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  };


  const initiateSigning = (file, fid) => {
    const fullName = (signerFullName || "").trim() || signerUserName;
    const redirectUrl = `/auditagency/auditnclist?pendingEsign=${encodeURIComponent(
      encrypt(ApplicantUserName)
    )}`;
    CallComponent({
      component: (
        <Esign
          efile={file}
          fullName="Gaurav Singh"
          maxFileSize={5}
          serviceName="/audit-service"
          serviceUrl="/download-final-esigned-report"
          documentPath="/CoverLetter"
          orgFileId={fid}
          redirectUrl={redirectUrl}
        />
      ),
    });
  };

  const handleRetryEsign = (e) => {
    handleSubmit(e);
  };


  const downloadfile = async (documentTitle) => {
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


  const downloadfiles = async (documentTitle) => {
    try {
      // Fetch the file from the server
      const response = await AuditService.viewApplicantActionTaken(documentTitle);

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



  // Remaining upload-only annexures (A5, A6, VI) — numbered after the view-only sections
  const uploadSections = [
    { label: "Annexure A5 - DSC Compliance", key: "annexureA5", number: 5 },
    { label: "Annexure A6 - eSign API Compliance", key: "annexureA6", number: 6 },
    { label: "Annexure VI - Security Evaluation", key: "annexureVI", number: 7 },
  ];

  const downloadUndertakingFile = async () => {
    const documentTitle = undertakingAuditForm.undertakingFileName;
    if (!documentTitle) {
      showAlert({
        messageTitle: "Error",
        messageContent: "Undertaking file is not available for download.",
        confirmText: "Ok",
      });
      return;
    }

    try {
      const response = await AuditService.viewFiles(documentTitle);
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", documentTitle || "AgencyUndertaking.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading undertaking file:", error);
      showAlert({
        messageTitle: "Error",
        messageContent: "Unable to download the undertaking file. Please try again.",
        confirmText: "Ok",
      });
    }
  };

  const downloadAuditorCertificate = async (auditorDescriptionId, certificateName) => {
    if (!auditorDescriptionId) {
      return;
    }
    try {
      const response = await AuditService.viewFile(auditorDescriptionId);
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", certificateName || "AuditorCertificate.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading auditor certificate:", error);
    }
  };



  const [files, setFiles] = useState({});

  const handleFileChanges = (event, key) => {
    const file = event.target.files[0];
    if (file && validatePdfFile(file)) {
      setRadioValue((prevState) => ({
        ...prevState,
        [key]: file, // set the file based on matching key
      }));
    }
  };

  console.log("files", files)
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);

  const handleFilesChanges = (event, key) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && validatePdfFile(selectedFile)) {
      setRadioValue((prev) => ({ ...prev, [key]: selectedFile }));
    } else {
      setRadioValue((prev) => ({ ...prev, [key]: null }));
    }
  };

  const validatePdfFile = (file) => {
    const isPdf = file.type === "application/pdf";
    const isUnder5MB = file.size <= 5 * 1024 * 1024; // 5MB

    if (!isPdf) {
      showAlert({
        messageTitle: 'Validation Error',
        messageContent: 'Only PDF files are allowed.',
        confirmText: 'OK',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
      return false;
    }

    if (!isUnder5MB) {
      showAlert({
        messageTitle: 'Validation Error',
        messageContent: 'File size should not exceed 5MB.',
        confirmText: 'OK',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
      return false;
    }

    return true;
  };




  return (
    <>
      <LoaderProgress open={isLoading} />
      {!isLoading && (
        <FormWrapper headingText="3. Detailed Audit Controls">
        <Box component="form" noValidate onSubmit={handleSubmit}>
          {controlsLoadError ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              {controlsLoadError}
            </Alert>
          ) : null}
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
                                  Action Taken Report
                                </TableCell>
                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Applicant Remarks
                                </TableCell>

                                <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>
                                  Auditor Remarks
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

                                        const parameterKey = `3.${criteriaIndex + 1
                                          }.${subIndex + 1}.${controlCounter}`;

                                        const matchedData = applicantCriteria.find(
                                          (item) =>
                                            extractMasterControlId(item?.auditControlId) ===
                                              String(control.auditControllId) ||
                                            item?.auditControlId ===
                                              `${parameterKey}-${control.auditControllId}`
                                        );

                                        const actionTakenData = applicantActionTaken.find((item) => {
                                          const auditControlId =
                                            item?.auditReportCriteriaEntity?.auditControlId;
                                          if (!auditControlId) {
                                            return false;
                                          }
                                          return (
                                            extractMasterControlId(auditControlId) ===
                                              String(control.auditControllId) ||
                                            auditControlId ===
                                              `${parameterKey}-${control.auditControllId}`
                                          );
                                        });

                                        const complianceValue = complianceValues[parameterKey] ?? matchedData?.compliance ?? "";

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
                                            {/* <TableCell sx={{ border: 0.5 }}>

                                           {matchedData?.compliance} 
                                             
                                          </TableCell> */}
                                            <TableCell sx={{ border: 0.5 }}>
                                              <FormControlLabel
                                                control={
                                                  <Radio
                                                    checked={complianceValue === "Yes"}
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
                                                    checked={complianceValue === "No"}
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
                                                    checked={complianceValue === "N/A"}
                                                    onChange={() => handleRadioChange("N/A", parameterKey)}
                                                    value="N/A"
                                                    name={`compliance-${parameterKey}`}
                                                  />
                                                }
                                                label="N/A"
                                              />
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              <a
                                                onClick={() => downloadfile(matchedData?.document || '')}
                                                style={{ textDecoration: 'none', color: 'blue' }} // Optional styling
                                              >
                                                <span>{matchedData?.document || ''}</span>
                                              </a>
                                            </TableCell>
                                            <TableCell sx={{ border: 0.5 }}>
                                              {matchedData?.remarks}
                                            </TableCell>


                                            <TableCell sx={{ border: 0.5 }}>
                                              {/* <input type="file" onChange={(event) => handleFileChange(event, parameterKey)} /> */}


                                              <a
                                                onClick={() => downloadfiles(actionTakenData?.actionReport || '')}
                                                style={{ textDecoration: 'none', color: 'blue' }}
                                              >
                                                <span>{actionTakenData?.actionReport || ''}</span>
                                              </a>

                                            </TableCell>

                                            <TableCell sx={{ border: 0.5 }}>
                                              {actionTakenData?.remarks}
                                            </TableCell>

                                            <TableCell sx={{ border: 0.5 }}>
                                              <TextField
                                                multiline
                                                rows={10}
                                                variant="outlined"
                                                // value={matchedData?.remarks}
                                                onChange={(e) => handleChanges(e, "remarks")}
                                                fullWidth
                                                InputProps={{
                                                  style: { padding: "5px", width: "150px" },
                                                }}
                                              ></TextField>
                                            </TableCell>


                                            <TableCell sx={{ border: 0.5 }}>
                                              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                <Button
                                                  variant="contained"
                                                  color="primary"
                                                  disabled={ncReviewRejected}
                                                  onClick={(e) => handleApproveData(e, `${parameterKey}-${control.auditControllId}`)}
                                                >
                                                  Approve
                                                </Button>

                                                <Button
                                                  variant="contained"
                                                  color="secondary"
                                                  disabled={ncReviewRejected}
                                                  onClick={(e) => handleRejectData(e, `${parameterKey}-${control.auditControllId}`)}
                                                >
                                                  Rejected
                                                </Button>
                                              </Box>
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

          {/* ---------------------------- upload / view annexures ---------------------------- */}
          <Typography
            variant="h5"
            sx={{ color: "rgb(80, 0, 0)", mt: 3, mb: 1 }}
          >
            Upload Audit Report &amp; Annexures
          </Typography>

          {/* 1. Audit Cover Report — upload */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              my: 1,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "rgb(80, 0, 0)",
                mb: -1,
                width: "40%",
                minWidth: 250,
                mr: 1,
              }}
            >
              1. Audit Cover Report: <span style={{ color: "red" }}>*</span>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <input
                accept=".pdf"
                id="auditCoverReport"
                type="file"
                style={{ display: "none" }}
                disabled={ncReviewRejected}
                onChange={(e) => handleFilesChanges(e, "auditCoverReport")}
              />
              <label htmlFor="auditCoverReport">
                <Button variant="contained" component="span" sx={{ minWidth: 140 }} disabled={ncReviewRejected}>
                  Choose File
                </Button>
              </label>
              {radioValue.auditCoverReport && (
                <Typography variant="body2" noWrap>
                  {radioValue.auditCoverReport.name}
                </Typography>
              )}
            </Box>
          </Box>

          {/* 2. Main Audit Report — Annexure A2 with auditor remarks (view) */}
          <Box sx={{ my: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography
                variant="h6"
                sx={{ color: "rgb(80, 0, 0)", flexGrow: 1 }}
              >
                2. Main Audit Report — Annexure A2 (Approved by Auditor Remarks):
              </Typography>
              <IconButton
                onClick={() => setShowAnnexureA2((prev) => !prev)}
                size="small"
                disableRipple
                sx={{ backgroundColor: "info.main", color: "white" }}
              >
                {showAnnexureA2 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={showAnnexureA2}>
              <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1 }}>
                <AnnexureA2Main />
              </Box>
            </Collapse>
          </Box>

          {/* 3. CA Details — auditor details from undertaking (view) */}
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ color: "rgb(80, 0, 0)", mb: 1 }}>
              3. Annexure A2 — CA Details (filled by auditor, approved by CA):
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "tablecolor.main" }}>
                    <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Auditor Name</TableCell>
                    <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Certificate Type</TableCell>
                    <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Certificate Expiry</TableCell>
                    <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Certificate File</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {undertakingAuditForm.auditorDesscription.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ border: 0.5 }}>
                        No auditor / CA details available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    undertakingAuditForm.auditorDesscription.map((row, index) => (
                      <TableRow key={`auditor-${row.auditorDescriptionId || index}`}>
                        <TableCell sx={{ border: 0.5 }}>{row.auditorName || ""}</TableCell>
                        <TableCell sx={{ border: 0.5 }}>{row.certificateType || ""}</TableCell>
                        <TableCell sx={{ border: 0.5 }}>{row.certificateExpiry || ""}</TableCell>
                        <TableCell sx={{ border: 0.5 }}>
                          {row.certificateName ? (
                            <Button
                              variant="text"
                              size="small"
                              sx={{ textTransform: "none" }}
                              disabled={ncReviewRejected}
                              onClick={() =>
                                downloadAuditorCertificate(
                                  row.auditorDescriptionId,
                                  row.certificateName
                                )
                              }
                            >
                              {row.certificateName}
                            </Button>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* 4. Audit Schedule — from undertaking (view) */}
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ color: "rgb(80, 0, 0)", mb: 1 }}>
              4. Annexure A4 — Audit Schedule (filled by audit agency, approved by CA):
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "tablecolor.main" }}>
                    <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Audit Title</TableCell>
                    <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Description</TableCell>
                    <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Start Date</TableCell>
                    <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {undertakingAuditForm.auditScope.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ border: 0.5 }}>
                        No audit schedule available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    undertakingAuditForm.auditScope.map((row, index) => (
                      <TableRow key={`scope-${row.auditScopeId || index}`}>
                        <TableCell sx={{ border: 0.5 }}>{row.auditTitle || ""}</TableCell>
                        <TableCell sx={{ border: 0.5 }}>{row.description || ""}</TableCell>
                        <TableCell sx={{ border: 0.5 }}>{row.startDate || ""}</TableCell>
                        <TableCell sx={{ border: 0.5 }}>{row.endDate || ""}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* 5–7. Remaining annexure uploads */}
          {uploadSections.map(({ label, key, number }) => (
            <Box
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                my: 1,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "rgb(80, 0, 0)",
                  mb: -1,
                  width: "40%",
                  minWidth: 250,
                  mr: 1,
                }}
              >
                {`${number}. ${label}`}:
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                  accept=".pdf"
                  id={key}
                  type="file"
                  style={{ display: "none" }}
                  disabled={ncReviewRejected}
                  onChange={(e) => handleFileChanges(e, key)}
                />
                <label htmlFor={key}>
                  <Button variant="contained" component="span" sx={{ minWidth: 140 }} disabled={ncReviewRejected}>
                    Choose File
                  </Button>
                </label>
                {radioValue[key] && (
                  <Typography variant="body2" noWrap>
                    {radioValue[key].name}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}

          {/* 8. Auditor Undertaking — download previously submitted / CCA-approved file */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              my: 1,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "rgb(80, 0, 0)",
                mb: -1,
                width: "40%",
                minWidth: 250,
                mr: 1,
              }}
            >
              8. Annexure VIII — Auditor Undertaking:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="contained"
                sx={{ minWidth: 140 }}
                onClick={downloadUndertakingFile}
                disabled={ncReviewRejected || !undertakingAuditForm.undertakingFileName}
              >
                Download File
              </Button>
              {undertakingAuditForm.undertakingFileName ? (
                <Typography variant="body2" noWrap>
                  {undertakingAuditForm.undertakingFileName}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No undertaking file on record
                </Typography>
              )}
            </Box>
          </Box>







          {auditEsignStatus.esignStatus === "COMPLETED" && (
            <Alert severity="success" sx={{ mt: 3 }}>
              NC audit report eSign is complete. The application can proceed in the workflow.
            </Alert>
          )}
          {(auditEsignStatus.esignStatus === "PENDING" ||
            auditEsignStatus.esignStatus === "FAILED") && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              {auditEsignStatus.esignStatus === "FAILED"
                ? "eSign failed for the NC audit report. Use Retry eSign to generate the report and sign again."
                : "eSign is pending for the NC audit report. Complete eSign or use Retry eSign if the signing window was closed."}
            </Alert>
          )}

          <Grid container justifyContent="center" sx={{ mt: 4 }}>
            <Grid item>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  sx={{ width: "auto", minWidth: "120px", px: 2 }}
                  onClick={handleForwordToApplicant}
                  disabled={!ncReviewRejected && Boolean(radioValue.auditCoverReport)}
                >
                  Forward To Applicant
                </Button>

                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  sx={{ width: "auto", minWidth: "120px", px: 2 }}
                  onClick={handleSubmit}
                  disabled={ncReviewRejected}
                >
                  Submit &amp; eSign
                </Button>

                {auditEsignStatus.canRetryEsign && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="warning"
                    sx={{ width: "auto", minWidth: "120px", px: 2 }}
                    onClick={handleRetryEsign}
                    disabled={ncReviewRejected}
                  >
                    Retry eSign
                  </Button>
                )}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  sx={{ width: "auto", minWidth: "120px", px: 2 }}
                  onClick={handlePreview}
                  disabled={ncReviewRejected}
                >
                  Preview
                </Button>
              </Box>
            </Grid>
          </Grid>

        </Box>
        </FormWrapper>
      )}
    </>
  );
};


export default AuditorControls;
