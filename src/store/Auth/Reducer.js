import { createSlice } from "@reduxjs/toolkit";
import { loadAuthState, saveAuthState} from './Util/authUtil';

// Load initial state from local storage

const persistedState = loadAuthState();

const initialState = persistedState || {
    name: '',
    username: '',
    refreshToken: '',
    roles: [],
    jwt: '',
    currentRole: '',
    rolePath: '',
    homePath: '',
    roleName: ''
};


const authSlice = createSlice({
    name: 'jwtAuthentication',
    initialState: initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.name = action.payload.name;
            state.username = action.payload.username;
            state.refreshToken = action.payload.refreshToken;
            state.roles = action.payload.roles;
            state.jwt = action.payload.jwt;
            state.currentRole = action.payload.currentRole;
            state.rolePath = action.payload.rolePath;
            state.homePath = action.payload.homePath;
            state.roleName = action.payload.roleName;

            //save
            saveAuthState(state);
        },

        clearCredentials: (state) => {
            state.name = '';
            state.username = '';
            state.refreshToken = '';
            state.roles = [];
            state.jwt = '';
            state.currentRole = '';
            state.rolePath = '';
            state.homePath = '';
            state.roleName = '';

            // Clear the state from local storage
            saveAuthState(state);
        }
    }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
