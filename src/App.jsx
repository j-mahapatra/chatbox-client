import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeContextProvider } from './contexts/themeContext';
import GlobalContextProvider from './contexts/globalContext';
import UserContextProvider from './contexts/userContext';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <>
      <ThemeContextProvider>
        <GlobalContextProvider>
          <UserContextProvider>
            <Navbar />
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </Routes>
          </UserContextProvider>
        </GlobalContextProvider>
      </ThemeContextProvider>
    </>
  );
}

export default App;
