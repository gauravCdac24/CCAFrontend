import React, { useEffect, useState } from "react";
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Grid,
  Box,
} from "@mui/material";
import ApplicationForm from "../../../../service/NewLicenseService/ApplicationForm";
import dayjs from "dayjs";
import { decrypt } from "../../../global/util/EncryptDecrypt";

const statusFlow = [
  "Application Submitted",
  "LICENSE_ISSUED",
  "Annual Audit",
  "Renewal Licensee"


];

const statusColor = {
  pending: "default",
  Submitted: "info",
  "PaymentProof Recieved": "info",
  "Payment Verification & Scrutiny": "primary",
  "Under Review": "warning",
  Audit: "primary",
  "Document Audit Review": "primary",
  LICENSE_ISSUED: "success",
  Rejected: "error",
};

const SingleUserTracker = ({ username }) => {
  const userName = decrypt(username); // assuming decrypt returns plain string

  const [allTimeline, setAllTimeline] = useState([]);
  const [userData, setUserData] = useState({
    userName: userName,
    status: "",
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
        <Typography>
          <strong>Status: </strong>
          <Chip
            label={userData.status}
            color={statusColor[userData.status] || "default"}
            variant="outlined"
            size="small"
          />
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ maxWidth: "100%", mt: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {statusFlow.map((label, index) => {
              const date = timelineMap[label];
              const isCompleted = index <= activeStep;

              return (
                <Step key={label} completed={isCompleted}>
                  <StepLabel
                    StepIconProps={{
                      color: isCompleted ? "success" : "inherit",
                    }}
                  >
                    <Typography variant="subtitle2">{label}</Typography>
                    {date && (
                      <Box>
                        <Typography variant="caption" display="block">
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
};

export default SingleUserTracker;
