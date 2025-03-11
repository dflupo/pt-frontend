import api from './axiosConfig';

export const mealPlansAPI = {
  // Meal Plans
  createMealPlan: async (planData) => {
    try {
      const response = await api.post('/meal-plans', planData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create meal plan error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getMealPlanById: async (planId) => {
    try {
      const response = await api.get(`/meal-plans/${planId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get meal plan ${planId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getClientMealPlans: async (clientId) => {
    try {
      const response = await api.get(`/meal-plans/client/${clientId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get client meal plans error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateMealPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/meal-plans/${planId}`, planData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update meal plan ${planId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteMealPlan: async (planId) => {
    try {
      const response = await api.delete(`/meal-plans/${planId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete meal plan ${planId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Meal Items
  addMealItem: async (planId, itemData) => {
    try {
      const response = await api.post(`/meal-plans/${planId}/items`, itemData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Add meal item error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteMealItem: async (itemId) => {
    try {
      const response = await api.delete(`/meal-items/${itemId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete meal item ${itemId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};