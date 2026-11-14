
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    updateDrawerOpen: false,
    updateObject: null,
};

const appSlice = createSlice({
    name: "app",

    initialState,

    reducers: {
        setUpdateDrawerOpen: (state) => {
            state.updateDrawerOpen = !state.updateDrawerOpen;
        },

        setUpdateObject: (state, action) => {
            state.updateObject = action.payload;
        },
    },
});

export const {
    setUpdateDrawerOpen,
    setUpdateObject,
} = appSlice.actions;

export default appSlice.reducer;
