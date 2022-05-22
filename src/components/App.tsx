import { ReactElement } from 'react';
import '../stylesheets/App.css';
import AuthorizeProvider from './AuthorizeProvider';
import Main from './Main';

const App = (): ReactElement => {
  return (
    <div className="App">
      <AuthorizeProvider>
        <Main />
      </AuthorizeProvider>
    </div>
  );
}

export default App;