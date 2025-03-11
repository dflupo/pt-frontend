import api from './axiosConfig';

export const subscriptionsAPI = {
  getAllSubscriptions: async () => {
    try {
      const response = await api.get('/subscriptions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSubscriptionById: async (subscriptionId) => {
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSubscription: async (subscriptionData) => {
    try {
      const response = await api.post('/subscriptions', subscriptionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSubscription: async (subscriptionId, subscriptionData) => {
    try {
      const response = await api.put(`/subscriptions/${subscriptionId}`, subscriptionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSubscription: async (subscriptionId) => {
    try {
      const response = await api.delete(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Gestione piani di abbonamento
  getSubscriptionPlans: async (subscriptionId) => {
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}/plans`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSubscriptionPlan: async (subscriptionId, planData) => {
    try {
      const response = await api.post(`/subscriptions/${subscriptionId}/plans`, planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Gestione abbonamenti cliente
  assignSubscriptionToClient: async (clientId, subscriptionData) => {
    try {
      const response = await api.post('/client-subscriptions', {
        client_id: clientId,
        ...subscriptionData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateClientSubscription: async (subscriptionId, updateData) => {
    try {
      const response = await api.put(`/client-subscriptions/${subscriptionId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};