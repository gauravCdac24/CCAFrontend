import ViewSubMenuMaster from "./ViewSubMenuMaster";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const SubMenuMaster = () => {

    const navigate = useNavigate();

    const addSubMenuMaster = () =>{

        navigate("/admin/submenu/addsubmenu");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addSubMenuMaster}>
                            <Typography variant="h6">Add Sub Menu</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewSubMenuMaster />


            </Box>
        
    )

}

export default SubMenuMaster;