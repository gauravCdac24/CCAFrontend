import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Typography from './typography';
import Palette from './palette';
import componentsOverride from './overrides';

import { useSelector } from "react-redux";
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import CryptoJS from 'crypto-js';

import { setNonce } from '../store/Nonce/Reducer';
import { useDispatch } from 'react-redux';

const MyTheme = ({ children }) => {

  const colorMode = useSelector((state) => state.colorMode.themeColorMode);
  const footerColor = useSelector((state) => state.colorMode.footerColor);
  const isDarkMode = useSelector((state) => state.colorMode.isDarkMode);
  const sidebarColor = useSelector((state) => state.colorMode.sidebarColor);
  const appbarColor = useSelector((state) => state.colorMode.appbarColor);
  const increment = useSelector((state)=>state.fontSize.incdec);
  
  const themeTypography = Typography(`'Public Sans', sans-serif`, increment);
  const themePalette = Palette(colorMode,footerColor,isDarkMode, sidebarColor, appbarColor);

  const dispatch = useDispatch();

  const themeOptions = useMemo(() => ({
    direction: 'ltr',
    mixins: {
      toolbar: {
        minHeight: 60,
        paddingTop: 8,
        paddingBottom: 8
      }
    },
    palette: themePalette.palette,
    typography: themeTypography,
  }), [colorMode,footerColor,isDarkMode, increment, sidebarColor, appbarColor]);

  

  const theme = useMemo(() => {
    return createTheme(themeOptions);
  }, [themeOptions, colorMode,footerColor,isDarkMode, sidebarColor, appbarColor]);


  theme.components = componentsOverride(theme);



  const nonceWordArray = CryptoJS.lib.WordArray.random(16);
  const nonce = 'jhfskljadslksjpsplkladsjlslsjl' //nonceWordArray.toString(CryptoJS.enc.Base64);

  // Create Emotion cache with nonce
  const emotionCache = createCache({
    key: 'mui',
    nonce: nonce,
    prepend: true,
  });

  const csp = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}';
  style-src 'self' 'nonce-${nonce}';
  img-src 'self' data:;
  font-src 'self' data:;
  connect-src 'self' http://localhost:7778;
  `;


  dispatch(setNonce(nonce));

  return (
    <StyledEngineProvider injectFirst>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
      </CacheProvider>
    </StyledEngineProvider>
  );
};

MyTheme.propTypes = {
  children: PropTypes.node
};

export default MyTheme;
