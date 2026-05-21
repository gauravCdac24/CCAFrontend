import ViewESignAPIVersion from "./ViewESignAPIVersion";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";

const ESignAPIVersion = () => {

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const addAPIVersion = () =>{

        navigate(`${rolePath}/apiversion/addapiversion`);

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addAPIVersion}>
                            <Typography variant="h6">Add API Version</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewESignAPIVersion />


            </Box>
        
    )

}

export default ESignAPIVersion;