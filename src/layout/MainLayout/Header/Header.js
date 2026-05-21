import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Grid, Tooltip, Typography } from '@mui/material';
import Profile from './Profile';
import Notification from './Notification';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Header = ({ open, handleDrawerOpen, handleDrawerClose }) =>{

    const colorMode = useSelector((state) => state.colorMode);
    const [notificationList, setNotificationList] = useState([]);
    const [unread, setUnread] = useState(0);

    const [anchorElUser, setAnchorElUser] = useState({
        notificationAnchor: null,
        profileAnchor: null
    });


    
    return (
        <AppBar
            position="fixed"
            elevation={0}
            
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
                <IconButton  
                    aria-label="open drawer"
                    onClick={open ? handleDrawerClose : handleDrawerOpen}
                    edge="start"
                    sx={{ marginRight: 5, color: colorMode.themeColorMode===colorMode.appbarColor?"#FFFFFF":"primary.main"}}
                >
                    <MenuIcon />
                </IconButton>

                {/*---------------*/}

            <Grid container >

            <Grid item  md sm xs  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%"}} >
                <>
            <Box sx={{ m:1, display: {xs: 'block', sm: 'block', md: 'none'} }}>
                    <Tooltip title="Licensing of Certifying Authorities and Dashboard for DSCs">
                        <Avatar alt="CCA Logo" src="/images/ccalogo.png" sx={{ ml: 1 }} />
                    </Tooltip>
                </Box>

                <Box sx={{ m:1, display: 'flex', justifyContent: 'center', alignItems: 'center', display: {xs: 'none', sm: 'none', md: 'block'} }}>
                    <Grid container sx={{width: 'auto'}}>
                        <Grid item>
                            <Avatar alt="CCA Logo" src="/images/ccalogo.png" sx={{ml: 1}}/>
                        </Grid>
                        <Grid>
                            <Typography variant='h6' sx={{m: 1}}>Licensing of Certifying Authorities and Dashboard for DSCs</Typography>
                        </Grid>
                    </Grid>

                    
                </Box>
                </>
            </Grid>

            <Grid item  sx={{mt:1.4}}>

            <Box component="div" sx={{display: 'flex',
                                               flexDirection: 'row',
                                               justifyContent: 'right' ,
                                               alignItems: 'right',
                                               width: '100%',
                                               
                                               
                     }}>

                    <Box sx={{display: 'flex', gap: '12px'}}>
                        <Box sx={{flex: 'auto'}}>
                            <Notification anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} notificationList={notificationList} setNotificationList={setNotificationList} unread={unread} setUnread={setUnread} />
                        </Box>                         
                        <Box sx={{flex: 'auto'}}>
                            <Profile anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} notificationList={notificationList} unread={unread} />
                        </Box>
                        
                    </Box>

                    </Box>

            </Grid>

        </Grid>

            </Toolbar>
        </AppBar>
    );
}

export default Header;
