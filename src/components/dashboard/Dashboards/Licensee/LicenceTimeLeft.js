import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
    EXPIRED_LICENSE_COUNTDOWN,
    formatLicenseCountdown,
    getLicenseCountdownTarget,
} from "../../../global/util/licenseCountdown";

const LicenceTimeLeft = ({ expiryDate, issueDate }) => {
    const target = useMemo(
        () => getLicenseCountdownTarget(expiryDate, issueDate)?.getTime() ?? null,
        [expiryDate, issueDate]
    );
    const [label, setLabel] = useState(() => formatLicenseCountdown(target));

    useEffect(() => {
        if (!target) {
            return undefined;
        }
        const tick = () => setLabel(formatLicenseCountdown(target));
        tick();
        const timerId = setInterval(tick, 1000);
        return () => clearInterval(timerId);
    }, [target]);

    if (!target || label === "-") {
        return null;
    }

    const expired = label === EXPIRED_LICENSE_COUNTDOWN;

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <Box
                sx={{
                    px: 2.5,
                    py: 1.25,
                    borderRadius: "4px",
                    backgroundColor: expired ? "error.main" : "tablecolor.main",
                    color: expired ? "error.contrastText" : "tablecolor.text",
                    textAlign: "right",
                    minWidth: 280,
                    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Licence time left
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: 0.4, lineHeight: 1.3 }}
                >
                    {label}
                </Typography>
                <Typography variant="caption">Year:Months:Days HH:MM:SS</Typography>
            </Box>
        </Box>
    );
};

export default LicenceTimeLeft;
