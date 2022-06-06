import { memo, ReactElement } from 'react';
import bookLogo from '../assets/bookLogo.svg';
import LoginForm from '../components/forms/LoginForm';
import PageContainer from '../components/PageContainer';

const LogIn = memo((): ReactElement => {
  return (
    <PageContainer id='loginPage'>
      <>
        <div className="d-flex flex-nowrap justify-content-center mb-5">
          <img src={bookLogo} className="logo-loginPage my-auto" alt="logo" />
          <h1 className="text-white my-auto logoText-loginPage text-nowrap">Book Review</h1>
        </div>
        <LoginForm />
      </>
    </PageContainer>
  )
})

export default LogIn;