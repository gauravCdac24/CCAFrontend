import ViewSubMenuMaster from "./ViewSubMenuInternalMaster";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const SubMenuInternalMaster = () => {

    const navigate = useNavigate();

    const addSubMenuInternal = () =>{

        navigate("/admin/internalsubmenu/addinternalsubmenu");

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addSubMenuInternal}>
                            <Typography variant="h6">Add Sub Menu Internal</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewSubMenuMaster />


            </Box>
        
    )

}

export default SubMenuInternalMaster;