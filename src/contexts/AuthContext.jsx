import { createContext, useState, useEffect } from 'react';
import { usersAPI } from '../api/users';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loadingUser: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Controlla se esiste un token all'avvio dell'app e carica i dati utente
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');
      
      if (token && userId) {
        try {
          setLoadingUser(true);
          // Carica i dati dell'utente usando l'ID salvato
          const userData = await usersAPI.getUserById(userId);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Errore nel ripristino della sessione:', error);
          // In caso di errore nel recupero dei dati utente, rimuovi i token
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_id');
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setLoadingUser(false);
        }
      } else {
        setLoadingUser(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loadingUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
