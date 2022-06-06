import { ReactElement } from 'react';
import { useUserAPI } from '../../hooks/useUserAPI';

const LoginButton = (): ReactElement => {

  const api = useUserAPI();

  return (
    <button
      className="btn btn-primary"
      id="btn-register"
      onClick={() => { api.login() }}
    >
      ログイン
    </button>
  )
}

export default LoginButton;