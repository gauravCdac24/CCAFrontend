import React, { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
  Collapse,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import AuditService from "../../../../service/AuditService/AuditService";
import showAlert from "../../../global/common/MessageBox/AlertService";

const AuditControls = () => {
  const userName = useSelector((state) => state.jwtAuthentication.username);
  const [checkedIds, setCheckedIds] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = [
    { id: 1, label: "Information Technology (IT) Security Guidelines" },
    { id: 2, label: "Security Guidelines for Certifying Authorities" },
    { id: 3, label: "Key Management Controls" },
    { id: 4, label: "Certificate Management Controls" },
    { id: 5, label: "Identity Verification Controls" },
    { id: 6, label: "Extended Valid Certificate Controls" },
    { id: 7, label: "Online Certificate Status Protocol (OCSP) Controls" },
    { id: 8, label: "SSL Certificate Controls" },
    { id: 9, label: "E-Authentication Controls" },
    { id: 10, label: "Other Business and Legal Matters" },
    { id: 11, label: "CA website, Application software, CA software requirements" },
  ];

  const toggleAll = () => setAllExpanded((prev) => !prev);

  const handleCheckboxChange = (id) => {
    setCheckedIds((prev) => {
      const exists = prev.find((item) => item.controlId === id);
      return exists
        ? prev.filter((item) => item.controlId !== id)
        : [...prev, { controlId: id, userName }];
    });
  };

  // Here: master checked if any item checked
  const isAnySelected = checkedIds.length > 0;

  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      const allItems = items.map((item) => ({ controlId: item.id, userName }));
      setCheckedIds(allItems);
    } else {
      setCheckedIds([]);
    }
  };

  const handleSubmit = () => {
    showAlert({
      messageTitle: "Confirm",
      messageContent: "Are you sure, you want to submit?",
      confirmText: "Yes",
      closeText: "No",
      fullWidth: true,
      maxWidth: "sm",
      onConfirm: () => submitAuditData(),
    });
  };

  const submitAuditData = () => {
    setLoading(true);
    AuditService.addNewAuditControl(checkedIds)
      .then((response) =>
        showAlert({
          messageTitle: "Success",
          messageContent: response.data,
          confirmText: "Ok",
        })
      )
      .catch((err) =>
        showAlert({
          messageTitle: "Error",
          messageContent:
            err.response?.data || "Request failed. Please try again later.",
          confirmText: "Ok",
        })
      )
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          backgroundColor: "primary.main",
          p: 1,
          borderRadius: "5px",
          boxShadow:
            "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
          cursor: "pointer",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={isAnySelected}
              indeterminate={false}
              onChange={handleSelectAllChange}
              color="success"
            />
          }
          label={
            <Typography
              variant="h6"
              sx={{ color: "primary.contrastText", userSelect: "none" }}
            >
              Audit Controls
            </Typography>
          }
        />

        <IconButton onClick={toggleAll} size="large" disableRipple>
          <ExpandMoreIcon
            style={{
              transform: allExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </IconButton>
      </Box>

      <Collapse
        in={allExpanded}
        sx={{
          pl: 1,
          pr: 1,
          backgroundColor: "primary.light",
          color: "text.primary",
          mt: 1,
          borderRadius: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {items.map((item) => (
            <FormControlLabel
              key={item.id}
              control={
                <Checkbox
                  checked={checkedIds.some(
                    (checked) => checked.controlId === item.id
                  )}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(item.id);
                  }}
                  color="primary"
                />
              }
              label={item.label}
            />
          ))}
        </div>

        <Box display="flex" justifyContent="center" mt={3} sx={{ gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={checkedIds.length === 0 || loading}
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Next"}
          </Button>
        </Box>
      </Collapse>
    </div>
  );
};

export default AuditControls;
