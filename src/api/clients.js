import api from './axiosConfig';

export const clientsAPI = {
  getAllClients: async (filters = {}) => {
    try {
      const response = await api.get('/clients', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getClientById: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateClient: async (clientId, clientData) => {
    try {
      const response = await api.put(`/clients/${clientId}`, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteClient: async (clientId) => {
    try {
      const response = await api.delete(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadClientPhoto: async (clientId, photoFile) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      
      const response = await api.post(`/clients/${clientId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadClientAttachment: async (clientId, file, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Aggiungi eventuali metadati
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });
      
      const response = await api.post(`/clients/${clientId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getClientGoals: async (clientId) => {
    try {
      const response = await api.get(`/client-goals/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getClientSubscriptions: async (clientId) => {
    try {
      const response = await api.get(`/client-subscriptions/${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};