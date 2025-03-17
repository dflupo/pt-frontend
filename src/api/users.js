import api from './axiosConfig';

export const usersAPI = {
  
  /**
   * Ottiene i dettagli di un utente specifico per ID
   * @param {number} userId - ID dell'utente
   * @returns {Promise<Object>} Dati dell'utente
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting user ${userId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  /**
   * Aggiorna i dati di un utente
   * @param {number} userId - ID dell'utente
   * @param {Object} userData - Dati da aggiornare (first_name, last_name, email, phone, city, birth_date, password)
   * @returns {Promise<Object>} Risposta aggiornata
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  /**
   * Elimina un utente
   * @param {number} userId - ID dell'utente da eliminare
   * @returns {Promise<Object>} Conferma eliminazione
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  /**
   * Ottiene i piani di allenamento assegnati a un utente
   * @param {number} userId - ID dell'utente
   * @returns {Promise<Array>} Elenco dei piani di allenamento
   */
  getUserWorkoutPlans: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/workout-plans`);
      return response.data;
    } catch (error) {
      console.error(`Error getting workout plans for user ${userId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  /**
   * Assegna un piano di allenamento a un utente
   * @param {number} userId - ID dell'utente
   * @param {number} planId - ID del piano di allenamento
   * @returns {Promise<Object>} Risultato operazione
   */
  assignWorkoutPlan: async (userId, planId) => {
    try {
      const response = await api.post(`/users/${userId}/workout-plans`, {
        user_id: userId,
        workout_plan_id: planId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error assigning workout plan to user ${userId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  /**
   * Rimuove un piano di allenamento da un utente
   * @param {number} userId - ID dell'utente
   * @param {number} planId - ID del piano di allenamento
   * @returns {Promise<Object>} Risultato operazione
   */
  removeWorkoutPlan: async (userId, planId) => {
    try {
      const response = await api.delete(`/users/${userId}/workout-plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing workout plan from user ${userId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  /**
   * Ottiene lo storico delle prenotazioni di un utente
   * @param {number} userId - ID dell'utente
   * @returns {Promise<Array>} Elenco delle prenotazioni
   */
  getUserBookings: async (userId) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting bookings for user ${userId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  /**
   * Ottiene la programmazione di un utente
   * @param {number} userId - ID dell'utente
   * @returns {Promise<Array>} Programmazione oraria dell'utente
   */
  getUserSchedules: async (userId) => {
    try {
      const response = await api.get(`/user-schedules/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting schedules for user ${userId}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default usersAPI;