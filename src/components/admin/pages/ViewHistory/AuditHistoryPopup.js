import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dateFormatter from "../../../global/util/DateFormatter";
import { esignLabel, loadApplicantAuditHistory } from "./auditTracking";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "workflow", label: "Workflow" },
  { id: "audit", label: "Audit application" },
  { id: "annexure", label: "Annexure A-2" },
  { id: "nc", label: "NC report" },
  { id: "esign", label: "eSign" },
];

const CATEGORY_CHIP = {
  workflow: { label: "Workflow", color: "primary" },
  audit: { label: "Audit application", color: "info" },
  annexure: { label: "Annexure A-2", color: "warning" },
  nc: { label: "NC report", color: "error" },
  esign: { label: "eSign", color: "success" },
};

const statusColor = (status) => {
  const value = String(status || "").toLowerCase();
  if (value.includes("reject") || value.includes("fail")) return "error";
  if (value.includes("complete") || value.includes("esign") || value.includes("active")) {
    return "success";
  }
  if (value.includes("pending") || value.includes("review")) return "warning";
  return "info";
};

const esignColor = (status) => {
  const value = String(status || "").toUpperCase();
  if (value === "COMPLETED") return "success";
  if (value === "FAILED") return "error";
  if (value === "PENDING") return "warning";
  return "default";
};

const AuditHistoryPopup = ({ auditor }) => {
  const applications = auditor?.applications || [];
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(applications[0]?.applicantUserName || "");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);

  const filteredApplicants = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return applications;
    return applications.filter((item) => {
      const name = `${item.applicantName || ""} ${item.applicantUserName || ""}`.toLowerCase();
      return name.includes(needle);
    });
  }, [applications, query]);

  const selected = applications.find((item) => item.applicantUserName === selectedUser) || null;

  useEffect(() => {
    if (!selectedUser) {
      setEvents([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    const current = applications.find((item) => item.applicantUserName === selectedUser);
    if (!current) {
      setEvents([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await loadApplicantAuditHistory(current);
        if (cancelled) return;
        setEvents(result.events || []);
        setError(result.error || "");
      } catch (err) {
        console.error("Failed to load auditor application history", err);
        if (!cancelled) {
          setEvents([]);
          setError("Unable to load tracking history for this applicant.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedUser, applications]);

  const visibleEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((event) => event.category === filter);
  }, [events, filter]);

  const counts = useMemo(() => {
    return events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {});
  }, [events]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {auditor?.auditorName || "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {auditor?.userName || "-"}
            {auditor?.agencyName ? ` · ${auditor.agencyName}` : ""}
          </Typography>
        </Box>
        <Chip
          size="small"
          variant="outlined"
          color={statusColor(auditor?.currentStatus)}
          label={auditor?.currentStatus || "-"}
        />
        <Chip
          size="small"
          color="primary"
          label={`${applications.length} applicant${applications.length === 1 ? "" : "s"}`}
        />
        <Chip
          size="small"
          color="success"
          variant="outlined"
          label={`${auditor?.esignCount || 0} audit report${auditor?.esignCount === 1 ? "" : "s"} eSigned`}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        History starts when the applicant chooses the audit agency and continues until the auditor eSigns the audit report. Audit application reviews, Annexure A-2 remarks, and NC report remarks are included.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {applications.length === 0 ? (
        <Typography variant="body2" align="center" sx={{ py: 4 }}>
          This auditor has no audit applications yet.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            height: { md: "62vh" },
            minHeight: 360,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              width: { xs: "100%", md: 300 },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 1.5, pb: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Applicants ({applications.length})
              </Typography>
              <TextField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search applicant"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <List sx={{ overflowY: "auto", flex: 1, py: 0 }}>
              {filteredApplicants.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>
                  No applicant matches your search.
                </Typography>
              ) : (
                filteredApplicants.map((item) => {
                  const active = item.applicantUserName === selectedUser;
                  return (
                    <ListItemButton
                      key={item.applicantUserName}
                      selected={active}
                      onClick={() => {
                        setSelectedUser(item.applicantUserName);
                        setFilter("all");
                      }}
                      sx={{
                        alignItems: "flex-start",
                        borderLeft: "3px solid",
                        borderLeftColor: active ? "primary.main" : "transparent",
                        py: 1.25,
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {item.applicantName || item.applicantUserName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" noWrap>
                          {item.applicantUserName}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.75 }}>
                          <Chip
                            size="small"
                            variant="outlined"
                            color={statusColor(item.currentStatus)}
                            label={item.currentStatus || "Agency Selection"}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            color={esignColor(item.esignStatus)}
                            label={esignLabel(item.esignStatus)}
                          />
                        </Box>
                        {!item.auditorNamed ? (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            Agency selected. Auditor is not named on the undertaking yet.
                          </Typography>
                        ) : null}
                      </Box>
                    </ListItemButton>
                  );
                })
              )}
            </List>
          </Paper>

          <Box sx={{ flex: 1, minWidth: 0, overflowY: "auto", pr: 0.5 }}>
            {!selected ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4 }} align="center">
                Select an applicant to view the audit tracking history.
              </Typography>
            ) : (
              <>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {selected.applicantName || selected.applicantUserName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selected.applicantUserName}
                    {selected.currentStatus ? ` · ${selected.currentStatus}` : ""}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
                  {FILTERS.map((item) => {
                    const count = item.id === "all" ? events.length : counts[item.id] || 0;
                    return (
                      <Chip
                        key={item.id}
                        size="small"
                        label={`${item.label} (${count})`}
                        color={filter === item.id ? "primary" : "default"}
                        variant={filter === item.id ? "filled" : "outlined"}
                        onClick={() => setFilter(item.id)}
                      />
                    );
                  })}
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress size={36} />
                  </Box>
                ) : error ? (
                  <Typography color="error" align="center" sx={{ py: 3 }}>
                    {error}
                  </Typography>
                ) : visibleEvents.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No tracking events in this view.
                  </Typography>
                ) : (
                  visibleEvents.map((event, index) => {
                    const chip = CATEGORY_CHIP[event.category] || CATEGORY_CHIP.workflow;
                    const stamp = dateFormatter(event.rawTime);
                    const isLast = index === visibleEvents.length - 1;
                    return (
                      <Box key={event.id || `${event.title}-${index}`} sx={{ display: "flex", gap: 1.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            minWidth: 16,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: `${chip.color}.main`,
                              mt: 0.8,
                            }}
                          />
                          {!isLast ? (
                            <Box
                              sx={{
                                width: 2,
                                flexGrow: 1,
                                bgcolor: "divider",
                                minHeight: 24,
                                mt: 0.5,
                              }}
                            />
                          ) : null}
                        </Box>
                        <Paper
                          variant="outlined"
                          sx={{ flex: 1, p: 1.5, mb: 1.5, borderRadius: 1 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 1,
                              flexWrap: "wrap",
                              mb: 0.75,
                            }}
                          >
                            <Box sx={{ display: "flex", gap: 0.75, alignItems: "center", flexWrap: "wrap" }}>
                              <Chip size="small" color={chip.color} variant="outlined" label={chip.label} />
                              <Typography variant="subtitle2" fontWeight={700}>
                                {event.title}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {stamp || "—"}
                            </Typography>
                          </Box>
                          {event.actor ? (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                              By {event.actor}
                            </Typography>
                          ) : null}
                          {(event.meta || []).length > 0 ? (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 0.75 }}>
                              {event.meta.map((item) => (
                                <Chip
                                  key={`${item.label}-${item.text}`}
                                  size="small"
                                  variant="outlined"
                                  label={`${item.label}: ${item.text}`}
                                />
                              ))}
                            </Box>
                          ) : null}
                          {(event.details || []).map((detail) => (
                            <Box key={`${detail.label}-${detail.text}`} sx={{ mt: 0.75 }}>
                              <Typography variant="caption" fontWeight={700} color="text.secondary">
                                {detail.label}
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                {detail.text}
                              </Typography>
                            </Box>
                          ))}
                        </Paper>
                      </Box>
                    );
                  })
                )}
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AuditHistoryPopup;
