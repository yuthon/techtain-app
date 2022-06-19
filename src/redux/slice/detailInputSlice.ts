import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface detailInputState { input: string, isValid: boolean }

const initialState: detailInputState = { input: '', isValid: false };

export const detailInputSlice = createSlice({
  name: 'detailInput',
  initialState,
  reducers: {
    setDetailInput: (state: detailInputState, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setIsDetailInputValid: (state: detailInputState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    }
  }
});

export const { setDetailInput, setIsDetailInputValid } = detailInputSlice.actions;

export default detailInputSlice.reducer;