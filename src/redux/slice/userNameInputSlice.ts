import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userNameInputState { input: string, isValid: boolean }

const initialState: userNameInputState = { input: '', isValid: false };

export const userNameInputSlice = createSlice({
  name: 'userNameInput',
  initialState,
  reducers: {
    setUserNameInput: (state: userNameInputState, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setIsUserNameInputValid: (state: userNameInputState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    }
  }
});

export const { setUserNameInput, setIsUserNameInputValid } = userNameInputSlice.actions;

export default userNameInputSlice.reducer;