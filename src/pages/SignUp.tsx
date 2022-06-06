import { memo, ReactElement } from 'react';
import SignUpForm from '../components/forms/SignUpForm';
import PageContainer from '../components/PageContainer';
import Logo from '../components/Logo';


const SignUp = memo((): ReactElement => {
  return (
    <PageContainer id='signupPage'>
      <div className="row">
        <div className="col-md-6" id="welcomeMessage">
          <div className="d-flex flex-wrap">
            <Logo size={2.6} />
            <h1 className="text-start text-white ms-2">へようこそ！</h1>
          </div>
          <h2 className="text-start text-white mt-5">会員登録してレビューにアクセスしてみましょう！</h2>
        </div>
        <SignUpForm />
      </div>
    </PageContainer>
  )
})

export default SignUp;