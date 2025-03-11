import './UsersTable.scss';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../common/ProgressBar/ProgressBar';
import { useClients } from '../../../hooks';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

export default function UsersTable() {
    const { clients: users, loading, error, fetchClients, clientsMetadata } = useClients();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch clients using the hook
        fetchClients();
    }, [fetchClients]);

    // Funzione per determinare lo stato dell'abbonamento
    const getSubscriptionStatus = (user) => {
        if (!user.subscription) return { status: 'expired', label: 'Scaduto 🔴' };
        
        const expiryDate = new Date(user.subscription.expiry_date);
        const today = new Date();
        const daysToExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysToExpiry < 0) return { status: 'expired', label: 'Scaduto 🔴' };
        if (daysToExpiry <= 14) return { status: 'expiring', label: 'In Scadenza 🟡' };
        return { status: 'active', label: 'Attivo 🟢' };
    };

    // Funzione per formattare la data di iscrizione
    const formatJoinDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT');
    };

    // Funzione per calcolare l'ultima modifica
    const getLastUpdate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true, locale: it });
    };

    // Funzione per calcolare l'età
    const calculateAge = (birthDate) => {
        if (!birthDate) return "N/A";
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return `${age} Anni`;
    };

    // Funzione per formattare il nome utente per l'URL
    const formatNameForUrl = (firstName, lastName) => {
        // Rimuove spazi e caratteri speciali, converte in lowercase
        return `${firstName}${lastName}`
            .toLowerCase()
            .normalize('NFD') // Normalizza per gestire caratteri accentati
            .replace(/[\u0300-\u036f]/g, '') // Rimuove diacritici
            .replace(/[^\w\s]/gi, '') // Rimuove caratteri speciali
            .replace(/\s+/g, ''); // Rimuove spazi
    };

    // Funzione per gestire il click sulla riga
    const handleRowClick = (user) => {
        const nameUrl = formatNameForUrl(user.first_name, user.last_name);
        navigate(`/users/${nameUrl}`, { state: { userId: user.id } });
    };

    if (loading) return <div className="users-table-loading">Caricamento utenti...</div>;
    if (error) return <div className="users-table-error">{error}</div>;

    return (
        <div className="users-table">
            {users.length === 0 ? (
                <div className="no-users">Nessun utente trovato</div>
            ) : (
                <>
                    <div className="users-table-info">
                        Mostrando {users.length} di {clientsMetadata.total} utenti
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Età</th>
                                <th>Data Iscrizione</th>
                                <th>Stato Abbonamento</th>
                                <th>Obiettivo</th>
                                <th>Var. %</th>
                                <th>Ultimo Update</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => {
                                const subscriptionStatus = getSubscriptionStatus(user);
                                return (
                                    <tr 
                                        key={user.id} 
                                        onClick={() => handleRowClick(user)}
                                        className="clickable-row"
                                    >
                                        <td>{user.id}</td>
                                        <td>{`${user.first_name} ${user.last_name}`}</td>
                                        <td>{calculateAge(user.birth_date)}</td>
                                        <td>{formatJoinDate(user.first_subscription_date || user.created_at)}</td>
                                        <td className='status'>
                                            <span className={subscriptionStatus.status}>
                                                {subscriptionStatus.label}
                                            </span>
                                        </td>
                                        <td>
                                            {user.goals && user.goals.length > 0 ? (
                                                <ProgressBar progress={user.goals[0].progress || 0} />
                                            ) : (
                                                "Nessun obiettivo"
                                            )}
                                        </td>
                                        <td>{user.variation_percentage ? `${user.variation_percentage}%` : "N/A"}</td>
                                        <td>{getLastUpdate(user.updated_at || user.latest_update)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}