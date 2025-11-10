import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginModal } from '../context/LoginModalContext';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, open } = useLoginModal();

  useEffect(() => {
    if (!authenticated) {
      open(location.pathname + location.search);
    }
  }, [authenticated, location.pathname, location.search, open]);

  if (!authenticated) {
    return (
      <div className="protected-route-placeholder" style={{ padding: '32px', textAlign: 'center', color: '#fff' }}>
        <p style={{ marginBottom: '16px' }}>Accedi per continuare.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => open(location.pathname + location.search)}
            style={{
              padding: '10px 18px',
              backgroundColor: '#e3b23c',
              border: 'none',
              borderRadius: '4px',
              color: '#121212',
              cursor: 'pointer'
            }}
          >
            Apri login
          </button>
          <button
            type="button"
            onClick={() => navigate('/home')}
            style={{
              padding: '10px 18px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Torna alla home
          </button>
        </div>
      </div>
    );
  }

  return children;
}
