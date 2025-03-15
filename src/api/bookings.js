import api from './axiosConfig';

export const bookingsAPI = {
  // ===== SLOTS =====
  
  // Get all slots with optional filters
  getSlots: async (filters = {}) => {
    try {
      // filters can include: start_date, end_time, etc.
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

  // Get slot by ID
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

  // Create a new slot
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

  // Update a slot
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

  // Delete a slot
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

  // Generate slots based on template
  generateSlots: async () => {
    try {
      const response = await api.post('/generate-slots', {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Generate slots error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // ===== SLOT TEMPLATES =====
  
  // Get all slot templates
  getSlotTemplates: async () => {
    try {
      const response = await api.get('/slot-templates', {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get slot templates error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Get slot template by ID
  getSlotTemplateById: async (templateId) => {
    try {
      const response = await api.get(`/slot-templates/${templateId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get slot template ${templateId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Create a new slot template
  createSlotTemplate: async (templateData) => {
    try {
      const response = await api.post('/slot-templates', templateData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create slot template error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Update a slot template
  updateSlotTemplate: async (templateId, templateData) => {
    try {
      const response = await api.put(`/slot-templates/${templateId}`, templateData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update slot template ${templateId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Delete a slot template
  deleteSlotTemplate: async (templateId) => {
    try {
      const response = await api.delete(`/slot-templates/${templateId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete slot template ${templateId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // ===== BOOKINGS =====
  
  // Create a booking
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

  // Get bookings for a user
  getUserBookings: async (userId, futureOnly = true) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`, {
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

  // Get bookings for a slot
  getSlotBookings: async (slotId) => {
    try {
      const response = await api.get(`/bookings/slot/${slotId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get slot bookings error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Move a booking from one slot to another
  moveBooking: async (userId, fromSlotId, toSlotId) => {
    try {
      const response = await api.post('/bookings/move', null, {
        params: {
          user_id: userId,
          from_slot_id: fromSlotId,
          to_slot_id: toSlotId
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Move booking error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Delete a booking
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
  },

  // ===== USER SCHEDULES =====
  
  // Get all schedules for a user
  getUserSchedules: async (userId) => {
    try {
      const response = await api.get(`/user-schedules/${userId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get user schedules error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Create a new user schedule
  createUserSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/user-schedules', scheduleData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create user schedule error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Update a user schedule
  updateUserSchedule: async (scheduleId, scheduleData) => {
    try {
      const response = await api.put(`/user-schedules/${scheduleId}`, scheduleData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update user schedule ${scheduleId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Delete a user schedule
  deleteUserSchedule: async (scheduleId) => {
    try {
      const response = await api.delete(`/user-schedules/${scheduleId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete user schedule ${scheduleId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Auto-book users into slots based on their schedules
  autoBookUsers: async (autoBookData) => {
    try {
      const response = await api.post('/auto-book', autoBookData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Auto-book users error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};