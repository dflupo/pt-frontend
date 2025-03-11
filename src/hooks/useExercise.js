import { useState, useEffect, useCallback } from 'react';
import { exercisesAPI } from '../api/exercises';

export default function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all exercises
  const fetchExercises = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await exercisesAPI.getAllExercises(filters);
      setExercises(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading exercises');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load specific exercise by ID
  const fetchExerciseById = useCallback(async (exerciseId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await exercisesAPI.getExerciseById(exerciseId);
      setSelectedExercise(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading exercise');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new exercise
  const createExercise = useCallback(async (exerciseData) => {
    setLoading(true);
    setError(null);
    try {
      const newExercise = await exercisesAPI.createExercise(exerciseData);
      setExercises(prev => [...prev, newExercise]);
      return newExercise;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating exercise');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an exercise
  const updateExercise = useCallback(async (exerciseId, exerciseData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedExercise = await exercisesAPI.updateExercise(exerciseId, exerciseData);
      setExercises(prev => prev.map(exercise => 
        exercise.id === exerciseId ? { ...exercise, ...updatedExercise } : exercise
      ));
      if (selectedExercise && selectedExercise.id === exerciseId) {
        setSelectedExercise({ ...selectedExercise, ...updatedExercise });
      }
      return updatedExercise;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating exercise');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedExercise]);

  // Delete an exercise
  const deleteExercise = useCallback(async (exerciseId) => {
    setLoading(true);
    setError(null);
    try {
      await exercisesAPI.deleteExercise(exerciseId);
      setExercises(prev => prev.filter(exercise => exercise.id !== exerciseId));
      if (selectedExercise && selectedExercise.id === exerciseId) {
        setSelectedExercise(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting exercise');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedExercise]);

  // Upload exercise GIF
  const uploadExerciseGif = useCallback(async (exerciseId, gifFile) => {
    setLoading(true);
    setError(null);
    try {
      const response = await exercisesAPI.uploadExerciseGif(exerciseId, gifFile);
      
      // Update the exercise in the list with the new GIF path
      setExercises(prev => prev.map(exercise => 
        exercise.id === exerciseId ? { ...exercise, gif_path: response.gif_path } : exercise
      ));
      
      // Update selected exercise if it's the one we just updated
      if (selectedExercise && selectedExercise.id === exerciseId) {
        setSelectedExercise({ ...selectedExercise, gif_path: response.gif_path });
      }
      
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error uploading exercise GIF');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedExercise]);

  // Load exercises on initialization
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return {
    exercises,
    selectedExercise,
    loading,
    error,
    fetchExercises,
    fetchExerciseById,
    createExercise,
    updateExercise,
    deleteExercise,
    uploadExerciseGif
  };
}