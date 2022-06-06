import { FC, ReactElement } from 'react';

interface InputFeedbackProps {
  text: string;
}

const InputFeedback: FC<InputFeedbackProps> = ({ text }): ReactElement => {
  return (
    <div className="invalid-feedback mb-0">
      {text}
    </div>
  )
}

export default InputFeedback;