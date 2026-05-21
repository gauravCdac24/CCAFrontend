import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Menu, MenuList, Grid, Divider, Badge } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import NotificationIcon from '@mui/icons-material/Notifications';
import NotificationService from '../../../service/NotificationService/NotificationService';
import CircleIcon from '@mui/icons-material/Circle';
import showAlert from '../../../components/global/common/MessageBox/AlertService';
import ViewNotificationDetails from './ViewNotificationDetails';
import ViewAllNotification from './ViewAllNotification';
import EmailIcon from '@mui/icons-material/Email';

const Notification = ({anchorElUser, setAnchorElUser, notificationList, setNotificationList, unread, setUnread}) => {
  
  
  const ref= useRef();

  const handleOpenUserMenu = (event) => {
    if (anchorElUser.notificationAnchor === null) {
      setAnchorElUser({
        notificationAnchor: event.currentTarget,
        profileAnchor: null,
      });
    } else {
      handleCloseUserMenu();
      event.currentTarget.blur();
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser({
      notificationAnchor: null,
      profileAnchor: null,
    });
  };


  const getNotificationList = () =>{

    NotificationService.getNotificationByUsernameAndRole()
    .then((response)=>{
      setNotificationList(response.data);

      const obj = response.data.filter((item)=>!item.isread);
      setUnread(obj.length)

    }).catch((err)=>{

    })
  }


  const showNotificationDetails = (obj) => {


    NotificationService.readNotificationById(obj.notificationId)
    .then((response)=>{

    }).catch((err)=>{

    })

    showAlert({
      messageTitle: 'Notification',
      messageContent: <ViewNotificationDetails Obj={obj}/>,
      enableHeaderCloseBtn: false,
      disableOutsideKeyDown: true,
      confirmText: 'Ok',
      onConfirm: ()=>getNotificationList()
  })



  }



  const getDiffDate = (date) => {
    
    const givenDate = new Date(date);
    const now = new Date();
  
    const diffInMillis = now - givenDate;
  
    const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
    const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));
    const diffInYears = Math.floor(diffInDays / 365);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 365) {
      return `${diffInDays} days ago`;
    } else {
      return `${diffInYears} years ago`;
    }
  };

  

 
  const handleViewAllNotification = () =>{


      showAlert({
          messageTitle: 'Notifications',
          messageContent: <ViewAllNotification ref={ref} getNotificationList={getNotificationList}/>,
          enableHeaderCloseBtn: false,
          disableOutsideKeyDown: true,
          buttonOneText: 'Mark All Read',
          closeText: "Close",
          onButtonOneClick: () => markAllNotificationRead(),
          fullWidth: true,
          maxWidth: 'md'
      })

  }

  const markAllNotificationRead = () => {

    ref.current?.markAllNotificationRead();

  }
  

  useEffect(()=>{

    getNotificationList();
  
  }, [])

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip arrow title="Notification">
        <IconButton
          size="large"
          onClick={handleOpenUserMenu}
          aria-label="show notifications"
          color="inherit"
          aria-controls={anchorElUser.notificationAnchor ? 'notification-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={anchorElUser.notificationAnchor ? 'true' : undefined}
        >
          <Badge badgeContent={unread} color="error">
            <NotificationIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id="notification-menu"
        anchorEl={anchorElUser.notificationAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser.notificationAnchor)}
        onClose={handleCloseUserMenu}
        slotProps={{
          paper: {
            onMouseDown: (event) => event.preventDefault(),
          },
        }}
        elevation={4}
        sx={{ mt: '49px',
          '& .MuiMenu-paper':{
            backgroundColor: 'bodycolor.main', 
            color: 'bodycolor.text'
          }
        }}
      >
        <MenuList autoFocus sx={{ p: 0 }}>
        <Grid container direction="row" alignItems="center" sx={{ml: 2}}>
          <Grid item>
            <EmailIcon sx={{mt:0.6}} color="primary"/>
          </Grid>
          <Grid item sx={{ml: 1}}>
            <Typography variant="h6">
              Notifications
            </Typography>
          </Grid>
        </Grid>

        
        <Box sx={{ maxHeight: '200px', width: '300px', overflowY: 'auto', overflowX: 'hidden' }}>
            {notificationList.length > 0 ? (
              notificationList.map((notification, index) => (
                <Box key={index}>
                  <MenuItem onClick={() => showNotificationDetails(notification)} sx={{ minWidth: '100px' }}>
                    <Grid container direction="column">
                      {/* Message and Icon */}
                      <Grid item>
                        <Grid container direction="row" sx={{ m: 0 }}>
                          <Grid item xs={10}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: '300',
                                wordWrap: 'break-word',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '200px',
                              }}
                            >
                              {notification.message}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <CircleIcon sx={{ fontSize: '12px', color: notification.isread ? '#DDDDDD' : 'primary.main' }} />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Timestamp */}
                      <Grid item sx={{ pr: 1, mt: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: '300', color: '#BCBCBC' }}>
                          {getDiffDate(notification.created)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </MenuItem>
                  <Divider sx={{ borderStyle: 'dotted' }} />
                </Box>
              ))
            ) : (
              <Box sx={{textAlign: 'center', p: 4}}><Typography>No Notifications</Typography></Box>
            )}
          </Box>

        
        {notificationList.length>0 && (<><Divider /> <MenuItem onClick={()=>handleViewAllNotification()} sx={{ minWidth: '100px', justifyContent: 'center', py: 2 }}>
          <Typography variant="body2" color="primary">
            View All
          </Typography>
        </MenuItem></>)}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Notification;
