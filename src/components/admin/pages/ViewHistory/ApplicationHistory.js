import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Link } from "@mui/material";
import CustomTable from "../../../global/util/CustomTable";
import dateFormatter from "../../../global/util/DateFormatter";
import showAlert from "../../../global/common/MessageBox/AlertService";
import ApplicationReviewCommittee from "../../../../service/NewLicenseService/ApplicationReviewCommittee";
import ApplicationForm from "../../../../service/NewLicenseService/ApplicationForm";
import ApplicationReview from "../../../../service/NewLicenseService/ApplicationReview";
import ClientService from "../../../../service/NewLicenseService/ClientService";
import LicenseIssuanceService from "../../../../service/LicenseIssuanceService/LicenseIssuanceService";
import {
  getNextStepLabel,
  isLicenseIssuedStatus,
} from "../../../global/util/applicationStatusFlow";
import ApplicationHistoryPopup from "./ApplicationHistoryPopup";

/** Normalize varied API row shapes into one tracking row. */
const normalizeRow = (item = {}) => {
  // Review-list rows nest live application status under intentAppId
  const intentApp =
    item.intentAppId && typeof item.intentAppId === "object"
      ? item.intentAppId
      : null;

  const userName = (
    item.applicantUserName ||
    item.userName ||
    item.applicantUsername ||
    intentApp?.userName ||
    ""
  )
    .toString()
    .trim();

  const currentStatus =
    item.applicationCurrentStatus ||
    item.applicationStatus ||
    item.status ||
    intentApp?.applicationStatus ||
    "-";

  const appliedDateRaw =
    item.applicationInitiatedOn ||
    intentApp?.created ||
    item.created ||
    item.statusInitiatedOn ||
    null;

  const sortDate =
    intentApp?.updated ||
    item.updated ||
    item.statusInitiatedOn ||
    item.applicationInitiatedOn ||
    item.created ||
    null;

  const intentAppId =
    typeof item.intentAppId === "object"
      ? item.intentAppId?.intentAppId
      : item.intentAppId;

  return {
    userName,
    applicantName: item.applicantName || intentApp?.applicantName || userName || "-",
    currentStatus,
    appliedDateRaw,
    _sortDate: sortDate,
    intentAppId,
  };
};

const ApplicationHistory = () => {
  const [applicationList, setApplicationList] = useState([]);
  const [loading, setLoading] = useState(false);

  const openApplicationTracker = useCallback((row) => {
    showAlert({
      messageTitle: "Application Tracking History",
      messageContent: (
        <ApplicationHistoryPopup
          userName={row.userName}
          applicantName={row.applicantName}
          currentStatus={row.currentStatus}
        />
      ),
      enableHeaderCloseBtn: true,
      disableOutsideKeyDown: true,
      fullWidth: true,
      maxWidth: "md",
      closeText: "Close",
    });
  }, []);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      // Pull every pre-license stage queue so applicants are not missed
      // just because they are not yet in CCA review / payment-proof list.
      const [
        ccaRes,
        reviewCommitteeRes,
        paymentRes,
        recommendedRes,
        docsRes,
        bankGuaranteeRes,
        reviewListRes,
        licenseIssuedRes,
        licenseDetailsRes,
      ] = await Promise.all([
        ApplicationReviewCommittee.getAllNewApplications().catch(() => ({
          data: [],
        })),
        ApplicationReviewCommittee.getAllNewApplication().catch(() => ({
          data: [],
        })),
        ApplicationForm.getAllApplications().catch(() => ({ data: [] })),
        ClientService.getAllRecommendedNewApplication().catch(() => ({
          data: [],
        })),
        ClientService.getAllAppWithRequiredDocuments().catch(() => ({
          data: [],
        })),
        ClientService.getNewAppWithBankGuaranteeProof().catch(() => ({
          data: [],
        })),
        // Includes apps after In-principle approval (still pre-license),
        // which drop out of stage-specific queues until docs are uploaded.
        ApplicationReview.getAllApplicationReviewList().catch(() => ({
          data: [],
        })),
        ClientService.getLicenseIssuedApplication().catch(() => ({ data: [] })),
        LicenseIssuanceService.getAllLicenseDetails().catch(() => ({
          data: [],
        })),
      ]);

      const licensedUsernames = new Set();

      (Array.isArray(licenseDetailsRes?.data) ? licenseDetailsRes.data : [])
        .map((item) => item?.userName?.trim())
        .filter(Boolean)
        .forEach((name) => licensedUsernames.add(name));

      (Array.isArray(licenseIssuedRes?.data) ? licenseIssuedRes.data : [])
        .map(
          (item) =>
            item?.applicantUserName?.trim() ||
            item?.userName?.trim() ||
            ""
        )
        .filter(Boolean)
        .forEach((name) => licensedUsernames.add(name));

      const byUsername = new Map();

      const upsert = (raw) => {
        const entry = normalizeRow(raw);
        if (!entry.userName) return;
        if (licensedUsernames.has(entry.userName)) return;
        if (isLicenseIssuedStatus(entry.currentStatus)) return;

        const existing = byUsername.get(entry.userName);
        if (!existing) {
          byUsername.set(entry.userName, entry);
          return;
        }

        const existingTime = new Date(existing._sortDate || 0).getTime();
        const nextTime = new Date(entry._sortDate || 0).getTime();
        if (nextTime >= existingTime) {
          byUsername.set(entry.userName, {
            ...existing,
            ...entry,
            applicantName:
              entry.applicantName && entry.applicantName !== entry.userName
                ? entry.applicantName
                : existing.applicantName || entry.applicantName || "-",
          });
        } else if (
          (!existing.applicantName || existing.applicantName === existing.userName) &&
          entry.applicantName &&
          entry.applicantName !== entry.userName
        ) {
          byUsername.set(entry.userName, {
            ...existing,
            applicantName: entry.applicantName,
          });
        }
      };

      const sources = [
        ccaRes,
        reviewCommitteeRes,
        paymentRes,
        recommendedRes,
        docsRes,
        bankGuaranteeRes,
        reviewListRes,
      ];

      sources.forEach((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        list.forEach((item) => upsert(item));
      });

      const rows = Array.from(byUsername.values())
        .sort(
          (a, b) =>
            new Date(b._sortDate || 0).getTime() -
            new Date(a._sortDate || 0).getTime()
        )
        .map((item, index) => ({
          id: index + 1,
          userName: item.userName,
          applicantName: item.applicantName || "-",
          currentStatus: item.currentStatus || "-",
          nextStep: getNextStepLabel(item.currentStatus),
          appliedDate: dateFormatter(item.appliedDateRaw) || "-",
          intentAppId: item.intentAppId,
        }));

      setApplicationList(rows);
    } catch (error) {
      console.error("Failed to load application history list", error);
      setApplicationList([]);
      showAlert({
        messageTitle: "Error",
        messageContent:
          "Unable to load application tracking list. Please try again.",
        confirmText: "Ok",
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "Sl. No.", resizable: false, width: 90 },
      {
        field: "userName",
        headerName: "Username",
        resizable: false,
        width: 180,
        renderCell: (params) => (
          <Box component="span">
            <Link
              sx={{ cursor: "pointer" }}
              underline="hover"
              onClick={() => openApplicationTracker(params.row)}
            >
              {params.row.userName}
            </Link>
          </Box>
        ),
      },
      {
        field: "applicantName",
        headerName: "Applicant Name",
        resizable: false,
        width: 220,
      },
      {
        field: "currentStatus",
        headerName: "Current Status",
        resizable: false,
        width: 220,
      },
      {
        field: "nextStep",
        headerName: "Next Step",
        resizable: false,
        width: 220,
      },
      {
        field: "appliedDate",
        headerName: "Applied Date",
        resizable: false,
        width: 180,
      },
    ],
    [openApplicationTracker]
  );

  return (
    <CustomTable
      customTitle={
        loading
          ? "Application Tracking (Loading...)"
          : "Application Tracking"
      }
      columns={columns}
      rows={applicationList}
      hideColumnsForExport={[]}
      pageSizeOptions={[10, 25, 50, 100]}
    />
  );
};

export default ApplicationHistory;
