import api from './axiosConfig';

export const authAPI = {
  login: async (email, password) => {
    try {
      // Format data as x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      formData.append('grant_type', 'password');
      formData.append('scope', '');
      // Client ID and secret could be added if needed
      // formData.append('client_id', import.meta.env.VITE_CLIENT_ID);
      // formData.append('client_secret', import.meta.env.VITE_CLIENT_SECRET);

      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });

      // Save tokens to localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        // Update the token in axiosConfig for future requests
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
  },

  // Get current authenticated user details
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me', {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};