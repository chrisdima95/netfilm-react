import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import { isAuthenticated } from '../utils/auth';

const LoginModalContext = createContext(null);

export function LoginModalProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const pendingPathRef = useRef(null);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'user') {
        setAuthenticated(isAuthenticated());
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const open = useCallback((path) => {
    if (typeof path === 'string') {
      pendingPathRef.current = path;
    } else if (!pendingPathRef.current) {
      pendingPathRef.current = location.pathname + location.search;
    }
    setIsOpen(true);
  }, [location.pathname, location.search]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSuccess = useCallback(() => {
    setAuthenticated(true);
    setIsOpen(false);

    if (pendingPathRef.current) {
      navigate(pendingPathRef.current, { replace: true });
      pendingPathRef.current = null;
    }
  }, [navigate]);

  const markLoggedOut = useCallback(() => {
    setAuthenticated(false);
    pendingPathRef.current = null;
  }, []);

  const value = useMemo(() => ({
    isOpen,
    authenticated,
    open,
    close,
    handleSuccess,
    markLoggedOut
  }), [authenticated, close, handleSuccess, isOpen, markLoggedOut, open]);

  return (
    <LoginModalContext.Provider value={value}>
      {children}
      <LoginModal
        isOpen={isOpen}
        onClose={close}
        onSuccess={handleSuccess}
      />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);

  if (!context) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }

  return context;
}

