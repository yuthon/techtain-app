import { useRef } from 'react';
import { useSelector } from '../../redux/store/store';
import { setUserNameInput } from '../../redux/slice/userNameInputSlice';
import { useDispatch } from 'react-redux';
import InputFeedback from './InputFeedback';
import { useInputValidation } from '../../hooks/useInputCheck';

const UserNameInput = () => {
  const userNameRef = useRef<HTMLInputElement>(null!);
  const isValid = useSelector((state) => state.userNameInput.isValid);
  const needValidation = useSelector((state) => state.formValidation.needValidation);
  const dispatch = useDispatch();
  const validation = useInputValidation();

  return (
    <div className="mb-3">
      <input
        className={needValidation && !isValid ? 'form-control is-invalid' : 'form-control'}
        ref={userNameRef}
        onChange={() => { dispatch(setUserNameInput(userNameRef.current.value)) }}
        onBlur={() => { validation.checkUserName() }}
        placeholder="ユーザー名"
      />
      {needValidation && !isValid ? <InputFeedback text='ユーザー名を入力してください' /> : null}
    </div>
  )
}

export default UserNameInput;