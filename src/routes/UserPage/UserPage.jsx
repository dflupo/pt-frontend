import './UserPage.scss';
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useClients } from '../../hooks';

export default function UserPage() {
  const { name } = useParams(); // Get the name from URL
  const location = useLocation();
  const userId = location.state?.userId; // Get the user ID from location state
  
  // Use the clients hook instead of direct API calls
  const { 
    selectedClient: user, 
    fetchClientById, 
    loading, 
    error 
  } = useClients();

  useEffect(() => {
    const loadUserData = async () => {
      // If we have the user ID, use it (more reliable)
      if (userId) {
        await fetchClientById(userId);
      } else {
        // Otherwise, we should search by name
        // This depends on how your API is structured
        console.warn('User ID not available, cannot load user details');
      }
    };

    loadUserData();
  }, [userId, name, fetchClientById]);

  if (loading) return <div className="user-page-loading">Caricamento dettagli utente...</div>;
  if (error) return <div className="user-page-error">{error}</div>;
  if (!user) return <div className="user-not-found">Utente non trovato</div>;

  return (
    <div className="user-page">
      <header className="user-header">
        <h1>{user.first_name} {user.last_name}</h1>
        {user.subscription && (
          <span className={`subscription-badge ${user.subscription.status}`}>
            {user.subscription.name}
          </span>
        )}
      </header>

      <div className="user-info-grid">
        <div className="user-info-card">
          <h2>Informazioni Personali</h2>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="label">Telefono:</span>
            <span className="value">{user.phone || 'Non specificato'}</span>
          </div>
          <div className="info-row">
            <span className="label">Data di nascita:</span>
            <span className="value">
              {user.birth_date ? new Date(user.birth_date).toLocaleDateString('it-IT') : 'Non specificata'}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Iscritto dal:</span>
            <span className="value">
              {user.first_subscription_date ? new Date(user.first_subscription_date).toLocaleDateString('it-IT') : 'Non specificata'}
            </span>
          </div>
        </div>

        {/* Other user information cards */}
        {/* ... */}
      </div>
    </div>
  );
}