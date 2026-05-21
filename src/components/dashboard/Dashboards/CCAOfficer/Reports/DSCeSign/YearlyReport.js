import { useEffect, useMemo, useState } from "react";
import DashboardService from "../../../../../../service/DashboardService/DashboardService";
import Grid  from "@mui/material/Grid2";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../../../global/util/CustomTable";
import LoaderProgress from "../../../../../global/common/LoaderProgress";

const YearlyReport = () => {

    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [isLoading, setIsLoading] = useState(false);
    const [yearList, setYearList] = useState([]);

    const navigate = useNavigate();

    const getYearlyReportData = async () => {

        try{
            setIsLoading(true);
            const response = await DashboardService.getYearlyDSCEsignData(selectedYear);

            const list = response.data.map((obj, index) => {
                obj['id'] = index + 1;
                return obj;
            });

            setData(list);
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
        }

    }

    const downloadYearlyDSCEsignDataReport = async() => {


         try {
                    setIsLoading(true);
                    const response = await DashboardService.downloadYearlyDSCEsignDataReport(selectedYear);
                    console.log(response);
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    const contentDisposition = response.headers['content-disposition'];
                    const filename = "Yearly Report";
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

    const getYearList = ()=>{
      
        const currnetYear = new Date().getFullYear();
        setSelectedYear(currnetYear.toString())

        const uyearlist = [];
  
          for (let i = new Date().getFullYear(); i >= 2025; i--) {
            uyearlist.push({label: i.toString(), value: i.toString()});
          }
          setYearList(uyearlist);
      }

      
      
  

      const handleBack = () => {
        navigate(-1);
    }

        const columns = useMemo(
            () => [
                { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90, headerAlign: 'center', align:'center' },
                { field: 'licenseeName', headerName: 'CA/ ESP Name', resizable: false, width: 350, headerAlign: 'center', align:'center' },
                { field: 'eSignIssued', headerName: `${selectedYear} (eSign)`, resizable: false, width: 200, headerAlign: 'center', align:'center' },
                { field: 'dscIssued', headerName: `${selectedYear} (DSC)`, resizable: false, width: 200, headerAlign: 'center', align:'center' }, 
                
            ],
            [data] 
        );


    useEffect(()=>{
        getYearList();
        getYearlyReportData();

    }, [])

    useEffect(()=>{
        getYearlyReportData();
    }, [selectedYear])

    return(
        <>
            <LoaderProgress open={isLoading} />
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  onClick={handleBack}>
                            <Typography variant="h6">Back</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Box>

        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', m: 2}}>
            <Grid container spacing={2}>

                <Grid  size={{ xs: 12, sm: 12, md: 'grow' }}>

                        <InputLabel shrink={false} htmlFor={"year"}>
                            <Typography variant='body1' sx={{color: "#000000"}}>Year</Typography>
                        </InputLabel>

                        <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '200px' }}>

                            
                            <Select
                                id="year"
                                onChange={(e)=>setSelectedYear(e.target.value)}
                                displayEmpty
                                value={selectedYear}
                                name="year"
                               
                                >

                                    <MenuItem disabled value=''>
                                        Select Year
                                    </MenuItem>


                                    {
                                        yearList.map((item, index)=>(

                                            <MenuItem key={index} value={item.value}>{item.label}</MenuItem>

                                        ))
                                    }
                            </Select>

                        </FormControl>
                        </Grid>


                        <Grid  size="grow" sx={{mt: 4}}>

                                

                            <Button variant="contained"  onClick={downloadYearlyDSCEsignDataReport}>
                                <Typography variant="h6">Download Report</Typography>
                            </Button>
      
                        </Grid>



            </Grid>
        </Box>

        <CustomTable customTitle = "Yearly Report of eSign & DSC" columns={columns} rows={data}  hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />

        </>
    )

}

export default YearlyReport;