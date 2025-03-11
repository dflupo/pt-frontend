import api from './axiosConfig';

export const workoutPlansAPI = {
  getAllWorkoutPlans: async (filters = {}) => {
    try {
      const response = await api.get('/workout-plans', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getWorkoutPlanById: async (planId) => {
    try {
      const response = await api.get(`/workout-plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createWorkoutPlan: async (planData) => {
    try {
      const response = await api.post('/workout-plans', planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateWorkoutPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/workout-plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteWorkoutPlan: async (planId) => {
    try {
      const response = await api.delete(`/workout-plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sets within workout plans
  addSetToWorkoutPlan: async (planId, setData) => {
    try {
      const response = await api.post(`/workout-plans/${planId}/sets`, setData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Exercise in sets
  addExerciseToSet: async (setId, exerciseData) => {
    try {
      const response = await api.post(`/workout-sets/${setId}/exercises`, exerciseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateWorkoutExercise: async (exerciseId, exerciseData) => {
    try {
      const response = await api.put(`/workout-exercises/${exerciseId}`, exerciseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteWorkoutExercise: async (exerciseId) => {
    try {
      const response = await api.delete(`/workout-exercises/${exerciseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assigning workout plans to users
  assignWorkoutPlanToUser: async (userId, planId, assignData = {}) => {
    try {
      const response = await api.post(`/users/${userId}/workout-plans`, {
        plan_id: planId,
        ...assignData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserWorkoutPlans: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/workout-plans`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removeWorkoutPlanFromUser: async (userId, planId) => {
    try {
      const response = await api.delete(`/users/${userId}/workout-plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};