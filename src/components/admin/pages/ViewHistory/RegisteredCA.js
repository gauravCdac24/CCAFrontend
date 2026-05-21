import { useEffect, useMemo, useState } from "react";
import DashboardService from "../../../../service/DashboardService/DashboardService";
import CustomTable from "../../../global/util/CustomTable";
import { timeStampToDate } from "../../../global/util/TimestampConverter";
import { Box, Button, Typography, Link,Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import showAlert from "../../../global/common/MessageBox/AlertService";
import SingleUserTracker from "./SingleUserTracker";
import { encrypt } from "../../../global/util/EncryptDecrypt";
import { useSelector } from "react-redux";

const RegisteredCA = () => {
    const [registeredCAList, setRegisteredCAList] = useState([]);
    const navigate = useNavigate();
const rolePath = useSelector((state)=>state.jwtAuthentication.rolePath);
    const getCAList = async () => {
        try {
            const response = await DashboardService.getAllActiveCA();

            const list = response.data.map((obj, index) => ({
                id: index + 1,
                caId: obj.caId, // Make sure caId exists in response
                licenseName: obj.licenseName,
                userName: obj.userName,
                issueDate: timeStampToDate(obj.issueDate),
                expiryDate: obj.expiryDate ? timeStampToDate(obj.expiryDate) : '-'
            }));

            setRegisteredCAList(list);
        } catch (err) {
            console.error("Failed to fetch CA list", err);
        }
    };

    useEffect(() => {
        getCAList();
    }, []);


 const openCATracker = (userName) => {
     const userNames = (encrypt(userName));
         showAlert({
            messageTitle: 'Licensee History',
            messageContent: <SingleUserTracker username={userNames} />,
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: 'md',
            closeText: 'Close',
          
           
        });


        //   if (userName) {
        //     const encryptedId = encodeURIComponent(encrypt(userName));
        //     navigate(`${rolePath}/cawisehistory/licenseehistory/${encryptedId}`);
        // } else {
        //     showAlert({
        //         messageTitle: ' Licensee History',
        //         messageContent: 'Error in Licensee History, try after some time.',
        //         confirmText: 'Ok',
        //         enableHeaderCloseBtn: true,
        //         disableOutsideKeyDown: true,
        //     });
        // }



    };
    


    const columns = useMemo(() => [
        { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
        {
            field: 'licenseName', headerName: 'Licensed CA', resizable: false, width: 350,
            renderCell: (params) => (
                <Box component="span">
                    <Link
                        sx={{ cursor: "pointer" }}
                        onClick={() => openCATracker(params.row.userName)}
                        underline="hover"
                    >
                        {params.row.licenseName}
                    </Link>
                </Box>
            )
        },
        { field: 'issueDate', headerName: 'Date of grant of Licence', resizable: false, width: 200 },
        { field: 'expiryDate', headerName: 'Licence Valid upto', resizable: false, width: 200 },
    ], [navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            {/* <Box component="div">
                <Grid2 container spacing={2} direction="column">
                    <Grid2 sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                        <Button variant="contained" onClick={handleBack}>
                            <Typography variant="h6">Back</Typography>
                        </Button>
                    </Grid2>
                </Grid2>
            </Box> */}

            <CustomTable
                customTitle="Licensed CA"
                columns={columns}
                rows={registeredCAList}
                hideColumnsForExport={['']}
                pageSizeOptions={[10, 25, 50, 100]}
            />
        </>
    );
};

export default RegisteredCA;
