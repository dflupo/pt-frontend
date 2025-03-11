import { useState, useCallback } from 'react';
import { mealPlansAPI } from '../api/mealPlans';

export default function useMealPlans() {
  const [clientMealPlans, setClientMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create meal plan
  const createMealPlan = useCallback(async (planData) => {
    setLoading(true);
    setError(null);
    try {
      const newPlan = await mealPlansAPI.createMealPlan(planData);
      setClientMealPlans(prev => [...prev, newPlan]);
      return newPlan;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating meal plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get meal plan by ID
  const fetchMealPlanById = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      const plan = await mealPlansAPI.getMealPlanById(planId);
      setSelectedMealPlan(plan);
      return plan;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading meal plan');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all meal plans for a client
  const fetchClientMealPlans = useCallback(async (clientId) => {
    setLoading(true);
    setError(null);
    try {
      const plans = await mealPlansAPI.getClientMealPlans(clientId);
      setClientMealPlans(plans);
      return plans;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading client meal plans');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a meal plan
  const updateMealPlan = useCallback(async (planId, planData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlan = await mealPlansAPI.updateMealPlan(planId, planData);
      setClientMealPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, ...updatedPlan } : plan
      ));
      if (selectedMealPlan && selectedMealPlan.id === planId) {
        setSelectedMealPlan({ ...selectedMealPlan, ...updatedPlan });
      }
      return updatedPlan;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating meal plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedMealPlan]);

  // Delete a meal plan
  const deleteMealPlan = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      await mealPlansAPI.deleteMealPlan(planId);
      setClientMealPlans(prev => prev.filter(plan => plan.id !== planId));
      if (selectedMealPlan && selectedMealPlan.id === planId) {
        setSelectedMealPlan(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting meal plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedMealPlan]);

  // Add meal item
  const addMealItem = useCallback(async (planId, itemData) => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await mealPlansAPI.addMealItem(planId, itemData);
      
      // If we're viewing the plan being modified, update it
      if (selectedMealPlan && selectedMealPlan.id === planId) {
        setSelectedMealPlan(prev => ({
          ...prev,
          items: [...(prev.items || []), newItem]
        }));
      }
      
      return newItem;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error adding meal item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedMealPlan]);

  // Delete meal item
  const deleteMealItem = useCallback(async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      await mealPlansAPI.deleteMealItem(itemId);
      
      // If we have the current plan loaded, update its items list
      if (selectedMealPlan && selectedMealPlan.items) {
        setSelectedMealPlan(prev => ({
          ...prev,
          items: prev.items.filter(item => item.id !== itemId)
        }));
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting meal item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedMealPlan]);

  return {
    clientMealPlans,
    selectedMealPlan,
    loading,
    error,
    createMealPlan,
    fetchMealPlanById,
    fetchClientMealPlans,
    updateMealPlan,
    deleteMealPlan,
    addMealItem,
    deleteMealItem
  };
}