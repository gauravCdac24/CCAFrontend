import ViewRole from "./ViewRole";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const Role = () => {

    const navigate = useNavigate();

    // const addRole = () =>{

    //     navigate("/admin/addrole/addassignedrole");

    // }

    return(
        
            <Box component="div">

                {/* <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addRole}>
                            <Typography variant="h6">Add Assigned Role</Typography>
                        </Button>
                    </Grid>
                </Grid> */}
                
                <ViewRole />


            </Box>
        
    )

}

export default Role;