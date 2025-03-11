import api from './axiosConfig';

export const bookingsAPI = {
  // Slots
  createSlot: async (slotData) => {
    try {
      const response = await api.post('/slots', slotData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create slot error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getSlots: async (filters = {}) => {
    try {
      // Default filters can include start_date, end_date, start_time, end_time, available_only
      const response = await api.get('/slots', {
        params: filters,
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get slots error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getSlotById: async (slotId) => {
    try {
      const response = await api.get(`/slots/${slotId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get slot ${slotId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateSlot: async (slotId, slotData) => {
    try {
      const response = await api.put(`/slots/${slotId}`, slotData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update slot ${slotId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteSlot: async (slotId) => {
    try {
      const response = await api.delete(`/slots/${slotId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete slot ${slotId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Bookings
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getUserBookings: async (userId, futureOnly = true) => {
    try {
      const response = await api.get(`/bookings/${userId}`, {
        params: { future_only: futureOnly },
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get user bookings error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete booking ${bookingId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};