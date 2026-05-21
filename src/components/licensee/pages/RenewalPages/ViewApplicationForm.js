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
import GovernmentAgencyForm from '../../../../service/NewLicenseService/GovernmentAgencyForm';
import FirmApplicationForm from '../../../../service/NewLicenseService/FirmApplicationForm';
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentProof from './PaymentProof';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import dayjs from 'dayjs';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService';



const ViewApplicationForm = () => {
    const [allApplicationFormList, setAllApplicationFormList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isAppTypeFound, setAppTypeFound] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();
    const rolePath = useSelector((state)=>state.jwtAuthentication.rolePath);

    const userName = useSelector((state) => state.jwtAuthentication.username);
    const [allApplicationTypeList, setAllApplicationTypeList] = useState([]);



    //------Manish
    const ref = useRef();

    const handleUploadSubmit = () =>{
        ref.current.handleFormSubmit();
    }

    const handleUploadReset = () => {
        ref.current.handleReset();
    }


    const handleAddAuditAgencySubmit = () =>{
        ref.current.handleSubmit();
    }

    const handleAddAuditAgencyReset = () => {
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
                        applicationType: applicationType, // Set the application type name
                        //------Manish
                        intentAppId: intentApp.intentAppId,
                    };
    
                   
                    setAllApplicationFormList([formattedIntentApp]); 
                }
            })
            .catch((err) => {
               // setAllApplicationFormList([]); 
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllApplicationForm();
    }, [allApplicationTypeList]);

   

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
                fullWidth:true
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
    dispatch(setApplicationDetails({applicationType: applicationType.appTypeMasterId}))
    const [applicationTypeData, setApplicationTypeData] = useState({});

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
        navigate("/licensee/renewallicense/renewallicenses");
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
            navigate(`${rolePath}/renewallicense/selectauditagency/${encryptedId}`);
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
            navigate(`${rolePath}/renewallicense/auditordetails/${encryptedId}`);
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
            navigate(`${rolePath}/renewallicense/applicationauditordetails/${encryptedId}`);
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


    const renderIndividualViewData = async(intentId) => {
        try {
            //alert(intentId)
             const response = await ApplicationForm.generatePdf(intentId);
             
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
    

    const handlePaymentApplicationForm= (cid) => {
        
        ApplicationForm.getApplicationPayment(cid)
            .then((response) => {
                console.log("Fetched Application Type list:", response.data);
                showAlert({
                    messageTitle: ' payment done',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: true,
                });
            })
            .catch((err) => {
                console.error("Error fetching Application Type list:", err);
            })
            .finally(() => {
               
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
    const [licenseDetails, setLicenseDetails] = useState({});
 const getLicenseDetailsByUsername = () => {

       // setIsLoading(true);
        LicenseIssuanceService.getLicenseDetails()
            .then((res) => {
                setLicenseDetails(res.data);
            })
            .catch((err) => {

            })
            .finally(() => {
               // setIsLoading(false);
            })


    }

      useEffect(() => {
    
            getLicenseDetailsByUsername();
        }, [])

 {/* added by sumit */ }
    const isRenewalAvailable = () => {
        if (licenseDetails.expiryDate) {
            const expiryDate = dayjs(licenseDetails.expiryDate);
            const currentDate = dayjs();
            const daysUntilExpiry = expiryDate.diff(currentDate, "day");

            // Check if the expiry date is within 45 days from today
            return daysUntilExpiry <= 45 && daysUntilExpiry >= 0;
        }
        return false;
    };

   
    

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 80 },
            { field: 'applicationType', headerName: 'Application Type Name', resizable: false, width: 150 },
            { field: 'created', headerName: 'Submitted', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 100,
            },
            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                minWidth: 200,
                sortable: false,
                renderCell: (params) => {
                    
                    const actionButtons = [];
                    //console.log('Row Status:', params.row.status);
                    if ( params.row.status !== 'LICENSE_ISSUED' ) {
                        actionButtons.push (
                            <Tooltip title="View">
                                <GridActionsCellItem 
                                    icon={<VisibilityIcon color="success" />} 
                                    label="View" 
                                    onClick={() => viewApplicationForm(params.row)} 
                                />
                            </Tooltip>,
                            <Tooltip title="Download Application Form">
                            <GridActionsCellItem 
                                icon={<DownloadIcon color="info" />} 
                                label="Edit" 
                                onClick={() => handleDownload(params.row.intentAppId)} 
                            />
                            </Tooltip>
                            
                        );
                    } 
                    
                    if (params.row.status === 'LICENSE_ISSUED'&& isRenewalAvailable()) {
                        actionButtons.push (
                            <Tooltip title="Edit">
                                <GridActionsCellItem 
                                    icon={<EditIcon color="info" />} 
                                    label="Edit" 
                                    onClick={() => handleEditApplicationForm()} 
                                />
                            </Tooltip>
                        );
                    } 

                    if (params.row.status === 'Edit Upon Review') {
                        actionButtons.push (
                            <Tooltip title="Edit">
                                <GridActionsCellItem 
                                    icon={<EditIcon color="info" />} 
                                    label="Edit" 
                                    onClick={() => handleEditApplicationForm()} 
                                />
                            </Tooltip>
                        );
                    } 

                    if (params.row.status === 'Submitted') {
                        actionButtons.push (
                            <Tooltip title="Payment">
                                <GridActionsCellItem 
                                    icon={<PaymentIcon color="info" />} 
                                    label="Payment" 
                                    onClick={() => handlePaymentApplicationForm(params.row.intentAppId)} 
                                />
                            </Tooltip>
                        );
                    } 

                    if (params.row.status === 'Fee Payment') {
                        actionButtons.push (
                            <Tooltip title="Payment Proof">
                                <GridActionsCellItem 
                                    icon={<CloudUploadIcon color="info" />} 
                                    label="Payment Proof" 
                                    onClick={() => handlePaymentProofForm(params.row.intentAppId)} 
                                />
                            </Tooltip>
                        );
                    } 


                    //------Manish
                    if(params.row.status === "RECOMMENDED_IN_PRINCIPLE_APPROVAL"){

                        actionButtons.push (
                            <Tooltip title="Upload Required Documents">
                                <GridActionsCellItem 
                                    icon={<FileUploadIcon color="danger" />} 
                                    label="Upload" 
                                    onClick={() => uploadRequiredDocuments(params.row.intentAppId)} 
                                />
                            </Tooltip>
                        );

                    }

                    if(params.row.status === "RECOMANDED_FOR_AUDIT"){

                        actionButtons.push (
                            <Tooltip title="Select the Audit Agency">
                                <GridActionsCellItem 
                                    icon={<FileUploadIcon color="danger" />} 
                                    label="select the audit agency" 
                                    onClick={() => selectAuditAgency(params.row.intentAppId)} 
                                />
                            </Tooltip>
                        );

                    }

                    if(params.row.status === "NC Issued By Auditor"){

                        actionButtons.push (
                            <Tooltip title="NC Issued By Auditor">
                                <GridActionsCellItem 
                                    icon={<ManageAccountsIcon  color="danger" />} 
                                    label="select the audit agency" 
                                    onClick={() => auditorControls(userName)} 
                                />
                            </Tooltip>
                        );

                    }

                    if(params.row.status === "Review NC Report"){

                        actionButtons.push (
                            <Tooltip title="Review NC Report">
                                <GridActionsCellItem 
                                    icon={<ManageAccountsIcon  color="danger" />} 
                                    label="select the audit agency" 
                                    onClick={() => applicationAuditorControls(userName)} 
                                />
                            </Tooltip>
                        );

                    }


                    return <Box sx={{ display: 'flex', gap: '10px', mt: 1 }}>{actionButtons}</Box>;

                },
            },
        ],
        [allApplicationFormList]
    );
    

    return (
        <>
            <CustomTable columns={columns} rows={allApplicationFormList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} hidePagination={true} hideToolbar={true}/>
        </>
    );
};

export default ViewApplicationForm;
