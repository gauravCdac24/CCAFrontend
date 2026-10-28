import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Grid,
  Box,
  StepConnector,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import Check from "@mui/icons-material/Check";
import ApplicationForm from "../../../../service/NewLicenseService/ApplicationForm";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const statusFlow = [
  "Application Submitted",
  "PaymentProof Recieved",
  "Payment Verification",
  "Application Scrutiny",
  "Reviewed By CCA",
  "Audit By Audit Agency",
  "Document Audit Review",
  "LICENSE_ISSUED",
];

const statusColor = {
  pending: "default",
  Submitted: "info",
  "Application Submitted": "info",
  "PaymentProof Recieved": "info",
  "Under Review": "warning",
  "Document Audit Review": "primary",
  License_Issued: "success",
  Rejected: "error",
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
    left: "calc(-50% + 22px)",
    right: "calc(50% + 22px)",
  },

  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 2,
    backgroundColor:
      theme.palette.mode === "dark" ? "#555" : "#d5d5d5",
  },

  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#28a745",
  },

  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#28a745",
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 44,
  height: 44,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundColor: "#1976d2",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundColor: "#28a745",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {completed ? (
        <Check sx={{ color: "#fff" }} />
      ) : (
        <Typography
          variant="body1"
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          {icon}
        </Typography>
      )}
    </ColorlibStepIconRoot>
  );
}

export default function SingleUserTracker() {
  const userName = useSelector(
    (state) => state.jwtAuthentication.username
  );

  const [allTimeline, setAllTimeline] = useState([]);
  const [userData, setUserData] = useState({
    userName: userName,
    status: "",
  });

  const fetchTimelineList = useCallback(async () => {
    if (!userName) {
      setAllTimeline([]);
      setUserData({ userName: "", status: "" });
      return;
    }

    try {
      const response =
        await ApplicationForm.getAllApplicationTimelineList(userName);

      const timeline = response.data || [];

      // Sort newest first
      const sortedTimeline = [...timeline].sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );

      setAllTimeline(sortedTimeline);

      // Get the newest timeline status
      const latestStatus =
        sortedTimeline[0]?.intentAppId?.applicationStatus ||
        "Application Submitted";

      setUserData({
        userName,
        status: latestStatus,
      });
    } catch (error) {
      console.error("Error fetching application timeline:", error);
    }
  }, [userName]);

  useEffect(() => {
    fetchTimelineList();
  }, [fetchTimelineList]);

  const getActiveStepIndex = (currentStatus) => {
    if (!currentStatus) return 0;

    const status = currentStatus
      .toLowerCase()
      .trim()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

    // License Issued
    if (
      status.includes("in principle") ||
      status.includes("principle approval") ||
      status.includes("recommended in principle approval") ||
      status.includes("in principle approval granted") ||
      status.includes("document submitted for license") ||
      status.includes("bank guarantee proof uploaded")
    ) {
      return 7;
    }

    // Document Audit Review
    if (status.includes("review nc report")) {
      return 6;
    }

    // Audit By Audit Agency
    if (
      status.includes("recomanded for audit") ||
      status.includes("agency selection") ||
      status.includes("approve from cca") ||
      status.includes("nc issued by auditor") ||
      status.includes("nc action taken by applicant")
    ) {
      return 5;
    }

    // Reviewed by CCA
    if (status.includes("approved from review")) {
      return 4;
    }

    // Committee review / Application Scrutiny
    if (status.includes("edit upon review")) {
      return 3;
    }

    // Payment Verification
    if (
      status.includes("payment verification") ||
      status.includes("scrutiny") ||
      status === "payment"
    ) {
      return 2;
    }

    // Payment proof received
    if (
      status.includes("paymentproof") ||
      status.includes("payment proof") ||
      status.includes("paymentproof recieved") ||
      status.includes("paymentproof received")
    ) {
      return 1;
    }

    // Initial application stage
    if (
      status.includes("application submitted") ||
      status === "submitted"
    ) {
      return 0;
    }

    console.warn("Unmapped application status:", currentStatus);
    return 0;
  };

  const activeStep = getActiveStepIndex(userData.status);

  const timelineMap = allTimeline.reduce((acc, item) => {
    if (item.applicationStatus && item.created) {
      acc[item.applicationStatus] = dayjs(item.created).format("YYYY-MM-DD");
    }
    return acc;
  }, {});

  if (allTimeline.length > 0 && allTimeline[0].created) {
    const earliestDate = dayjs(
      allTimeline[allTimeline.length - 1]?.created || allTimeline[0].created
    ).format("YYYY-MM-DD");

    if (!timelineMap["Application Submitted"]) {
      timelineMap["Application Submitted"] = earliestDate;
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography>
          <strong>User Name:</strong> {userData.userName}
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography component="span" variant="body2">
            <strong>Status:</strong>
          </Typography>

          <Chip
            label={userData.status || "Application Submitted"}
            color={statusColor[userData.status] || "info"}
            variant="outlined"
            size="small"
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ maxWidth: "100%", mt: 3, overflowX: "auto" }}>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<ColorlibConnector />}
          >
            {statusFlow.map((label, index) => {
              const date = timelineMap[label];

              const isCompleted = index < activeStep;

              return (
                <Step key={label} completed={isCompleted}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <Typography variant="subtitle2" align="center">
                      {label}
                    </Typography>

                    {date && (
                      <Box mt={1}>
                        <Typography
                          variant="caption"
                          align="center"
                          display="block"
                        >
                          {date}
                        </Typography>
                      </Box>
                    )}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </Grid>
    </Grid>
  );
}
