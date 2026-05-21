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
import RoleService from '../../../service/AdminService/RoleService';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationType from '../../../service/AdminService/ApplicationType';
import IntentService from '../../../service/AdminService/IntentService';
import { setApplicationDetails } from '../../../store/LicenseApplication/Reducer';
import ApplicationReviewCommittee from '../../../service/NewLicenseService/ApplicationReviewCommittee';
import IndividualViewData from './IndividualViewData';
import FirmViewData from './FirmViewData';
import GovernmentViewData from './GovernmentViewData';
import MinimumAttempt from '../../../service/AdminService/MinimumAttempt';
import ApplicationReview from '../../../service/NewLicenseService/ApplicationReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from "@mui/icons-material/Payment";
import LicenseIssuanceService from '../../../service/LicenseIssuanceService/LicenseIssuanceService';



const ViewNewApplicationForm = () => {
    const [isLoading, setLoading] = useState(false);
    const [isAppTypeFound, setAppTypeFound] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();

    const userName = useSelector((state) => state.jwtAuthentication.username);
    const [allApplicationTypeList, setAllApplicationTypeList] = useState([]);


    //------------------------
    
    const myRef = useRef();
    
    const callChildMethod = () => {
        myRef.current?.childFunction();
    }
    
    //-------------------------


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


    console.log("Fetched allApplicationTypeList list:", allApplicationTypeList);

 const [licenseDetails, setLicenseDetails] = useState({});
 const getLicenseDetailsByUsername = () => {

       // setIsLoading(true);
        LicenseIssuanceService.getAllLicenseDetails()
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


    const [allApplicationFormList, setAllApplicationFormList] = useState({});
    const getAllApplicationForm = () => {
  setLoading(true);
  ApplicationReviewCommittee.getAllNewApplication()
    .then((response) => {
      
        const result = response.data;

      const licenseUsername = licenseDetails?.map((detail) => detail?.userName?.trim())?.filter(Boolean) || [];
      console.log('License Username:', licenseUsername);

      const updatedData = [];

      for(var i=0;i<result.length;i++){

        const uname = result[i]?.applicantUserName;
console.log("abc=-->",uname)
        // Check if any application in response.data matches licenseDetails.username
        const hasMatchingUsername = licenseUsername.find((application) => application === uname) || '';

        console.log('Has Matching Username:', hasMatchingUsername);

        // Only set data if there is a match
        if (hasMatchingUsername === '') {

              const matchedType = allApplicationTypeList.find(
                (type) => type.appTypeMasterId === parseInt(result[i]?.applicationType)
              );
              const applicationType = matchedType ? matchedType?.appType : 'Unknown Type';
              const obj =  {
                
                id: i + 1,
                applicationInitiatedOn: dateFormatter(result[i]?.applicationInitiatedOn),
                updated: dateFormatter(result[i]?.updated),
                applicationTypeName: applicationType,
                applicantName:result[i]?.applicantName,
                applicationCurrentStatus:result[i]?.applicationCurrentStatus,
                applicantUserName:result[i]?.applicantUserName,
                intentAppId:result[i]?.intentAppId,
                applicationType:result[i]?.applicationType,

              };
            
        
              updatedData.push(obj);
        
          
        } 

        setAllApplicationFormList(updatedData);

      };

    })
    .catch((err) => {
      // showAlert commented out
    })
    .finally(() => {
      setLoading(false);
    });
};
    
    console.log("Fetched allApplicationFormList list:", allApplicationFormList);

    useEffect(() => {
     
        getAllApplicationForm();
        
    }, [allApplicationTypeList]);

    const changeApplicationFormStatus = (id) => {
        setLoading(true);
        RoleService.changeRoleStatus((id))
            .then((response) => {
                getAllApplicationForm(); //Refresh
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



    const viewApplicationForm = (id,applicantUserName) => {
        if (id) {
            //alert(id)
            showAlert({
                messageTitle: 'Review Application Form',
                messageContent: renderStepContent(id,applicantUserName),  // Pass applicationData to renderStepContent
                confirmText: 'Yes',
                onConfirm: () => callChildMethod() ,
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
                return <IndividualViewData  userName={applicantUserName}  />;
            case 2:
            case 3:
                return <FirmViewData userName={applicantUserName} />;
            case 4:
                return <GovernmentViewData  userName={applicantUserName} />;
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
    ApplicationReview.getAllApplicationReviewList()
        .then((response) => {
            console.log("Fetched review application list:", response.data);

            // Check if the response data is valid and not empty
            if (response.data && response.data.length > 0) {
                setAllApplicationReviewList(response.data);
            } else {
                setAllApplicationReviewList([]); // Set empty list if no data is found
                console.warn("No review application data found");
            }
        })
        .catch((err) => {
            console.error("Error fetching review application list:", err);
            setAllApplicationReviewList([]); // Clear the list in case of an error
        })
        .finally(() => {
            setLoading(false);
        });
};

useEffect(() => {
    // Check if allApplicationReviewList is valid and contains data
    if (Array.isArray(allApplicationReviewList) && allApplicationReviewList.length > 0) {
        const counts = {};
        allApplicationReviewList.forEach((app) => {
            const intentId = app.intentAppId.intentAppId; // Adjust according to your data structure
            if (counts[intentId]) {
                counts[intentId]++;
            } else {
                counts[intentId] = 1;
            }
        });
        setApplicationCounts(counts);
    } else {
        // Handle case where allApplicationReviewList is empty or not available
        setApplicationCounts({}); // Clear the counts if there's no data
        console.warn("No application review data found or list is empty");
    }
}, [allApplicationReviewList]);

useEffect(() => {
    if (allMinimumAttemptList.length > 0) {
        const counts = {};
        allMinimumAttemptList.forEach((app) => {
            const reviewId = app.applicationReview; // Adjust according to your data structure
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

    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
    // const navigate = useNavigate();
    
    // Debugging routeRootPath
    console.log("Route Path:", routeRootPath);
    
    const renderIndividualViewData = (applicantUserName) => {
        const userName = encodeURIComponent(encrypt(applicantUserName));
        console.log("Navigating to Individual view:", `${routeRootPath}/newapplication/reviewapplication/${userName}`);
        navigate(`${routeRootPath}/newapplication/reviewapplication/${userName}`);
    };
    
    const renderFirmViewData = async (applicantUserName) => {
        const userName = encodeURIComponent(encrypt(applicantUserName));
        console.log("Navigating to Firm view:", `${routeRootPath}/newapplication/reviewapplicationes/${userName}`);
        navigate(`${routeRootPath}/newapplication/reviewapplicationes/${userName}`);
    };
    
    const renderGovernmentViewData = async (applicantUserName) => {
        const userName = encodeURIComponent(encrypt(applicantUserName));
        console.log("Navigating to Government view:", `${routeRootPath}/newapplication/reviewapplications/${userName}`);
        navigate(`${routeRootPath}/newapplication/reviewapplications/${userName}`);
    };
    
    const handleDownload = (id, applicantUserName) => {
        console.log("Handle download called with id:", id, "and applicantUserName:", applicantUserName);
        switch (parseInt(id)) {
            case 1:
                return renderIndividualViewData(applicantUserName);
            case 2:
            case 3:
                return renderFirmViewData(applicantUserName);
            case 4:
                return renderGovernmentViewData(applicantUserName);
            default:
                return <Typography variant="h6">Unknown step</Typography>;
        }
    };
    
    







    const columns = [
        { field: 'id', headerName: 'Sl. No.', resizable: true,width: 50  },
        { field: 'applicantName', headerName: 'Applicant Name', resizable: true,width: 150  },
        { field: 'applicantUserName', headerName: 'Applicant User Name', resizable: true,width: 150  },
        // { field: 'acknowledgementNo', headerName: 'Acknowledgement Number', resizable: false },
        { field: 'applicationTypeName', headerName: 'Application Type Name', resizable: true },
        { field: 'applicationCurrentStatus', headerName: 'Application Current Status', resizable: true, width: 150 },
        // { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
        {
            field: 'action',
            headerName: 'Action',
            resizable: true,
            flex: 1,
            minWidth: 100,
            sortable: false,
            renderCell: (params) => {
                // Check if the application is under review
                if (params.row.applicationCurrentStatus === 'underReview') {
                    // Get the intentId for the current row
                    const intentId = params.row.intentAppId; // Ensure this matches your data structure
                    const currentCount = applicationCounts[intentId] || 0; // Get count or default to 0
        
                    // Debugging logs
                    console.log("intentId==>", intentId);
                    console.log('currentCount==>', currentCount);
                    console.log('applicationReview==>', applicationReview);
        
                    // Check if the current count matches the required application review count
                    const isCountMatching = applicationReview >= currentCount;
        
                    // Check if the intentId exists in applicationCounts
                    const isIntentIdExists = Object.keys(applicationCounts).includes(intentId.toString());
        
                    // If counts are equal and intentId exists, show the CheckCircleIcon
                    if (isCountMatching && isIntentIdExists) {
                        return (
                            <Tooltip title="Approval for Rejection by CCA">
                                <span>
                                    <CheckCircleIcon color="primary" /> {/* Check icon indicating success */}
                                </span>
                            </Tooltip>
                        );
                    } else {
                        // If counts are not equal, show the VisibilityIcon
                        return (
                            <Tooltip title="View">
                                <GridActionsCellItem 
                                    icon={<VisibilityIcon color="success" />} 
                                    label="View" 
                                    onClick={() => handleDownload(params.row.applicationType, params.row.applicantUserName)} 
                                />
                            </Tooltip>
                        );
                    }
                } else if (params.row.applicationCurrentStatus === 'Edit_Upon_Review') {
                    return (
                        <Tooltip title="Edit">
                            <GridActionsCellItem 
                                icon={<EditIcon color="info" />} 
                                label="Edit" 
                                onClick={() => handleDownload(params.row.applicationType, params.row.applicantUserName)} 
                            />
                        </Tooltip>
                        
                    );
                } else {
                    return null; // Return null for other statuses if not needed
                }
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
