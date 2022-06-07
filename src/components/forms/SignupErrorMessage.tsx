import { ReactElement } from 'react';
import FormErrorMessage from './FormErrorMessage';
import { signupError } from '../../utils/ErrorMessages';
import { useSelector } from '../../redux/store/store';

const SignupErrorMessage = (): ReactElement | null => {
  const resStatus = useSelector((state) => state.response.resStatus)

  if (resStatus === null) {
    return null
  }
  else if (resStatus === 200) {
    return null
  }
  else if (resStatus === 400) {
    return <FormErrorMessage text={signupError.code400} />
  }
  else if (resStatus === 401) {
    return <FormErrorMessage text={signupError.code401} />
  }
  else if (resStatus === 403) {
    return <FormErrorMessage text={signupError.code401} />
  }
  else if (resStatus === 500) {
    return <FormErrorMessage text={signupError.code500} />
  }
  else {
    return <FormErrorMessage text={signupError.otherError} />
  }
}

export default SignupErrorMessage;