import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';

const RouteGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Se l'utente non è autenticato e non siamo in fase di caricamento
    if (!isAuthenticated && !loading) {
      // Mostra un messaggio toast
      toast.info("Devi effettuare l'accesso per visualizzare questa pagina", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [isAuthenticated, loading]);

  // Durante il caricamento, mostriamo null o un componente di loading
  if (loading) {
    return <div className="loading-container">Caricamento...</div>;
  }

  // Se l'utente non è autenticato, reindirizza alla pagina di login
  // e passa l'URL corrente come parametro "from" per poter tornare dopo il login
  if (!isAuthenticated) {
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Se l'utente è autenticato, mostra il contenuto protetto
  return children;
};

export default RouteGuard;