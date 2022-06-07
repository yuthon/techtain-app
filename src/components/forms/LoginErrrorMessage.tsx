import { ReactElement } from 'react';
import FormErrorMessage from './FormErrorMessage';
import { loginError } from '../../utils/ErrorMessages';
import { useSelector } from '../../redux/store/store';

const LoginErrorMessage = (): ReactElement | null => {
  const resStatus = useSelector((state) => state.response.resStatus)

  if (resStatus === null) {
    return null
  }
  else if (resStatus === 200) {
    return null
  }
  else if (resStatus === 400) {
    return <FormErrorMessage text={loginError.code400} />
  }
  else if (resStatus === 401) {
    return <FormErrorMessage text={loginError.code401} />
  }
  else if (resStatus === 403) {
    return <FormErrorMessage text={loginError.code401} />
  }
  else if (resStatus === 500) {
    return <FormErrorMessage text={loginError.code500} />
  }
  else {
    return <FormErrorMessage text={loginError.otherError} />
  }
}

export default LoginErrorMessage;