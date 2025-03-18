import './UsersTable.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../common/ProgressBar/ProgressBar';
import { useClients } from '../../../hooks';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

export default function UsersTable() {
    const { clients: users, loading, error, fetchClients, clientsMetadata } = useClients();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: 'id',
        direction: 'ascending'
    });

    useEffect(() => {
        // Fetch clients using the hook
        fetchClients();
    }, [fetchClients]);

    useEffect(() => {
        // Filter users when the search term or users data changes
        if (users && users.length > 0) {
            const filtered = users.filter(user => {
                const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
                const searchLower = searchTerm.toLowerCase();
                return fullName.includes(searchLower) || 
                       (user.id && user.id.toString().includes(searchLower));
            });
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    }, [searchTerm, users]);

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
        navigate(`/gestione-utenti/${nameUrl}`, { state: { userId: user.id } });
    };

    // Funzione per gestire il sort delle colonne
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Funzione per ottenere il className per l'header della colonna
    const getSortDirectionClass = (name) => {
        if (sortConfig.key !== name) return '';
        return sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc';
    };

    // Applica il sort alla lista filtrata
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        // Per gestire valori null o undefined
        if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
        if (!a[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (!b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Gestione speciale per campi specifici
        if (sortConfig.key === 'birth_date') {
            aValue = a.birth_date ? new Date(a.birth_date).getTime() : 0;
            bValue = b.birth_date ? new Date(b.birth_date).getTime() : 0;
        } else if (sortConfig.key === 'first_subscription_date' || sortConfig.key === 'created_at') {
            aValue = a[sortConfig.key] ? new Date(a[sortConfig.key]).getTime() : 0;
            bValue = b[sortConfig.key] ? new Date(b[sortConfig.key]).getTime() : 0;
        } else if (sortConfig.key === 'subscription') {
            const aStatus = getSubscriptionStatus(a).status;
            const bStatus = getSubscriptionStatus(b).status;
            
            // Ordine personalizzato: active > expiring > expired
            const statusOrder = { 'active': 0, 'expiring': 1, 'expired': 2 };
            aValue = statusOrder[aStatus];
            bValue = statusOrder[bStatus];
        } else if (sortConfig.key === 'name') {
            aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
            bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
        } else if (sortConfig.key === 'goals') {
            aValue = a.goals && a.goals.length > 0 ? a.goals[0].progress || 0 : 0;
            bValue = b.goals && b.goals.length > 0 ? b.goals[0].progress || 0 : 0;
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    if (loading) return <div className="users-table-loading">Caricamento utenti...</div>;
    if (error) return <div className="users-table-error">{error}</div>;

    return (
        <div className="users-table">
            <div className="users-table-controls">
                <input
                    type="text"
                    placeholder="Cerca per nome o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            
            {filteredUsers.length === 0 ? (
                <div className="no-users">Nessun utente trovato</div>
            ) : (
                <>
                    <div className="users-table-info">
                        Mostrando {filteredUsers.length} di {clientsMetadata.total} utenti
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th 
                                    onClick={() => requestSort('id')}
                                    className={getSortDirectionClass('id')}
                                >
                                    ID
                                </th>
                                <th 
                                    onClick={() => requestSort('name')}
                                    className={getSortDirectionClass('name')}
                                >
                                    Nome
                                </th>
                                <th 
                                    onClick={() => requestSort('birth_date')}
                                    className={getSortDirectionClass('birth_date')}
                                >
                                    Età
                                </th>
                                <th 
                                    onClick={() => requestSort('first_subscription_date')}
                                    className={getSortDirectionClass('first_subscription_date')}
                                >
                                    Data Iscrizione
                                </th>
                                <th 
                                    onClick={() => requestSort('subscription')}
                                    className={getSortDirectionClass('subscription')}
                                >
                                    Stato Abbonamento
                                </th>
                                <th 
                                    onClick={() => requestSort('goals')}
                                    className={getSortDirectionClass('goals')}
                                >
                                    Obiettivo
                                </th>
                                <th 
                                    onClick={() => requestSort('variation_percentage')}
                                    className={getSortDirectionClass('variation_percentage')}
                                >
                                    Var. %
                                </th>
                                <th 
                                    onClick={() => requestSort('updated_at')}
                                    className={getSortDirectionClass('updated_at')}
                                >
                                    Ultimo Update
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedUsers.map(user => {
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