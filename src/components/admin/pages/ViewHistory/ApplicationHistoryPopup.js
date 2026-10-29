import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import ApplicationForm from "../../../../service/NewLicenseService/ApplicationForm";
import ApplicationReview from "../../../../service/NewLicenseService/ApplicationReview";
import dateFormatter from "../../../global/util/DateFormatter";
import {
  APPLICATION_STATUS_FLOW,
  getActiveStepIndex,
  getNextStepLabel,
} from "../../../global/util/applicationStatusFlow";

const ApplicationHistoryPopup = ({
  userName,
  applicantName = "",
  currentStatus = "",
}) => {
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userName) {
      setLoading(false);
      setError("Username is missing.");
      return;
    }

    let cancelled = false;

    const loadHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const [timelineRes, reviewRes, reviewDetailRes] = await Promise.all([
          ApplicationForm.getAllApplicationTimelineList(userName).catch(() => ({
            data: [],
          })),
          ApplicationReview.getApplicationForm6ByUsername(userName).catch(
            () => ({ data: null })
          ),
          ApplicationReview.getAllApplicationReviewByUserNames(userName).catch(
            () => ({ data: [] })
          ),
        ]);

        if (cancelled) return;

        const timelineData = Array.isArray(timelineRes?.data)
          ? [...timelineRes.data].sort(
              (a, b) => new Date(a.created) - new Date(b.created)
            )
          : [];

        const reviewApplications = Array.isArray(
          reviewRes?.data?.reviewApplications
        )
          ? reviewRes.data.reviewApplications
          : [];

        const reviewDetails = Array.isArray(reviewDetailRes?.data)
          ? reviewDetailRes.data
          : [];

        const detailById = reviewDetails.reduce((acc, item) => {
          if (item?.reviewId != null) {
            acc[String(item.reviewId)] = item;
          }
          return acc;
        }, {});

        const mergedReviews = reviewApplications.map((review) => {
          const detail = detailById[String(review?.reviewId)] || {};
          return {
            ...detail,
            ...review,
            reviewerUserName:
              review?.reviewerUserName ||
              detail?.reviewerUserName ||
              review?.createdBy ||
              detail?.createdBy ||
              "",
          };
        });

        const finalReviews =
          mergedReviews.length > 0
            ? mergedReviews
            : reviewDetails.map((item) => ({
                ...item,
                reviewerUserName:
                  item?.reviewerUserName || item?.createdBy || "",
              }));

        setTimeline(timelineData);
        setReviews(
          [...finalReviews].sort(
            (a, b) =>
              new Date(a.created || a.reviewDate || 0) -
              new Date(b.created || b.reviewDate || 0)
          )
        );
      } catch (err) {
        console.error("Error loading application history:", err);
        if (!cancelled) {
          setError("Unable to load application history. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [userName]);

  const resolvedStatus = useMemo(() => {
    if (currentStatus) return currentStatus;
    if (timeline.length === 0) return "";
    const latest = timeline[timeline.length - 1];
    return (
      latest?.applicationStatus ||
      latest?.intentAppId?.applicationStatus ||
      ""
    );
  }, [currentStatus, timeline]);

  const activeStep = getActiveStepIndex(resolvedStatus);
  const nextStep = getNextStepLabel(resolvedStatus);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ py: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Username:</strong> {userName || "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Applicant Name:</strong> {applicantName || "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" component="span">
              <strong>Current Status:</strong>
            </Typography>
            <Chip
              label={resolvedStatus || "-"}
              color="info"
              variant="outlined"
              size="small"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Next Step:</strong> {nextStep}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Application Progress History
      </Typography>

      {timeline.length === 0 ? (
        <Typography variant="body2" sx={{ mb: 3 }}>
          No timeline events found for this applicant.
        </Typography>
      ) : (
        <Box sx={{ mb: 3 }}>
          {timeline.map((event, index) => {
            const statusLabel =
              event?.applicationStatus ||
              event?.intentAppId?.applicationStatus ||
              "Status Update";
            const stamp = dateFormatter(event?.created);
            const stepIndex = getActiveStepIndex(statusLabel);
            const isLatest = index === timeline.length - 1;

            return (
              <Box
                key={`${statusLabel}-${event?.created}-${index}`}
                sx={{ display: "flex", gap: 1.5, mb: 1.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 18,
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: isLatest ? "primary.main" : "success.main",
                      mt: 0.7,
                    }}
                  />
                  {index < timeline.length - 1 ? (
                    <Box
                      sx={{
                        width: 2,
                        flexGrow: 1,
                        bgcolor: "divider",
                        mt: 0.5,
                        minHeight: 28,
                      }}
                    />
                  ) : null}
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 1.5,
                    bgcolor: isLatest ? "action.hover" : "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      {statusLabel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stamp || "-"}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Step {stepIndex + 1} of {APPLICATION_STATUS_FLOW.length}
                    {isLatest ? " (Current)" : ""}
                  </Typography>
                  {event?.remarks || event?.remark ? (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {event.remarks || event.remark}
                    </Typography>
                  ) : null}
                </Paper>
              </Box>
            );
          })}
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Reviews & Remarks
      </Typography>

      {reviews.length === 0 ? (
        <Typography variant="body2">
          No reviews or remarks have been recorded yet.
        </Typography>
      ) : (
        reviews.map((review, index) => {
          const reviewedOn = dateFormatter(
            review?.created || review?.reviewDate
          );
          const reviewer =
            review?.reviewerUserName ||
            review?.createdBy ||
            (review?.ccaRemarks ? "CCA" : "Review Committee");

          return (
            <Paper
              key={review?.reviewId || `review-${index}`}
              elevation={0}
              sx={{
                p: 2,
                mb: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  Reviewed by: {reviewer}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {reviewedOn || "-"}
                </Typography>
              </Box>

              {review?.remarks ? (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Application Review Remarks
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {review.remarks}
                  </Typography>
                </Box>
              ) : null}

              {review?.ccaRemarks ? (
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    CCA Remarks
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {review.ccaRemarks}
                  </Typography>
                </Box>
              ) : null}

              {!review?.remarks && !review?.ccaRemarks ? (
                <Typography variant="body2" color="text.secondary">
                  No remarks recorded for this review.
                </Typography>
              ) : null}

              {review?.isApproved || review?.isRejected ? (
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  {review?.isApproved ? (
                    <Chip label="Approved" color="success" size="small" />
                  ) : null}
                  {review?.isRejected ? (
                    <Chip label="Rejected" color="error" size="small" />
                  ) : null}
                </Box>
              ) : null}
            </Paper>
          );
        })
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Active progress marker: step {activeStep + 1} (
          {APPLICATION_STATUS_FLOW[activeStep]}) → Next: {nextStep}
        </Typography>
      </Box>
    </Box>
  );
};

export default ApplicationHistoryPopup;
