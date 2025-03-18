import api from './axiosConfig';

export const subscriptionsAPI = {
  // Subscription types
  getAllSubscriptions: async () => {
    try {
      const response = await api.get('/subscriptions', {
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Get all subscriptions error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getSubscriptionById: async (subscriptionId) => {
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}`, {
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error(`Get subscription ${subscriptionId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  createSubscription: async (subscriptionData) => {
    try {
      const response = await api.post('/subscriptions', subscriptionData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create subscription error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateSubscription: async (subscriptionId, subscriptionData) => {
    try {
      const response = await api.put(`/subscriptions/${subscriptionId}`, subscriptionData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update subscription ${subscriptionId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteSubscription: async (subscriptionId) => {
    try {
      const response = await api.delete(`/subscriptions/${subscriptionId}`, {
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete subscription ${subscriptionId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Subscription plans
  getSubscriptionPlans: async (subscriptionId) => {
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}/plans`, {
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error(`Get subscription plans error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  createSubscriptionPlan: async (subscriptionId, planData) => {
    try {
      const response = await api.post(`/subscriptions/${subscriptionId}/plans`, planData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create subscription plan error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateSubscriptionPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/subscription-plans/${planId}`, planData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update subscription plan ${planId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteSubscriptionPlan: async (planId) => {
    try {
      const response = await api.delete(`/subscription-plans/${planId}`, {
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete subscription plan ${planId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Client subscriptions
  assignSubscriptionToClient: async (subscriptionData) => {
    try {
      const response = await api.post('/client-subscriptions', subscriptionData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Assign subscription to client error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getClientSubscriptions: async (clientId) => {
    try {
      const response = await api.get(`/client-subscriptions/${clientId}`, {
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error(`Get client subscriptions error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateClientSubscription: async (subscriptionId, updateData) => {
    try {
      const response = await api.put(`/client-subscriptions/${subscriptionId}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update client subscription ${subscriptionId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Renew client subscription
  renewClientSubscription: async (subscriptionId, renewData) => {
    try {
      const response = await api.post(`/client-subscriptions/${subscriptionId}/renew`, renewData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Renew client subscription ${subscriptionId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Payments
  getClientPayments: async (clientId, filters = {}) => {
    try {
      const response = await api.get(`/client-payments/${clientId}`, {
        headers: { 'Accept': 'application/json' },
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error(`Get client payments error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create payment error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getAllPayments: async (filters = {}) => {
    try {
      const response = await api.get('/payments', {
        headers: { 'Accept': 'application/json' },
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Get all payments error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};
