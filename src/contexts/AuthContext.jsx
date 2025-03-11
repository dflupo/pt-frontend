import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Controlla se esiste un token all'avvio dell'app
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Imposta solo lo stato di autenticazione
      // L'utente effettivo viene caricato da useAuth.js
      setIsAuthenticated(true);
    }
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};