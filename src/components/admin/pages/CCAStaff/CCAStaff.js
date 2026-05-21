import ViewCCAStaff from "./ViewCCAStaff";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";


const CCAStaff = () => {

    const navigate = useNavigate();
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

    const addCCAStaff = () =>{
        const path = `${routeRootPath}/ccastaff/addccastaff`;
        navigate(path);

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addCCAStaff}>
                            <Typography variant="h6">Register Employee</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewCCAStaff />


            </Box>
        
    )

}

export default CCAStaff;