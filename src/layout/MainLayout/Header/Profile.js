import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Logout, Password, Person } from '@mui/icons-material';
import { Divider, FormControl, Grid, Select } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials,setCredentials } from '../../../store/Auth/Reducer';
import showAlert from '../../../components/global/common/MessageBox/AlertService';
import RoleMasterService from '../../../service/AdminService/RoleMasterService';
import ProfileDetails from './ProfileDetails';
import ChangePassword from './ChangePassword';
import NotificationService from '../../../service/NotificationService/NotificationService';
import store from '../../../store';
import {
  isSalutationOnly,
  resolveApplicantDisplayName,
  resolveProfileDetails,
  trimPart,
} from './profileNameUtils';

const Profile = ({anchorElUser, setAnchorElUser, setNotificationList, setUnread}) => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authSelector = useSelector((state)=>state.jwtAuthentication);
  const userRoles = useSelector((state)=>state.jwtAuthentication.roles);
  const currentRole = useSelector((state)=>state.jwtAuthentication.currentRole);
  
  const location = useLocation();
  const ref = useRef();
  const [displayName, setDisplayName] = useState(authSelector.name || '');
  const [nameToPersist, setNameToPersist] = useState(null);

  useEffect(() => {
    const storedName = trimPart(authSelector.name);
    if (storedName && !isSalutationOnly(storedName)) {
      setDisplayName(storedName);
    }
  }, [authSelector.name, authSelector.username]);

  useEffect(() => {
    if (!nameToPersist) {
      return;
    }

    const auth = store.getState().jwtAuthentication;
    const storedName = trimPart(auth.name);
    if ((!storedName || isSalutationOnly(storedName)) && nameToPersist !== auth.username) {
      dispatch(setCredentials({
        ...auth,
        name: nameToPersist,
      }));
    }
    setNameToPersist(null);
  }, [nameToPersist, dispatch]);

  const handleRefSubmit = () => {
    ref.current?.handleFormSubmit();
  }

  const handleRefReset = () => {
    ref.current?.handleReset();
  }

  const fetchDisplayName = async () => {
    if (!authSelector.username) {
      return;
    }

    try {
      const resolvedName = await resolveApplicantDisplayName(authSelector.username);
      setDisplayName(resolvedName);

      const storedName = trimPart(authSelector.name);
      if ((!storedName || isSalutationOnly(storedName)) && resolvedName !== authSelector.username) {
        setNameToPersist(resolvedName);
      }
    } catch {
      const fallback = trimPart(authSelector.name);
      setDisplayName(!fallback || isSalutationOnly(fallback) ? authSelector.username : fallback);
    }
  };

  const handleOpenUserMenu = (event) => {
    if (anchorElUser.profileAnchor === null) {
      setAnchorElUser({
        notificationAnchor: null,
        profileAnchor: event.currentTarget,
      });
      fetchDisplayName();
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

  const handleMenuItemClick = (path) => {
    handleCloseUserMenu();
    if(path==="/logout"){
      logout(path);
    }else if(path === "/viewprofile"){
      viewprofile();
    }else if(path === "/changepwd"){
      changeUserPassword();
    }
    else{
        navigate(path);
    }
  };


  const viewprofile = async () => {
    try {
      const profileObj = await resolveProfileDetails(authSelector.username);

      showAlert({
        messageTitle: 'Profile',
        messageContent: <ProfileDetails profileObj={profileObj} />,
        confirmText: 'Ok',
        enableHeaderCloseBtn: true,
      });
    } catch {
      showAlert({
        messageTitle: 'Profile',
        messageContent: 'Unable to load profile details. Please try again later.',
        confirmText: 'Ok',
        enableHeaderCloseBtn: true,
      });
    }
  };

  const changeUserPassword = () => {

    showAlert({
      messageTitle: 'Change Password',
      messageContent: <ChangePassword username={authSelector.username} ref={ref}/>,
      enableHeaderCloseBtn: true,
      buttonOneText: "Submit",
      buttonTwoText: "Reset",
      onButtonOneClick: ()=>handleRefSubmit(),
      onButtonTwoClick: ()=>handleRefReset()
  })

  }


  const logout = () => {

    showAlert({
        messageTitle: 'Logout?',
        messageContent: 'Are you sure, you want to logout?',
        confirmText: 'Yes',
        closeText: 'No',
        onConfirm: () => {
            dispatch(clearCredentials())
            localStorage.removeItem("timers");
            navigate("/login",{ replace: true });
        }
    })
    
}


const  getNotificationList = (homePage) =>{



  NotificationService.getNotificationByUsernameAndRole()
  .then((response)=>{
    setNotificationList(response.data);

    const obj = response.data.filter((item)=>!item.isread);
    setUnread(obj.length)

    
    navigate(homePage, { replace: true, state: { from: location } });

  }).catch((err)=>{

  })
}


const handleChangeRole = (e)=>{

  

  RoleMasterService.getRoleByName(e.target.value.substring(5))
  .then((response)=>{

      const roleDetails= response.data;
      console.log("e.target.value===>",e.target.value);
    console.log("roleDetails===>",JSON.stringify(roleDetails));
      const userCredentials = {
        name: authSelector.name || displayName,
        username: authSelector.username,
        refreshToken: authSelector.refreshToken,
        roles: authSelector.roles,
        jwt: authSelector.jwt,
        currentRole: e.target.value
    }
      console.log("userCredentials===>",JSON.stringify(userCredentials));
      userCredentials.rolePath = `/${roleDetails.path}`;
      userCredentials.homePath = `/${roleDetails.homePage}`;
      userCredentials.roleName = roleDetails.description;

      
      dispatch(setCredentials(userCredentials));
      getNotificationList(`/${roleDetails.homePage}`);

      window.location.href = `/${roleDetails.homePage}`;
      
      //navigate(`/${roleDetails.homePage}`, { replace: true, state: { from: location } });
     
  })
  .catch((err)=>{
    alert(err)
  })  

}





const settings = [
  {
    id: 1,
    title: 'View Profile',
    icon: <Person sx={{ color: 'inherit' }} />,
    path: '/viewprofile',
    divider: false,
  },
  {
    id: 2,
    title: 'Change Password',
    icon: <Password sx={{ color: 'inherit' }} />,
    path: '/changepwd',
    divider: true,
  },
  {
    id: 3,
    title: 'Logout',
    icon: <Logout sx={{ color: 'inherit' }} />,
    path: '/logout',
    divider: false,
  },
];



  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip arrow title="Profile">
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{ p: 0 }}
          aria-controls={anchorElUser.profileAnchor ? 'menu-appbar' : undefined}
          aria-haspopup="true"
          aria-expanded={anchorElUser.profileAnchor ? 'true' : undefined}
        >
          <Avatar alt="Profile" src="/images/profile.png" />
        </IconButton>
      </Tooltip>

      <Menu
        id="menu-appbar"
        anchorEl={anchorElUser.profileAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser.profileAnchor)}
        onClose={handleCloseUserMenu}
        slotProps={{
          paper: {
            onMouseDown: (event) => event.preventDefault(),
          },
        }}
        sx={{ mt: '49px',
          '& .MuiMenu-paper':{
            backgroundColor: 'bodycolor.main', 
            color: 'bodycolor.text'
          }
        }}
        elevation={4}
      >
        <MenuList autoFocus sx={{ p: 0 }}>
        <Box sx={{m: 1}}>
        
          <Typography sx={{fontWeight: '600', textAlign: 'center'}}  variant='body1'>{displayName || authSelector.username}</Typography>  
          <Typography sx={{fontWeight: '600', textAlign: 'center'}} variant='body1'>({authSelector.roleName})</Typography>   

          {/* Change Role */}


          {userRoles.length>1 && (<Box sx={{m: 1, textAlign: 'center'}}>
                      
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="role"
                                    required
                                    value=''
                                    onChange={handleChangeRole}
                                    displayEmpty
                                    name="role"
                                    
                                    size='small'
                                >
                                  <MenuItem value='' disabled >
                                    Switch Role
                                  </MenuItem>
                                    {userRoles.map((item, index) => (
                                        <MenuItem disabled={currentRole===item} key={index} value={item}>
                                            {item.substring(5)}
                                        </MenuItem>
                                    ))}
                                </Select>
                                
                            </FormControl>
                        </Box>)}


          {/*----------------*/}


        <Divider />

        {settings.map((setting) => (
          <Box key={setting.id}>
            <MenuItem onClick={() => handleMenuItemClick(setting.path)} sx={{ minWidth: '100px' }}>
              <Grid sx={{m: 0}} container alignItems="center">
                <Grid item sx={{ px: 1, pt: 1 }}>
                  {setting.icon}
                </Grid>
                <Grid item sx={{ pr: 1 }}>
                  <Typography  variant='subtitle1' sx={{fontWeight: '300'}}>{setting.title}</Typography>
                </Grid>
              </Grid>
            </MenuItem>
            {setting.divider && <Divider />}
          </Box>
        ))}

        
      </Box>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Profile;
