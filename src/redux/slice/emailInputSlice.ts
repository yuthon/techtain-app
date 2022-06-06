import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface emailInputState { input: string, isValid: boolean }

const initialState: emailInputState = { input: '', isValid: false };

export const emailInputSlice = createSlice({
  name: 'emailInput',
  initialState,
  reducers: {
    setEmailInput: (state: emailInputState, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setIsEmailInputValid: (state: emailInputState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    }
  }
});

export const { setEmailInput, setIsEmailInputValid } = emailInputSlice.actions;

export default emailInputSlice.reducer;