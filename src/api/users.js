import api from './axiosConfig';

export const usersAPI = {
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get user ${userId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update user ${userId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete user ${userId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  // Get current user (wrapper over auth API for convenience)
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