import api from './axiosConfig';

export const exercisesAPI = {
  getAllExercises: async (filters = {}) => {
    try {
      const response = await api.get('/exercises', {
        params: filters,
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get all exercises error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getExerciseById: async (exerciseId) => {
    try {
      const response = await api.get(`/exercises/${exerciseId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Get exercise ${exerciseId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  createExercise: async (exerciseData) => {
    try {
      const response = await api.post('/exercises', exerciseData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create exercise error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateExercise: async (exerciseId, exerciseData) => {
    try {
      const response = await api.put(`/exercises/${exerciseId}`, exerciseData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update exercise ${exerciseId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteExercise: async (exerciseId) => {
    try {
      const response = await api.delete(`/exercises/${exerciseId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete exercise ${exerciseId} error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },

  uploadExerciseGif: async (exerciseId, gifFile) => {
    try {
      const formData = new FormData();
      formData.append('gif_file', gifFile);
      
      const response = await api.post(`/exercises/${exerciseId}/gif`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Upload exercise gif error:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};