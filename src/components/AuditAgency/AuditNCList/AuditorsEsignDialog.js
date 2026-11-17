import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AuditService from "../../../service/AuditService/AuditService";
import EsignService from "../../../service/EsignService/EsignService";
import Esign from "../../global/pages/Esign";
import CallComponent from "../../global/common/CallComponent/CallComponent";
import showAlert from "../../global/common/MessageBox/AlertService";
import { encrypt } from "../../global/util/EncryptDecrypt";
import { useSelector } from "react-redux";

/**
 * Popup after Submit & eSign: lists undertaking auditors and lets each
 * sequentially eSign the same audit report (min 2).
 */
const AuditorsEsignDialog = ({
  applicantUserName,
  buildAuditReportFormData,
  onAllComplete,
}) => {
  const signerFullName = useSelector((state) => state.jwtAuthentication.name);
  const signerUserName = useSelector((state) => state.jwtAuthentication.username);
  const [loading, setLoading] = useState(true);
  const [signingId, setSigningId] = useState(null);
  const [progress, setProgress] = useState({
    auditors: [],
    allComplete: false,
    completedCount: 0,
    latestSignedDocId: null,
  });

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AuditService.getMultiAuditorEsignStatus(applicantUserName);
      setProgress(response.data || { auditors: [] });
      if (response.data?.allComplete && typeof onAllComplete === "function") {
        onAllComplete();
      }
    } catch (err) {
      console.error(err);
      showAlert({
        messageTitle: "Error",
        messageContent: "Unable to load auditor eSign progress.",
        confirmText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  }, [applicantUserName, onAllComplete]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const redirectBackToPopup = () => {
    const encApplicant = encodeURIComponent(encrypt(applicantUserName));
    return `/auditagency/auditnclist/ncclosurereport/${encApplicant}?auditorsEsign=1`;
  };

  const redirectAfterAllComplete = () => {
    return `/auditagency/auditnclist?auditorsEsignDone=1`;
  };

  const toPdfFile = async (blobOrFile, fileName) => {
    const blob =
      blobOrFile instanceof Blob
        ? blobOrFile
        : new Blob([blobOrFile], { type: "application/pdf" });
    if (!blob || blob.size < 100) {
      throw new Error("Generated audit report is empty. Please try again.");
    }
    const headerBuf = await blob.slice(0, 5).arrayBuffer();
    const header = String.fromCharCode(...new Uint8Array(headerBuf));
    if (!header.startsWith("%PDF")) {
      throw new Error(
        "Audit report PDF could not be generated. Please ensure Cover Report is uploaded and try again."
      );
    }
    return new File([blob], fileName || `AuditReport_${Date.now()}.pdf`, {
      type: "application/pdf",
    });
  };

  const extractOrgFileId = (contentDisposition, fallbackId) => {
    if (!contentDisposition) {
      return String(fallbackId || "").trim();
    }
    const match = String(contentDisposition).match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i);
    if (match?.[1]) {
      return decodeURIComponent(match[1].replace(/"/g, "")).trim();
    }
    return String(fallbackId || "").trim();
  };

  const startAuditorEsign = async (auditor) => {
    if (!auditor?.appAuditorId) {
      return;
    }
    setSigningId(auditor.appAuditorId);
    try {
      const prepRes = await AuditService.prepareAuditorEsign(
        applicantUserName,
        auditor.appAuditorId
      );
      const prep = prepRes.data || {};
      let eSignedId = prep.eSignedId;
      if (!eSignedId) {
        throw new Error("Missing eSign document id");
      }

      let pdfFile;
      if (prep.needsFreshReport || !prep.previousSignedDocId) {
        const formData = buildAuditReportFormData(false);
        formData.append(
          "signerKey",
          prep.signerKey || `AUDITOR:${auditor.appAuditorId}`
        );
        const reportRes = await AuditService.downloadDocument(formData);
        const contentType = String(reportRes.headers["content-type"] || "");
        if (contentType.includes("application/json") || contentType.includes("text/")) {
          throw new Error(
            "Audit report generation failed. Please ensure Cover Report is uploaded."
          );
        }
        eSignedId = extractOrgFileId(
          reportRes.headers["content-disposition"],
          eSignedId
        );
        pdfFile = await toPdfFile(
          reportRes.data,
          `AuditReport_${eSignedId}.pdf`
        );
      } else {
        const signedBlob = await EsignService.viewDigitallySignedDocument(
          prep.previousSignedDocId
        );
        pdfFile = await toPdfFile(
          signedBlob,
          `AuditReport_Signed_${eSignedId}.pdf`
        );
      }

      const remaining = (progress.auditors || []).filter(
        (row) =>
          String(row.esignStatus || "").toUpperCase() !== "COMPLETED" &&
          String(row.appAuditorId) !== String(auditor.appAuditorId)
      );
      const isLast = remaining.length === 0;
      const redirectUrl = isLast
        ? redirectAfterAllComplete()
        : redirectBackToPopup();

      // Use logged-in signer name (Aadhaar eSign identity), not row label alone
      const fullName =
        (signerFullName || "").trim() ||
        (auditor.auditorName || "").trim() ||
        signerUserName;

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
            redirectUrl={redirectUrl}
          />
        ),
      });
    } catch (err) {
      console.error(err);
      const apiMsg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message;
      showAlert({
        messageTitle: "Error",
        messageContent:
          apiMsg ||
          err?.message ||
          "Unable to start eSign for this auditor.",
        confirmText: "Ok",
      });
    } finally {
      setSigningId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: { xs: "100%", sm: 520 }, p: 1 }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Each auditor listed for this audit must eSign the audit report.
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "tablecolor.main" }}>
              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Sl. No.</TableCell>
              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Auditor Name</TableCell>
              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Certificate Type</TableCell>
              <TableCell sx={{ border: 0.5, fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(progress.auditors || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ border: 0.5 }}>
                  No auditors found for this application undertaking.
                </TableCell>
              </TableRow>
            ) : (
              progress.auditors.map((row, index) => {
                const done =
                  String(row.esignStatus || "").toUpperCase() === "COMPLETED";
                return (
                  <TableRow key={row.appAuditorId || index}>
                    <TableCell sx={{ border: 0.5 }}>{index + 1}</TableCell>
                    <TableCell sx={{ border: 0.5 }}>{row.auditorName || "—"}</TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      {row.certificateType || "—"}
                    </TableCell>
                    <TableCell sx={{ border: 0.5 }}>
                      {done ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                          <Typography variant="body2" color="success.main">
                            eSign successful
                          </Typography>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          disabled={Boolean(signingId)}
                          onClick={() => startAuditorEsign(row)}
                        >
                          {signingId === row.appAuditorId ? "Starting…" : "eSign"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        Completed: {progress.completedCount || 0} / {(progress.auditors || []).length}
        {progress.allComplete ? " — all auditors signed. Application moved to Pending Audit Acceptance." : ""}
      </Typography>
    </Box>
  );
};

export default AuditorsEsignDialog;
