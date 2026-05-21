import { useEffect, useMemo, useRef, useState } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Grid, Switch, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import showAlert from "../../global/common/MessageBox/AlertService";
import dateFormatter from "../../global/util/DateFormatter";
import CustomTable from "../../global/util/CustomTable";
import { useNavigate } from "react-router-dom";
import { encrypt, decrypt } from "../../global/util/EncryptDecrypt";

import { useDispatch, useSelector } from "react-redux";
import ApplicationType from "../../../service/AdminService/ApplicationType";
import IntentService from "../../../service/AdminService/IntentService";
import { setApplicationDetails } from "../../../store/LicenseApplication/Reducer";
import ApplicationReviewCommittee from "../../../service/RenewLicenseService/ApplicationReviewCommittee";

import MinimumAttempt from "../../../service/AdminService/MinimumAttempt";
import ApplicationReview from "../../../service/RenewLicenseService/ApplicationReview";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import AuditService from "../../../service/AuditService/AuditService";

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
    myRef.current?.handleFormSubmit();
  };

  const myAcceptRef = useRef();

  const callAcceptedMethod = () => {
    myAcceptRef.current?.handleFormSubmit();
  };

  //-------------------------

  const [getAllAnnexureMain, setAllAnnexureMain] = useState([]);
  const getAllAuditorMain = () => {
    AuditService.getAllAuditorMain()
      .then((response) => {
        console.log("Fetched Annexure Main list:", response.data);
        setAllAnnexureMain(() => {
          return response.data.map((obj, index) => {
            obj["id"] = index + 1;
            obj["created"] = dateFormatter(obj.created);
            obj["updated"] = dateFormatter(obj.updated);
            return obj;
          });
        });
      })
      .catch((err) => {
        console.error("Error fetching Annexure Main list:", err);
      })
      .finally(() => {
        setAppTypeFound(true);
      });
  };

  const getAllApplicationType = () => {
    ApplicationType.getAllApplicationTypeList()
      .then((response) => {
        console.log("Fetched Application Type list:", response.data);
        setAllApplicationTypeList(() => {
          return response.data.map((obj, index) => {
            obj["id"] = index + 1;
            obj["created"] = dateFormatter(obj.created);
            obj["updated"] = dateFormatter(obj.updated);
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

    ApplicationReviewCommittee.getAllApplicationForAuditor(userName)
      .then((response) => {
        console.log(response.data);
        //Change here latest
        console.log("DEBUG: Auditor API Response Data:", response.data); // <--- CHECK THIS LOG

        if (!response.data || Object.keys(response.data).length === 0) {
          console.warn(
            "DEBUG: Auditor API returned EMPTY data. Table will be empty."
          );
        }
        // Assuming response.data is an object
        setAllApplicationFormList(() => {
          return Object.entries(response.data).map(([key, value], index) => {
            return {
              ...value,
              id: index + 1,
              applicationInitiatedOn: dateFormatter(
                value.applicationInitiatedOn
              ),
              updated: dateFormatter(value.updated),
              applicationTypeName:
                allApplicationTypeList.find(
                  (item) =>
                    item.appTypeMasterId === parseInt(value.applicationType)
                )?.appType || "NA",
            };
          });
        });
      })
      .catch((err) => {
        showAlert({
          messageTitle: "Error",
          messageContent:
            "Error fetching All Data list. Please try again later.",
          confirmText: "OK",
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
    getAllAuditorMain();
  }, [isAppTypeFound]);

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

  const getAllApplicationReview = () => {
    setLoading(true);
    ApplicationReview.getAllApplicationReviewList()
      .then((response) => {
        console.log("Fetched review application list:", response.data);

        // Check if the response data is valid and not empty
        if (response.data && response.data.length > 0) {
          setAllApplicationReviewList(response.data);
        } else {
          setAllApplicationReviewList("no application found"); // Set empty list if no data is found
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
    getAllMinimumAttempt();
    getAllApplicationReview();
  }, []);

  const handleEditApplicationForm = () => {
    // Assuming you want to pass formDetails to the AddApplicationForm route
    navigate("/applicant/applicationform/addapplicationform");
  };

  const ActionTakenByApplicant = (cid) => {
    //alert("ActionTakenByApplicant===>"+rolePath)
    if (cid) {
      const encryptedId = encodeURIComponent(encrypt(cid));
      navigate(`${rolePath}/auditnclist/ncclosurereport/${encryptedId}`);
    } else {
      showAlert({
        messageTitle: "NC Closure Report",
        messageContent: "Error in NC Closure Report, try after some time.",
        confirmText: "Ok",
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
    }
  };

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
      width: 150,
    },
    {
      field: "applicationCurrentStatus",
      headerName: "Application Current Status",
      resizable: true,
      width: 180,
    },
    {
      field: "action",
      headerName: "Action",
      resizable: false,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        const actionButtons = [];
        if (
          params.row.applicationCurrentStatus === "NC Action taken By Applicant"
        ) {
          actionButtons.push(
            <Tooltip title="Submit Audit Report" key="Submit Audit Report">
              <GridActionsCellItem
                icon={<FileUploadIcon color="error" />}
                label="Guideline"
                onClick={() =>
                  ActionTakenByApplicant(params.row.applicantUserName)
                }
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

  //   const testRows = allApplicationReviewList.map((row) => ({
  //     id: row.reviewId, // <--- THIS FIXES THE CRASH (MUI requires 'id')

  //     // We map the nested data so it shows up in your existing columns
  //     applicantUserName: row.intentAppId ? row.intentAppId.userName : "N/A",
  //     applicationCurrentStatus: row.intentAppId
  //       ? row.intentAppId.applicationStatus
  //       : row.status,

  //     // Dummy data for columns that don't exist in the review list
  //     applicantName: "Test User",
  //     applicationTypeName: "Test Type",
  //     auditorTracker: "18", // Dummy value to test Action buttons
  //   }));

  return (
    <>
      <CustomTable
        columns={columns}
        rows={allApplicationFormList}
        //rows={testRows}
        getRowId={(row) => row.reviewId}
        hideColumnsForExport={["Action"]}
        pageSizeOptions={[10, 25, 50, 100]}
        hidePagination={true}
        hideToolbar={false}
      />
    </>
  );
};

export default ViewNewApplicationForm;
