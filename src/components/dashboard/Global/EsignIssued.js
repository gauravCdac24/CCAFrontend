import { useEffect, useMemo, useState } from "react";
import DashboardService from "../../../service/DashboardService/DashboardService";
import CustomTable from "../../global/util/CustomTable";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EsignIssued = () => {

    const [dscIssuedList, setDscIssuedList] = useState([]);
    const navigate = useNavigate();

    const getCAList = async () => {

        try{
            const response = await DashboardService.getTotalDSCEsignIssued();

            const list = response.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj['dscIssued'] = obj.dscIssued? obj.dscIssued : '-'
                obj['eSignIssued'] = obj.eSignIssued? obj.eSignIssued : '-'
                return obj;
            });

            setDscIssuedList(list);


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
            //{ field: 'dscIssued', headerName: 'Total DSC Issued', resizable: false, width: 200 },
            { field: 'eSignIssued', headerName: 'Total eSign Issued', resizable: false, width: 200 }, 
            
        ],
        [dscIssuedList] 
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

            <CustomTable customTitle = "eSign Issued" columns={columns} rows={dscIssuedList}  hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
}

export default EsignIssued;