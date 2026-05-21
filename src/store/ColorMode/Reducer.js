import {createSlice} from '@reduxjs/toolkit'

const storedColorMode = localStorage.getItem("ccaColorMode");
const initialColorMode = storedColorMode ? storedColorMode : "#27AE60";

const storedFooterColor = localStorage.getItem("ccaFooterColor");
const initialFooterColor = storedFooterColor ? storedFooterColor : "#373B45";

const storedDarkMode = localStorage.getItem("ccaDarkModeColor");
const initialDarkMode = storedDarkMode ? (storedDarkMode === 'true') : false;

const storedSidebarColor = localStorage.getItem("ccaSidebarColor");
const initialSidebarColor = storedSidebarColor ? storedSidebarColor : "#373B45";

const storedAppbarColor = localStorage.getItem("ccaAppbarColor");
const initialAppbarColor = storedAppbarColor ? storedAppbarColor : "#FFFFFF";

const colorModeSlice = createSlice({
    name: 'colorMode',
    initialState: {
        themeColorMode: initialColorMode,
        footerColor: initialFooterColor,
        isDarkMode: initialDarkMode,
        sidebarColor: initialSidebarColor,
        appbarColor: initialAppbarColor
    },
    reducers:{
        changeColorMode: (state, action) =>{
            const newColorMode = action.payload;
            localStorage.setItem("ccaColorMode", newColorMode);
            state.themeColorMode = newColorMode;
        },
        changeFooterColor: (state, action) =>{
            const newFooterColor = action.payload;
            localStorage.setItem("ccaFooterColor", newFooterColor);
            state.footerColor = newFooterColor;
        },
        changeMode: (state) =>{
            const newMode = !state.isDarkMode;
            localStorage.setItem("ccaDarkModeColor", newMode);
            state.isDarkMode = newMode;
        },
        changeSidebarColor: (state, action) =>{
            const newColorMode = action.payload;
            localStorage.setItem("ccaSidebarColor", newColorMode);
            state.sidebarColor = newColorMode;
        },
        changeAppbarColor: (state, action) =>{
            const newColorMode = action.payload;
            localStorage.setItem("ccaAppbarColor", newColorMode);
            state.appbarColor = newColorMode;
        },

    }
})

export const {changeColorMode, changeFooterColor, changeMode, changeSidebarColor, changeAppbarColor} = colorModeSlice.actions;
export default colorModeSlice.reducer;