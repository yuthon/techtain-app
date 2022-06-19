import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState { name: string | null }

const initialState: userState = { name: null };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state: userState, action: PayloadAction<string | null>) => {
      state.name = action.payload;
    }
  }
});

export const { setUserName } = userSlice.actions;

export default userSlice.reducer;