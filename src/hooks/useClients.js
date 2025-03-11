import { useState, useEffect, useCallback } from 'react';
import { clientsAPI } from '../api/clients';

export default function useClients() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carica tutti i clienti
  const fetchClients = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsAPI.getAllClients(filters);
      setClients(data);
      return data;
    } catch (err) {
      setError(err.message || 'Errore durante il caricamento dei clienti');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Carica un cliente specifico per ID
  const fetchClientById = useCallback(async (clientId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsAPI.getClientById(clientId);
      setSelectedClient(data);
      return data;
    } catch (err) {
      setError(err.message || 'Errore durante il caricamento del cliente');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Aggiorna un cliente
  const updateClient = useCallback(async (clientId, clientData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedClient = await clientsAPI.updateClient(clientId, clientData);
      setClients(prev => prev.map(client => 
        client.id === clientId ? { ...client, ...updatedClient } : client
      ));
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient({ ...selectedClient, ...updatedClient });
      }
      return updatedClient;
    } catch (err) {
      setError(err.message || 'Errore durante l\'aggiornamento del cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  // Elimina un cliente
  const deleteClient = useCallback(async (clientId) => {
    setLoading(true);
    setError(null);
    try {
      await clientsAPI.deleteClient(clientId);
      setClients(prev => prev.filter(client => client.id !== clientId));
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(null);
      }
      return true;
    } catch (err) {
      setError(err.message || 'Errore durante l\'eliminazione del cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  // Carica le iscrizioni di un cliente
  const fetchClientSubscriptions = useCallback(async (clientId) => {
    try {
      return await clientsAPI.getClientSubscriptions(clientId);
    } catch (err) {
      setError(err.message || 'Errore durante il caricamento degli abbonamenti');
      return [];
    }
  }, []);

  // Carica gli obiettivi di un cliente
  const fetchClientGoals = useCallback(async (clientId) => {
    try {
      return await clientsAPI.getClientGoals(clientId);
    } catch (err) {
      setError(err.message || 'Errore durante il caricamento degli obiettivi');
      return [];
    }
  }, []);

  // Carica i clienti all'inizializzazione
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    selectedClient,
    loading,
    error,
    fetchClients,
    fetchClientById,
    updateClient,
    deleteClient,
    fetchClientSubscriptions,
    fetchClientGoals
  };
}