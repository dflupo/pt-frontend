import './UserPage.scss';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useClients, useGoals, useWorkoutPlans, useSubscriptions, useMealPlans } from '../../hooks';
import { useOutletContext } from 'react-router-dom';

export default function UserPage() {
  const { TopBar } = useOutletContext();
  const { name } = useParams(); // Get the name from URL
  const location = useLocation();
  const userId = location.state?.userId; // Get the user ID from location state
  
  // Use the clients hook for basic user data
  const { 
    selectedClient: user, 
    fetchClientById, 
    loading: loadingUser, 
    error: userError 
  } = useClients();

  // Use additional hooks for related data
  const { clientGoals, fetchClientGoals, loading: loadingGoals } = useGoals();
  const { getClientSubscriptions, loading: loadingSubscriptions } = useSubscriptions();
  const { getUserWorkoutPlans, loading: loadingWorkoutPlans } = useWorkoutPlans();
  const { fetchClientMealPlans, loading: loadingMealPlans } = useMealPlans();

  // States for related data
  const [subscriptions, setSubscriptions] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  
  // Overall loading state
  const loading = loadingUser || loadingGoals || loadingSubscriptions || loadingWorkoutPlans || loadingMealPlans;
  const [loadingRelatedData, setLoadingRelatedData] = useState(false);

  // Load user basic data
  useEffect(() => {
    const loadUserData = async () => {
      if (userId) {
        await fetchClientById(userId);
      } else {
        console.warn('User ID not available, cannot load user details');
      }
    };

    loadUserData();
  }, [userId, name, fetchClientById]);

  // Load related data when user is loaded
  useEffect(() => {
    const loadRelatedData = async () => {
      if (!user || !user.id) return;
      
      setLoadingRelatedData(true);
      try {
        // Fetch goals
        await fetchClientGoals(user.id);
        
        // Fetch subscriptions
        const subsData = await getClientSubscriptions(user.id);
        setSubscriptions(subsData || []);
        
        // Fetch workout plans
        const workoutsData = await getUserWorkoutPlans(user.id);
        setWorkoutPlans(workoutsData || []);
        
        // Fetch meal plans
        const mealsData = await fetchClientMealPlans(user.id);
        setMealPlans(mealsData || []);
      } catch (error) {
        console.error("Error loading related data", error);
      } finally {
        setLoadingRelatedData(false);
      }
    };
    
    loadRelatedData();
  }, [user, fetchClientGoals, getClientSubscriptions, getUserWorkoutPlans, fetchClientMealPlans]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Non specificata';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  // Calculate age helper
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} anni`;
  };

  if (loadingUser) return <div className="user-page-loading">Caricamento dettagli utente...</div>;
  if (userError) return <div className="user-page-error">{userError}</div>;
  if (!user) return <div className="user-not-found">Utente non trovato</div>;



  return (
    <div className="user-page">
      <TopBar title={`Pagina Utente`} />
      <div className="user-header">

        <h1>{user.first_name} {user.last_name}</h1>
        
        <div className="user-badges">
          {subscriptions && subscriptions.length > 0 && (
            <span className={`subscription-badge ${subscriptions[0].payment_status === 'pagato' ? 'active' : 'expired'}`}>
              {subscriptions[0].subscription_name || 'Abbonamento'}
            </span>
          )}
        </div>
      </div>

      <div className="user-info-grid">
        {/* Informazioni personali */}
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
            <span className="label">Città:</span>
            <span className="value">{user.city || 'Non specificata'}</span>
          </div>
          <div className="info-row">
            <span className="label">Data di nascita:</span>
            <span className="value">{formatDate(user.birth_date)}</span>
          </div>
          <div className="info-row">
            <span className="label">Età:</span>
            <span className="value">{calculateAge(user.birth_date)}</span>
          </div>
          <div className="info-row">
            <span className="label">Altezza:</span>
            <span className="value">{user.height ? `${user.height} cm` : 'Non specificata'}</span>
          </div>
          <div className="info-row">
            <span className="label">Iscritto dal:</span>
            <span className="value">{formatDate(user.first_subscription_date)}</span>
          </div>
          <div className="info-row">
            <span className="label">Ultimo aggiornamento:</span>
            <span className="value">{formatDate(user.latest_update || user.updated_at)}</span>
          </div>
        </div>

        {/* Abbonamenti */}
        <div className="user-info-card">
          <h2>Abbonamenti</h2>
          {loadingSubscriptions ? (
            <div className="loading-indicator">Caricamento abbonamenti...</div>
          ) : subscriptions && subscriptions.length > 0 ? (
            <div className="subscriptions-list">
              {subscriptions.map((sub, index) => (
                <div key={index} className="subscription-item">
                  <div className="info-row">
                    <span className="label">Tipo:</span>
                    <span className="value">{sub.subscription_name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Inizio:</span>
                    <span className="value">{formatDate(sub.start_date)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Fine:</span>
                    <span className="value">{formatDate(sub.end_date)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Stato pagamento:</span>
                    <span className={`value ${sub.payment_status === 'pagato' ? 'status-paid' : 'status-pending'}`}>
                      {sub.payment_status || 'Non specificato'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Metodo pagamento:</span>
                    <span className="value">{sub.payment_method || 'Non specificato'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nessun abbonamento attivo</div>
          )}
        </div>

        {/* Obiettivi */}
        <div className="user-info-card">
          <h2>Obiettivi</h2>
          {loadingGoals ? (
            <div className="loading-indicator">Caricamento obiettivi...</div>
          ) : clientGoals && clientGoals.length > 0 ? (
            <div className="goals-list">
              {clientGoals.map(goal => (
                <div key={goal.id} className="goal-item">
                  <div className="info-row">
                    <span className="label">Metrica:</span>
                    <span className="value">{goal.metric}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Valore Corrente:</span>
                    <span className="value">{goal.current_value} {goal.unit}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Obiettivo:</span>
                    <span className="value">{goal.target_value} {goal.unit}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Tempo stimato:</span>
                    <span className="value">{goal.estimated_time} giorni</span>
                  </div>
                  {goal.notes && (
                    <div className="info-row">
                      <span className="label">Note:</span>
                      <span className="value">{goal.notes}</span>
                    </div>
                  )}
                  <div className="goal-progress">
                    <progress 
                      value={Math.abs(goal.current_value - goal.target_value) / Math.abs(goal.target_value) * 100} 
                      max="100"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nessun obiettivo impostato</div>
          )}
        </div>

        {/* Piani di workout */}
        <div className="user-info-card">
          <h2>Piani di Allenamento</h2>
          {loadingWorkoutPlans ? (
            <div className="loading-indicator">Caricamento piani di allenamento...</div>
          ) : workoutPlans && workoutPlans.length > 0 ? (
            <div className="workout-plans-list">
              {workoutPlans.map(plan => (
                <div key={plan.id} className="workout-plan-item">
                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <span className="plan-date">{formatDate(plan.created_at)}</span>
                  </div>
                  <p className="plan-description">{plan.description || 'Nessuna descrizione'}</p>
                  <div className="plan-sets">
                    {plan.sets && plan.sets.length > 0 ? (
                      plan.sets.map(set => (
                        <div key={set.id} className="set-item">
                          <h4>Set {set.set_order}</h4>
                          <ul className="exercises-list">
                            {set.exercises && set.exercises.map(exercise => (
                              <li key={exercise.id}>{exercise.name} - {exercise.sets}x{exercise.reps}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p>Nessun esercizio definito</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nessun piano di allenamento assegnato</div>
          )}
        </div>

        {/* Piani alimentari */}
        <div className="user-info-card">
          <h2>Piani Alimentari</h2>
          {loadingMealPlans ? (
            <div className="loading-indicator">Caricamento piani alimentari...</div>
          ) : mealPlans && mealPlans.length > 0 ? (
            <div className="meal-plans-list">
              {mealPlans.map(plan => (
                <div key={plan.id} className="meal-plan-item">
                  <div className="plan-header">
                    <h3>{plan.title}</h3>
                    <span className="plan-date">{formatDate(plan.start_date)} - {formatDate(plan.end_date)}</span>
                  </div>
                  <p className="plan-description">{plan.description || 'Nessuna descrizione'}</p>
                  {plan.total_calories && (
                    <div className="info-row">
                      <span className="label">Calorie giornaliere:</span>
                      <span className="value">{plan.total_calories} kcal</span>
                    </div>
                  )}
                  <div className="meal-items">
                    {plan.items && plan.items.length > 0 ? (
                      <div className="meals-table">
                        <h4>Pasti</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>Giorno</th>
                              <th>Orario</th>
                              <th>Alimento</th>
                              <th>Quantità</th>
                              <th>Calorie</th>
                            </tr>
                          </thead>
                          <tbody>
                            {plan.items.map(item => (
                              <tr key={item.id}>
                                <td>{item.day || '-'}</td>
                                <td>{item.meal_time || '-'}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity || '-'}</td>
                                <td>{item.calories ? `${item.calories} kcal` : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>Nessun pasto definito</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nessun piano alimentare assegnato</div>
          )}
        </div>
      </div>
    </div>
  );
}