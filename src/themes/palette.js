/**
 * Color intention used in theme
 * @param {JsonObject} palette, theme customization object
 */

import tinycolor from "tinycolor2";


//Basic Color Combination
const primaryColorDark =  "#212631";
const lightenRate = 20;
const darkenRate = 10;

//Dark Mode Color
const darkModeColor = "#191d30";


const getLightestColor = (color, lightenrate) => {
        let lightColor = tinycolor(color);

        while (lightColor.getBrightness() < lightenrate) {
            lightColor = lightColor.lighten(1);
        }

        return lightColor.toHexString();
    }


    

const Palette = (colorMode, footerColor, isDarkMode, sidebarColor, appbarColor) => ({

        

                palette: {
                        
                        
                        primary:{
                                main: isDarkMode? tinycolor(darkModeColor).lighten(30).toHexString(): colorMode,
                                text: isDarkMode? "#FFFFFF" : tinycolor(colorMode).isLight()? "#000000" : "#FFFFFF",
                                tabletext:  tinycolor(colorMode).darken(30).toHexString(),
                                light: isDarkMode? tinycolor(darkModeColor).lighten(50).toHexString(): tinycolor(colorMode).lighten(50).toHexString(),

                        },
                        gcolor:{
                                main: colorMode,
                                light: tinycolor(colorMode).lighten(20).toHexString()
                        },
                        
                        tablecolor:{
                                main: isDarkMode? tinycolor(darkModeColor).lighten(10).toHexString():  getLightestColor(colorMode, 170),
                                body: isDarkMode? tinycolor(darkModeColor).lighten(4).toHexString():  getLightestColor(colorMode, 253),
                                text: isDarkMode? "#FFFFFF": tinycolor( getLightestColor(colorMode, 170)).isLight()? "#000000" : "#FFFFFF",
                                toolbar: isDarkMode? "#FFFFFF": getLightestColor(colorMode, 170),
                                toolbarsearch: isDarkMode? "#FFFFFF": "#000000"
                        },

                       
                        bodycolor:{
                                main: isDarkMode ? darkModeColor : getLightestColor(colorMode, 253), 
                                text: isDarkMode? "#FFFFFF" : "#000000",
                                
                        },
                        
                        heading:{
                                main: isDarkMode ? tinycolor(darkModeColor).lighten(lightenRate).toHexString() : tinycolor(colorMode).lighten(lightenRate).toHexString(),
                                text: "#000000"
                        },
                        
                        footer:{
                                main: isDarkMode ? tinycolor(darkModeColor).lighten(4).toHexString() : footerColor,
                                text: isDarkMode? "#FFFFFF" : tinycolor(footerColor).isLight()? "#000000" : "#FFFFFF"
                        },
                        
                        sidebar:{
                                main: isDarkMode ? tinycolor(darkModeColor).lighten(4).toHexString() : sidebarColor,
                                text: isDarkMode? "#FFFFFF": tinycolor(sidebarColor).isLight()? "#000000" : "#FFFFFF"
                        },

                        
                        formcolor:{
                                main: isDarkMode ? tinycolor(darkModeColor).lighten(4).toHexString() : "#FFFFFF",
                                textfield: isDarkMode ? tinycolor(darkModeColor).lighten(10).toHexString() : "#FFFFFF",
                                text: isDarkMode ? "#FFFFFF" : "#000000"
                        },

                        dividercolor:{
                                main: isDarkMode ? tinycolor(darkModeColor).lighten(20).toHexString() : "#f9f9f9",
                        },
                        
                        appbar:{
                                main: isDarkMode ? tinycolor(darkModeColor).lighten(4).toHexString() : appbarColor,
                                text: isDarkMode? "#FFFFFF": tinycolor(appbarColor).isLight()? "#000000" : "#FFFFFF"
                        },
                        //tracker color
                        tracker:{
                                main: isDarkMode ? getLightestColor(darkModeColor, 60) : getLightestColor(appbarColor, 250),
                                text: isDarkMode? "#FFFFFF" : "#000000",
                                link: isDarkMode? "#c0c0c0" : colorMode
                        },
                        //hover color
                        hovercolor:{
                                main: isDarkMode ? "#dfdfdf" : tinycolor(colorMode).lighten(lightenRate).toHexString(),
                        },

                        settingcolor:{
                                main: isDarkMode ? tinycolor(darkModeColor).lighten(1).toHexString() : "#FFFFFF",
                                text: isDarkMode ? "#FFFFFF": "#000000" 
                        },

                        success:{

                                main: "#4BB543",
                                dark: tinycolor("#4BB543").darken(darkenRate).toHexString(),
                                light: tinycolor("#4BB543").lighten(lightenRate).toHexString(),
                                text: "#FFFFFF"

                        },
                        error:{

                                main: "#FF0033",
                                dark: tinycolor("#FF0033").darken(darkenRate).toHexString(),
                                light: tinycolor("#FF0033").lighten(lightenRate).toHexString(),
                                text: "#FFFFFF"

                        },
                        warning:{

                                main:  "#f0ad4e",
                                dark:  tinycolor("#f0ad4e").darken(darkenRate).toHexString(),
                                light: tinycolor("#f0ad4e").lighten(lightenRate).toHexString(),
                                text: "#FFFFFF"

                        },
                        info:{

                                main: "#5bc0de",
                                dark: tinycolor("#5bc0de").darken(darkenRate).toHexString(),
                                light: tinycolor("#5bc0de").lighten(lightenRate).toHexString(),
                                text: "#FFFFFF"

                        },
                        reset:{
                                main: isDarkMode? tinycolor(primaryColorDark).lighten(10).toHexString() : primaryColorDark,
                                dark: primaryColorDark,
                                text: "#FFFFFF"
                        },
                        infobox: {
                                color1: isDarkMode ? getLightestColor(darkModeColor, 60) : '#90EE90',
                                color2: isDarkMode ? getLightestColor(darkModeColor, 60) : '#FFD580',
                                color3: isDarkMode ? getLightestColor(darkModeColor, 60) : '#F0E0F0',
                                color4: isDarkMode ? getLightestColor(darkModeColor, 60) : '#F0F8FF',
                                color5: isDarkMode ? getLightestColor(darkModeColor, 60) : '#90EE90',
                                color6: isDarkMode ? getLightestColor(darkModeColor, 60) : '#FFD580',
                                color7: isDarkMode ? getLightestColor(darkModeColor, 60) : '#FFA500',

                                text: isDarkMode? "#FFFFFF" : "#000000",
                        },
                        modalbody:{
                                main: isDarkMode? tinycolor(darkModeColor).lighten(35).toHexString(): "#FFFFFF",
                                text: isDarkMode? "#FFFFFF" : "#000000",
                                
                        },
                        textcolor:{
                                text: isDarkMode? "#FFFFFF" : "#000000",
                                active: isDarkMode? tinycolor(darkModeColor).lighten(40).toHexString() : "",
                                disabled: isDarkMode? tinycolor(darkModeColor).lighten(20).toHexString() : "",
                        },
                        checkboxbg:{
                                main: isDarkMode?  tinycolor(darkModeColor).lighten(10).toHexString() : "#F8F8F8",
                        }
                        
    
                }

    });


export default Palette;
