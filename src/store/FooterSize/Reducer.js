import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    fheight: 0,
};

const footerSizeSlice = createSlice({
    name: 'footerSize',
    initialState,
    reducers: {
        setFooterHeight: (state, action) => {
            state.fheight = action.payload;
        },
    },
});

export const { setFooterHeight } = footerSizeSlice.actions;
export default footerSizeSlice.reducer;
