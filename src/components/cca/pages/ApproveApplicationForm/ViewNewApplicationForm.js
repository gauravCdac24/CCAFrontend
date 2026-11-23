import { useEffect, useMemo, useRef, useState } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Grid, Switch, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import showAlert from "../../../global/common/MessageBox/AlertService";
import dateFormatter from "../../../global/util/DateFormatter";
import CustomTable from "../../../global/util/CustomTable";
import { useNavigate } from "react-router-dom";
import { encrypt, decrypt } from "../../../global/util/EncryptDecrypt";
import RoleService from "../../../../service/AdminService/RoleService";
import { useDispatch, useSelector } from "react-redux";
import ApplicationType from "../../../../service/AdminService/ApplicationType";
import IntentService from "../../../../service/AdminService/IntentService";
import { setApplicationDetails } from "../../../../store/LicenseApplication/Reducer";
import ApplicationReviewCommittee from "../../../../service/NewLicenseService/ApplicationReviewCommittee";
import IndividualViewData from "./IndividualViewData";
import FirmViewData from "./FirmViewData";
import GovernmentViewData from "./GovernmentViewData";
import MinimumAttempt from "../../../../service/AdminService/MinimumAttempt";
import ApplicationReview from "../../../../service/NewLicenseService/ApplicationReview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import LicenseIssuanceService from "../../../../service/LicenseIssuanceService/LicenseIssuanceService";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const ViewNewApplicationForm = () => {
  const [isLoading, setLoading] = useState(false);
  const [isAppTypeFound, setAppTypeFound] = useState(false);
  const label = { inputProps: { "aria-label": "Switch" } };
  const navigate = useNavigate();

  const userName = useSelector((state) => state.jwtAuthentication.username);
  const [allApplicationTypeList, setAllApplicationTypeList] = useState([]);
  const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

  //------------------------

  const myRef = useRef();

  const callChildMethod = () => {
    myRef.current?.childFunction();
  };

  //-------------------------

  const resolveApplicationTypeName = (matchedType, applicationType) => {
    if (matchedType?.appType) return matchedType.appType;
    if (applicationType === "1") return "Individual";
    if (applicationType === "2") return "Company";
    if (applicationType === "3") return "Partnership Firm";
    if (applicationType === "4") return "Government Organization";
    return "Unknown Type";
  };

  const [licenseDetails, setLicenseDetails] = useState([]);
  const [allApplicationFormList, setAllApplicationFormList] = useState([]);

  const buildApplicationFormRows = (applications, applicationTypes, licenses) => {
    const licenseUsername = (Array.isArray(licenses) ? licenses : [])
      .map((detail) => detail?.userName?.trim())
      .filter(Boolean);
    const typeList = Array.isArray(applicationTypes) ? applicationTypes : [];
    const result = Array.isArray(applications) ? applications : [];
    const updatedData = [];

    for (let i = 0; i < result.length; i++) {
      const uname = result[i]?.applicantUserName;
      const hasMatchingUsername =
        licenseUsername.find((application) => application === uname) || "";

      // Exclude applicants who already have a license
      if (hasMatchingUsername === "") {
        const matchedType = typeList.find(
          (type) =>
            String(type.appTypeMasterId) === String(result[i]?.applicationType)
        );
        updatedData.push({
          id: updatedData.length + 1,
          applicationInitiatedOn: dateFormatter(
            result[i]?.applicationInitiatedOn
          ),
          updated: dateFormatter(result[i]?.updated),
          applicationTypeName: resolveApplicationTypeName(
            matchedType,
            result[i]?.applicationType
          ),
          applicantName: result[i]?.applicantName,
          applicationCurrentStatus: result[i]?.applicationCurrentStatus,
          applicantUserName: result[i]?.applicantUserName,
          intentAppId: result[i]?.intentAppId,
          applicationType: result[i]?.applicationType,
        });
      }
    }

    return updatedData;
  };

  const getAllApplicationForm = () => {
    setLoading(true);

    Promise.all([
      ApplicationType.getAllApplicationTypeList(),
      LicenseIssuanceService.getAllLicenseDetails(),
      ApplicationReviewCommittee.getAllNewApplications(),
    ])
      .then(([typesResponse, licenseResponse, applicationsResponse]) => {
        const typesData = Array.isArray(typesResponse?.data)
          ? typesResponse.data.map((obj, index) => ({
              ...obj,
              id: index + 1,
              created: dateFormatter(obj.created),
              updated: dateFormatter(obj.updated),
            }))
          : [];
        const licensesData = Array.isArray(licenseResponse?.data)
          ? licenseResponse.data
          : [];
        const applicationsData = Array.isArray(applicationsResponse?.data)
          ? applicationsResponse.data
          : [];

        setAllApplicationTypeList(typesData);
        setLicenseDetails(licensesData);
        setAppTypeFound(true);
        setAllApplicationFormList(
          buildApplicationFormRows(applicationsData, typesData, licensesData)
        );
      })
      .catch((err) => {
        console.error("Error loading application table data:", err);
        setAllApplicationFormList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllApplicationForm();
  }, []);

  const changeApplicationFormStatus = (id) => {
    setLoading(true);
    RoleService.changeRoleStatus(id)
      .then((response) => {
        getAllApplicationForm(); //Refresh
      })
      .catch((err) => {
        showAlert({
          messageTitle: "Error",
          messageContent:
            "Error changing country status. Please try again later.",
          confirmText: "OK",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [applicationType, setApplicationType] = useState({
    appTypeMasterId: "",
    appType: "",
  });
  const [activeStep, setActiveStep] = useState(0);

  const [steps, setSteps] = useState([]); // Store steps based on application type

  const dispatch = useDispatch();
  dispatch(
    setApplicationDetails({ applicationType: applicationType.appTypeMasterId })
  );
  const [applicationTypeData, setApplicationTypeData] = useState({});

  useEffect(() => {
    setLoading(true);
    IntentService.getIntentByUserName(userName)
      .then((data) => {
        console.log("applicationTypeData===>", data.data);
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
      .catch((error) => {
        console.error("Error fetching application types:", error);
        setLoading(false);
      });
  }, [userName]);
  console.log("allApplicationFormList===>", allApplicationFormList);

  // -------------------------------------------------------------
  // CHANGE 1: Renamed 'renderStepContent' to 'renderStepsContent'
  // (plural) to match the new columns logic.
  // -------------------------------------------------------------
  const renderStepsContent = (id, applicantUserName, onconfirm) => {
    //alert(parseInt(id))
    switch (parseInt(id)) {
      case 1:
        return (
          <IndividualViewData
            userName={applicantUserName}
            onSuccess={getAllApplicationForm}
          />
        );
      case 2:
      case 3:
        return (
          <FirmViewData
            userName={applicantUserName}
            onSuccess={getAllApplicationForm}
          />
        );
      case 4:
        return (
          <GovernmentViewData
            userName={applicantUserName}
            onSuccess={getAllApplicationForm}
          />
        );
      default:
        return <Typography variant="h6">Unknown step</Typography>;
    }
  };

  // -------------------------------------------------------------
  // CHANGE 2: Updated 'viewApplicationForms' (plural) to match
  // the new columns logic.
  // -------------------------------------------------------------
  const viewApplicationForms = (id, applicantUserName) => {
    if (id) {
      //alert(id)
      showAlert({
        messageTitle: "Review Application Form",
        messageContent: renderStepsContent(id, applicantUserName),
        confirmText: "Yes",
        onConfirm: () => callChildMethod(),
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
        maxWidth: "md",
        fullWidth: true,
      });
    } else {
      showAlert({
        messageTitle: "View Application Form",
        messageContent:
          "Error in getting application details, try after some time.",
        confirmText: "Ok",
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
    }
  };

  const [allMinimumAttemptList, setAllMinimumAttemptsList] = useState([]);

  const getAllMinimumAttempt = () => {
    setLoading(true);
    MinimumAttempt.getAllActiveMinimumAttemptList()
      .then((response) => {
        console.log("Fetched Minimum Attempts list:", response.data);
        setAllMinimumAttemptsList(() => {
          return response.data.map((obj, index) => {
            obj["id"] = index + 1;
            obj["created"] = dateFormatter(obj.created);
            obj["updated"] = dateFormatter(obj.updated);
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

  // const getAllApplicationReview = () => {
  //   setLoading(true);
  //   // Ensure you are calling the correct service method for this page
  //   ApplicationReview.getAllApplicationReviewList()
  //     .then((response) => {
  //       console.log("Fetched review application list:", response.data);

  //       if (response.data && response.data.length > 0) {
  //         // 1. TRANSFORM THE DATA
  //         const formattedData = response.data.map((obj, index) => {
  //           return {
  //             ...obj,
  //             id: index + 1, // Fixes "MUI X: Missing ID" crash

  //             // Fixes "View Button" error
  //             applicationType: obj.intentAppId?.appTypeMasterId,

  //             // Fixes Empty Columns
  //             applicantUserName: obj.intentAppId?.userName || "N/A",
  //             applicationCurrentStatus:
  //               obj.intentAppId?.applicationStatus || "Pending",

  //             // Map Application Type Name
  //             applicationTypeName:
  //               allApplicationTypeList.find(
  //                 (item) =>
  //                   item.appTypeMasterId ===
  //                   parseInt(obj.intentAppId?.appTypeMasterId)
  //               )?.appType || "NA",

  //             applicantName: obj.intentAppId?.userName,
  //           };
  //         });

  //         // 2. SAVE FORMATTED DATA TO STATE
  //         setAllApplicationReviewList(formattedData);
  //       } else {
  //         setAllApplicationReviewList([]);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching review application list:", err);
  //       setAllApplicationReviewList([]);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  const getAllApplicationReview = () => {
    setLoading(true);
    ApplicationReview.getAllApplicationReviewList()
      .then((response) => {
        console.log("Fetched review application list:", response.data);

        if (response.data && response.data.length > 0) {
          // 1. Format the data
          const formattedData = response.data.map((obj, index) => {
            return {
              ...obj,
              id: index + 1,
              applicationType: obj.intentAppId?.appTypeMasterId,
              applicantUserName: obj.intentAppId?.userName || "N/A",

              // Get the status directly
              applicationCurrentStatus:
                obj.intentAppId?.applicationStatus || "Pending",

              applicationTypeName:
                allApplicationTypeList.find(
                  (item) =>
                    item.appTypeMasterId ===
                    parseInt(obj.intentAppId?.appTypeMasterId)
                )?.appType || "NA",

              applicantName: obj.intentAppId?.userName,
            };
          });

          // 2. FILTER: Only show applications that need your attention.
          // We want to KEEP 'underReview', 'Pending', or 'Edit_Upon_Review'.
          // We want to HIDE 'Recomanded For Audit Agency', 'Approved', etc.
          const pendingApplications = formattedData.filter((item) => {
            const status = item.applicationCurrentStatus;

            // Check against the exact strings from your database
            // Note: Includes "Recomanded" (typo handling) just in case
            if (
              status === "Recomanded For Audit Agency" ||
              status === "Recommended For Audit Agency" ||
              status === "Approved From Review" ||
              status === "Send To Rejection"
            ) {
              return false; // HIDE these
            }

            return true; // SHOW everything else (Pending, underReview, etc.)
          });

          // 3. Set the state with the FILTERED list
          setAllApplicationReviewList(pendingApplications);
        } else {
          setAllApplicationReviewList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching review application list:", err);
        setAllApplicationReviewList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    // Check if allApplicationReviewList is valid and contains data
    if (
      Array.isArray(allApplicationReviewList) &&
      allApplicationReviewList.length > 0
    ) {
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

  console.log("hvgshgfvgfji=======>", JSON.stringify(applicationReview));

  console.log(
    "allApplicationReviewList=======>",
    JSON.stringify(allApplicationReviewList)
  );

  console.log("applicationCounts=======>", JSON.stringify(applicationCounts));

  useEffect(() => {
    renderStepsContent();
    getAllMinimumAttempt();
    getAllApplicationReview();
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
        messageTitle: "Edit Application Form",
        messageContent: "Error in updating Role details, try after some time.",
        confirmText: "Ok",
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
    }
  };

  // -------------------------------------------------------------
  // CHANGE 3: Added 'auditorDetails' function
  // -------------------------------------------------------------
  const auditorDetails = (cid) => {
    if (cid) {
      const encryptedId = encodeURIComponent(encrypt(cid));
      navigate(`${rolePath}/auditorlicense/auditordetails/${encryptedId}`);
    } else {
      showAlert({
        messageTitle: "Auditor Details",
        messageContent:
          "Error in Auditor Details details, try after some time.",
        confirmText: "Ok",
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
    }
  };

  // -------------------------------------------------------------
  // CHANGE 4: Added 'sendToRejection' function
  // -------------------------------------------------------------
  const sendToRejection = (cid) => {
    if (cid) {
      const encryptedId = encodeURIComponent(encrypt(cid));
      navigate(`${rolePath}/auditorlicense/sendToRejection/${encryptedId}`);
    } else {
      showAlert({
        messageTitle: "Auditor Control",
        messageContent: "Error in Auditor Control, try after some time.",
        confirmText: "Ok",
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
    }
  };

  // -------------------------------------------------------------
  // CHANGE 5: Replaced the 'columns' array with the CORRECT one
  // that handles "NA" (via valueGetter) and the Action Buttons.
  // -------------------------------------------------------------
  // const columns = [
  //   { field: "id", headerName: "Sl. No.", resizable: true, width: 80 },
  //   {
  //     field: "applicantName",
  //     headerName: "Applicant Name",
  //     resizable: true,
  //     width: 150,
  //   },
  //   {
  //     field: "applicantUserName",
  //     headerName: "Applicant User Name",
  //     resizable: true,
  //     width: 150,
  //   },

  //   // --- FIXED: Shows correct Name instead of "NA" ---
  //   {
  //     field: "applicationTypeName",
  //     headerName: "Application Type Name",
  //     resizable: true,
  //     width: 180,
  //     valueGetter: (params) => {
  //       const typeId = params.row.intentAppId?.appTypeMasterId;
  //       const matchedType = allApplicationTypeList.find(
  //         (item) => item.appTypeMasterId === parseInt(typeId)
  //       );
  //       return matchedType ? matchedType.appType : "NA";
  //     },
  //   },

  //   {
  //     field: "applicationCurrentStatus",
  //     headerName: "Application Current Status",
  //     resizable: true,
  //     width: 180,
  //   },

  //   // --- FIXED: Shows View/Upload buttons correctly ---
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     resizable: false,
  //     minWidth: 100,
  //     sortable: false,
  //     renderCell: (params) => {
  //       const actionButtons = [];

  //       // 1. VIEW BUTTON (Shows for everything except 'pending')
  //       if (
  //         params.row.applicationCurrentStatus &&
  //         params.row.applicationCurrentStatus.toLowerCase() !== "pending"
  //       ) {
  //         actionButtons.push(
  //           <Tooltip title="View the Renewal Application" key="view-renewal">
  //             <GridActionsCellItem
  //               icon={<VisibilityIcon color="success" />}
  //               label="View"
  //               onClick={() =>
  //                 viewApplicationForms(
  //                   params.row.applicationType,
  //                   params.row.applicantUserName
  //                 )
  //               }
  //             />
  //           </Tooltip>
  //         );
  //       }

  //       // 2. UPLOAD BUTTON (Shows only for Recommended for Audit)
  //       if (
  //         params.row.applicationCurrentStatus === "Recomanded For Audit Agency"
  //       ) {
  //         actionButtons.push(
  //           <Tooltip
  //             title="Upload Undertaking & Auditors Details"
  //             key="upload-undertaking"
  //           >
  //             <GridActionsCellItem
  //               icon={<FileUploadIcon color="error" />}
  //               label="Upload"
  //               onClick={() => auditorDetails(params.row.applicantUserName)}
  //             />
  //           </Tooltip>
  //         );
  //       }

  //       // 3. REJECTION BUTTON
  //       if (params.row.applicationCurrentStatus === "Send To Rejection") {
  //         actionButtons.push(
  //           <Tooltip title="Send To Rejection" key="Send To Rejection">
  //             <GridActionsCellItem
  //               icon={<FileUploadIcon color="error" />}
  //               label="Guideline"
  //               onClick={() => sendToRejection(params.row.applicantUserName)}
  //             />
  //           </Tooltip>
  //         );
  //       }

  //       return (
  //         <Box sx={{ display: "flex", gap: "10px", mt: 1 }}>
  //           {actionButtons}
  //         </Box>
  //       );
  //     },
  //   },
  // ];

  const columns = [
    { field: "id", headerName: "Sl. No.", resizable: true, width: 80 },
    {
      field: "applicantName",
      headerName: "Applicant Name",
      resizable: true,
      width: 150,
    },
    {
      field: "applicantUserName",
      headerName: "Applicant User Name",
      resizable: true,
      width: 150,
    },

    {
      field: "applicationTypeName",
      headerName: "Application Type Name",
      resizable: true,
      width: 180,
      // valueGetter: (value, row) => {
      //   // Handle both MUI v5 (params.row) and v6 (row) structures
      //   const currentRow = row || value?.row;

      //   const typeId = currentRow?.intentAppId?.appTypeMasterId;

      //   if (!typeId) return "NA";

      //   const matchedType = allApplicationTypeList.find(
      //     (item) => item.appTypeMasterId === parseInt(typeId)
      //   );
      //   return matchedType ? matchedType.appType : "NA";
      // },
    },

    {
      field: "applicationCurrentStatus",
      headerName: "Application Current Status",
      resizable: true,
      width: 180,
    },

    // --- Action Buttons ---
    {
      field: "action",
      headerName: "Action",
      resizable: false,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        const actionButtons = [];

        // 1. VIEW BUTTON
        if (
          params.row.applicationCurrentStatus &&
          params.row.applicationCurrentStatus.toLowerCase() !== "pending"
        ) {
          actionButtons.push(
            <Tooltip title="View the Renewal Application" key="view-renewal">
              <GridActionsCellItem
                icon={<VisibilityIcon color="success" />}
                label="View"
                onClick={() =>
                  viewApplicationForms(
                    params.row.applicationType,
                    params.row.applicantUserName
                  )
                }
              />
            </Tooltip>
          );
        }

        // 2. UPLOAD BUTTON
        if (
          params.row.applicationCurrentStatus === "Recomanded For Audit Agency"
        ) {
          actionButtons.push(
            <Tooltip
              title="Upload Undertaking & Auditors Details"
              key="upload-undertaking"
            >
              <GridActionsCellItem
                icon={<FileUploadIcon color="error" />}
                label="Upload"
                onClick={() => auditorDetails(params.row.applicantUserName)}
              />
            </Tooltip>
          );
        }

        // 3. REJECTION BUTTON
        if (params.row.applicationCurrentStatus === "Send To Rejection") {
          actionButtons.push(
            <Tooltip title="Send To Rejection" key="Send To Rejection">
              <GridActionsCellItem
                icon={<FileUploadIcon color="error" />}
                label="Guideline"
                onClick={() => sendToRejection(params.row.applicantUserName)}
              />
            </Tooltip>
          );
        }

        return (
          <Box sx={{ display: "flex", gap: "10px", mt: 1 }}>
            {actionButtons}
          </Box>
        );
      },
    },
  ];
  return (
    <>
      <CustomTable
        columns={columns}
        rows={allApplicationFormList}
        loading={isLoading}
        //rows={allApplicationReviewList}
        hideColumnsForExport={["Action"]}
        pageSizeOptions={[10, 25, 50, 100]}
        hidePagination={true}
        hideToolbar={false}
      />
    </>
  );
};

export default ViewNewApplicationForm;
