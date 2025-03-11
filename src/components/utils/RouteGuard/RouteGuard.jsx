import { Navigate } from 'react-router-dom';

export default function RouteGuard({ children }) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // Reindirizza alla pagina di login se non c'è un token
    return <Navigate to="/login" replace />;
  }
  
  // Se c'è un token, mostra il componente figlio (le rotte protette)
  return children;
}