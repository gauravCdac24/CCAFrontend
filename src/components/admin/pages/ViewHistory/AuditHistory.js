import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Chip, Link } from "@mui/material";
import CustomTable from "../../../global/util/CustomTable";
import showAlert from "../../../global/common/MessageBox/AlertService";
import { loadAuditorTracking } from "./auditTracking";
import AuditHistoryPopup from "./AuditHistoryPopup";

const statusColor = (status) => {
  const value = String(status || "").toLowerCase();
  if (value.includes("inactive") || value.includes("reject")) return "error";
  if (value.includes("active") || value.includes("verified")) return "success";
  return "info";
};

const AuditHistory = () => {
  const [auditorList, setAuditorList] = useState([]);
  const [loading, setLoading] = useState(false);

  const openAuditorTracker = useCallback((row) => {
    showAlert({
      messageTitle: "Auditor Tracking History",
      messageContent: <AuditHistoryPopup auditor={row} />,
      enableHeaderCloseBtn: true,
      disableOutsideKeyDown: true,
      fullWidth: true,
      maxWidth: "lg",
      closeText: "Close",
    });
  }, []);

  const loadAuditors = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await loadAuditorTracking();
      setAuditorList(rows);
    } catch (error) {
      console.error("Failed to load auditor tracking list", error);
      setAuditorList([]);
      showAlert({
        messageTitle: "Error",
        messageContent: "Unable to load auditor tracking list. Please try again.",
        confirmText: "Ok",
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuditors();
  }, [loadAuditors]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "Sl. No.", resizable: false, width: 90 },
      {
        field: "userName",
        headerName: "Username",
        resizable: false,
        width: 200,
        renderCell: (params) => (
          <Box component="span">
            <Link
              sx={{ cursor: "pointer" }}
              underline="hover"
              onClick={() => openAuditorTracker(params.row)}
            >
              {params.row.userName}
            </Link>
          </Box>
        ),
      },
      {
        field: "agencyName",
        headerName: "Audit Agency",
        resizable: false,
        width: 240,
      },
      {
        field: "auditorName",
        headerName: "Auditor Name",
        resizable: false,
        width: 220,
      },
      {
        field: "currentStatus",
        headerName: "Current Status",
        resizable: false,
        width: 160,
        renderCell: (params) => (
          <Chip
            size="small"
            variant="outlined"
            color={statusColor(params.row.currentStatus)}
            label={params.row.currentStatus || "-"}
          />
        ),
      },
      {
        field: "esignCount",
        headerName: "No of Audit Report eSign by Auditor",
        type: "number",
        resizable: false,
        width: 320,
        align: "left",
        headerAlign: "left",
      },
    ],
    [openAuditorTracker]
  );

  return (
    <CustomTable
      customTitle={loading ? "Auditor Tracking (Loading...)" : "Auditor Tracking"}
      columns={columns}
      rows={auditorList}
      hideColumnsForExport={[]}
      pageSizeOptions={[10, 25, 50, 100]}
    />
  );
};

export default AuditHistory;
