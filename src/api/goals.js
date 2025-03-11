import api from './axiosConfig';

export const goalsAPI = {
  createClientGoal: async (goalData) => {
    try {
      const response = await api.post('/client-goals', goalData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create client goal error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getClientGoals: async (clientId) => {
    try {
      const response = await api.get(`/client-goals/client/${clientId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get client goals error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getGoalById: async (goalId) => {
    try {
      const response = await api.get(`/client-goals/${goalId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get goal ${goalId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateGoal: async (goalId, goalData) => {
    try {
      const response = await api.put(`/client-goals/${goalId}`, goalData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update goal ${goalId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteGoal: async (goalId) => {
    try {
      const response = await api.delete(`/client-goals/${goalId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete goal ${goalId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getGoalHistory: async (goalId) => {
    try {
      const response = await api.get(`/client-goals/${goalId}/history`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get goal history error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};