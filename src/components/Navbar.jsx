import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Logo from './Logo';
import loginImg from '../assets/login.png';
import './Navbar.css';
import { useLoginModal } from '../context/LoginModalContext';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { authenticated, open } = useLoginModal();

  useEffect(() => {
    if (authenticated) {
      setIsSidebarOpen(false);
    }
  }, [authenticated]);

  return (
    <>
      {authenticated && <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />}
      
      <nav className="navbar">
        {authenticated ? (
          // Menu hamburger per utenti autenticati (in alto)
          <button
            className={`navbar-hamburger ${isSidebarOpen ? 'open' : ''}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        ) : (
          // Icona login per utenti non autenticati (in basso)
          <div className="navbar-login-container">
            <button
              className="navbar-login-button"
              onClick={() => open()}
              aria-label="Accedi"
              title="Accedi per navigare"
            >
              <img 
                src={loginImg} 
                alt="Accedi" 
                style={{ width: '36px', height: '36px' }}
              />
              <span className="navbar-login-tooltip">Accedi per navigare</span>
            </button>
          </div>
        )}
        
        {/* Logo al centro della navbar, ruotato di 180 gradi */}
        <div className="navbar-logo-container">
          <Logo size="normal" animate={false} />
        </div>
      </nav>
    </>
  );
}

