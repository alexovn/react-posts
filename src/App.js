import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './Components/AppRouter';
import Navbar from './Components/UI/Navbar/Navbar';
import { AuthContext } from './context/context';
import './styles/App.css';

function App () {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(localStorage.getItem('auth')) {
      setIsAuth(true);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuth,
      setIsAuth,
      isLoading 
    }}>
      <BrowserRouter>
        <Navbar />
        <AppRouter />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;