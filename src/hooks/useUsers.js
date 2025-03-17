import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../api/users';

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carica un utente specifico per ID
  const fetchUserById = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersAPI.getUserById(userId);
      setSelectedUser(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore nel recupero dell\'utente');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Aggiorna un utente
  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await usersAPI.updateUser(userId, userData);
      
      // Aggiorna lo stato solo se l'utente selezionato è quello che è stato modificato
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, ...updatedUser });
      }
      
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore nell\'aggiornamento dell\'utente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  // Elimina un utente
  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await usersAPI.deleteUser(userId);
      // Se l'utente selezionato è quello che è stato eliminato, lo rimuoviamo dallo stato
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore nell\'eliminazione dell\'utente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  // Ottiene i piani di allenamento assegnati a un utente
  const fetchUserWorkoutPlans = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersAPI.getUserWorkoutPlans(userId);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore nel recupero dei piani di allenamento');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Assegna un piano di allenamento a un utente
  const assignWorkoutPlan = useCallback(async (userId, planId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await usersAPI.assignWorkoutPlan(userId, planId);
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore nell\'assegnazione del piano di allenamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rimuove un piano di allenamento da un utente
  const removeWorkoutPlan = useCallback(async (userId, planId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await usersAPI.removeWorkoutPlan(userId, planId);
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore nella rimozione del piano di allenamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Ottiene le prenotazioni di un utente
  const fetchUserBookings = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersAPI.getUserBookings(userId);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore nel recupero delle prenotazioni');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Ottiene la programmazione di un utente
  const fetchUserSchedules = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersAPI.getUserSchedules(userId);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore nel recupero della programmazione');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Al caricamento del componente, cerca di caricare l'utente corrente
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    selectedUser,
    loading,
    error,
    fetchCurrentUser,
    fetchUserById,
    updateUser,
    deleteUser,
    fetchUserWorkoutPlans,
    assignWorkoutPlan,
    removeWorkoutPlan,
    fetchUserBookings,
    fetchUserSchedules
  };
}