import { useEffect, useMemo, useRef, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Grid, Switch, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../../global/common/MessageBox/AlertService';
import dateFormatter from '../../global/util/DateFormatter';
import CustomTable from '../../global/util/CustomTable';
import { useNavigate } from 'react-router-dom';
import { encrypt,decrypt } from '../../global/util/EncryptDecrypt';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationType from '../../../service/AdminService/ApplicationType';
import IntentService from '../../../service/AdminService/IntentService';
import { setApplicationDetails } from '../../../store/LicenseApplication/Reducer';
import ApplicationReviewCommittee from '../../../service/RenewLicenseService/ApplicationReviewCommittee';
import IndividualViewData from './IndividualViewData';
import FirmViewData from './FirmViewData';
import GovernmentViewData from './GovernmentViewData';
import MinimumAttempt from '../../../service/AdminService/MinimumAttempt';
import ApplicationReview from '../../../service/RenewLicenseService/ApplicationReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AuditService from '../../../service/AuditService/AuditService';

const ViewNewApplicationForm = () => {
    const [isLoading, setLoading] = useState(false);
    const [isAppTypeFound, setAppTypeFound] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const userName = useSelector((state) => state.jwtAuthentication.username);
    const [allApplicationTypeList, setAllApplicationTypeList] = useState([]);
    const rolePath = useSelector((state)=>state.jwtAuthentication.rolePath);

    //------------------------
    
    const myRef = useRef();
    
    const callChildMethod = () => {
        myRef.current?.handleFormSubmit();
    }
    

    const myAcceptRef = useRef();
    
    const callAcceptedMethod = () => {
        myAcceptRef.current?.handleFormSubmit();
    }
    
    //-------------------------


    const getAllApplicationType= () => {
        
    
        ApplicationType.getAllApplicationTypeList()
            .then((response) => {
                console.log("Fetched Application Type list:", response.data);
                setAllApplicationTypeList(() => {
                    return response.data.map((obj, index) => {
                        obj['id'] = index + 1;
                        obj['created'] = dateFormatter(obj.created);
                        obj['updated'] = dateFormatter(obj.updated);
                        return obj;
                    });
                });
            })
            .catch((err) => {
                console.error("Error fetching Application Type list:", err);
            })
            .finally(() => {
                setAppTypeFound(true);
            });
    };
    console.log("Fetched allApplicationTypeList list:", allApplicationTypeList);

    const [allApplicationFormList, setAllApplicationFormList] = useState({});
    const getAllApplicationForm = () => {
        setLoading(true); // Start loading
    
        ApplicationReviewCommittee.getAllApplication()
            .then((response) => {
                console.log(response.data);
    
                // Assuming response.data is an object
                setAllApplicationFormList(() => {
                    // Convert object entries to an array and map over them
                    return Object.entries(response.data).map(([key, value], index) => {
                        // Assuming value is the object that contains properties like created and updated
                        return {
                            ...value, // Spread existing object properties
                            id: index + 1, // Adding an id based on index
                            applicationInitiatedOn: dateFormatter(value.applicationInitiatedOn), // Formatting created date
                            updated: dateFormatter(value.updated), // Formatting updated date
                            applicationTypeName : (allApplicationTypeList.find(item=>item.appTypeMasterId===parseInt(value.applicationType)))?.appType || 'NA'
                        };
                    });
                });
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching All Data list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false); // Stop loading
            });
    };
    
    console.log("Fetched allApplicationFormList list:", allApplicationFormList);

    useEffect(() => {
        getAllApplicationForm();
        getAllApplicationType();
    }, [isAppTypeFound]);

   

    const viewApplicationForm = (id,applicantUserName) => {
        if (id) {
            //alert(id)
            showAlert({
                messageTitle: 'Review Renew Application Form',
                messageContent: renderStepContent(id,applicantUserName),  // Pass applicationData to renderStepContent
               // buttonTwoText:"Application Accepted",
                buttonOneText: 'Submit For Review',
                onButtonOneClick: () => callChildMethod() ,
                //onButtonTwoClick:()=>callAcceptedMethod(),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
                maxWidth:'md',
                fullWidth:true
            });
        } else {
            showAlert({
                messageTitle: 'Review Renew Application Form',
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
                console.log("applicationTypeData===>",data.data);
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
console.log("allApplicationFormList===>",allApplicationFormList)

const renderStepContent = (id,applicantUserName, onconfirm) => {
    //alert(parseInt(id))
        switch (parseInt(id)) {
            case 1:
                return <IndividualViewData  userName={applicantUserName} ref={myRef} />;
            case 2:
            case 3:
                return <FirmViewData userName={applicantUserName} ref={myRef}/>;
            case 4:
                return <GovernmentViewData  userName={applicantUserName} ref={myRef} />;
            default:
                return <Typography  variant="h6">Unknown step</Typography>;
        }
   
};
const [allMinimumAttemptList, setAllMinimumAttemptsList] = useState([]);

const getAllMinimumAttempt= () => {
    setLoading(true);
    MinimumAttempt.getAllActiveMinimumAttemptList()
        .then((response) => {
            console.log("Fetched Minimum Attempts list:", response.data);
            setAllMinimumAttemptsList(() => {
                return response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
            });
        })
        .catch((err) => {
            console.error("Error fetching Minimum Attempts list:", err);
        })
        .finally(() => {
            setLoading(false);
        });
};

const [allApplicationReviewList, setAllApplicationReviewList] = useState([]);
const [applicationCounts, setApplicationCounts] = useState({});
const [applicationReview, setApplicationReview] = useState({});

const getAllApplicationReview = () => {
    setLoading(true);
    AuditService.getAllData()
        .then((response) => {
            console.log("Fetched  application list:", response.data);

            // Check if the response data is valid and not empty
            if (response.data && response.data.length > 0) {
                setAllApplicationReviewList(response.data);
            } else {
                setAllApplicationReviewList([]); // Set empty list if no data is found
                console.warn("No review application data found");
            }
        })
        .catch((err) => {
            console.error("Error fetching  application list:", err);
            setAllApplicationReviewList([]); // Clear the list in case of an error
        })
        .finally(() => {
            setLoading(false);
        });
};

 // State to store the total rows count
 const [totalRows, setTotalRows] = useState(0);

 useEffect(() => {
   // Check if allApplicationReviewList is valid and contains data
   if (Array.isArray(allApplicationReviewList) && allApplicationReviewList.length > 0) {
     
     const totalRows = allApplicationReviewList.length;

     // Store the total row count in the state
     setTotalRows(totalRows);

     console.log('Total rows:', totalRows); // Log the total rows count
   } else {
   
     setTotalRows(0); 
     console.warn('No application review data found or list is empty');
   }
 }, [allApplicationReviewList]); 

useEffect(() => {
    if (allMinimumAttemptList.length > 0) {
        const counts = {};
        allMinimumAttemptList.forEach((app) => {
            const reviewId = app.applicationAudit; // Adjust according to your data structure
            console.log("reviewId=======>",reviewId);
            setApplicationReview(reviewId);
        });
      
    }
}, [allMinimumAttemptList]);

console.log("hvgshgfvgfji=======>",JSON.stringify(applicationReview))

console.log("allApplicationReviewList=======>",JSON.stringify(allApplicationReviewList))

console.log("applicationCounts=======>",JSON.stringify(applicationCounts))

    useEffect(() => {
        renderStepContent()
        getAllMinimumAttempt()
        getAllApplicationReview()
    }, []);

    const handleEditApplicationForm = () => {
        // Assuming you want to pass formDetails to the AddApplicationForm route
        navigate("/applicant/applicationform/addapplicationform");
    };


    const renderStepsContent = (id,userName) => {
        const stepId = parseInt(id, 10);
        switch (stepId) {
            case 1:
                return <IndividualViewData userName={userName} />;  // Pass data as props
            case 2:
                return <FirmViewData userName={userName} />;
            case 3:
                return <FirmViewData userName={userName} />;
            case 4:
                return <GovernmentViewData userName={userName} />;
            default:
                return <Typography variant="h6">Unknown step</Typography>;
        }
    };
    
    useEffect(() => {
        renderStepsContent()
    }, []);




// Minimum Attempts







    const viewApplicationForms = (id,userName) => {
        if (id) {
            showAlert({
                messageTitle: 'View Renew Application Form',
                messageContent: renderStepsContent(id,userName),  // Pass applicationData to renderStepContent
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
                maxWidth:'md',
                fullWidth:true
            });
        } else {
            showAlert({
                messageTitle: 'View Renew Application Form',
                messageContent: 'Error in getting application details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
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

    const auditorDetails = (cid) => {
        
        alert(cid)
        if (cid) {
            const encryptedId = encodeURIComponent(encrypt(cid));
            navigate(`${rolePath}/auditorlicense/auditordetails/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Auditor Details',
                messageContent: 'Error in Auditor Details details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const reviewncreport = (cid) => {
        
        if (cid) {
          //  alert(rolePath)
            const encryptedId = encodeURIComponent(encrypt(cid));
            navigate(`${rolePath}/reviewauditreport/reviewreport/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Review NC Report',
                messageContent: 'Error in Review NC Report, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const columns = [
        { field: 'id', headerName: 'Sl. No.', resizable: true, width: 80 },
        { field: 'applicantName', headerName: 'Applicant Name', resizable: true, width: 150 },
        { field: 'applicantUserName', headerName: 'Applicant User Name', resizable: true, width: 150 },
        { field: 'applicationTypeName', headerName: 'Application Type Name', resizable: true, width: 150 },
        { field: 'applicationCurrentStatus', headerName: 'Application Current Status', resizable: true, width: 180 },
        {
            field: 'action',
            headerName: 'Action',
            resizable: false,
            minWidth: 100,
            sortable: false,
            renderCell: (params) => {
                const actionButtons = [];
                const { applicationCurrentStatus, applicationType, applicantUserName, intentAppId } = params.row;
        
                // Ensure `applicationCounts` exists and is defined
                const currentCount = applicationCounts?.[intentAppId] || 0;
                const isIntentIdExists = Object.keys(applicationCounts).includes(intentAppId?.toString());
        
                // Check if the application status is not "pending"
                if (applicationCurrentStatus !== 'pending') {
                    actionButtons.push(
                        <Tooltip title="View the Application" key="view-application">
                            <GridActionsCellItem
                                icon={<VisibilityIcon color="success" />}
                                label="View"
                                onClick={() => viewApplicationForms(applicationType, applicantUserName)}
                            />
                        </Tooltip>
                    );
                }
        
                // Check if the status is "Review NC Report"
                if (applicationCurrentStatus === 'Review Audit Report') {
                    actionButtons.push(
                        <Tooltip title="Review NC Report" key="review-nc-report">
                            <GridActionsCellItem
                                icon={<FileUploadIcon color="error" />}
                                label="Upload"
                                onClick={() => reviewncreport(applicantUserName)}
                            />
                        </Tooltip>
                    );
                }
        
                // If no conditions were met, return null (no buttons shown)
                if (actionButtons.length === 0) {
                    return null; // Prevent rendering anything if no condition is met
                }
        
                // Return the action buttons
                return (
                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    {actionButtons}
                </Box>
                );
            },
        }
        
    ];
    
    
    

    return (
        <>
            <CustomTable columns={columns} rows={allApplicationFormList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} hidePagination={true} hideToolbar={false}/>
        </>
    );
};

export default ViewNewApplicationForm;
