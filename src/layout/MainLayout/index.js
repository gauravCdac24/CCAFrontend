import { Box, Toolbar, Typography, Grid } from "@mui/material";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import SubHeader from "../../components/global/common/SubHeader";
import { drawerWidth } from "./Util/Constant";
import AccessibilityUser from "../../components/global/common/AccessibilityUser";

const MainLayout = () => {
    const [open, setOpen] = useState(window.innerWidth >= 600);
     const [cyear, setCyear] = useState(2024);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

     const getCurrentYear = () =>{

         setCyear(new Date().getFullYear());
    }

    const handleDrawerClose = () => {
        setOpen(false);
    };
 useEffect(()=>{

        getCurrentYear();
        

        
        
    },[]);



    return (
        <>
            <AccessibilityUser />
            <Box component="div" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose}  />
                <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
                
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            
                            transition: (theme) => theme.transitions.create(['margin', 'width'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                            marginLeft: { sm: open ? `${drawerWidth}px` : '0px', xs: '0px' },
                            width: { sm: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
                            overflowY: 'auto', 
                            height: '100vh', 
                        }}
                    >
                        <Toolbar />
                        <Box component="div" sx={{minHeight: 'calc(100vh - 110px)'}}>
                            <Box component="div" sx={{backgroundColor: 'tracker.main', color: 'tracker.text', py: 1, px: 3}}>
                                <SubHeader />
                            </Box>
                            <Box component="div" sx={{p: 3}}>
                                <Outlet />
                            </Box>
                            
                        </Box>

                <Box
                    sx={{
                       
                        position: 'relative',
                    }}
                >
                    <Grid
                        container
                        direction="column"
                        sx={{
                            backgroundColor: "footer.main",
                            color: "footer.text",
                            padding: "0%",
                            zIndex: (theme) => theme.zIndex.drawer - 1,
                            width: '100%'
                        }}
                    >
                        <Grid item>
                            <Typography sx={{ textAlign: "center" }} variant="body1">
                                &#169; {cyear} Controller of Certifying Authorities (CCA),MeitY, Govt. of India
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1" sx={{ textAlign: "center" }}>
                                Website owned by Controller of Certifying Authorities (CCA) & maintained by C-DAC, Delhi.
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>


                    </Box>
            

                
            </Box>
        </>
    );
};

export default MainLayout;
