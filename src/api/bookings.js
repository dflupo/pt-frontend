import api from './axiosConfig';

export const bookingsAPI = {
  // ===== SLOT TEMPLATES =====
  
  /**
   * Crea un nuovo template di slot
   * @param {Object} templateData - Dati del template (day_of_week, start_time, end_time, max_capacity)
   * @returns {Promise<Object>} Template creato
   */
  createSlotTemplate: async (templateData) => {
    try {
      const response = await api.post('/slot-templates', templateData);
      return response.data;
    } catch (error) {
      console.error('Create slot template error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Ottiene la lista di tutti i template
   * @returns {Promise<Array>} Lista dei template
   */
  getSlotTemplates: async () => {
    try {
      const response = await api.get('/slot-templates');
      return response.data;
    } catch (error) {
      console.error('Get slot templates error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Ottiene un template specifico
   * @param {number} templateId - ID del template
   * @returns {Promise<Object>} Dettagli del template
   */
  getSlotTemplateById: async (templateId) => {
    try {
      const response = await api.get(`/slot-templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error(`Get slot template ${templateId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // ===== SLOTS =====
  
  /**
   * Crea un nuovo slot
   * @param {Object} slotData - Dati dello slot (date, start_time, end_time, max_capacity)
   * @returns {Promise<Object>} Slot creato
   */
  createSlot: async (slotData) => {
    try {
      const response = await api.post('/slots', slotData);
      return response.data;
    } catch (error) {
      console.error('Create slot error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Ottiene la lista degli slot con filtri opzionali
   * @param {Object} params - Parametri di filtro (start_date, end_date)
   * @returns {Promise<Array>} Lista degli slot
   */
  getSlots: async (params = {}) => {
    try {
      const response = await api.get('/slots', { params });
      return response.data;
    } catch (error) {
      console.error('Get slots error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Ottiene uno slot specifico
   * @param {number} slotId - ID dello slot
   * @returns {Promise<Object>} Dettagli dello slot
   */
  getSlotById: async (slotId) => {
    try {
      const response = await api.get(`/slots/${slotId}`);
      return response.data;
    } catch (error) {
      console.error(`Get slot ${slotId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // ===== BOOKINGS =====
  
  /**
   * Crea una nuova prenotazione
   * @param {Object} bookingData - Dati della prenotazione (user_id, slot_id)
   * @returns {Promise<Object>} Prenotazione creata
   */
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Ottiene la lista delle prenotazioni con filtri opzionali
   * @param {Object} params - Parametri di filtro (start_date, end_date)
   * @returns {Promise<Array>} Lista delle prenotazioni
   */
  getBookings: async (params = {}) => {
    try {
      const response = await api.get('/bookings', { params });
      return response.data;
    } catch (error) {
      console.error('Get bookings error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Ottiene una prenotazione specifica
   * @param {number} bookingId - ID della prenotazione
   * @returns {Promise<Object>} Dettagli della prenotazione
   */
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error(`Get booking ${bookingId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Elimina una prenotazione
   * @param {number} bookingId - ID della prenotazione
   * @returns {Promise<Object>} Risultato dell'operazione
   */
  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error(`Delete booking ${bookingId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // ===== AUTOBOOKING =====

  /**
   * Genera prenotazioni automatiche per un periodo
   * @param {Object} params - Parametri (start_date, end_date)
   * @returns {Promise<Object>} Risultato dell'operazione
   */
  generateAutobooking: async (params) => {
    try {
      const response = await api.post('/autobooking/generate', null, { params });
      return response.data;
    } catch (error) {
      console.error('Generate autobooking error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Ottiene lo stato dell'autobooking per un periodo
   * @param {Object} params - Parametri (start_date, end_date)
   * @returns {Promise<Object>} Stato dell'autobooking
   */
  getAutobookingStatus: async (params) => {
    try {
      const response = await api.get('/autobooking/status', { params });
      return response.data;
    } catch (error) {
      console.error('Get autobooking status error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

export default bookingsAPI;