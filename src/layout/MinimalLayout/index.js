import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/global/common/Footer";
import Accessibility from "../../components/global/common/Accessibility";
import { Box } from "@mui/material";
import { useSelector } from 'react-redux';
import Cheader from "../../components/global/common/Cheader";
import { useEffect } from "react";

const MinimalLayout = () =>{

    const footerHeight = useSelector((state)=>state.footerSize.fheight);
    const homePage = useSelector((state)=>state.jwtAuthentication.homePath);

    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(()=>{
    //     //if(homePage !== '' && (location.pathname==='/' || location.pathname==='/login' || location.pathname==='/forgotpwd' || location.pathname==='/intentregistration')){
    //         if(homePage !== ''){
    //         navigate(`${homePage}`, { replace: true, state: { from: location } });
    //     }
    // }, []);

    return(
        <>
        <Box sx={{ display: 'flex', flexDirection: 'column', 
            backgroundImage: 'url("images/background.jpg")',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            minHeight: `calc(100vh - ${footerHeight}px)`
        }}>
                <Cheader />
                <Accessibility />
                <Outlet/>
        </Box>
            <Footer />
        </>
    );
    

};

export default MinimalLayout;



