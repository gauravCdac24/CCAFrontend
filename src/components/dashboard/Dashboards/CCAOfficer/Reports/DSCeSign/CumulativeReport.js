import { useEffect, useMemo, useState } from "react";
import DashboardService from "../../../../../../service/DashboardService/DashboardService";
import Grid  from "@mui/material/Grid2";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../../../global/util/CustomTable";
import LoaderProgress from "../../../../../global/common/LoaderProgress";

const CumulativeReport = () => {

    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('January');

    const [isLoading, setIsLoading] = useState(false);
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);

    const navigate = useNavigate();

    const getCumulativeReportData = async () => {

        try{
            setIsLoading(true);
            const response = await DashboardService.getCumulativeReportOnDSCEsignData(selectedMonth, selectedYear);

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

    const downloadCumulativeDSCEsignDataReport = async() => {


         try {
                    setIsLoading(true);
                    const response = await DashboardService.downloadCumulativeDSCEsignDataReport(selectedMonth, selectedYear);
                    console.log(response);
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    const contentDisposition = response.headers['content-disposition'];
                    const filename = "Cumulative Report";
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
      
        const currentYear = new Date().getFullYear();
        setSelectedYear(currentYear.toString())
        

        const uyearlist = [];
  
          for (let i = new Date().getFullYear(); i >= 2025; i--) {
            uyearlist.push({label: i.toString(), value: i.toString()});
          }
          setYearList(uyearlist);
      }

      
      const getMonthList = () => {

        const months = [
          {label: 'January', value: 'January'},
          {label: 'February', value: 'February'},
          {label: 'March', value: 'March'},
          {label: 'April', value: 'April'},
          {label: 'May', value: 'May'},
          {label: 'June', value: 'June'},
          {label: 'July', value: 'July'},
          {label: 'August', value: 'August'},
          {label: 'September', value: 'September'},
          {label: 'October', value: 'October'},
          {label: 'November', value: 'November'},
          {label: 'December', value: 'December'},
        ]
        setMonthList(months);
      }
  

      const handleBack = () => {
        navigate(-1);
    }

        const columns = useMemo(
            () => [
                { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90, headerAlign: 'center', align:'center' },
                { field: 'licenseeName', headerName: 'State/Union Territory', resizable: false, width: 350, headerAlign: 'center', },
                { field: 'eSignIssued', headerName: 'Total eSign Issued', resizable: false, width: 200, headerAlign: 'center', align:'center' },
                { field: 'dscIssued', headerName: 'Total DSC Issued', resizable: false, width: 200, headerAlign: 'center', align:'center' }, 
                
            ],
            [data] 
        );


    useEffect(()=>{
        getYearList();
        getMonthList();
        getCumulativeReportData();

    }, [])

    useEffect(()=>{
        getCumulativeReportData();
    }, [selectedMonth, selectedYear])

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

                <InputLabel shrink={false} htmlFor={"month"}>
                    <Typography variant='body1' sx={{color: "bodycolor.text"}}>Month</Typography>
                </InputLabel>

                <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '200px' }}>

                    
                    <Select
                        id="month"
                        onChange={(e)=>setSelectedMonth(e.target.value)}
                        displayEmpty
                        value={selectedMonth}
                        name="month"
                        
                        >

                            <MenuItem disabled value=''>
                                Select Month
                            </MenuItem>


                            {
                                monthList.map((item, index)=>(

                                    <MenuItem key={index} value={item.value}>{item.label}</MenuItem>

                                ))
                            }
                    </Select>
                
                </FormControl>
                </Grid>

                <Grid  size={{ xs: 12, sm: 12, md: 'grow' }}>

                        <InputLabel shrink={false} htmlFor={"year"}>
                            <Typography variant='body1' sx={{color: "bodycolor.text"}}>Year</Typography>
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

                                

                            <Button variant="contained"  onClick={downloadCumulativeDSCEsignDataReport}>
                                <Typography variant="h6">Download Report</Typography>
                            </Button>
      
                        </Grid>



            </Grid>
        </Box>

        <CustomTable customTitle = "Cumulative Report of eSign & DSC" columns={columns} rows={data}  hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />

        </>
    )

}

export default CumulativeReport;