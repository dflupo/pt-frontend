import axios from 'axios';

// Usa la variabile d'ambiente se disponibile, altrimenti usa un valore predefinito
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per le richieste
api.interceptors.request.use(
  (config) => {
    // Aggiungi il token di autenticazione a ogni richiesta
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log delle richieste in ambiente di sviluppo
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Errore nella richiesta:', error);
    return Promise.reject(error);
  }
);

// Interceptor per le risposte
api.interceptors.response.use(
  (response) => {
    // Log delle risposte in ambiente di sviluppo
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Gestione migliorata degli errori
    if (error.response) {
      const { status, data, config } = error.response;
      console.error(`API Error ${status}: ${config.method.toUpperCase()} ${config.url}`, data);
      
      // Gestione errori di autenticazione
      if (status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Opzionale: reindirizza alla pagina di login
        // window.location.href = '/login';
      }
      
      // Formatta gli errori di validazione per un debug migliore
      if (status === 422) {
        if (data.detail && Array.isArray(data.detail)) {
          console.error('Errori di validazione:', data.detail.map(err => ({
            campo: err.loc ? err.loc.join('.') : 'sconosciuto',
            messaggio: err.msg,
            tipo: err.type
          })));
        } else {
          console.error('Errore di validazione:', data.detail);
        }
      }
    } else if (error.request) {
      // La richiesta è stata effettuata ma non è stata ricevuta alcuna risposta
      console.error('Nessuna risposta ricevuta:', error.request);
    } else {
      // Si è verificato un errore durante l'impostazione della richiesta
      console.error('Errore di configurazione della richiesta:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;