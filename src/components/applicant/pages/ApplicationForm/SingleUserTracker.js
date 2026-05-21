import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Grid,
  Box,
} from "@mui/material";
import ApplicationForm from "../../../../service/NewLicenseService/ApplicationForm";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const statusFlow = [
  "Application Pending",
  "Application Submitted",
  "PaymentProof Recieved",
  "Payment Verification & Scrutiny",
  "Reviewed By Committee",
  "Audit By Audit Agency",
  "Document Audit Review",
  "LICENSE_ISSUED",
];

const statusColor = {
  pending: "default",
  Submitted: "info",
  "PaymentProof Recieved": "info",
  "Under Review": "warning",
  "Payment Verification & Scrutiny": "primary",
  "Audit": "primary",
   "Document Audit Review": "primary",
  License_Issued: "success",
  Rejected: "error",
};

export default function SingleUserTracker() {
  const userName = useSelector((state) => state.jwtAuthentication.username);
  const [allTimeline, setAllTimeline] = useState([]);
  const [userData, setUserData] = useState({
    userName: userName,
    status: "", // dynamically determined from last timeline entry
  });

  useEffect(() => {
    const fetchTimelineList = async () => {
      try {
        const response = await ApplicationForm.getAllApplicationTimelineList(userName);
        const sortedTimeline = response.data.sort(
          (a, b) => new Date(a.created) - new Date(b.created)
        );

        setAllTimeline(sortedTimeline);

        if (sortedTimeline.length > 0) {
          const latestStatus = sortedTimeline[sortedTimeline.length - 1];
          setUserData((prev) => ({
            ...prev,
            status: latestStatus.applicationStatus,
            remarks: "", // Optional: Add a remark if needed
          }));
        }
      } catch (error) {
        console.error("Error fetching application timeline:", error);
      }
    };

    fetchTimelineList();
  }, [userName]);

  const activeStep = statusFlow.indexOf(userData.status);

  const timelineMap = allTimeline.reduce((acc, item) => {
    acc[item.applicationStatus] = dayjs(item.created).format("YYYY-MM-DD");
    return acc;
  }, {});

  return (

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography><strong>User Name:</strong> {userData.userName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography component="span" variant="body2">
              <strong>Status:</strong>
            </Typography>
            <Chip
              label={userData.status}
              color={statusColor[userData.status] || "default"}
              variant="outlined"
              size="small"
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ maxWidth: "100%", mt: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {statusFlow.map((label) => {
                const date = timelineMap[label];
                return (
                  <Step key={label}>
                    <StepLabel>
                      <Typography variant="subtitle2" align="center">{label}</Typography>
                      {date && (
                        <Box mt={1}>
                          <Typography variant="caption" align="center" display="block">
                            {date}
                          </Typography>
                          <Chip
                            label={label}
                            color={statusColor[label] || "default"}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
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
