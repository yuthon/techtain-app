import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface passwordConfirmInputState { input: string, isValid: boolean }

const initialState: passwordConfirmInputState = { input: '', isValid: true };

export const passwordConfirmInputSlice = createSlice({
  name: 'passwordConfirmInput',
  initialState,
  reducers: {
    setPasswordConfirmInput: (state: passwordConfirmInputState, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setIsPasswordConfirmInputValid: (state: passwordConfirmInputState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    }
  }
});

export const { setPasswordConfirmInput, setIsPasswordConfirmInputValid } = passwordConfirmInputSlice.actions;

export default passwordConfirmInputSlice.reducer;