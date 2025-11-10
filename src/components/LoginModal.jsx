import { useLoginForm } from '../hooks/useLoginForm';
import Logo from './Logo';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const {
    error,
    success,
    loginEmail,
    loginPassword,
    setLoginEmail,
    setLoginPassword,
    handleLogin,
    resetForm
  } = useLoginForm({
    onLoginSuccess: () => {
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 300);
    }
  });

  function handleClose() {
    resetForm();
    onClose?.();
  }

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={handleClose}>×</button>
        <div className="login-modal-content">
          <div className="login-logo">
            <Logo size="large" animate={false} />
          </div>
          <h1 className="login-title">Accedi</h1>
          <p className="login-subtitle">Entra per continuare a esplorare Netfilm.</p>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Email
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="inserisci@email.com"
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Inserisci la tua password"
                autoComplete="current-password"
              />
            </label>
            {error && <div className="error">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" className="login-button">
              Entra
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



