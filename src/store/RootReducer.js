import { combineReducers } from "redux";

import fontSizeSlice from './FontSize/Reducer';
import colorModeSlice from './ColorMode/Reducer';
import footerSizeSlice from './FooterSize/Reducer';
import authSlice from './Auth/Reducer';
import menuSlice from './Menu/Reducer';
import titleHeightSlice from './TitleHeight/Reducer'
import applicationSlice from './LicenseApplication/Reducer'
import nonceSlice from './Nonce/Reducer'

const rootReducer = combineReducers({
    fontSize: fontSizeSlice,
    colorMode: colorModeSlice,
    footerSize: footerSizeSlice,
    jwtAuthentication: authSlice,
    appMenu: menuSlice,
    titleHeight: titleHeightSlice,
    licenseApplication: applicationSlice,
    customNonce: nonceSlice
});

export default rootReducer;

