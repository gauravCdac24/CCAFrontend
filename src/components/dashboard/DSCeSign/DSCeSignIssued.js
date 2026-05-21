import ViewDSCeSignIssued from "./ViewDSCeSignIssued";
import { Box, Button, Grid2, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";

const DSCeSignIssued = () => {

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const addDSCeSignIssued = () =>{

        navigate(`${rolePath}/dscesignissued/adddscesignissued`);

    }

    return(
        
            <Box component="div">

                <Grid2 container spacing={2} direction={'column'}>

                    <Grid2  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addDSCeSignIssued}>
                            <Typography variant="h6">Add DSC & eSign Issued</Typography>
                        </Button>
                    </Grid2>
                </Grid2>
                
                <ViewDSCeSignIssued />


            </Box>
        
    )

}

export default DSCeSignIssued;