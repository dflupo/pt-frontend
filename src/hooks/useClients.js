import { useState, useEffect, useCallback } from 'react';
import { clientsAPI } from '../api/clients';

export default function useClients() {
  const [clients, setClients] = useState([]);
  const [clientsMetadata, setClientsMetadata] = useState({
    total: 0,
    limit: 0,
    offset: 0
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carica tutti i clienti
  const fetchClients = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientsAPI.getAllClients(filters);
      
      // Gestisci sia il caso in cui la risposta sia un array diretto che un oggetto con la proprietà 'clients'
      if (Array.isArray(response)) {
        setClients(response);
        setClientsMetadata({ total: response.length, limit: 0, offset: 0 });
      } else if (response && Array.isArray(response.clients)) {
        // Estrai l'array clients e i metadati dalla risposta
        setClients(response.clients);
        setClientsMetadata({
          total: response.total || response.clients.length,
          limit: response.limit || 0,
          offset: response.offset || 0
        });
      } else {
        // Caso di emergenza se il formato non è riconosciuto
        console.warn('Formato risposta API inatteso:', response);
        setClients([]);
        setClientsMetadata({ total: 0, limit: 0, offset: 0 });
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Errore durante il caricamento dei clienti');
      setClients([]);
      return { clients: [] };
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
    clientsMetadata,
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