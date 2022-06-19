import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface titleInputState { input: string, isValid: boolean }

const initialState: titleInputState = { input: '', isValid: false };

export const titleInputSlice = createSlice({
  name: 'titleInput',
  initialState,
  reducers: {
    setTitleInput: (state: titleInputState, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setIsTitleInputValid: (state: titleInputState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    }
  }
});

export const { setTitleInput, setIsTitleInputValid } = titleInputSlice.actions;

export default titleInputSlice.reducer;