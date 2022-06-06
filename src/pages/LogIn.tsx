import { memo, ReactElement } from 'react';
import LoginForm from '../components/forms/LoginForm';
import PageContainer from '../components/PageContainer';
import Logo from '../components/Logo';

const LogIn = memo((): ReactElement => {
  return (
    <PageContainer id='loginPage'>
      <>
        <Logo size={4} />
        <LoginForm />
      </>
    </PageContainer>
  )
})

export default LogIn;