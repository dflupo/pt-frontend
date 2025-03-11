import api from './axiosConfig';

export const exercisesAPI = {
  getAllExercises: async (filters = {}) => {
    try {
      const response = await api.get('/exercises', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getExerciseById: async (exerciseId) => {
    try {
      const response = await api.get(`/exercises/${exerciseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createExercise: async (exerciseData) => {
    try {
      const response = await api.post('/exercises', exerciseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateExercise: async (exerciseId, exerciseData) => {
    try {
      const response = await api.put(`/exercises/${exerciseId}`, exerciseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteExercise: async (exerciseId) => {
    try {
      const response = await api.delete(`/exercises/${exerciseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadExerciseGif: async (exerciseId, gifFile) => {
    try {
      const formData = new FormData();
      formData.append('gif', gifFile);
      
      const response = await api.post(`/exercises/${exerciseId}/gif`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};