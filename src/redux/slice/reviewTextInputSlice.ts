import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface reviewTextInputState { input: string, isValid: boolean }

const initialState: reviewTextInputState = { input: '', isValid: false };

export const reviewTextInputSlice = createSlice({
  name: 'reviewTextInput',
  initialState,
  reducers: {
    setReviewTextInput: (state: reviewTextInputState, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setIsReviewTextInputValid: (state: reviewTextInputState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    }
  }
});

export const { setReviewTextInput, setIsReviewTextInputValid } = reviewTextInputSlice.actions;

export default reviewTextInputSlice.reducer;