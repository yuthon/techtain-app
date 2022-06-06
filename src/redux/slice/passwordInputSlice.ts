import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface passwordInputState { input: string, isValid: boolean }

const initialState: passwordInputState = { input: '', isValid: true };

export const passwordInputSlice = createSlice({
  name: 'passwordInput',
  initialState,
  reducers: {
    setPasswordInput: (state: passwordInputState, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setIsPasswordInputValid: (state: passwordInputState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    }
  }
});

export const { setPasswordInput, setIsPasswordInputValid } = passwordInputSlice.actions;

export default passwordInputSlice.reducer;