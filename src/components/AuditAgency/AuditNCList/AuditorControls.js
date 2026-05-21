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
  const [isLoading, setLoading] = useState(false);
  const [allAuditControlList, setAllAuditControlList] = useState([]);
  const [openSubCriteria, setOpenSubCriteria] = useState({});
  const [radioValue, setRadioValue] = useState({
    compliance: "",
    applicantUserName: ApplicantUserName,
    creteriaId: '',
    remarks: '',
    isRejected: false,
    auditCoverReport: null,
    mainAuditReport: null,
    annexureA1: null,
    annexureA2: null,
    annexureA4: null,
    annexureA3: null,
    annexureA5: null,
    annexureA6: null,
    annexureVI: null,
    annexureVIII: null,
    annexureVIIIRepeat: null,
    annexureVIIIUndertaking: null,
  });
  const [selectedFiles, setSelectedFiles] = useState([]); // Track files per row
  let controlCounter = 0;
  // Fetching audit control data
  const getAllAuditControl = () => {
    //setLoading(true);
    AuditControlService.NCData(ApplicantUserName)
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

  useEffect(() => {
    getAllAuditControl();
    getAllApplicationForm();
    loadAuditEsignStatus();
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
    setRadioValue({ compliance: [], applicantUserName: '' }); // Reset the radioValue state
    setSelectedFiles([]); // Clear the selected files array
    console.log("Form data has been reset.");
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
    const validCompliance = radioValue?.compliance[id.split('-')[0]];
    formData.append('compliance', validCompliance);
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
  //temporary state
  const [applicantCriteria, setApplicantCriteria] = useState([]);
  const [fileName, setFileName] = useState([]);

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



  const [applicantActionTaken, setApplicantActionTaken] = useState([]);

  const getByApplicationActionTaken = () => {
    //setLoading(true);
    AuditService.getByApplicantActionTaken(ApplicantUserName)
      .then((response) => {
        setApplicantActionTaken(response.data);
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
    getByApplicationActionTaken();
  }, []);


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

 const handleSubmit = (e) => {
  e.preventDefault();

  // Validate that the file is present and not empty
  if (!radioValue.auditCoverReport || radioValue.auditCoverReport.size === 0) {
    showAlert({
      messageTitle: 'Validation Error',
      messageContent: 'Please upload the Audit Cover Report.',
      confirmText: 'OK',
      enableHeaderCloseBtn: true,
      disableOutsideKeyDown: true,
    });
    return;
  }

  // Show confirmation before submitting
  showAlert({
    messageTitle: 'Confirm',
    messageContent: 'Are you sure you want to submit?',
    confirmText: 'Yes',
    closeText: 'No',
    onConfirm: handleConfrimSubmit,
  });
};


  const handleConfrimSubmit = async () => {
    try {
      setLoading(true);


      const formData = new FormData();
      formData.append("applicantUserName", radioValue.applicantUserName);
      formData.append("auditCoverReport", radioValue.auditCoverReport);
      formData.append("mainAuditReport", radioValue.mainAuditReport);
      formData.append("annexureA1", radioValue.annexureA1);
      formData.append("annexureA2", radioValue.annexureA2);
      formData.append("annexureA3", radioValue.annexureA3);
      formData.append("annexureA4", radioValue.annexureA4);
      formData.append("annexureA5", radioValue.annexureA5);
      formData.append("annexureA6", radioValue.annexureA6);
      formData.append("annexureVI", radioValue.annexureVI);
      formData.append("annexureVIII", radioValue.annexureVIII);
      formData.append("annexureVIIIRepeat", radioValue.annexureVIIIRepeat);
      formData.append("annexureVIIIUndertaking", radioValue.annexureVIIIUndertaking);

      //alert(radioValue.applicantUserName) 

      if (!coverLetterDoc.file) {
        const response = await AuditService.downloadDocument(formData);


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



  const uploadSections = [
    { label: "Main Audit Report", key: "mainAuditReport" },
    { label: "Annexure A1 - Non-Compliance Summary", key: "annexureA1" },
    { label: "Annexure A2 - CA Details", key: "annexureA2" },
    { label: "Annexure A4 - Audit Schedule", key: "annexureA4" },
    { label: "Annexure A3 - Auditor Notes", key: "annexureA3" },
    { label: "Annexure A5 - DSC Compliance", key: "annexureA5" },
    { label: "Annexure A6 - eSign API Compliance", key: "annexureA6" },
    { label: "Annexure VI - Security Evaluation", key: "annexureVI" },
    { label: "Annexure VIII - Financial Status Report", key: "annexureVIII" },
    { label: "Same as above (Annexure VIII)", key: "annexureVIIIRepeat" },
    { label: "Annexure VIII - Auditor Undertaking", key: "annexureVIIIUndertaking" },
  ];



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
                                          (item) => item.auditControlId.split("-")[1] === control.auditControllId
                                        );
                                        console.log("applicantActionTaken", applicantActionTaken)

                                        const actionTakenData = applicantActionTaken.find((item) => {
                                          const auditControlId = item?.auditReportCriteriaEntity?.auditControlId;

                                          if (auditControlId && auditControlId.includes("-")) {
                                            const parts = auditControlId.split("-");

                                            return parts[1] === control.auditControllId;
                                          }

                                          return false;
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
                                                  onClick={(e) => handleApproveData(e, `${parameterKey}-${control.auditControllId}`)}
                                                >
                                                  Approve
                                                </Button>

                                                <Button
                                                  variant="contained"
                                                  color="secondary" // Changed to secondary for better distinction
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

          {/* ---------------------------- upload files ---------------------------- */}


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
            1.  Audit Cover Report: <span style={{ color: "red" }}>*</span>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Hidden input */}
              <input
                accept=".pdf"
                id="auditCoverReport"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleFilesChanges(e, 'auditCoverReport')}
              />

              {/* Choose File Button */}
              <label htmlFor="auditCoverReport">
                <Button variant="contained" component="span" sx={{ minWidth: 140 }}>
                  Choose File
                </Button>
              </label>

              {/* File name display */}
              {radioValue.auditCoverReport && (
                <Typography variant="body2" noWrap>
                  {radioValue.auditCoverReport.name}
                </Typography>
              )}
            </Box>
          </Box>




         {uploadSections.map(({ label, key }, index) => (
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
    {/* Numbered Label */}
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
      {`${index + 2}. ${label}`}:
    </Typography>

    {/* File input and button container */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/* Hidden input */}
      <input
        accept=".pdf"
        id={key}
        type="file"
        style={{ display: "none" }}
        onChange={(e) => handleFileChanges(e, key)}
      />

      {/* Choose File Button */}
      <label htmlFor={key}>
        <Button variant="contained" component="span" sx={{ minWidth: 140 }}>
          Choose File
        </Button>
      </label>

      {/* File name display */}
      {radioValue[key] && (
        <Typography variant="body2" noWrap>
          {radioValue[key].name}
        </Typography>
      )}
    </Box>
  </Box>
))}







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
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: "auto", minWidth: "120px", px: 2 }}
                  onClick={handleForwordToApplicant}
                  disabled={radioValue.auditCoverReport}
                >
                  Forward To Applicant
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ width: "auto", minWidth: "120px", px: 2 }}
                  onClick={handleSubmit}
                >
                  Final Revision
                </Button>

                {auditEsignStatus.canRetryEsign && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="warning"
                    sx={{ width: "auto", minWidth: "120px", px: 2 }}
                    onClick={handleRetryEsign}
                  >
                    Retry eSign
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

        </Box>
      )}
    </>
  );
};


export default AuditorControls;
