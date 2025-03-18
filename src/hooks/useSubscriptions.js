import { useState, useEffect, useCallback } from 'react';
import { subscriptionsAPI } from '../api/subscriptions';

export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all subscriptions
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subscriptionsAPI.getAllSubscriptions();
      setSubscriptions(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading subscriptions');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load specific subscription by ID
  const fetchSubscriptionById = useCallback(async (subscriptionId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await subscriptionsAPI.getSubscriptionById(subscriptionId);
      setSelectedSubscription(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading subscription');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new subscription
  const createSubscription = useCallback(async (subscriptionData) => {
    setLoading(true);
    setError(null);
    try {
      const newSubscription = await subscriptionsAPI.createSubscription(subscriptionData);
      setSubscriptions(prev => [...prev, newSubscription]);
      return newSubscription;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a subscription
  const updateSubscription = useCallback(async (subscriptionId, subscriptionData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSubscription = await subscriptionsAPI.updateSubscription(subscriptionId, subscriptionData);
      setSubscriptions(prev =>
        prev.map(subscription =>
          subscription.id === subscriptionId ? { ...subscription, ...updatedSubscription } : subscription
        )
      );
      if (selectedSubscription && selectedSubscription.id === subscriptionId) {
        setSelectedSubscription({ ...selectedSubscription, ...updatedSubscription });
      }
      return updatedSubscription;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedSubscription]);

  // Delete a subscription
  const deleteSubscription = useCallback(async (subscriptionId) => {
    setLoading(true);
    setError(null);
    try {
      await subscriptionsAPI.deleteSubscription(subscriptionId);
      setSubscriptions(prev => prev.filter(subscription => subscription.id !== subscriptionId));
      if (selectedSubscription && selectedSubscription.id === subscriptionId) {
        setSelectedSubscription(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedSubscription]);

  // Load subscription plans
  const fetchSubscriptionPlans = useCallback(async (subscriptionId) => {
    setLoading(true);
    setError(null);
    try {
      const plans = await subscriptionsAPI.getSubscriptionPlans(subscriptionId);
      setSubscriptionPlans(plans);
      return plans;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading subscription plans');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create subscription plan
  const createSubscriptionPlan = useCallback(async (subscriptionId, planData) => {
    setLoading(true);
    setError(null);
    try {
      const newPlan = await subscriptionsAPI.createSubscriptionPlan(subscriptionId, planData);
      setSubscriptionPlans(prev => [...prev, newPlan]);
      return newPlan;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating subscription plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update subscription plan
  const updateSubscriptionPlan = useCallback(async (planId, planData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlan = await subscriptionsAPI.updateSubscriptionPlan(planId, planData);
      setSubscriptionPlans(prev =>
        prev.map(plan => (plan.id === planId ? { ...plan, ...updatedPlan } : plan))
      );
      return updatedPlan;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating subscription plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete subscription plan
  const deleteSubscriptionPlan = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      await subscriptionsAPI.deleteSubscriptionPlan(planId);
      setSubscriptionPlans(prev => prev.filter(plan => plan.id !== planId));
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting subscription plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Renew client subscription
  const renewClientSubscription = useCallback(async (subscriptionId, renewData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await subscriptionsAPI.renewClientSubscription(subscriptionId, renewData);
      // Aggiorna lo stato locale se necessario (es. aggiornamento data di scadenza)
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error renewing subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get client payments (storico)
  const getClientPayments = useCallback(async (clientId, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await subscriptionsAPI.getClientPayments(clientId, filters);
      setPayments(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading client payments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create payment
  const createPayment = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const newPayment = await subscriptionsAPI.createPayment(paymentData);
      // Aggiorna lo storico locale se necessario
      return newPayment;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all payments (storico completo)
  const getAllPayments = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await subscriptionsAPI.getAllPayments(filters);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading payments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load subscriptions on initialization
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return {
    subscriptions,
    selectedSubscription,
    subscriptionPlans,
    payments,
    loading,
    error,
    fetchSubscriptions,
    fetchSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    fetchSubscriptionPlans,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    assignSubscriptionToClient: subscriptionsAPI.assignSubscriptionToClient, // già implementata in API
    getClientSubscriptions: subscriptionsAPI.getClientSubscriptions, // già implementata in API
    renewClientSubscription,
    getClientPayments,
    createPayment,
    getAllPayments
  };
}
