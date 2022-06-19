import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface urlInputState { input: string, isValid: boolean }

const initialState: urlInputState = { input: '', isValid: false };

export const urlInputSlice = createSlice({
  name: 'urlInput',
  initialState,
  reducers: {
    setUrlInput: (state: urlInputState, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setIsUrlInputValid: (state: urlInputState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    }
  }
});

export const { setUrlInput, setIsUrlInputValid } = urlInputSlice.actions;

export default urlInputSlice.reducer;