import { configureStore } from "@reduxjs/toolkit";
import { useSelector as rawUseSelector, TypedUseSelectorHook } from 'react-redux';
import errorReducer from '../slice/errorSlice';
import responseReducer from '../slice/responseSlice';

export const store = configureStore({
  reducer: {
    error: errorReducer,
    response: responseReducer,
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// 型情報付きのuseSelectorを宣言
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;