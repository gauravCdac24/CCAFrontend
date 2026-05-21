import { useEffect, useMemo, useState } from "react";
import DashboardService from "../../../../../../service/DashboardService/DashboardService";
import Grid  from "@mui/material/Grid2";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../../../global/util/CustomTable";
import LoaderProgress from "../../../../../global/common/LoaderProgress";
import AuditAgency from "../../../../../../service/AdminService/AuditAgency";
import { timeStampToDate } from "../../../../../global/util/TimestampConverter";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const errorMsg = {
    
    fromDate: {
        blank: "Please select From date.",
        diff: "From date must be less than To date."
    },

    toDate: {
        blank: "Please select To date.",
        diff: "To date must be greater than From date."
    },
};


const AuditByAuditAgency = () => {

    const [data, setData] = useState([]);
    const [selectedAuditAgency, setSelectedAuditAgency] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [auditAgencyList, setAuditAgencyList] = useState([]);
    const [fromDate, setFromDate] = useState(dayjs(new Date()).subtract(1, 'year').format('YYYY-MM-DD'));
    const [toDate, setToDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();

    const getAuditConductedByAuditAgency = async () => {

        try{
            setIsLoading(true);
            const response = await DashboardService.getAuditConductedByAuditAgency(selectedAuditAgency, fromDate, toDate);

            const list = response.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj['auditInitiatedOn'] = obj.auditInitiatedOn != null? timeStampToDate(obj.auditInitiatedOn): '-';
                obj['auditCompletedOn'] = obj.auditCompletedOn != null? timeStampToDate(obj.auditCompletedOn): '-';

                return obj;
            });
            
            setData(list);
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
        }

    }

    const downloadAuditConductedByAuditAgency = async() => {


         try {
                    setIsLoading(true);
                    const response = await DashboardService.downloadAuditConductedByAuditAgency(selectedAuditAgency, fromDate, toDate);
                    console.log(response);
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    const contentDisposition = response.headers['content-disposition'];
                    let filename = "AuditByAuditAgency";

                    if (contentDisposition) {
                        
                        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                        if (filenameMatch && filenameMatch[1]) {
                            filename = filenameMatch[1].replace(/['"]/g, ''); 
                        }
                    }

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

    const getAuditAgencyList = async ()=>{
      
        try{
            setIsLoading(true);
            const response = await AuditAgency.getAllAuditAgencyList();
            setAuditAgencyList(response.data);
            if(response.data.length>0)
                setSelectedAuditAgency(response.data[0].auditAgencyId)
            
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
        }


      }


    const validateForm = () => {
            const errors = {};
        
            if (!fromDate) {
                errors.fromDate = errorMsg.fromDate.blank;
            }
        
            if (!toDate) {
                errors.toDate = errorMsg.toDate.blank;
            }
        
            if (fromDate && toDate && !dayjs(toDate).isAfter(fromDate)) {
                errors.fromDate = errorMsg.fromDate.diff;
                errors.toDate = errorMsg.toDate.diff;
            }
        
            return errors;
        };
        
        const setFromDateChange = (date) => {
            const isValidDate = (date) => {
                return dayjs(date).isValid();
            };
            if (!isValidDate(date)) {
                return;
            }
        
            const formatDate = (date) => {
                return dayjs(date).format('YYYY-MM-DD');
            };
            setFromDate(formatDate(date));
        };
        
        const setToDateChange = (date) => {
            const isValidDate = (date) => {
                return dayjs(date).isValid();
            };
            if (!isValidDate(date)) {
                return;
            }
        
            const formatDate = (date) => {
                return dayjs(date).format('YYYY-MM-DD');
            };
            setToDate(formatDate(date));
        };

      
      
  

      const handleBack = () => {
        navigate(-1);
    }

        const columns = useMemo(
            () => [
                { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90, headerAlign: 'center', align:'center' },
                { field: 'auditors', headerName: 'Auditors', resizable: false, width: 350, headerAlign: 'center', align:'center' },
                { field: 'auditConductedFor', headerName: 'Audit Conducted For', resizable: false, width: 350, headerAlign: 'center', align:'center' },
                { field: 'auditType', headerName: 'Audit Type', resizable: false, width: 350, headerAlign: 'center', align:'center' },
                { field: 'auditInitiatedOn', headerName: 'Audit Initiated On', resizable: false, width: 200, headerAlign: 'center', align:'center' },
                { field: 'auditCompletedOn', headerName: 'Audit Completed On', resizable: false, width: 200, headerAlign: 'center', align:'center' },
                
                
            ],
            [data] 
        );


    useEffect(()=>{
        getAuditAgencyList();
        getAuditConductedByAuditAgency();

    }, [])

    useEffect(()=>{
        const errors = validateForm();
        setFormErrors(errors);
        getAuditConductedByAuditAgency();
    }, [selectedAuditAgency, fromDate, toDate])

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

                        <InputLabel shrink={false} htmlFor={"AuditAgency"}>
                            <Typography variant='body1' sx={{color: "#000000"}}>Audit Agency</Typography>
                        </InputLabel>

                        <FormControl variant="outlined" size="small" sx={{  mt: 1, width: {xs: '100%', sm: '100%', md: '220px'} }}>

                            
                            <Select
                                id="auditAgency"
                                onChange={(e)=>setSelectedAuditAgency(e.target.value)}
                                displayEmpty
                                value={selectedAuditAgency}
                                name="auditAgency"
                               
                                >

                                    <MenuItem disabled value=''>
                                        Select Audit Agency
                                    </MenuItem>


                                    {
                                        auditAgencyList.map((item, index)=>(

                                            <MenuItem key={index} value={item.auditAgencyId}>{item.auditAgencyName}</MenuItem>

                                        ))
                                    }
                            </Select>

                        </FormControl>
                        </Grid>

                        <Grid  size={{ xs: 12, sm: 12, md: 'grow' }}>

                        <InputLabel shrink={false} htmlFor={"fromDate"}>
                                <Typography variant='body1' >From Date*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 10015}}> 
                                <DatePicker
                                    id="fromDate"
                                    
                                    name="fromDate"
                                    onChange={(date) => setFromDateChange(date)}
                                    value={dayjs(fromDate)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "From Date",
                                            error: !!formErrors.fromDate,
                                            helperText: formErrors.fromDate || ''
                                        },
                                        popper: {
                                            style: { zIndex: 110015 },
                                        },
                                    }}
                                    sx={{mt:1}}
                                    
                                />
                            </LocalizationProvider>
                </Grid>

                <Grid  size={{ xs: 12, sm: 12, md: 'grow' }}>

                        
                            <InputLabel shrink={false} htmlFor={"toDate"}>
                                <Typography variant='body1' >To Date*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 10015}}> 
                                <DatePicker
                                    id="toDate"
                                    name="toDate"
                                    onChange={(date) => setToDateChange(date)}
                                    value={dayjs(toDate)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "To Date",
                                            error: !!formErrors.toDate,
                                            helperText: formErrors.toDate || ''
                                        },
                                        popper: {
                                            style: { zIndex: 110015 },
                                        },
                                    }}
                                    sx={{mt:1}}
                                    
                                />
                            </LocalizationProvider>
                        </Grid>



                        <Grid  size="grow" sx={{mt: 4}}>

                                

                            <Button variant="contained"  onClick={downloadAuditConductedByAuditAgency}>
                                <Typography variant="h6">Download Report</Typography>
                            </Button>
      
                        </Grid>



            </Grid>
        </Box>

        <CustomTable customTitle = "Report on Audits Conducted By Audit Agency" columns={columns} rows={data}  hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />

        </>
    )

}

export default AuditByAuditAgency;