import api from './axiosConfig';

export const staffAPI = {
  getAllStaff: async () => {
    try {
      const response = await api.get('/staff', {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get all staff error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getStaffById: async (staffId) => {
    try {
      const response = await api.get(`/staff/${staffId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get staff ${staffId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  createStaff: async (staffData) => {
    try {
      const response = await api.post('/staff', staffData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create staff error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateStaff: async (staffId, staffData) => {
    try {
      const response = await api.put(`/staff/${staffId}`, staffData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update staff ${staffId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteStaff: async (staffId) => {
    try {
      const response = await api.delete(`/staff/${staffId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete staff ${staffId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};