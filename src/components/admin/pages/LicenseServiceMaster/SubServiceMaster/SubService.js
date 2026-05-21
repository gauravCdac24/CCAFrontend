import ViewSubService from "./ViewSubService";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const SubService = () => {

    const navigate = useNavigate();

    const addSubService= () =>{

        navigate("/admin/subservice/addsubservice");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addSubService}>
                            <Typography variant="h6">Add Sub Service</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewSubService />


            </Box>
        
    )

}

export default SubService;