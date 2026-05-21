import ViewASP from "./ViewASP";
import { Box, Button, Grid2, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";

const ASP = () => {

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const addASP = () =>{

        navigate(`${rolePath}/asplist/addasp`);

    }

    return(
        
            <Box component="div">

                <Grid2 container spacing={2} direction={'column'}>

                    <Grid2 item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addASP}>
                            <Typography variant="h6">Add ASP</Typography>
                        </Button>
                    </Grid2>
                </Grid2>
                
                <ViewASP />


            </Box>
        
    )

}

export default ASP;