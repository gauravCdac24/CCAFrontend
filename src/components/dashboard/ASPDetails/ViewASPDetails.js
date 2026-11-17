import { useState } from "react";
import { Box, Button, Grid2, Typography } from "@mui/material";
import DashboardService from "../../../service/DashboardService/DashboardService";
import showAlert from "../../global/common/MessageBox/AlertService";

const fileNameFromHeader = (header) => {
    const match = String(header || "").match(/filename="?([^"]+)"?/i);
    return match?.[1] || "ASPReports.pdf";
};

const ViewASPDetails = ({aspObj}) =>{
    const [downloading, setDownloading] = useState(false);

    const downloadAspReports = async () => {
        if (!aspObj?.aspId) {
            return;
        }
        setDownloading(true);
        try {
            const response = await DashboardService.downloadAspAuditReports(aspObj.aspId);
            const contentType = response.headers["content-type"] || "application/pdf";
            if (String(contentType).includes("text") || String(contentType).includes("json")) {
                throw new Error("Unable to download the ASP audit reports.");
            }
            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = fileNameFromHeader(response.headers["content-disposition"]);
            window.document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch (err) {
            showAlert({
                messageTitle: "ASP Reports",
                messageContent: "Unable to download the ASP audit reports.",
                confirmText: "Ok",
            });
        } finally {
            setDownloading(false);
        }
    };

    return(
        <>
        <Box sx={{width: '520px'}}>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">ASP Name:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.aspName}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">Email Id:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.emailId}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">Country:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.countryId}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">State:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.stateId}</Typography>
                </Grid2>
            </Grid2>


            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">Onboarding Date:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.onBoardingDate}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} >
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">Exit Date:</Typography> 
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.exitDate}</Typography>
                </Grid2>
            </Grid2>

            {aspObj.auditReportCount !== 0 && (
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Typography variant="h6" color="primary.tabletext">ASP Reports:</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                    <Button variant="outlined" size="small" disabled={downloading} onClick={downloadAspReports}>
                        ASP Reports
                    </Button>
                </Grid2>
            </Grid2>
            )}

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6" color="primary.tabletext">Created At:</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.created}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6" color="primary.tabletext">Updated At:</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6 }}>
                <Typography variant="h6">{aspObj.updated}</Typography>
                </Grid2>
            </Grid2>
        </Box>
        
        </>
    )


}

export default ViewASPDetails;
