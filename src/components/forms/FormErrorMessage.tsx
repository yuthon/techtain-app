import { FC, ReactElement } from 'react';

interface FormErrorMessageProps {
  text: string
}

const FormErrorMessage: FC<FormErrorMessageProps> = ({ text }): ReactElement => {
  return (
    <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">
      {text}
    </div>
  )
}

export default FormErrorMessage;