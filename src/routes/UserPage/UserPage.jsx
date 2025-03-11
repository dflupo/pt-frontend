import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { clientsAPI } from '../../api/clients';
import './UserPage.scss';

export default function UserPage() {
  const { name } = useParams(); // Ottiene il nome dall'URL
  const location = useLocation();
  const userId = location.state?.userId; // Ottiene l'ID utente passato nello state
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Se abbiamo l'ID utente, usiamo quello (più affidabile)
        if (userId) {
          const userData = await clientsAPI.getClientById(userId);
          setUser(userData);
        } else {
          // Altrimenti dovremmo fare una ricerca per nome
          // Questo dipende da come è strutturata la tua API
          console.warn('User ID non disponibile, impossibile caricare i dettagli dell\'utente');
          setError('Impossibile caricare i dettagli dell\'utente');
        }
      } catch (err) {
        console.error('Errore durante il caricamento dei dettagli dell\'utente:', err);
        setError('Si è verificato un errore durante il caricamento dei dettagli dell\'utente');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, name]);

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
              {user.join_date ? new Date(user.join_date).toLocaleDateString('it-IT') : 'Non specificata'}
            </span>
          </div>
        </div>

        {/* Altri riquadri con informazioni sull'utente */}
        {/* ... */}
      </div>
    </div>
  );
}