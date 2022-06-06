import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface formValidationState { needValidation: boolean }

const initialState: formValidationState = { needValidation: false };

export const formValidationSlice = createSlice({
  name: 'formvalidation',
  initialState,
  reducers: {
    setNeedValidation: (state: formValidationState, action: PayloadAction<boolean>) => {
      state.needValidation = action.payload;
    }
  }
});

export const { setNeedValidation } = formValidationSlice.actions;

export default formValidationSlice.reducer;