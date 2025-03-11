import { useState, useEffect, useCallback, useContext } from 'react';
import { authAPI } from '../api/auth';
import { AuthContext } from '../contexts/AuthContext';

export default function useAuth() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
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
      setError(err.response?.data?.message || 'Failed to register');
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
      setError(err.response?.data?.message || 'Failed to logout');
      // Anche in caso di errore, effettua il logout lato client
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [setUser, setIsAuthenticated]);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Se il token non è presente, non siamo autenticati
      if (!localStorage.getItem('authToken')) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      const userData = await authAPI.checkAuthStatus();
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify authentication');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser, setIsAuthenticated]);

  // Verifica autenticazione all'avvio
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth
  };
}