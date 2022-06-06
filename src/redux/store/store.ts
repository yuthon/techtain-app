import { configureStore } from "@reduxjs/toolkit";
import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import authorizeReducer from '../slice/authorizeSlice';
import errorReducer from '../slice/errorSlice';
import responseReducer from '../slice/responseSlice';
import emailInputReducer from '../slice/emailInputSlice';
import passwordInputReducer from '../slice/passwordInputSlice';
import formValidationReducer from '../slice/formValidationSlice';

export const store = configureStore({
  reducer: {
    authorize: authorizeReducer,
    error: errorReducer,
    response: responseReducer,
    emailInput: emailInputReducer,
    passwordInput: passwordInputReducer,
    formValidation: formValidationReducer,
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// 型情報付きのuseSelectorを宣言
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;