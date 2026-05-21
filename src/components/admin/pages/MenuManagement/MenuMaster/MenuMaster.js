import ViewMenuMaster from "./ViewMenuMaster";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const MenuMaster = () => {

    const navigate = useNavigate();

    const addMenuMaster = () =>{

        navigate("/admin/menumaster/addmenu");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addMenuMaster}>
                            <Typography variant="h6">Add Menu</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewMenuMaster />


            </Box>
        
    )

}

export default MenuMaster;