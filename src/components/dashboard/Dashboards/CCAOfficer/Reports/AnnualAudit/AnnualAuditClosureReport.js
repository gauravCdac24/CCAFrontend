import { useEffect, useMemo, useState } from "react";
import DashboardService from "../../../../../../service/DashboardService/DashboardService";
import Grid  from "@mui/material/Grid2";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../../../global/util/CustomTable";
import LoaderProgress from "../../../../../global/common/LoaderProgress";
import { timeStampToDate } from "../../../../../global/util/TimestampConverter";

const AnnualAuditClosureReport = () => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();


     const getAnnualAuditClosureReport = async () => {
    
            try{
                setIsLoading(true);
                const response = await DashboardService.getAnnualAuditClosureReport();
    
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['scheduleStartDate'] = obj.scheduleStartDate != null ? timeStampToDate(obj.scheduleStartDate): '-';
                    obj['scheduleSubmissionDate'] = obj.scheduleSubmissionDate != null ? timeStampToDate(obj.scheduleSubmissionDate): '-';
                    obj['actualStartDate'] = obj.actualStartDate != null ? timeStampToDate(obj.actualStartDate): '-';
                    obj['dateOfSubmission'] = obj.dateOfSubmission != null ? timeStampToDate(obj.dateOfSubmission): '-';
                    obj['dateOfCompletion'] = obj.dateOfCompletion != null ? timeStampToDate(obj.dateOfCompletion): '-';
                    return obj;
                });
    
                setData(list);
                setIsLoading(false);
            }catch(err){
                setIsLoading(false);
            }
    
        }
    

    const downloadAnnualAuditClosureReport = async() => {


         try {
                    setIsLoading(true);
                    const response = await DashboardService.downloadAnnualAuditClosureReport();
                    console.log(response);
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    const contentDisposition = response.headers['content-disposition'];
                    const filename = "AnnualAuditClosureReport";
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error downloading file:', error);
                    setIsLoading(false);
                }


    }
  

      const handleBack = () => {
        navigate(-1);
    }

        const columns = useMemo(
            () => [
                { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90, headerAlign: 'center', align:'center' },
                { field: 'userName', headerName: 'CA Name', resizable: false, width: 350, headerAlign: 'center', align:'center' },
                { field: 'scheduleStartDate', headerName: 'Scheduled Audit Date', resizable: false, width: 200, headerAlign: 'center', align:'center' },
                { field: 'actualStartDate', headerName: 'Audit Start Date', resizable: false, width: 200, headerAlign: 'center', align:'center' },
                { field: 'scheduleSubmissionDate', headerName: 'Scheduled Audit Submission Date', resizable: false, width: 200, headerAlign: 'center', align:'center' },
                { field: 'dateOfSubmission', headerName: 'Audit Submission Date', resizable: false, width: 200, headerAlign: 'center', align:'center' },
                { field: 'dateOfCompletion', headerName: 'Audit Completion Date', resizable: false, width: 200, headerAlign: 'center', align:'center' },
            ],
            [data] 
        );


    useEffect(()=>{
        getAnnualAuditClosureReport();

    }, [])

    return(
        <>
            <LoaderProgress open={isLoading} />
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  sx={{mr: 2}} onClick={downloadAnnualAuditClosureReport}>
                            <Typography variant="h6">Download Report</Typography>
                        </Button>
                        <Button variant="contained"  onClick={handleBack}>
                            <Typography variant="h6">Back</Typography>
                        </Button>
                    </Grid>

                </Grid>
            </Box>

        <CustomTable customTitle = "Annual Audits Closure Report" columns={columns} rows={data}  hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />

        </>
    )

}

export default AnnualAuditClosureReport;