import { useState, useEffect, useCallback } from 'react';
import { workoutPlansAPI } from '../api/workoutPlans';

export default function useWorkoutPlans() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all workout plans
  const fetchWorkoutPlans = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await workoutPlansAPI.getAllWorkoutPlans(filters);
      setWorkoutPlans(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading workout plans');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load specific workout plan by ID
  const fetchWorkoutPlanById = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await workoutPlansAPI.getWorkoutPlanById(planId);
      setSelectedPlan(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading workout plan');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new workout plan
  const createWorkoutPlan = useCallback(async (planData) => {
    setLoading(true);
    setError(null);
    try {
      const newPlan = await workoutPlansAPI.createWorkoutPlan(planData);
      setWorkoutPlans(prev => [...prev, newPlan]);
      return newPlan;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating workout plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a workout plan
  const updateWorkoutPlan = useCallback(async (planId, planData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlan = await workoutPlansAPI.updateWorkoutPlan(planId, planData);
      setWorkoutPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, ...updatedPlan } : plan
      ));
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan({ ...selectedPlan, ...updatedPlan });
      }
      return updatedPlan;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating workout plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPlan]);

  // Delete a workout plan
  const deleteWorkoutPlan = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      await workoutPlansAPI.deleteWorkoutPlan(planId);
      setWorkoutPlans(prev => prev.filter(plan => plan.id !== planId));
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting workout plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPlan]);

  // Add set to workout plan
  const addSetToWorkoutPlan = useCallback(async (planId, setData) => {
    setLoading(true);
    setError(null);
    try {
      const newSet = await workoutPlansAPI.addSetToWorkoutPlan(planId, setData);
      
      // Update the selected plan with the new set if we're viewing that plan
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan(prev => ({
          ...prev,
          sets: [...(prev.sets || []), newSet]
        }));
      }
      
      return newSet;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error adding set to workout plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPlan]);

  // Add exercise to set
  const addExerciseToSet = useCallback(async (setId, exerciseData) => {
    setLoading(true);
    setError(null);
    try {
      const newExercise = await workoutPlansAPI.addExerciseToSet(setId, exerciseData);
      
      // Update the selected plan with the new exercise if we have the plan loaded
      if (selectedPlan) {
        const updatedSets = selectedPlan.sets?.map(set => {
          if (set.id === setId) {
            return {
              ...set,
              exercises: [...(set.exercises || []), newExercise]
            };
          }
          return set;
        });
        
        if (updatedSets) {
          setSelectedPlan(prev => ({
            ...prev,
            sets: updatedSets
          }));
        }
      }
      
      return newExercise;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error adding exercise to set');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPlan]);

  // Get user workout plans
  const getUserWorkoutPlans = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const plans = await workoutPlansAPI.getUserWorkoutPlans(userId);
      return plans;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading user workout plans');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Assign workout plan to user
  const assignWorkoutPlanToUser = useCallback(async (userId, assignData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workoutPlansAPI.assignWorkoutPlanToUser(userId, assignData);
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error assigning workout plan to user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load workout plans on initialization
  useEffect(() => {
    fetchWorkoutPlans();
  }, [fetchWorkoutPlans]);

  return {
    workoutPlans,
    selectedPlan,
    loading,
    error,
    fetchWorkoutPlans,
    fetchWorkoutPlanById,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    addSetToWorkoutPlan,
    addExerciseToSet,
    getUserWorkoutPlans,
    assignWorkoutPlanToUser
  };
}