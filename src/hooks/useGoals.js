import { useState, useCallback } from 'react';
import { goalsAPI } from '../api/goals';

export default function useGoals() {
  const [clientGoals, setClientGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalHistory, setGoalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create client goal
  const createClientGoal = useCallback(async (goalData) => {
    setLoading(true);
    setError(null);
    try {
      const newGoal = await goalsAPI.createClientGoal(goalData);
      setClientGoals(prev => [...prev, newGoal]);
      return newGoal;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating goal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all goals for a client
  const fetchClientGoals = useCallback(async (clientId) => {
    setLoading(true);
    setError(null);
    try {
      const goals = await goalsAPI.getClientGoals(clientId);
      setClientGoals(goals);
      return goals;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading client goals');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get goal by ID
  const fetchGoalById = useCallback(async (goalId) => {
    setLoading(true);
    setError(null);
    try {
      const goal = await goalsAPI.getGoalById(goalId);
      setSelectedGoal(goal);
      return goal;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading goal');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a goal
  const updateGoal = useCallback(async (goalId, goalData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGoal = await goalsAPI.updateGoal(goalId, goalData);
      setClientGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, ...updatedGoal } : goal
      ));
      if (selectedGoal && selectedGoal.id === goalId) {
        setSelectedGoal({ ...selectedGoal, ...updatedGoal });
      }
      return updatedGoal;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating goal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedGoal]);

  // Delete a goal
  const deleteGoal = useCallback(async (goalId) => {
    setLoading(true);
    setError(null);
    try {
      await goalsAPI.deleteGoal(goalId);
      setClientGoals(prev => prev.filter(goal => goal.id !== goalId));
      if (selectedGoal && selectedGoal.id === goalId) {
        setSelectedGoal(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting goal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedGoal]);

  // Get goal history
  const fetchGoalHistory = useCallback(async (goalId) => {
    setLoading(true);
    setError(null);
    try {
      const history = await goalsAPI.getGoalHistory(goalId);
      setGoalHistory(history);
      return history;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading goal history');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clientGoals,
    selectedGoal,
    goalHistory,
    loading,
    error,
    createClientGoal,
    fetchClientGoals,
    fetchGoalById,
    updateGoal,
    deleteGoal,
    fetchGoalHistory
  };
}