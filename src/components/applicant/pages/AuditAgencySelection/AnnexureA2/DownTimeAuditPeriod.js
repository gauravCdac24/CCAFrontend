import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Collapse,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AnnexureService from "../../../../../service/AnnexureA2Service/AnnexureService";
import showAlert from "../../../../global/common/MessageBox/AlertService";

const STRING_PATTERN = /^[A-Za-z0-9().,&\- ]+$/;
const DIGITS_PATTERN = /^[0-9]+$/;

const DownTimeAuditPeriod = () => {
  const [open, setOpen] = useState(false);
  const [caData, setCaData] = useState({
    downTimeId: "",
    reasonAndMeasuresTaken: "",
    downTimeHour: "",
    downTimeMinute: "",
    downTimeSecond: "",
  });
  const [errors, setErrors] = useState({});

  const [isLoading, setLoading] = useState(false);

  const countWords = (str) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const getCASoftwareDetailsDetails = async () => {
    setLoading(true);
    try {
      const response = await AnnexureService.getDownTimeDetails();

      console.log("CA Software details:", response.data);
      if (response.data) {
        setCaData(response.data);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCASoftwareDetailsDetails();
  }, []);

  const handleChange = (field, value) => {
    setCaData({ ...caData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  // --- FIXED VALIDATE FUNCTION ---
  const validate = () => {
    let newErrors = {};

    // 1. FIX: Convert SECOND to String safely
    const secondStr = String(caData.downTimeSecond || "");
    if (!secondStr.trim()) {
      newErrors.downTimeSecond = "Second cannot be empty.";
    } else if (!DIGITS_PATTERN.test(secondStr)) {
      newErrors.downTimeSecond = "Only digits are allowed.";
    } else if (parseInt(secondStr) > 59) {
      newErrors.downTimeSecond = "Maximum 59 seconds.";
    }

    // 2. FIX: Convert MINUTE to String safely
    const minuteStr = String(caData.downTimeMinute || "");
    if (!minuteStr.trim()) {
      newErrors.downTimeMinute = "Minute cannot be empty.";
    } else if (!DIGITS_PATTERN.test(minuteStr)) {
      newErrors.downTimeMinute = "Only digits are allowed.";
    } else if (parseInt(minuteStr) > 59) {
      newErrors.downTimeMinute = "Maximum 59 minutes.";
    }

    // 3. FIX: Convert HOUR to String safely
    const hourStr = String(caData.downTimeHour || "");
    if (!hourStr.trim()) {
      newErrors.downTimeHour = "Hour cannot be empty.";
    } else if (!DIGITS_PATTERN.test(hourStr)) {
      newErrors.downTimeHour = "Only digits are allowed.";
    } else if (hourStr.length > 4) {
      newErrors.downTimeHour = "Only 4 digits are allowed.";
    }

    // 4. FIX: Convert REASON to String safely
    const reasonStr = String(caData.reasonAndMeasuresTaken || "");
    if (!reasonStr.trim()) {
      newErrors.reasonAndMeasuresTaken = "Explanation cannot be empty.";
    } else if (reasonStr.length < 3 || reasonStr.length > 500) {
      newErrors.reasonAndMeasuresTaken =
        "The length must be between 3 and 500 characters.";
    } else if (!STRING_PATTERN.test(reasonStr)) {
      newErrors.reasonAndMeasuresTaken =
        "Only alphabets, numbers, characters ().,&- are allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      console.log("Form submitted:", caData);
      try {
        setLoading(true);

        // Send data to backend
        const response = await AnnexureService.addDownTimeDetails(caData);

        showAlert({
          messageTitle: "Success",
          messageContent: response.data || "Data submitted successfully!",
          confirmText: "Ok",
        });

        getCASoftwareDetailsDetails();
      } catch (err) {
        console.error("Submission error:", err);
        showAlert({
          messageTitle: "Error",
          messageContent:
            err.response?.data ||
            "Your request cannot be processed at this time.",
          confirmText: "Ok",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: "primary.main" }} gutterBottom>
          17. Down time during the Audit period
        </Typography>
        <Box sx={{ marginLeft: "auto" }}>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{ color: "primary.main" }}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={open}>
        <Box mt={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "tablecolor.main",
                    color: "tablecolor.text",
                  }}
                >
                  <TableCell
                    sx={{
                      border: 0.5,
                      borderColor: "grey.500",
                      fontWeight: "bold",
                    }}
                  >
                    S. No.
                  </TableCell>
                  <TableCell
                    sx={{
                      border: 0.5,
                      borderColor: "grey.500",
                      fontWeight: "bold",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      border: 0.5,
                      borderColor: "grey.500",
                      fontWeight: "bold",
                    }}
                  >
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{
                    backgroundColor: "tablecolor.main",
                    color: "tablecolor.text",
                  }}
                >
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    1
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    Total service down time during the audit period, if any.
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      gap: 1,
                      border: 0.5,
                      borderColor: "grey.500",
                    }}
                  >
                    <TextField
                      value={caData.downTimeHour}
                      onChange={(e) =>
                        handleChange("downTimeHour", e.target.value)
                      }
                      variant="outlined"
                      placeholder="HH"
                      sx={{ width: 60 }}
                      error={!!errors.downTimeHour}
                      helperText={errors.downTimeHour}
                    />
                    <TextField
                      value={caData.downTimeMinute}
                      onChange={(e) =>
                        handleChange("downTimeMinute", e.target.value)
                      }
                      variant="outlined"
                      placeholder="MM"
                      sx={{ width: 60 }}
                      error={!!errors.downTimeMinute}
                      helperText={errors.downTimeMinute}
                    />
                    <TextField
                      value={caData.downTimeSecond}
                      onChange={(e) =>
                        handleChange("downTimeSecond", e.target.value)
                      }
                      variant="outlined"
                      placeholder="SS"
                      sx={{ width: 60 }}
                      error={!!errors.downTimeSecond}
                      helperText={errors.downTimeSecond}
                    />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    backgroundColor: "tablecolor.main",
                    color: "tablecolor.text",
                  }}
                >
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    2
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    Reason for non-availability of service and remedial measures
                    taken.
                  </TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: "grey.500" }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={caData.reasonAndMeasuresTaken}
                      onChange={(e) =>
                        handleChange("reasonAndMeasuresTaken", e.target.value)
                      }
                      variant="outlined"
                      placeholder="Enter reason and measures taken"
                      error={!!errors.reasonAndMeasuresTaken}
                      helperText={errors.reasonAndMeasuresTaken}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="right" mt={3}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              ADD
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DownTimeAuditPeriod;
