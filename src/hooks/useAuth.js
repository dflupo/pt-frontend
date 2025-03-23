import { useState, useEffect, useCallback, useContext } from 'react';
import { authAPI } from '../api/auth';
import { usersAPI } from '../api/users';
import { AuthContext } from '../contexts/AuthContext';

export default function useAuth() {
  const { user, setUser, isAuthenticated, setIsAuthenticated, loadingUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Prima effettuiamo il login per ottenere i token
      const loginResponse = await authAPI.login(email, password);
      
      // Impostiamo il token nell'header per le richieste successive
      if (loginResponse.access_token) {
        localStorage.setItem('access_token', loginResponse.access_token);
        localStorage.setItem('refresh_token', loginResponse.refresh_token);
      }

      try {
        // Poi otteniamo i dati dell'utente usando il token appena ottenuto
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      } catch (userError) {
        console.error('Error getting user data after login:', userError);
        setUser({ email });
        setIsAuthenticated(true);
        throw userError;
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to login';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Authentication error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setIsAuthenticated]);

  // Register
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to register';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Registration error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to logout';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Logout error occurred');
      // Anche se il logout lato server fallisce, eseguiamo comunque il logout lato client
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [setUser, setIsAuthenticated]);

  // Funzione per cancellare gli errori
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    loading: loading || loadingUser,
    error,
    login,
    register,
    logout,
    clearError
  };
}
