import api from './axiosConfig';

const workoutPlansAPI = {
  // Workout Plans
  getAllWorkoutPlans: async () => {
    try {
      const response = await api.get('/workouts');
      return response.data;
    } catch (error) {
      console.error('Get all workout plans error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  getWorkoutPlanById: async (planId) => {
    try {
      const response = await api.get(`/workout-plans/${planId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get workout plan ${planId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  createWorkoutPlan: async (planData) => {
    try {
      const response = await api.post('/workout-plans', planData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create workout plan error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateWorkoutPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/workout-plans/${planId}`, planData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update workout plan ${planId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteWorkoutPlan: async (planId) => {
    try {
      const response = await api.delete(`/workout-plans/${planId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete workout plan ${planId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Workout Sets
  addSetToWorkoutPlan: async (planId, setData) => {
    try {
      const response = await api.post(`/workout-plans/${planId}/sets`, setData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Add set to workout plan error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteWorkoutSet: async (setId) => {
    try {
      const response = await api.delete(`/workout-sets/${setId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete workout set ${setId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Exercise in sets
  addExerciseToSet: async (setId, exerciseData) => {
    try {
      const response = await api.post(`/workout-sets/${setId}/exercises`, exerciseData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Add exercise to set error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateWorkoutExercise: async (exerciseId, exerciseData) => {
    try {
      const response = await api.put(`/workout-exercises/${exerciseId}`, exerciseData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update workout exercise ${exerciseId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteWorkoutExercise: async (exerciseId) => {
    try {
      const response = await api.delete(`/workout-exercises/${exerciseId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete workout exercise ${exerciseId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Assign workout plans to users
  assignWorkoutPlanToUser: async (userId, assignData) => {
    try {
      const response = await api.post(`/users/${userId}/workout-plans`, assignData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Assign workout plan to user error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getUserWorkoutPlans: async (userId) => {
    try {
      const response = await api.get(`/workouts/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Get user ${userId} workout plans error:`, error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  removeWorkoutPlanFromUser: async (userId, planId) => {
    try {
      const response = await api.delete(`/users/${userId}/workout-plans/${planId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Remove workout plan from user error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

export default workoutPlansAPI;