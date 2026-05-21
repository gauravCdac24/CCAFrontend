import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theight: 0,
};

const titleHeightSlice = createSlice({
    name: 'titleHeight',
    initialState,
    reducers: {
        setTitleHeight: (state, action) => {
            state.theight = action.payload;
        },
    },
});

export const { setTitleHeight } = titleHeightSlice.actions;
export default titleHeightSlice.reducer;
