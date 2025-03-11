import api from './axiosConfig';

export const clientsAPI = {
  getAllClients: async (filters = {}) => {
    try {
      // Default filters
      const defaultFilters = {
        search: '',
        city: '',
        min_age: 0,
        max_age: 99,
        sort_by: 'last_name',
        sort_order: 'asc',
        limit: 100,
        offset: 0,
        ...filters
      };

      const response = await api.get('/clients', {
        params: defaultFilters,
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get all clients error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getClientById: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get client ${clientId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateClient: async (clientId, clientData) => {
    try {
      const response = await api.put(`/clients/${clientId}`, clientData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update client ${clientId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteClient: async (clientId) => {
    try {
      const response = await api.delete(`/clients/${clientId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete client ${clientId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  uploadClientPhotos: async (clientId, photos, photoDate) => {
    try {
      const formData = new FormData();
      
      if (photos.frontPhoto) {
        formData.append('front_photo', photos.frontPhoto);
      }
      
      if (photos.sidePhoto) {
        formData.append('side_photo', photos.sidePhoto);
      }
      
      if (photos.backPhoto) {
        formData.append('back_photo', photos.backPhoto);
      }
      
      const response = await api.post(`/clients/${clientId}/photos?photo_date=${photoDate}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Upload client photos error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  uploadClientAttachment: async (clientId, file, category) => {
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('attachment', file);
      
      const response = await api.post(`/clients/${clientId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Upload client attachment error:`, error.response ? error.response.data : error.message);
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

  getClientSubscriptions: async (clientId) => {
    try {
      const response = await api.get(`/client-subscriptions/${clientId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get client subscriptions error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};