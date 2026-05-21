import { useEffect, useState } from 'react';
import { Avatar, Box, Collapse, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ExpandLess, ExpandMore, Lens} from '@mui/icons-material';
import { drawerWidth } from '../Util/Constant';
import { formatMenuDisplayLabel } from '../Util/menuLabelUtils';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../../../store/Auth/Reducer';
import showAlert from '../../../components/global/common/MessageBox/AlertService';
import { useSelector } from 'react-redux';
import SubMenuMasterService from '../../../service/AdminService/SubMenuMasterService';
import LoaderProgress from '../../../components/global/common/LoaderProgress';
import * as ReactIcons from '@mui/icons-material';

const Sidebar = ({ open, handleDrawerClose }) => {
    const [expandMenu, setExpandMenu] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.jwtAuthentication);
    const [isLoading, setIsLoading] = useState(false);


    const getSidebarMenu = (roleName) => {
            setIsLoading(true);
            
                SubMenuMasterService.getSidebarByRole(roleName)
                .then((response)=>{
                    setIsLoading(false);
                    setMenuItems(response.data);
                })
                .catch ((err) =>{
                    setIsLoading(false);
                })
                
        };
    


    useEffect(()=>{
        if (user?.currentRole) {
            const roleName = user.currentRole.substring(5);
            getSidebarMenu(roleName);    
        }
    },[user.currentRole])


    const handleToggleSubMenu = (id) => {
        setExpandMenu((prevState) => (prevState === id ? null : id));
    };

    const handleNavigation = (path) => {

        if(path==="/logout"){
            logout(path);
        }
        else{
            navigate(path);
        }
    };

    const isPathMatching = (itemPath, children) => {

        

        if (itemPath && (location.pathname === itemPath)) {
          return true;
        }
        if (children && children.some(child => location.pathname === ('/'+child.menuId.roleId.path+'/'+child.subMenuPath))) {
            
          return true;
        }
        return children.some(child => {
            if(location.pathname.startsWith(('/'+child.menuId.roleId.path+'/'+child.subMenuPath)))
                return true;
            else 
                return false;
            }
        );
      };

      const isChildPathMatching = (child) =>{
        if(location.pathname === ('/'+child.menuId.roleId.path+'/'+child.subMenuPath))
            return true;

        if(location.pathname.startsWith(('/'+child.menuId.roleId.path+'/'+child.subMenuPath)))
            return true;
      }
      

    const logout = () => {

        showAlert({
            messageTitle: 'Logout?',
            messageContent: 'Are you sure, you want to logout?',
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => {
                dispatch(clearCredentials())
                navigate("/login",{ replace: true });
            }
        })
        
    }

    const DynamicIcon = ({ iconName }) => {
        const IconComponent = ReactIcons[iconName];
      
        if (IconComponent) {
          return <IconComponent />;
        } else {
          return <span>{""}</span>;
        }
      };


    const drawer = (
        <>
            <LoaderProgress open={isLoading}/>

        <Box component="div">
             <Toolbar>
            </Toolbar>
            {/* <Divider />  */}
            <List>
                {menuItems.map((item, index) => (
                    <div key={index}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => (item.children.length > 0 ? handleToggleSubMenu(item.menuId) : handleNavigation(item.path))}
                                
                                sx={{

                                    ...(isPathMatching(item.path, item.children) && {backgroundColor: 'primary.main', 
                                                                            color: 'primary.text',
                                                                            borderRadius: '0px 25px 25px 0px',
                                                                            mr: 2,
                                                                            '&:hover':{
                                                                                backgroundColor: 'primary.light', 
                                                                                color: 'primary.text',
                                                                                borderRadius: '0px 25px 25px 0px',
                                                                                mr: 2,
                                                                            }
                                                                        }),
                                    
                                }}
                            >
                                <ListItemIcon sx={{color: "inherit"}}><DynamicIcon iconName={item.menuIcon} /></ListItemIcon>
                                <ListItemText disableTypography primary={formatMenuDisplayLabel(item.menuName)} sx={{fontSize: '13px', fontWeight: 600}}/>
                                {item.children.length > 0 && (expandMenu === item.menuId ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>
                        </ListItem>
                        {item.children.length > 0 && (
                            <Collapse in={expandMenu === item.menuId} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.children.map((child, index) => (
                                        <ListItem key={index} disablePadding>
                                            <ListItemButton
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleNavigation(('/'+child.menuId.roleId.path+'/'+child.subMenuPath));
                                                }}

                                                sx={{
                                                    transition: (theme) => theme.transitions.create(['margin', 'width'], {
                                                        easing: theme.transitions.easing.sharp,
                                                        duration: theme.transitions.duration.leavingScreen,
                                                    }),
                                                }}

                                            >
                                                <ListItemIcon sx={{ display: 'flex', 
                                                                    justifyContent: 'center', 
                                                                    alignItems: 'center' }}>
                                                    <Lens sx={{ fontSize: '8px',
                                                                ...(isChildPathMatching(child) ? {color: 'primary.light', fontSize: '12px'} : {color: 'sidebar.text'}), 
                                                     }} />
                                                </ListItemIcon>
                                                
                                                <ListItemText disableTypography primary={formatMenuDisplayLabel(child.subMenuName)} sx={{
                                                    ...(isChildPathMatching(child) && {fontWeight: 900}), 
                                                    fontSize: '13px',
                                                }}/>
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </div>
                ))}
            </List>
        </Box>
        </>
    );

    return (
        <>
            {/* Mobile Drawer */}
            <Drawer
                open={open}
                variant="temporary"
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        overflowY: 'auto',
                        backgroundColor: "sidebar.main",
                        color: "sidebar.text"
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                open={open}
                variant="persistent"
                sx={{
                    display: { xs: 'none', sm: 'block'},
                    '& .MuiDrawer-paper': {
                        
                        width: drawerWidth,
                    overflowY: 'auto',
                    backgroundColor: "sidebar.main",
                    color: "sidebar.text"
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Sidebar;
