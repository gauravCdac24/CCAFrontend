import {useDispatch, useSelector} from "react-redux";
//material ui
import { Typography, Grid, Box, Fade, Divider, Tooltip} from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

//project import

import {incrementFontSize, decrementFontSize, resetFontSize} from "../../../store/FontSize/Reducer";
import { changeColorMode, changeFooterColor, changeMode, changeAppbarColor } from "../../../store/ColorMode/Reducer";


const Accessibility = () =>{

  const dispatch = useDispatch();
  const [themeSetting, setThemeSetting] = useState(false);
  const drawerWidth = 220;
  const isDarkMode = useSelector((state) => state.colorMode.isDarkMode);

  const themeColors=["#BD0F10", 
                "#27AE60", 
                "#3498DB", 
                "#7F00FF", 
                "#FFBF00", 
                "#40E0D0", 
                "#E9967A", 
                "#6B8E23", 
                "#FF6347",
                "#008080",
                "#BA55D3",
                "#FF1493"];

  const footerColors=[
                "#8B4513",
                "#756464", 
                "#FFFACD", 
                "#E0FFFF", 
                "#E6E6FA", 
                "#FFF0F5", 
                "#F5F5DC", 
                "#F0F8FF", 
                "#FFFFFF", 
                "#DCDCDC",
                "#DDA0DD",
                "#373B45"];
  
  const appbarColors=[
                "#BD0F10",
                "#FF7F7F",
                "#756464",
                "#7F00FF",
                "#804397", 
                "#d4a8c4", 
                "#aed5af",
                "#373B45",
                "#FFFFFF",
                "#a6a8ac",
                "#e8e9ea",
                "#80727f"
    ]

  const handleThemeSetting = () => {
    setThemeSetting((prevVal)=>!prevVal);
  }

  const closeThemeSetting = () => {
    setThemeSetting(false);
  }

  const AppbarColorButton = ({color}) =>{
    return(
          <Box component="div" sx={{
            width: "30px",
            height: "30px",
            backgroundColor: `${color}`,
            borderRadius: "50%",
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 8px',
            cursor: 'pointer',
            '&:hover':{
              boxShadow: 'rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 2px 2px -1px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px, rgba(42, 51, 70, 0.03) 0px 10px 10px -5px, rgba(42, 51, 70, 0.03) 0px 24px 24px -8px'
            }
          }}
          onClick={()=>dispatch(changeAppbarColor(color))}
          >
            
          </Box>

    )
  }

  const ColorButton = ({color}) =>{
    return(
          <Box component="div" sx={{
            width: "30px",
            height: "30px",
            backgroundColor: `${color}`,
            borderRadius: "50%",
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 8px',
            cursor: 'pointer',
            '&:hover':{
              boxShadow: 'rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 2px 2px -1px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px, rgba(42, 51, 70, 0.03) 0px 10px 10px -5px, rgba(42, 51, 70, 0.03) 0px 24px 24px -8px'
            }
          }}
          onClick={()=>dispatch(changeColorMode(color))}
          >
            
          </Box>

    )
  }

  const FooterColorButton = ({color}) =>{
    return(
          <Box component="div" sx={{
            width: "30px",
            height: "30px",
            backgroundColor: `${color}`,
            borderRadius: "50%",
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 8px',
            cursor: 'pointer',
            '&:hover':{
              boxShadow: 'rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 2px 2px -1px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px, rgba(42, 51, 70, 0.03) 0px 10px 10px -5px, rgba(42, 51, 70, 0.03) 0px 24px 24px -8px'
            }
          }}
          onClick={()=>dispatch(changeFooterColor(color))}
          >
            
          </Box>

    )
  }
  

  const drawer = (
    <Box component="div" sx={{

      height: '100%',
      width: `${drawerWidth}px`,
      right: 0,
      top: 0,
      backgroundColor: 'settingcolor.main',
      color: 'settingcolor.text',
      position: 'fixed',
      zIndex: 10002,
      boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
      transition: 'width 12s ease-in-out',
      overflowY: 'scroll'
    }}>
    
    <Grid container sx={{height: '40px'}}>

        <Grid item xs>
          <Typography sx={{p: 1, fontSize: '18px', fontWeight: 900}}>
            Settings
          </Typography>
        </Grid>

        <Grid item xs sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}>
          <IconButton aria-label="setting"
            sx={{
              fontSize: '22px',
            }}
            onClick={closeThemeSetting}
          >
            <CloseIcon fontSize="inherit" sx={{color: "settingcolor.text"}} />

          </IconButton>
      </Grid>

    </Grid>

    <Divider />

    <Box component="fieldset" sx={{
      borderRadius: '10px',
      m: 2,
      borderColor: "#F8F8F8",
    }}>
      <legend><Typography sx={{fontSize: '14px', backgroundColor: "#000", color: "#FFF", padding: "4px", borderRadius: "10px"}}>Header</Typography></legend>
      
      <Grid container spacing={1} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        {appbarColors.map((color, index)=>(
          <Grid item key={index}>
            <AppbarColorButton color={color} />
          </Grid>

          ))
        }
      </Grid>

    </Box>


    <Box component="fieldset" sx={{
      borderRadius: '10px',
      m: 2,
      borderColor: "#F8F8F8",
    }}>
      <legend><Typography sx={{fontSize: '14px', backgroundColor: "#000", color: "#FFF", padding: "4px", borderRadius: "10px"}}>Footer</Typography></legend>
      
      <Grid container spacing={1} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        {footerColors.map((color, index)=>(
          <Grid item key={index}>
            <FooterColorButton color={color} />
          </Grid>

          ))
        }
      </Grid>

    </Box>


    <Box component="fieldset" sx={{
      borderRadius: '10px',
      m: 2,
      borderColor: "#F8F8F8",
    }}>
      <legend><Typography sx={{fontSize: '14px', backgroundColor: "#000", color: "#FFF", padding: "4px", borderRadius: "10px"}}>Themes</Typography></legend>
      
      <Grid container spacing={1} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        {themeColors.map((color, index)=>(
          <Grid item key={index}>
            <ColorButton color={color} />
          </Grid>

          ))
        }
      </Grid>

    </Box>

    


    <Box component="fieldset" sx={{
      borderRadius: '10px',
      m: 2,
      borderColor: "#F8F8F8",
    }}>
      <legend><Typography sx={{fontSize: '14px', backgroundColor: "#000", 
                               color: "#FFF", 
                               padding: "4px", 
                               borderRadius: "10px"}}>Text Size</Typography></legend>
      
      <Grid container>

        <Grid item xs={9} sx={{display:'flex', alignItems: 'center', justifyContent: 'left'}}>
          <Typography sx={{fontSize: '16px', fontWeight: 600}}>Increase Font</Typography>
        </Grid>
        <Grid item xs={3}>
          <IconButton aria-label="increase" onClick={()=>dispatch(incrementFontSize())} 
          sx={{	
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
            backgroundColor: '#FFFFFF',
            '&:hover':{
              backgroundColor: '#FFFFFF'
          }}}>
            <KeyboardDoubleArrowUpIcon />
          </IconButton>
        </Grid>
      
      </Grid>


      <Grid container sx={{mt: 1}}>

        <Grid item xs={9} sx={{display:'flex', alignItems: 'center', justifyContent: 'left'}}>
          <Typography sx={{fontSize: '16px', fontWeight: 600}}>Decrease Font</Typography>
        </Grid>
        <Grid item xs={3}>
          <IconButton aria-label="decrease" onClick={()=>dispatch(decrementFontSize())}
                      sx={{	
                        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                        backgroundColor: '#FFFFFF',
                        '&:hover':{
                          backgroundColor: '#FFFFFF'
                      }}}>
            <KeyboardDoubleArrowDownIcon />
          </IconButton>
        </Grid>
      
      </Grid>

      <Grid container sx={{mt: 1}} >

        <Grid item xs={9} sx={{display:'flex', alignItems: 'center', justifyContent: 'left'}}>
          <Typography sx={{fontSize: '16px', fontWeight: 600}}>Reset Font</Typography>
        </Grid>
        <Grid item xs={3}>
          <IconButton aria-label="reset" onClick={()=>dispatch(resetFontSize())}
                      sx={{	
                        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                        backgroundColor: '#FFFFFF',
                        '&:hover':{
                          backgroundColor: '#FFFFFF'
                      }}}>
            <FormatSizeIcon />
          </IconButton>
        </Grid>
      
      </Grid>

    </Box>


    <Box component="fieldset" sx={{
      borderRadius: '10px',
      m: 2,
      borderColor: "#F8F8F8",
    }}>
      <legend><Typography sx={{fontSize: '14px', backgroundColor: "#000", color: "#FFF", padding: "4px", borderRadius: "10px"}}>Dark Mode</Typography></legend>
      
      <Grid container>
        <Grid item xs={8} sx={{display:'flex', alignItems: 'center', justifyContent: 'left'}}>
            <Typography sx={{fontSize: '16px', fontWeight: 600}}>Dark Mode</Typography>
        </Grid>

          <Grid item xs={4}>
            <FormGroup>
              <FormControlLabel control={<Switch checked={isDarkMode} onClick={()=>dispatch(changeMode())} name="darkmode" />} />
            </FormGroup>
          </Grid>
        </Grid>

    </Box>


    
    </Box>
  )

return (    

  <>

  <Box component="div">

    <IconButton aria-label="setting"
      sx={{
        bottom: 30,
        left: 20,
        position: 'fixed',
        color: 'primary.main',
        fontSize: '32px',
        backgroundColor: '#FFFFFF',
        zIndex: (theme) => theme.zIndex.drawer - 2,
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        '&:hover':{
          backgroundColor: '#FFFFFF'
        }
      }}
      onClick={handleThemeSetting}
    >
      <SettingsIcon sx={{
          '&:hover':{
            animation: "spin 1.9s linear infinite",
            "@keyframes spin": {
              "0%": {
                transform: "rotate(360deg)",
              },
              "100%": {
                transform: "rotate(0deg)",
              },
            },
          }}}
        fontSize="inherit" />
    </IconButton>
  </Box>

  {themeSetting && (<Fade in={themeSetting}>
    {drawer}
  </Fade>
    )}

  </>
  );
}

export default Accessibility;
