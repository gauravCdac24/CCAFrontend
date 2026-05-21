import { useEffect, useMemo, useState } from "react";
import DashboardService from "../../../service/DashboardService/DashboardService";
import CustomTable from "../../global/util/CustomTable";
import { timeStampToDate } from "../../global/util/TimestampConverter";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisteredESP = () => {

    const [registeredCAList, setRegisteredCAList] = useState([]);
    const navigate = useNavigate();

    const getCAList = async () => {

        try{
            const response = await DashboardService.getAllActiveESP();

            const list = response.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj['licenseIssueDate'] = obj.licenseIssueDate? timeStampToDate(obj.licenseIssueDate) : '-'
                obj['licenseExpiryDate'] = obj.licenseExpiryDate? timeStampToDate(obj.licenseExpiryDate) : '-'
                obj['empanelmentDate'] = obj.empanelmentDate? timeStampToDate(obj.empanelmentDate) : '-'
                return obj;
            });

            setRegisteredCAList(list);


        }catch(err){

        }
    }

    useEffect(()=>{

        getCAList();

    }, [])



    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'licenseeName', headerName: 'Licensed CA', resizable: false, width: 350 },
            { field: 'licenseIssueDate', headerName: 'Date of grant of Licence', resizable: false, width: 200 },
            { field: 'licenseExpiryDate', headerName: 'Licence Valid upto', resizable: false, width: 200 }, 
            { field: 'empanelmentDate', headerName: 'ESP Empanelment Date', resizable: false, width: 200 },
        ],
        [registeredCAList] 
    );


    const handleBack = () => {
        navigate(-1);
    }


    return (
        <>

                <Box component="div">

                <Grid2 container spacing={2} direction={'column'}>

                    <Grid2  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  onClick={handleBack}>
                            <Typography variant="h6">Back</Typography>
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>

            <CustomTable customTitle = "Licensed CA" columns={columns} rows={registeredCAList}  hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
}

export default RegisteredESP;