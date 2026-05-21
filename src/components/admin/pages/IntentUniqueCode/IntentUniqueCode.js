import ViewIntentUniqueCode from "./ViewIntentUniqueCode";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const IntentUniqueCode = () => {

    const navigate = useNavigate();

    const addUniqueCode = () =>{

        navigate("/admin/iuniquecode/adduniquecode");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addUniqueCode}>
                            <Typography variant="h6">Generate Intent Code</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewIntentUniqueCode />


            </Box>
        
    )

}

export default IntentUniqueCode;