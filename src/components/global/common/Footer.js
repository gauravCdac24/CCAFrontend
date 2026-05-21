import { Typography, Grid} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { setFooterHeight } from '../../../store/FooterSize/Reducer';

const Footer = () =>{

    const [cyear, setCyear] = useState(2024);
    const footerRef = useRef(null);
    const dispatch = useDispatch();
    

    const getCurrentYear = () =>{

         setCyear(new Date().getFullYear());
    }

    const handleResize = () => {
        dispatch(setFooterHeight(footerRef.current.offsetHeight));
    };

    useEffect(()=>{

        getCurrentYear();
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {

            window.removeEventListener('resize', handleResize);
            
        };

        
        
    },[]);

    return(

            <Grid ref={footerRef} container direction="column" sx={{backgroundColor: "footer.main", 
                                                    color: "footer.text", 
                                                    padding: "0%"}}>
                <Grid item>
                    <Typography sx={{textAlign: "center"}} variant='body1'>&#169; {cyear} Controller of Certifying Authorities (CCA),MeitY, Govt. of India </Typography>
                </Grid>
           
                <Grid item>
                    <Typography variant='body1' sx={{textAlign: "center"}}>  Website owned by Controller of Certifying Authorities (CCA) & maintained by C-DAC, Delhi.</Typography>
                </Grid>
            </Grid>

    )

}

export default Footer;
