import { useState, useEffect, useCallback, useContext } from 'react';
import { authAPI } from '../api/auth';
import { usersAPI } from '../api/users';
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
      // After successful login, get the current user details
      const userData = await usersAPI.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login');
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
      setError(err.response?.data?.detail || 'Failed to register');
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
      setError(err.response?.data?.detail || 'Failed to logout');
      // Even if server logout fails, perform client-side logout
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
      // If access token isn't present, we're not authenticated
      if (!localStorage.getItem('access_token')) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      const userData = await usersAPI.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to verify authentication');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser, setIsAuthenticated]);

  // Verify authentication on startup
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