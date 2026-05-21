import React, { useEffect, useMemo, useRef, useState } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Global/Util Imports
import showAlert from "../../global/common/MessageBox/AlertService";
import dateFormatter from "../../global/util/DateFormatter";
import CustomTable from "../../global/util/CustomTable";
import { encrypt } from "../../global/util/EncryptDecrypt";

// Service Imports
import ApplicationType from "../../../service/AdminService/ApplicationType";
import ApplicationReviewCommittee from "../../../service/RenewLicenseService/ApplicationReviewCommittee";
import AuditService from "../../../service/AuditService/AuditService";
import AnnexureService from "../../../service/AnnexureA2Service/AnnexureService";

// Child Components
import IndividualViewData from "./IndividualViewData";
import FirmViewData from "./FirmViewData";
import GovernmentViewData from "./GovernmentViewData";

const APP_STATUS = {
  PENDING: "pending",
  RECOMMENDED_FOR_AUDIT: "RECOMANDED_FOR_AUDIT",
  AGENCY_SELECTION: "Agency Selection",
  RECOMMENDED_FOR_AUDIT_AGENCY: "Recomanded For Audit Agency",
  APPROVE_FROM_CCA: "Approve From CCA",
  NC_ACTION_TAKEN: "NC Action taken By Applicant",
};

const normalizeStatus = (status) => (status || "").trim().toLowerCase();

const isUploadUndertakingStatus = (status) => {
  const s = normalizeStatus(status);
  return (
    s === normalizeStatus(APP_STATUS.RECOMMENDED_FOR_AUDIT) ||
    s === normalizeStatus(APP_STATUS.AGENCY_SELECTION)
  );
};

// SRS: annexure audit remarks only after CCA approves audit agency appointment (UC11 pre-condition)
const isAnnexureReviewStatus = (status) => {
  const s = normalizeStatus(status);
  return (
    s === normalizeStatus(APP_STATUS.APPROVE_FROM_CCA) ||
    s === normalizeStatus(APP_STATUS.NC_ACTION_TAKEN) ||
    s.includes("approve from cca")
  );
};

const ViewNewApplicationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userName = useSelector((state) => state.jwtAuthentication.username);
  const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

  const [isLoading, setLoading] = useState(false);
  const [allApplicationFormList, setAllApplicationFormList] = useState([]);
  const [allApplicationTypeList, setAllApplicationTypeList] = useState([]);

  const myRef = useRef();

  // --- Data Fetching Logic ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [appTypeRes, auditorMainRes] = await Promise.all([
        ApplicationType.getAllApplicationTypeList(),
        AuditService.getAllAuditorMain(),
      ]);

      const appTypes = appTypeRes.data || [];
      setAllApplicationTypeList(appTypes);

      let appResponse = await ApplicationReviewCommittee.getAllApplicationForAuditor(userName);
      let applications = appResponse?.data || [];

      if (!Array.isArray(applications) || applications.length === 0) {
        const selectionResponse = await AuditService.getAllAuditSelectionByUsername(userName);
        const selections = Array.isArray(selectionResponse?.data) ? selectionResponse.data : [];
        applications = selections
          .filter((item) => item?.aplicantUserName || item?.applicantUserName)
          .map((item) => ({
            applicantUserName: item.aplicantUserName || item.applicantUserName,
            applicantName: item.aplicantUserName || item.applicantUserName,
            applicationCurrentStatus: APP_STATUS.AGENCY_SELECTION,
            applicationType: "1",
            applicationInitiatedOn: null,
            updated: null,
          }));
      }

      const annexureList = auditorMainRes.data || [];
      const appArray = Array.isArray(applications) ? applications : Object.values(applications);

      const formattedList = await Promise.all(
        appArray.map(async (value, index) => {
          let annexureEntry = annexureList.find(
            (item) => item.userName === value.applicantUserName
          );

          if (
            !annexureEntry &&
            normalizeStatus(value.applicationCurrentStatus) ===
              normalizeStatus(APP_STATUS.APPROVE_FROM_CCA)
          ) {
            try {
              const annexureRes = await AnnexureService.getAnnexureMainByUsername(
                value.applicantUserName
              );
              annexureEntry = annexureRes?.data;
            } catch {
              annexureEntry = null;
            }
          }

          const typeObj = appTypes.find(
            (item) => item.appTypeMasterId === parseInt(value.applicationType)
          );

          return {
            ...value,
            id: index + 1,
            applicationInitiatedOn: dateFormatter(value.applicationInitiatedOn),
            updated: dateFormatter(value.updated),
            applicationTypeName: typeObj ? typeObj.appType : "NA",
            auditorTracker: annexureEntry
              ? annexureEntry.auditorTracker
              : "NOT FOUND",
          };
        })
      );

      setAllApplicationFormList(formattedList);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status !== 404) {
          showAlert({
            messageTitle: "Error",
            messageContent: "Error fetching application data.",
            confirmText: "OK",
          });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  // --- Navigation Handlers ---
  const handleNavigate = (pathSegments) => {
    const fullPath = `${rolePath}/uploadundertaking/${pathSegments}`;
    navigate(fullPath);
  };

  const handleEncryptedNavigate = (id, subPath) => {
    if (!id) return;
    const encryptedId = encodeURIComponent(encrypt(id));
    handleNavigate(`${subPath}/${encryptedId}`);
  };

  // --- Modal Content Renderers ---
  const renderStepsContent = (id, applicantUserName) => {
    const stepId = parseInt(id, 10);
    const props = { userName: applicantUserName, ref: myRef };

    switch (stepId) {
      case 1: return <IndividualViewData {...props} />;
      case 2:
      case 3: return <FirmViewData {...props} />;
      case 4: return <GovernmentViewData {...props} />;
      default: return <Typography variant="h6">Unknown Application Type</Typography>;
    }
  };

  const viewApplicationForms = (appTypeId, applicantUserName) => {
    if (!appTypeId) return;
    showAlert({
      messageTitle: "View Application Form",
      messageContent: renderStepsContent(appTypeId, applicantUserName),
      confirmText: "Ok",
      enableHeaderCloseBtn: true,
      disableOutsideKeyDown: true,
      maxWidth: "md",
      fullWidth: true,
    });
  };

  // --- Table Columns Definition ---
  const columns = useMemo(
    () => [
      { field: "id", headerName: "Sl. No.", width: 80 },
      { field: "applicantName", headerName: "Applicant Name", width: 150 },
      { field: "applicantUserName", headerName: "Applicant User Name", width: 180 },
      { field: "applicationTypeName", headerName: "Application Type", width: 150 },
      { field: "applicationCurrentStatus", headerName: "Current Status", width: 220 },
      {
        field: "action",
        headerName: "Action",
        minWidth: 200,
        sortable: false,
        renderCell: (params) => {
          const {
            applicationCurrentStatus,
            applicantUserName,
            applicationType,
            auditorTracker,
          } = params.row;

          if (applicationCurrentStatus === APP_STATUS.PENDING) return null;

          return (
            <Box sx={{ display: "flex", gap: "5px", mt: 1 }}>
              {/* 1. View Application */}
              <Tooltip title="View Application">
                <GridActionsCellItem
                  icon={<VisibilityIcon color="success" />}
                  label="View"
                  onClick={() => viewApplicationForms(applicationType, applicantUserName)}
                />
              </Tooltip>

              {/* 2. Annexure View */}
              {isAnnexureReviewStatus(applicationCurrentStatus) &&
                (auditorTracker == null ||
                  auditorTracker === "NOT FOUND" ||
                  parseInt(auditorTracker, 10) < 18) && (
                <Tooltip title="View Annexure-A2">
                  <GridActionsCellItem
                    icon={<AttachFileIcon color="success" />}
                    label="View Annexure"
                    onClick={() => handleEncryptedNavigate(applicantUserName, "annexurea")}
                  />
                </Tooltip>
              )}

              {isUploadUndertakingStatus(applicationCurrentStatus) && (
                <Tooltip title="Upload Undertaking & Auditors Details">
                  <GridActionsCellItem
                    icon={<FileUploadIcon color="error" />}
                    label="Upload"
                    onClick={() => handleEncryptedNavigate(applicantUserName, "auditordetails")}
                  />
                </Tooltip>
              )}

              {/* 4. Approve From CCA Actions */}
              {applicationCurrentStatus === APP_STATUS.APPROVE_FROM_CCA && (
                <Tooltip title="Auditor Guideline">
                  <GridActionsCellItem
                    icon={<FileUploadIcon color="error" />}
                    label="Guideline"
                    onClick={() => handleEncryptedNavigate(applicantUserName, "auditorcontrols")}
                  />
                </Tooltip>
              )}

              {/* 5. NC Action Actions */}
              {applicationCurrentStatus === APP_STATUS.NC_ACTION_TAKEN && (
                <Tooltip title="Submit Audit Report">
                  <GridActionsCellItem
                    icon={<FileUploadIcon color="error" />}
                    label="Report"
                    onClick={() => handleEncryptedNavigate(applicantUserName, "ncclosurereport")}
                  />
                </Tooltip>
              )}
            </Box>
          );
        },
      },
    ],
    [rolePath]
  );

  return (
    <CustomTable
      columns={columns}
      rows={allApplicationFormList}
      hideColumnsForExport={["Action"]}
      pageSizeOptions={[10, 25, 50, 100]}
      hidePagination={true}
      loading={isLoading}
    />
  );
};

export default ViewNewApplicationForm;