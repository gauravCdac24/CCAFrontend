import {createSlice} from '@reduxjs/toolkit'

const currentFontSize = localStorage.getItem("ccaFontSize");

const initialState = {
    incdec: currentFontSize?parseInt(currentFontSize):0,
}

const fontSizeSlice = createSlice({
    name: 'fontSize',
    initialState,
    reducers:{
        incrementFontSize: (state) =>{
            state.incdec = Math.min(state.incdec + 1, 6);
            localStorage.setItem("ccaFontSize", Math.min(state.incdec + 1, 6));
        },
        decrementFontSize: (state) =>{
            state.incdec = Math.max(state.incdec - 1, -6);
            localStorage.setItem("ccaFontSize", Math.max(state.incdec - 1, -6));
        },
        resetFontSize: (state) =>{
            state.incdec = 0;
            localStorage.setItem("ccaFontSize", 0);
        }

    }
})

export const {incrementFontSize, decrementFontSize, resetFontSize} = fontSizeSlice.actions;
export default fontSizeSlice.reducer;