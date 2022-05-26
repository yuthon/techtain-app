import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface responseType {
  token?: string;
  name?: string;
  id?: string;
  title?: string;
  url?: string;
  detail?: string;
  review?: string;
  reviewer?: string;
  isMine?: boolean;
  Error?: string;
}

interface responseState { response: responseType | null }

const initialState: responseState = { response: null };

export const responseSlice = createSlice({
  name: 'response',
  initialState,
  reducers: {
    setResponse: (state: responseState, action: PayloadAction<responseType | null>) => {
      state.response = action.payload;
    }
  }
});

export const { setResponse } = responseSlice.actions;

export default responseSlice.reducer;