import { useEffect, useMemo, useState } from "react";
import DashboardService from "../../../../../../service/DashboardService/DashboardService";
import Grid  from "@mui/material/Grid2";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../../../global/util/CustomTable";
import LoaderProgress from "../../../../../global/common/LoaderProgress";
import { timeStampToDate } from "../../../../../global/util/TimestampConverter";

const AnnualAuditSubmittedOnTime = () => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();


     const getAnnualAuditSubmittedOnTime = async () => {
    
            try{
                setIsLoading(true);
                const response = await DashboardService.getAnnualAuditSubmittedOnTime();
    
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['scheduleSubmissionDate'] = timeStampToDate(obj.scheduleSubmissionDate);
                    obj['dateOfSubmission'] = obj.dateOfSubmission != null ? timeStampToDate(obj.dateOfSubmission): '-';
                    return obj;
                });
    
                setData(list);
                setIsLoading(false);
            }catch(err){
                setIsLoading(false);
            }
    
        }
    

    const downloadAnnualAuditSubmittedOnTime = async() => {


         try {
                    setIsLoading(true);
                    const response = await DashboardService.downloadAnnualAuditSubmittedOnTime();
                    console.log(response);
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    const contentDisposition = response.headers['content-disposition'];
                    const filename = "AnnualAuditSubmittedOnTime";
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
                { field: 'scheduleSubmissionDate', headerName: 'Scheduled Audit Submission Date', resizable: false, width: 200, headerAlign: 'center', align:'center' },
                { field: 'dateOfSubmission', headerName: 'Date of Submission', resizable: false, width: 200, headerAlign: 'center', align:'center' },
            ],
            [data] 
        );


    useEffect(()=>{
        getAnnualAuditSubmittedOnTime();

    }, [])

    return(
        <>
            <LoaderProgress open={isLoading} />
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  sx={{mr: 2}} onClick={downloadAnnualAuditSubmittedOnTime}>
                            <Typography variant="h6">Download Report</Typography>
                        </Button>
                        <Button variant="contained"  onClick={handleBack}>
                            <Typography variant="h6">Back</Typography>
                        </Button>
                    </Grid>

                </Grid>
            </Box>

        <CustomTable customTitle = "Report on Annual Audits Submitted on Time" columns={columns} rows={data}  hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />

        </>
    )

}

export default AnnualAuditSubmittedOnTime;