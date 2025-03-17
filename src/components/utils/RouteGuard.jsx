import { useEffect, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

const RouteGuard = ({ children }) => {
  const { isAuthenticated, loadingUser } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    // Se l'utente non è autenticato e non siamo in fase di caricamento
    if (!isAuthenticated && !loadingUser) {
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
  }, [isAuthenticated, loadingUser]);

  // Durante il caricamento, mostriamo un componente di loading
  if (loadingUser) {
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
