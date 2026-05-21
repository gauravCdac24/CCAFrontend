import Toolbar from '@mui/material/Toolbar';
import { Avatar, Box, Grid, Tooltip, Typography } from '@mui/material';
import {useDispatch} from "react-redux";
import { setTitleHeight } from '../../../store/TitleHeight/Reducer';
import { useEffect, useRef } from 'react';

const Cheader = () =>{
  
    const cheaderRef = useRef(null);
    const dispatch = useDispatch();
    
    const handleResize = () => {
        dispatch(setTitleHeight(cheaderRef.current.offsetHeight));
    };

    useEffect(()=>{

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {

            window.removeEventListener('resize', handleResize);
            
        };

    },[]);

    return (
        <Box
            
            
            ref={cheaderRef}
            sx={{
                zIndex: { 
                    xs: 1000, 
                    sm: 10001 
                  },
                width: '100%',
                transition: (theme) =>
                    theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    backgroundColor: 'appbar.main',
                    color: 'appbar.text',
                    height: '64px'
            }}
        >
            <Toolbar>
                

              
            <Grid container >

            <Grid item sm sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            
            <Box sx={{ m:1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%", display: {xs: 'block', sm: 'none'} }}>
                    <Tooltip title="Licensing of Certifying Authorities and Dashboard for DSCs">
                        <>
                            <Avatar alt="CCA Logo" src="/images/ccalogo.png" sx={{ml: 1}}/>
                        </>
                    </Tooltip>

                </Box>

                <Box sx={{ m:1, display: 'flex', justifyContent: 'center', alignItems: 'center', display: {xs: 'none', sm: 'block'} }}>
                    <Grid container sx={{width: 'auto'}}>
                        <Grid item>
                            <Avatar alt="CCA Logo" src="/images/ccalogo.png" sx={{ml: 1}}/>
                        </Grid>
                        <Grid>
                            <Typography variant='h6' sx={{m: 1}}>Licensing of Certifying Authorities and Dashboard for DSCs</Typography>
                        </Grid>
                    </Grid>

                    
                </Box>
                
            </Grid>

            </Grid>

            </Toolbar>
        </Box>
       
    );
}

export default Cheader;
