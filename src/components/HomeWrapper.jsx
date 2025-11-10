import { Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import Home from '../pages/Home';

export default function HomeWrapper() {
  const location = useLocation();
  
  // Se siamo esattamente su /home, mostra sempre la pagina Home
  if (location.pathname === '/home') {
    return <Home />;
  }
  
  // Se siamo su route protette (/home/films, etc.), mostra le route nidificate (Layout)
  return <Outlet />;
}

