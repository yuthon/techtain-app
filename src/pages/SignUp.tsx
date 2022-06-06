import { memo, ReactElement } from 'react';
import bookLogo from '../assets/bookLogo.svg';
import SignUpForm from '../components/forms/SignUpForm';
import PageContainer from '../components/PageContainer';


const SignUp = memo((): ReactElement => {
  return (
    <PageContainer id='signupPage'>
      <div className="row">
        <div className="col-md-6" id="welcomeMessage">
          <div className="d-flex flex-wrap">
            <div className="d-flex flex-nowrap">
              <img src={bookLogo} className="signupPage-logo" alt="logo" />
              <h1 className="text-start text-white">Book Review</h1>
            </div>
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