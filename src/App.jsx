import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeContextProvider } from './contexts/themeContext';

function App() {
  return (
    <>
      <ThemeContextProvider>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </ThemeContextProvider>
    </>
  );
}

export default App;
