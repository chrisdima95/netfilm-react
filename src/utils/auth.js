// Registrazione utente
export function register(nome, cognome, email, password) {
  const users = getRegisteredUsers();
  
  // Verifica se l'email esiste già
  if (users.find(u => u.email === email)) {
    throw new Error('Email già registrata');
  }

  const newUser = {
    id: Date.now(),
    nome,
    cognome,
    email,
    password, // In produzione, dovrebbe essere hashata
    username: email.split('@')[0] // Usa la parte prima della @ come username
  };

  users.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(users));
  
  // Login automatico dopo registrazione
  loginUser(newUser);
  
  return newUser;
}

// Login utente - accetta qualsiasi email e password
export function login(email, password) {
  const users = getRegisteredUsers();
  let user = users.find(u => u.email === email && u.password === password);
  
  // Se l'utente non esiste, crea un nuovo utente automaticamente
  if (!user) {
    // Estrai nome dalla parte prima dell'@ come nome utente
    const username = email.split('@')[0];
    const nome = username.charAt(0).toUpperCase() + username.slice(1);
    
    user = {
      id: Date.now(),
      nome: nome,
      cognome: 'Utente',
      email: email,
      password: password,
      username: username
    };

    // Salva il nuovo utente
    users.push(user);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }

  loginUser(user);
  return user;
}

// Login utente (funzione interna)
function loginUser(user) {
  localStorage.setItem('user', JSON.stringify({
    id: user.id,
    nome: user.nome,
    cognome: user.cognome,
    email: user.email,
    password: user.password, // Salva la password per mostrarla nel profilo
    username: user.username
  }));
}

// Logout
export function logout() {
  localStorage.removeItem('user');
}

// Ottieni utente corrente
export function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

// Verifica autenticazione
export function isAuthenticated() {
  return Boolean(getUser());
}

// Ottieni tutti gli utenti registrati (solo per sviluppo)
function getRegisteredUsers() {
  const raw = localStorage.getItem('registeredUsers');
  return raw ? JSON.parse(raw) : [];
}
