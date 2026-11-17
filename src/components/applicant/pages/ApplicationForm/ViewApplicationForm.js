import { useEffect, useMemo, useRef, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Grid, Switch, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import { useNavigate } from 'react-router-dom';
import { encrypt,decrypt } from '../../../global/util/EncryptDecrypt';
import RoleService from '../../../../service/AdminService/RoleService';
import ViewDetailsApplicationForm from './ViewDetailsApplicationForm';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import { useDispatch, useSelector } from 'react-redux';
import AddApplicationForm from './AddApplicationForm';
import ApplicationType from '../../../../service/AdminService/ApplicationType';
import IndividualViewData from './IndividualViewData';
import FirmViewData from './FirmViewData';
import GovernmentViewData from './GovernmentViewData';
import IntentService from '../../../../service/AdminService/IntentService';
import { setApplicationDetails } from '../../../../store/LicenseApplication/Reducer';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadDocuments from '../InPrincipleApproval/UploadDocuments';
import AuditAgencySelection from '../AuditAgencySelection/AuditAgencySelection';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DownloadIcon from '@mui/icons-material/Download';
import DrawIcon from '@mui/icons-material/Draw';
import GovernmentAgencyForm from '../../../../service/NewLicenseService/GovernmentAgencyForm';
import FirmApplicationForm from '../../../../service/NewLicenseService/FirmApplicationForm';
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentProof from './PaymentProof';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SingleUserTracker from './SingleUserTracker';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Esign from '../../../global/pages/Esign';
import CallComponent from '../../../global/common/CallComponent/CallComponent';
import EsignService from '../../../../service/EsignService/EsignService';
import OfflinePaymentPage from './OfflinePaymentPage';
import { canSelectAuditAgency, hasLicenseAction } from '../../../global/util/licenseAcquisitionWorkflow';
import printApplicationPreview from '../../../global/util/printApplicationPreview';
import AuditService from '../../../../service/AuditService/AuditService';
import AuditAcceptanceService from '../../../../service/AdminService/AuditAcceptanceService';


const ViewApplicationForm = () => {
    const [allApplicationFormList, setAllApplicationFormList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isAppTypeFound, setAppTypeFound] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();
    const rolePath = useSelector((state)=>state.jwtAuthentication.rolePath);

    const userName = useSelector((state) => state.jwtAuthentication.username);
    const signerFullName = useSelector((state) => state.jwtAuthentication.name);
    const [allApplicationTypeList, setAllApplicationTypeList] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [acceptanceLetterStatus, setAcceptanceLetterStatus] = useState("NONE");
    const acceptanceFileInputRef = useRef(null);


    //------Manish
    const ref = useRef();

    const handleUploadSubmit = () =>{
        ref.current.handleFormSubmit();
    }

    const handleUploadReset = () => {
        ref.current.handleReset();
    }


    const handleDDSubmit = () =>{
        ref.current.handleSubmit();
    }

    const handleDDReset = () => {
        ref.current.handleReset();
    }

    //---------------
    const prevApplicationTypeListRef = useRef(); // Reference to store previous state

    useEffect(() => {
        console.log("Updated Application Type List:", allApplicationTypeList);
    }, [allApplicationTypeList]);

    const getAllApplicationType = () => {
        ApplicationType.getAllApplicationTypeList()
            .then((response) => {
                console.log("Fetched Application Type list:", response.data);

                if (Array.isArray(response.data)) {
                    // Check if the new data is different from the old state
                    if (JSON.stringify(response.data) !== JSON.stringify(allApplicationTypeList)) {
                        setAllApplicationTypeList(() => {
                            return response.data.map((obj, index) => {
                                const formattedCreated = dateFormatter(obj.created);
                                const formattedUpdated = dateFormatter(obj.updated);
                                obj['id'] = index + 1;
                                obj['created'] = formattedCreated;
                                obj['updated'] = formattedUpdated;
                                return obj;
                            });
                        });
                    } else {
                        console.log("Data has not changed, skipping state update.");
                    }
                } else {
                    console.error("Response data is not an array:", response.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching Application Type list:", err);
            })
            .finally(() => {
                setAppTypeFound(true);
            });
    };

    // Call getAllApplicationType() once when the component is mounted
    useEffect(() => {
        getAllApplicationType();
    }, []);
        


    const getAllApplicationForm = () => {
       
        ApplicationForm.getApplicationDetailsFormByUsername(userName)
            .then((response) => {
                const intentApp = response.data.intentApp;
                const workflow = response.data.workflow || {};
                console.log("-=---->",allApplicationTypeList)
                if (intentApp) {
                    const matchedType = allApplicationTypeList.find(
                        (type) => type.appTypeMasterId === parseInt(intentApp.appTypeMasterId)
                      );
                      const applicationType = matchedType ? matchedType.appType : 'Unknown Type';
                     
                        let counter = 1;

                    const formattedIntentApp = {
                        id: counter++,
                        created: dateFormatter(intentApp.created),
                        updated: dateFormatter(intentApp.updated),
                        status: intentApp.applicationStatus,
                        applicationType: applicationType,
                        intentAppId: intentApp.intentAppId,
                        allowedActions: workflow.allowedActions || [],
                        currentStep: workflow.currentStep,
                        readOnly: workflow.readOnly,
                    };
    
                   
                    setAllApplicationFormList([formattedIntentApp]); 
                } else {
                    setAllApplicationFormList([]);
                }
            })
            .catch((err) => {
                if (err.response?.status === 404) {
                    setAllApplicationFormList([]);
                } else {
                    console.error("Error fetching application details:", err);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllApplicationForm();
    }, [allApplicationTypeList]);

    const loadAcceptanceLetterStatus = () => {
        if (!userName) {
            return;
        }
        AuditService.getAcceptanceLetterStatus(userName)
            .then((response) => {
                setAcceptanceLetterStatus(
                    response?.data?.acceptanceLetterStatus || "NONE"
                );
            })
            .catch(() => setAcceptanceLetterStatus("NONE"));
    };

    useEffect(() => {
        const row = allApplicationFormList[0];
        if (
            row &&
            (String(row.status || "").toLowerCase().includes("pending audit acceptance") ||
                hasLicenseAction(row.allowedActions || [], "AUDIT_ACCEPTANCE"))
        ) {
            loadAcceptanceLetterStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allApplicationFormList, userName]);

    const downloadAuditAcceptanceLetter = async () => {
        try {
            setLoading(true);
            const listRes = await AuditAcceptanceService.getAllActiveDocuments();
            const activeList = Array.isArray(listRes?.data) ? listRes.data : [];
            if (!activeList.length) {
                showAlert({
                    messageTitle: "Error",
                    messageContent: "No active Audit Acceptance letter is available from admin master.",
                    confirmText: "Ok",
                });
                return;
            }
            const activeDoc = activeList[0];
            const fileRes = await AuditAcceptanceService.downloadFile(
                activeDoc.auditAcceptanceId,
                true
            );
            const blob = new Blob([fileRes.data], {
                type: fileRes.headers["content-type"] || "application/pdf",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute(
                "download",
                activeDoc.documentName || "AuditAcceptanceLetter.pdf"
            );
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            await AuditService.markAcceptanceDownloaded(userName);
            await loadAcceptanceLetterStatus();
            getAllApplicationForm();
        } catch (err) {
            console.error(err);
            showAlert({
                messageTitle: "Error",
                messageContent: "Unable to download the Audit acceptance letter.",
                confirmText: "Ok",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptanceUploadClick = () => {
        if (acceptanceFileInputRef.current) {
            acceptanceFileInputRef.current.value = "";
            acceptanceFileInputRef.current.click();
        }
    };

    const handleAcceptanceFileSelected = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        if (file.type && !String(file.type).includes("pdf")) {
            showAlert({
                messageTitle: "Validation Error",
                messageContent: "Please upload a PDF Audit acceptance letter.",
                confirmText: "Ok",
            });
            return;
        }
        try {
            setLoading(true);
            await AuditService.uploadAcceptanceLetter(userName, file);
            await loadAcceptanceLetterStatus();
            showAlert({
                messageTitle: "Success",
                messageContent:
                    "Audit acceptance letter uploaded. You can now eSign the letter.",
                confirmText: "Ok",
            });
            getAllApplicationForm();
        } catch (err) {
            console.error(err);
            showAlert({
                messageTitle: "Error",
                messageContent:
                    err?.response?.data ||
                    "Unable to upload the Audit acceptance letter.",
                confirmText: "Ok",
            });
        } finally {
            setLoading(false);
        }
    };

    const startAcceptanceLetterEsign = async () => {
        try {
            setLoading(true);
            const prepRes = await AuditService.prepareAcceptanceEsign(userName);
            const prep = prepRes?.data || {};
            const eSignedId = prep.eSignedId;
            if (!eSignedId) {
                throw new Error("Unable to prepare acceptance letter eSign.");
            }

            // Packet = auditor-signed full NC report + uploaded acceptance letter, then applicant eSigns.
            const parts = [];
            if (prep.needsFullReport && prep.previousSignedDocId) {
                const reportBlob = await EsignService.viewDigitallySignedDocument(
                    prep.previousSignedDocId
                );
                parts.push(
                    new File([reportBlob], "AuditReport.pdf", { type: "application/pdf" })
                );
            }
            try {
                const letterRes = await AuditService.downloadUploadedAcceptanceLetter(userName);
                parts.push(
                    new File([letterRes.data], "AcceptanceLetter.pdf", {
                        type: letterRes.headers["content-type"] || "application/pdf",
                    })
                );
            } catch (letterErr) {
                console.warn("Uploaded acceptance letter not available:", letterErr);
            }
            if (parts.length === 0) {
                throw new Error(
                    "Unable to build acceptance eSign PDF. Ensure auditors have eSigned and acceptance letter is uploaded."
                );
            }

            let pdfFile;
            if (parts.length === 1) {
                pdfFile = parts[0];
            } else {
                const mergedRes = await AuditService.mergePdfs(parts);
                pdfFile = new File(
                    [mergedRes.data],
                    `AuditReport_Acceptance_${eSignedId}.pdf`,
                    {
                        type:
                            mergedRes.headers?.["content-type"] || "application/pdf",
                    }
                );
            }

            const fullName = (signerFullName || "").trim() || userName;
            CallComponent({
                component: (
                    <Esign
                        efile={pdfFile}
                        fullName={fullName}
                        maxFileSize={15}
                        serviceName="/audit-service"
                        serviceUrl="/download-final-esigned-report"
                        documentPath="/CoverLetter"
                        orgFileId={String(eSignedId).trim()}
                        redirectUrl="/applicant/applicationform"
                    />
                ),
            });
        } catch (err) {
            console.error(err);
            showAlert({
                messageTitle: "Error",
                messageContent:
                    err?.message || "Unable to start eSign for the Audit acceptance letter.",
                confirmText: "Ok",
            });
        } finally {
            setLoading(false);
        }
    };

    const changeApplicationFormStatus = (id) => {
        setLoading(true);
        RoleService.changeRoleStatus((id))
            .then((response) => {
               // getAllApplicationForm(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing country status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };



    const viewApplicationForm = (applicationData) => {
        if (applicationData) {
            showAlert({
                messageTitle: 'View Application Form',
                messageContent: renderStepContent(applicationData),  // Pass applicationData to renderStepContent
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
                maxWidth:'md',
                fullWidth:true,
                headerButtonText: 'Print PDF',
                onHeaderButtonClick: async ({ contentElement }) => {
                    try {
                        await printApplicationPreview({
                            contentElement: contentElement(),
                            fetchFile: (appDocId) => ApplicationForm.viewFile(appDocId),
                            userName,
                            title: 'Application Form Preview',
                        });
                    } catch (error) {
                        showAlert({
                            messageTitle: 'Print PDF',
                            messageContent: error?.message || 'Unable to prepare the application for printing.',
                            confirmText: 'Ok',
                            enableHeaderCloseBtn: true,
                        });
                    }
                },
            });
        } else {
            showAlert({
                messageTitle: 'View Application Form',
                messageContent: 'Error in getting application details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };
    

    const [applicationType, setApplicationType] = useState({
        appTypeMasterId: '',
        appType: '',
    });
    const [activeStep, setActiveStep] = useState(0);
 
    const [steps, setSteps] = useState([]); // Store steps based on application type

    const dispatch = useDispatch();
    const [applicationTypeData, setApplicationTypeData] = useState({});

    useEffect(() => {
        dispatch(setApplicationDetails({ applicationType: applicationType.appTypeMasterId }));
    }, [applicationType.appTypeMasterId, dispatch]);

    useEffect(() => {
        setLoading(true);
        IntentService.getIntentByUserName(userName)
            .then(data => {
                const appData = data.data;
                setApplicationTypeData(appData);

                if (appData && appData.appTypeMasterId) {
                    const appTypeId = appData.appTypeMasterId.appTypeMasterId;
                    setApplicationType({
                        appTypeMasterId: appTypeId,
                        appType: appData.appTypeMasterId.appType,
                    });

                    // Set steps based on app type
                }

                setActiveStep(0);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching application types:", error);
                setLoading(false);
            });
    }, [userName]);

    const renderStepContent = (applicationData) => {
        //alert(applicationType.appTypeMasterId)
        switch (applicationType.appTypeMasterId) {
            
            case 1:
                return <IndividualViewData  userName={userName}/>;  // Pass data as props
            case 2:
            case 3:
                return <FirmViewData  userName={userName}/>;
            case 4:
                return <GovernmentViewData  userName={userName}/>;
            default:
                return <Typography variant="h6">Unknown step</Typography>;
        }
    };
    useEffect(() => {
        renderStepContent()
    }, []);

    const handleEditApplicationForm = () => {
        // Assuming you want to pass formDetails to the AddApplicationForm route
        navigate("/applicant/applicationform/addapplicationform");
    };

    const editApplicationForm = (cid) => {
        const Role = allApplicationFormList.find((obj) => obj.id === cid);
        if (Role) {
            const encryptedId = encodeURIComponent(encrypt(Role.roleId));
            navigate(`/admin/applicant/editapplicationform/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Application Form',
                messageContent: 'Error in updating Role details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };


    //-------------Manish
    const uploadRequiredDocuments = (id) => {

        if(id === undefined)
            return;

        showAlert({
            messageTitle: 'Upload Required Documents',
            messageContent: <UploadDocuments intentAppId={id} ref={ref} refreshList={getAllApplicationForm}/>,
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: 'md',
            buttonOneText: 'Submit',
            buttonTwoText: 'Reset',
            onButtonOneClick: ()=>handleUploadSubmit(),
            onButtonTwoClick: ()=>handleUploadReset()
        });

    }


    const selectAuditAgency = (userName) => {
   
        
        if (userName) {
            const encryptedId = encodeURIComponent(encrypt(userName));
            navigate(`${rolePath}/applicationform/selectauditagency/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: ' NC Auditor Control',
                messageContent: 'Error in NC Auditor Control, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }

    }


    const auditorControls = (userName) => {
        
        
        if (userName) {
            const encryptedId = encodeURIComponent(encrypt(userName));
            navigate(`${rolePath}/applicationform/auditordetails/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: ' NC Auditor Control',
                messageContent: 'Error in NC Auditor Control, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };


    const applicationAuditorControls = (userName) => {
        
       
        if (userName) {
            const encryptedId = encodeURIComponent(encrypt(userName));
            navigate(`${rolePath}/applicationform/applicationauditordetails/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: ' NC Auditor Control',
                messageContent: 'Error in NC Auditor Control, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };


    const [generateDoc, setGenerateDoc] = useState({  
  file: null, 
  fid:'',

});


 const renderIndividualViewData = async (intentId) => {
  try {
    const response = await ApplicationForm.generatePdf(intentId);

    const contentType = response.headers['content-type'];
    const contentDisposition = response.headers['content-disposition'];

    if (response.data && contentDisposition) {
      const blob = new Blob([response.data], { type: contentType });

      // Extract filename from Content-Disposition
      const rowid = contentDisposition
        .split('filename=')[1]
        .replace(/["']/g, '');

      // Save to state if needed
      const updatedCoverLetterDoc = {
        ...generateDoc,
        file: blob,
        fid: rowid,
      };
      setGenerateDoc(updatedCoverLetterDoc);

      // Send file to Esign component
      initiateSigning(blob, rowid);

      // Optionally generate preview
      createIndivReport(userName);
    } else if (generateDoc.file) {
      initiateSigning(generateDoc.file, generateDoc.fid);
      //createIndivReport(userName);
    } else {
      showAlert({
        messageTitle: 'Error',
        messageContent: 'Document not available for signing.',
        enableHeaderCloseBtn: false,
        disableOutsideKeyDown: true,
        confirmText: 'Ok',
      });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    showAlert({
      messageTitle: 'Download Error',
      messageContent: 'Failed to download the document.',
      enableHeaderCloseBtn: false,
      disableOutsideKeyDown: true,
      confirmText: 'Ok',
    });
  }
};

const initiateSigning = (file, fid) => {
  const fullName = (signerFullName || '').trim() || userName;
  CallComponent({
    component: (
      <Esign
        efile={file}
        fullName="Gaurav Singh"
        maxFileSize={5}
        serviceName="/newlicense-service"
        serviceUrl="/download-final-esigned-report"
        documentPath="/applicationform"
        orgFileId={fid}
        redirectUrl="/applicant/applicationform"
      />
    ),
  });
};

const createIndivReport = async (userName) => {
  try {
    const response = await ApplicationForm.getEsignedDocumentId(userName);
    const signedDocId = response.data?.signedDocId;

    if (!signedDocId) {
      console.error("No signed document ID found.");
      return;
    }

    const pdfBlob = await EsignService.downloadDigitallySignedDocument(
      signedDocId,
      "finalSignedDocument"
    );

    const url = window.URL.createObjectURL(
      new Blob([pdfBlob], { type: "application/pdf" })
    );
    setPdfUrl(url); // You can use this for preview in iframe or embed

  } catch (error) {
    console.error("Error downloading signed file:", error);
  }
};

    
    const renderFirmViewData = async(intentId) => {
        try {
           // alert(intentId)
             const response = await FirmApplicationForm.generatePdf(intentId);
             
             // Create a blob from the response data
             const blob = new Blob([response.data], { type: response.headers['content-type'] });
             
             // Create a link element
             const link = document.createElement('a');
             link.href = window.URL.createObjectURL(blob);
             
             // Extract the filename from the Content-Disposition header
             const contentDisposition = response.headers['content-disposition'];
 
             console.log(JSON.stringify(contentDisposition))
 
         
     
             link.setAttribute('download', "filename");
             document.body.appendChild(link);
             link.click();
             link.parentNode.removeChild(link);
         } catch (error) {
             console.error('Error downloading file:', error);
         }
    };
    
    const renderGovernmentViewData = async(intentId) => {
        try {
           // alert(intentId)
             const response = await GovernmentAgencyForm.generatePdf(intentId);
             
             // Create a blob from the response data
             const blob = new Blob([response.data], { type: response.headers['content-type'] });
             
             // Create a link element
             const link = document.createElement('a');
             link.href = window.URL.createObjectURL(blob);
             
             // Extract the filename from the Content-Disposition header
             const contentDisposition = response.headers['content-disposition'];
 
             console.log(JSON.stringify(contentDisposition))
 
         
     
             link.setAttribute('download', "filename");
             document.body.appendChild(link);
             link.click();
             link.parentNode.removeChild(link);
         } catch (error) {
             console.error('Error downloading file:', error);
         }
    };
    
    const handleDownload = (intentAppId) => {
        //alert(intentAppId)
        switch (applicationType.appTypeMasterId) {
            case 1:
                return renderIndividualViewData(intentAppId);
            case 2:
            case 3:
                return renderFirmViewData(intentAppId);
            case 4:
                return renderGovernmentViewData(intentAppId);
            default:
                return <Typography variant="h6">Unknown step</Typography>;
        }
    };


     const viewTracker = (intentAppId) => {
         showAlert({
            messageTitle: 'Application Tracker',
            messageContent: <SingleUserTracker />,
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: 'md',
            closeText: 'Close',
          
           
        });
    };
    

    const handlePaymentApplicationForm= (cid) => {
        

          showAlert({
            messageTitle: 'Application Payment',
            messageContent: <OfflinePaymentPage cid={cid} ref={ref} />,
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: 'md',
            buttonOneText: 'Submit',
            buttonTwoText: 'Reset',
            onButtonOneClick: ()=>handleDDSubmit(),
            onButtonTwoClick: ()=>handleDDReset()
        });
    };



    // payment Proof

    const handleSubmitDocuments = () =>{
        ref.current.handleFormSubmit()
    }

    const handleResetForm = () =>{
        ref.current.handleReset()
    }

    const handlePaymentProofForm = (intentAppId) => {


        showAlert({
            messageTitle: 'Upload Payment Proof',
            messageContent: <PaymentProof ref={ref} intentAppId={intentAppId} refreshApplication={getAllApplicationType}/>,
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            buttonOneText: "Submit",
            buttonTwoText: "Reset",
            onButtonOneClick: () => handleSubmitDocuments(),
            onButtonTwoClick: () => handleResetForm()

        })

        


    }



   
    

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, flex: 0.4, minWidth: 90 },
            { field: 'applicationType', headerName: 'Application Type Name', resizable: false, flex: 1.4, minWidth: 200 },
            { field: 'created', headerName: 'Submitted', resizable: false, flex: 1.2, minWidth: 170 },
            { field: 'updated', headerName: 'Updated', resizable: false, flex: 1.2, minWidth: 170 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                flex: 1.2,
                minWidth: 180,
            },
            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                flex: 1,
                minWidth: 120,
                sortable: false,
                renderCell: (params) => {
                    const actions = params.row.allowedActions || [];
                    const actionButtons = [];

                    if (hasLicenseAction(actions, 'VIEW')) {
                        actionButtons.push(
                            <Tooltip key="view" title="View">
                                <GridActionsCellItem
                                    icon={<VisibilityIcon color="success" />}
                                    label="View"
                                    onClick={() => viewApplicationForm(params.row)}
                                />
                            </Tooltip>
                        );
                    }

                    if (hasLicenseAction(actions, 'DOWNLOAD')) {
                        actionButtons.push(
                            <Tooltip key="download" title="Download Application Form">
                                <GridActionsCellItem
                                    icon={<DownloadIcon color="info" />}
                                    label="Download"
                                    onClick={() => handleDownload(params.row.intentAppId)}
                                />
                            </Tooltip>
                        );
                    }

                    if (hasLicenseAction(actions, 'TRACKER')) {
                        actionButtons.push(
                            <Tooltip key="tracker" title="Application Tracker">
                                <GridActionsCellItem
                                    icon={<TrackChangesIcon color="info" />}
                                    label="Application Tracker"
                                    onClick={() => viewTracker(params.row.intentAppId)}
                                />
                            </Tooltip>
                        );
                    }

                    if (hasLicenseAction(actions, 'EDIT_FORM')) {
                        actionButtons.push(
                            <Tooltip key="edit" title="Edit">
                                <GridActionsCellItem
                                    icon={<EditIcon color="info" />}
                                    label="Edit"
                                    onClick={() => handleEditApplicationForm()}
                                />
                            </Tooltip>
                        );
                    }

                    if (hasLicenseAction(actions, 'PAYMENT')) {
                        actionButtons.push(
                            <Tooltip key="payment" title="Payment">
                                <GridActionsCellItem
                                    icon={<PaymentIcon color="info" />}
                                    label="Payment"
                                    onClick={() => handlePaymentApplicationForm(params.row.intentAppId)}
                                />
                            </Tooltip>
                        );
                    }

                    if (hasLicenseAction(actions, 'UPLOAD_PAYMENT_PROOF')) {
                        actionButtons.push(
                            <Tooltip key="payment-proof" title="Payment Proof">
                                <GridActionsCellItem
                                    icon={<CloudUploadIcon color="info" />}
                                    label="Payment Proof"
                                    onClick={() => handlePaymentProofForm(params.row.intentAppId)}
                                />
                            </Tooltip>
                        );
                    }

                    if (hasLicenseAction(actions, 'UPLOAD_LICENSE_DOCUMENTS')) {
                        actionButtons.push(
                            <Tooltip key="upload-docs" title="Submission of Bank Guarantee, Agreement & CSR">
                                <GridActionsCellItem
                                    icon={<FileUploadIcon color="danger" />}
                                    label="Upload"
                                    onClick={() => uploadRequiredDocuments(params.row.intentAppId)}
                                />
                            </Tooltip>
                        );
                    }

                    if (
                        hasLicenseAction(actions, 'SELECT_AUDIT_AGENCY') &&
                        canSelectAuditAgency(params.row.status)
                    ) {
                        actionButtons.push(
                            <Tooltip key="select-audit" title="Select the Audit Agency">
                                <GridActionsCellItem
                                    icon={<FileUploadIcon color="danger" />}
                                    label="Select Audit Agency"
                                    onClick={() => selectAuditAgency(params.row.intentAppId)}
                                />
                            </Tooltip>
                        );
                    }

                    if (hasLicenseAction(actions, 'NC_ACTION')) {
                        actionButtons.push(
                            <Tooltip key="nc-issued" title="NC Issued By Auditor">
                                <GridActionsCellItem
                                    icon={<ManageAccountsIcon color="danger" />}
                                    label="NC Action"
                                    onClick={() => auditorControls(userName)}
                                />
                            </Tooltip>
                        );
                    }

                    if (hasLicenseAction(actions, 'AUDIT_ACCEPTANCE')) {
                        const letterStatus = String(acceptanceLetterStatus || "NONE").toUpperCase();
                        if (letterStatus === "NONE") {
                            actionButtons.push(
                                <Tooltip key="acceptance-download" title="Download Audit acceptance letter">
                                    <GridActionsCellItem
                                        icon={<DownloadIcon color="info" />}
                                        label="Download Audit acceptance letter"
                                        onClick={() => downloadAuditAcceptanceLetter()}
                                    />
                                </Tooltip>
                            );
                        } else if (letterStatus === "DOWNLOADED") {
                            actionButtons.push(
                                <Tooltip key="acceptance-upload" title="Upload the Audit acceptance letter">
                                    <GridActionsCellItem
                                        icon={<CloudUploadIcon color="info" />}
                                        label="Upload Audit acceptance letter"
                                        onClick={() => handleAcceptanceUploadClick()}
                                    />
                                </Tooltip>
                            );
                        } else if (letterStatus === "UPLOADED") {
                            actionButtons.push(
                                <Tooltip key="acceptance-esign" title="eSign Audit acceptance letter">
                                    <GridActionsCellItem
                                        icon={<DrawIcon color="secondary" />}
                                        label="eSign Audit acceptance letter"
                                        onClick={() => startAcceptanceLetterEsign()}
                                    />
                                </Tooltip>
                            );
                        } else if (letterStatus === "SIGNED") {
                            actionButtons.push(
                                <Tooltip key="acceptance-signed" title="Audit acceptance letter eSigned">
                                    <GridActionsCellItem
                                        icon={<ChecklistIcon color="success" />}
                                        label="Acceptance letter signed"
                                        disabled
                                    />
                                </Tooltip>
                            );
                        }
                    }

                    return <Box sx={{ display: 'flex', gap: '10px', mt: 1 }}>{actionButtons}</Box>;
                },
            },
        ],
        [allApplicationFormList, acceptanceLetterStatus, userName]
    );
    

    return (
        <>
            <input
                ref={acceptanceFileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                style={{ display: "none" }}
                onChange={handleAcceptanceFileSelected}
            />
            {allApplicationFormList.length > 0 ? (
                <CustomTable columns={columns} rows={allApplicationFormList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} hidePagination={true} hideToolbar={true}/>
            ) : (
                !isLoading && (
                    <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                        No application found.
                    </Typography>
                )
            )}
        </>
    );
};

export default ViewApplicationForm;
