import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { formatLicenseCountdown } from "./licenseCountdown";

const DaysLeftCell = ({ target }) => {
    const [label, setLabel] = useState(() => formatLicenseCountdown(target));

    useEffect(() => {
        setLabel(formatLicenseCountdown(target));
        const timerId = setInterval(() => {
            setLabel(formatLicenseCountdown(target));
        }, 1000);
        return () => clearInterval(timerId);
    }, [target]);

    return (
        <Box component="span" sx={{ fontVariantNumeric: "tabular-nums" }}>
            {label}
        </Box>
    );
};

export default DaysLeftCell;
