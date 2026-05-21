import { createSlice } from "@reduxjs/toolkit";
import { loadApplicationDetails, saveApplicationDetails} from './Util/applicationUtil';

// Load initial state from local storage

const persistedState = loadApplicationDetails();

const initialState = persistedState || {
    applicationType: '',
};


const applicationSlice = createSlice({
    name: 'licenseApplicatiion',
    initialState: initialState,
    reducers: {
        setApplicationDetails: (state, action) => {
            state.applicationType = action.payload.applicationType;
    
            //save
            saveApplicationDetails(state);
        },

        clearApplicationDetails: (state) => {
            state.applicationType = '';

            // Clear the state from local storage
            saveApplicationDetails(state);
        }
    }
});

export const { setApplicationDetails, clearApplicationDetails } = applicationSlice.actions;
export default applicationSlice.reducer;
