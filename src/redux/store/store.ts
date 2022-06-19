import { configureStore } from "@reduxjs/toolkit";
import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import authorizeReducer from '../slice/authorizeSlice';
import errorReducer from '../slice/errorSlice';
import responseReducer from '../slice/responseSlice';
import emailInputReducer from '../slice/emailInputSlice';
import passwordInputReducer from '../slice/passwordInputSlice';
import formValidationReducer from '../slice/formValidationSlice';
import userNameInputReducer from '../slice/userNameInputSlice';
import passwordConfirmInputReducer from "../slice/passwordConfirmInputSlice";
import titleInputReducer from '../slice/titleInputSlice';
import urlInputReducer from '../slice/urlInputSlice';
import detailInputReducer from '../slice/detailInputSlice';
import reviewTextInputReducer from '../slice/reviewTextInputSlice';
import userReducer from '../slice/userSlice';

export const store = configureStore({
  reducer: {
    authorize: authorizeReducer,
    error: errorReducer,
    response: responseReducer,
    emailInput: emailInputReducer,
    passwordInput: passwordInputReducer,
    formValidation: formValidationReducer,
    userNameInput: userNameInputReducer,
    passwordConfirmInput: passwordConfirmInputReducer,
    titleInput: titleInputReducer,
    detailInput: detailInputReducer,
    urlInput: urlInputReducer,
    reviewTextInput: reviewTextInputReducer,
    user: userReducer,
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// 型情報付きのuseSelectorを宣言
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;