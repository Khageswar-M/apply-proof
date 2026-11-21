
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";

export const restoreSession = createAsyncThunk(
    "app/restoreSession",
    async (_, { rejectWithValue }) => {
        const user = {
            userId: localStorage.getItem("userId"),
            email: localStorage.getItem("email"),
        };

        if (!user.userId || !user.email) {
            return rejectWithValue("No saved user profile");
        }

        const result = await authService.refresh();

        if (!result.success) {
            return rejectWithValue(result.message);
        }

        return user;
    }
);

const initialState = {
    updateDrawerOpen: false,
    updateObject: null,
    authStatus: "checking",
    currentUser: null,
    appliedApplications: []
};

const appSlice = createSlice({
    name: "app",

    initialState,

    reducers: {
        setUpdateDrawerOpen: (state, action) => {
            state.updateDrawerOpen =
                typeof action.payload === "boolean"
                    ? action.payload
                    : !state.updateDrawerOpen;
        },

        setUpdateObject: (state, action) => {
            state.updateObject = action.payload;
        },

        loginSucceeded: (state, action) => {
            state.authStatus = "authenticated";
            state.currentUser = action.payload;
        },

        logoutSucceeded: (state) => {
            state.authStatus = "unauthenticated";
            state.currentUser = null;
            state.updateDrawerOpen = false;
            state.updateObject = null;
            state.appliedApplications = [];
        },

        setAppliedApplications: (state, action) => {
            state.appliedApplications = Array.isArray(action.payload)
                ? action.payload
                : [];
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(restoreSession.pending, (state) => {
                state.authStatus = "checking";
            })
            .addCase(restoreSession.fulfilled, (state, action) => {
                if (state.authStatus === "checking") {
                    state.authStatus = "authenticated";
                    state.currentUser = action.payload;
                }
            })
            .addCase(restoreSession.rejected, (state) => {
                if (state.authStatus === "checking") {
                    state.authStatus = "unauthenticated";
                    state.currentUser = null;
                }
            });
    },
});

export const {
    setUpdateDrawerOpen,
    setUpdateObject,
    loginSucceeded,
    logoutSucceeded,
    setAppliedApplications,
} = appSlice.actions;

export default appSlice.reducer;
