import api from './axiosConfig';
import qs from 'qs'; // Importa qs per la serializzazione dei dati in formato form-urlencoded

export const authAPI = {
  login: async (email, password) => {
    try {
      // Prepara i dati nel formato corretto (application/x-www-form-urlencoded)
      const data = qs.stringify({
        grant_type: 'password',
        username: email,
        password: password,
        scope: '',
        client_id: '', // Sostituisci con il client_id corretto se necessario
        client_secret: '' // Sostituisci con il client_secret corretto se necessario
      });

      // Effettua la richiesta con il formato corretto
      const response = await api.post('/login', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });
      
      // Salva i token di autenticazione
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        
        // Salva anche il refresh token se presente
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        
        // Imposta l'header di autorizzazione per le future richieste
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/register', userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout', {}, {
        headers: {
          'Accept': 'application/json'
        }
      });
      // Remove tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Remove authorization header
      delete api.defaults.headers.common['Authorization'];
      return response.data;
    } catch (error) {
      // Even if the server request fails, clear the tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete api.defaults.headers.common['Authorization'];
      throw error;
    }
  }
};

// Esporta anche come default per compatibilità
export default authAPI;