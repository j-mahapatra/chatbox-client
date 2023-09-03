import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeContextProvider } from './contexts/themeContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <ThemeContextProvider>
        <Navbar />
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
