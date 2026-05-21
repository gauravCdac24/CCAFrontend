import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: [],
	defaultId: 'default',
	opened: true
};

const menuSlice = createSlice({
    name: 'appMenu',
    initialState,
    reducers: {
        menuOpen: (state, action) => {
            state.isOpen = [action.id];
        },
		setMenu: (state, action) => {
			state.opened = action.opened;
		}
    },
});

export const { menuOpen, setMenu } = menuSlice.actions;
export default menuSlice.reducer;
