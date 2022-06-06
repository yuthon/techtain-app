import { Link } from "react-router-dom";
import LoginErrorMessage from '../LoginErrrorMessage';
import EmailInput from '../inputs/EmailInput';
import PasswordInput from '../inputs/PasswordInput';
import LoginButton from '../buttons/LoginButton';
import { useSelector } from "../../redux/store/store";

const LoginForm = () => {

  const isError = useSelector((state) => state.error.isError);

  return (
    <div className="form mt-5" id="login-form">
      <EmailInput />
      <PasswordInput />
      <div className="d-flex flex-wrap justify-content-between" id="signupOrLogin">
        <LoginButton />
        <p className="my-auto">または</p>
        <Link className="text-reset" to="/signup">
          <p id="link-login">登録</p>
        </Link>
      </div>
      {isError ? <LoginErrorMessage /> : null}
    </div>
  )
}

export default LoginForm;