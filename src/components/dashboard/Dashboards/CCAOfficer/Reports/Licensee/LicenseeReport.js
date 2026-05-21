import { useEffect, useMemo, useState } from "react";
import DashboardService from "../../../../../../service/DashboardService/DashboardService";
import Grid  from "@mui/material/Grid2";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../../../global/util/CustomTable";
import LoaderProgress from "../../../../../global/common/LoaderProgress";
import { timeStampToDate } from "../../../../../global/util/TimestampConverter";

const LicenseeReport = () => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();


     const getLicensingReport = async () => {
    
            try{
                setIsLoading(true);
                const response = await DashboardService.getLicensingReport();
    
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['licenseIssueDate'] = timeStampToDate(obj.licenseIssueDate);
                    obj['licenseExpiryDate'] = timeStampToDate(obj.licenseExpiryDate);
                    obj['empanelmentDate'] = obj.empanelmentDate != null? timeStampToDate(obj.empanelmentDate): '-';
                    return obj;
                });
    
                setData(list);
                setIsLoading(false);
            }catch(err){
                setIsLoading(false);
            }
    
        }
    

    const downloadLicensingReport = async() => {


         try {
                    setIsLoading(true);
                    const response = await DashboardService.downloadLicensingReport();
                    console.log(response);
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    const contentDisposition = response.headers['content-disposition'];
                    const filename = "Licensee Report";
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
                { field: 'licenseeName', headerName: 'CA/ ESP Name', resizable: false, width: 350, headerAlign: 'center', align:'center' },
                { field: 'licenseeType', headerName: 'Type(CA/ESP)', resizable: false, width: 200, headerAlign: 'center', align:'center' },
                { field: 'licenseIssueDate', headerName: 'License Issue Date', resizable: false, width: 200, headerAlign: 'center', align:'center' }, 
                { field: 'licenseExpiryDate', headerName: 'License Valid Up To', resizable: false, width: 200, headerAlign: 'center', align:'center' }, 
                { field: 'empanelmentDate', headerName: 'ESP Empanelment Date', resizable: false, width: 200, headerAlign: 'center', align:'center' }, 
            ],
            [data] 
        );


    useEffect(()=>{
        getLicensingReport();

    }, [])

    return(
        <>
            <LoaderProgress open={isLoading} />
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  sx={{mr: 2}} onClick={downloadLicensingReport}>
                            <Typography variant="h6">Download Report</Typography>
                        </Button>
                        <Button variant="contained"  onClick={handleBack}>
                            <Typography variant="h6">Back</Typography>
                        </Button>
                    </Grid>

                </Grid>
            </Box>

        <CustomTable customTitle = "Licensing Report of CAs and ESPs from beginning" columns={columns} rows={data}  hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />

        </>
    )

}

export default LicenseeReport;