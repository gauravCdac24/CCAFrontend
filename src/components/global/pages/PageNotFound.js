import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PageNotFound = () => {


    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation=()=>{
        navigate('/login', {replace: true});
    }

    return(
    
    <Box component='div' sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '80vh'}}>

        <Box sx={{width: "auto", height: "auto"}}>
            
                <Box component="div" sx={{fontSize: '18vw', color: 'primary.main', m: 0, p:0}}>404</Box>
                <Box component="p" sx={{fontSize: '2vw', textAlign: 'center', m: 0, p:0}}>Page Not Found</Box>
                <Box component="p" sx={{fontSize: '1vw', textAlign: 'center', m: 0, p:0}}>Oops! The page you are looking for does not exist. It might have been moved or deleted.</Box>
                
                <Grid container direction="row" sx={{ mt: 1}}  justifyContent="center" alignItems="center">
                    <Grid item  >
                        <Button type="button" onClick={handleNavigation} fullWidth variant="contained" sx={{maxWidth: '120px' }}>
                            Home
                        </Button>
                    </Grid>                        
                </Grid>

        </Box>

    </Box>
    
    )

}

export default PageNotFound;