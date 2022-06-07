import { memo, ReactElement } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from '../../redux/store/store';
import EmailInput from '../inputs/EmailInput';
import PasswordInput from '../inputs/PasswordInput';
import PasswordConfirmInput from '../inputs/PasswordConfirmInput';
import UserNameInput from '../inputs/UserNameInput';
import SignupButton from '../buttons/SignupButton';
import SignupErrorMessage from './SignupErrorMessage';

const SignUpForm = memo((): ReactElement => {

  const isError = useSelector((state) => state.error.isError);

  return (
    <div className="form col-md-6" id="signupForm">
      <UserNameInput />
      <EmailInput />
      <PasswordInput />
      <PasswordConfirmInput />
      <div className="d-flex flex-wrap justify-content-between" id="signupOrLogin">
        <SignupButton />
        <p className="my-auto">または</p>
        <Link className="text-reset" to="/login">
          <p id="link-login">ログイン</p>
        </Link>
      </div>
      {isError ? <SignupErrorMessage /> : null}
    </div>
  )
})

export default SignUpForm;