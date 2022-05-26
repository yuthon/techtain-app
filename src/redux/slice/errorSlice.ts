import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface isErrorState { isError: boolean }

const initialState: isErrorState = { isError: false };

export const errorSlice = createSlice({
  name: 'isError',
  initialState,
  reducers: {
    setIsError: (state: isErrorState, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    }
  }
});

export const { setIsError } = errorSlice.actions;

export default errorSlice.reducer;