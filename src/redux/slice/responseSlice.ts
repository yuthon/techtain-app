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

interface responseState { response: responseType | null, resStatus: number | null }

const initialState: responseState = { response: null, resStatus: null };

export const responseSlice = createSlice({
  name: 'response',
  initialState,
  reducers: {
    setResponse: (state: responseState, action: PayloadAction<responseType | null>) => {
      state.response = action.payload;
    },
    setResStatus: (state: responseState, action: PayloadAction<number | null>) => {
      state.resStatus = action.payload;
    }
  }
});

export const { setResponse, setResStatus } = responseSlice.actions;

export default responseSlice.reducer;