import { useState } from 'react';
import { login, register } from '../utils/auth';

export function useLoginForm(options = {}) {
  const { onLoginSuccess, onRegisterSuccess } = options;
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Campi login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Campi registrazione
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setError('');
    setSuccess('');
    setLoginEmail('');
    setLoginPassword('');
    setNome('');
    setCognome('');
    setEmail('');
    setPassword('');
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    resetForm();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Inserisci email e password');
      return;
    }

    try {
      login(loginEmail.trim(), loginPassword.trim());
      setSuccess('Accesso completato!');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message || 'Errore durante il login');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome.trim() || !cognome.trim() || !email.trim() || !password.trim()) {
      setError('Compila tutti i campi');
      return;
    }

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }

    try {
      register(nome.trim(), cognome.trim(), email.trim(), password.trim());
      setSuccess('Registrazione completata!');
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err) {
      setError(err.message || 'Errore durante la registrazione');
    }
  };

  return {
    // State
    isRegisterMode,
    error,
    success,
    loginEmail,
    loginPassword,
    nome,
    cognome,
    email,
    password,
    // Setters
    setLoginEmail,
    setLoginPassword,
    setNome,
    setCognome,
    setEmail,
    setPassword,
    // Handlers
    handleLogin,
    handleRegister,
    toggleMode,
    resetForm
  };
}

