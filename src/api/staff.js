import api from './axiosConfig';

export const staffAPI = {
  /**
   * Ottiene l'elenco di tutti i membri dello staff
   * @returns {Promise<Array>} Lista dello staff
   */
  getAllStaff: async () => {
    try {
      const response = await api.get('/staff');
      return response.data;
    } catch (error) {
      console.error('Error getting staff members:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Ottiene un membro dello staff specifico per ID
   * @param {number} staffId - ID del membro dello staff
   * @returns {Promise<Object>} Dettagli del membro dello staff
   */
  getStaffById: async (staffId) => {
    try {
      const response = await api.get(`/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting staff member ${staffId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Crea un nuovo membro dello staff
   * @param {Object} staffData - Dati del nuovo membro dello staff (user_id, role, specialization)
   * @returns {Promise<Object>} Dettagli del membro dello staff creato
   */
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
      console.error('Error creating staff member:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Aggiorna un membro dello staff esistente
   * @param {number} staffId - ID del membro dello staff
   * @param {Object} staffData - Dati da aggiornare (role, specialization, phone)
   * @returns {Promise<Object>} Dettagli del membro dello staff aggiornato
   */
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
      console.error(`Error updating staff member ${staffId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  /**
   * Elimina un membro dello staff
   * @param {number} staffId - ID del membro dello staff da eliminare
   * @returns {Promise<Object>} Risultato dell'operazione
   */
  deleteStaff: async (staffId) => {
    try {
      const response = await api.delete(`/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting staff member ${staffId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

export default staffAPI;