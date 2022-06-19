import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authorizeState { isAuthorized: boolean, token: string | null }

const initialState: authorizeState = { isAuthorized: false, token: null };

export const authorizeSlice = createSlice({
  name: 'authorize',
  initialState,
  reducers: {
    setIsAuthorized: (state: authorizeState, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setToken: (state: authorizeState, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    }
  }
});

export const { setIsAuthorized, setToken } = authorizeSlice.actions;

export default authorizeSlice.reducer;