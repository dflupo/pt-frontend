import api from './axiosConfig';

export const authAPI = {
  login: async (email, password) => {
    try {
      // Converte i dati in formato x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', email);
      formData.append('password', password);
      formData.append('scope', '');
      // formData.append('client_id', import.meta.env.VITE_CLIENT_ID);
      // formData.append('client_secret', import.meta.env.VITE_CLIENT_SECRET);

      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        }
      });

      // Salva i token 
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      // Rimuovi il token
      localStorage.removeItem('authToken');
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      throw error;
    }
  },

  // Verifica se l'utente è ancora autenticato
  checkAuthStatus: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};