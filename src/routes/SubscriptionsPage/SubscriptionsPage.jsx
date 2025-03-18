import React, { useState, useEffect } from 'react';
import useSubscriptions from '../../hooks/useSubscriptions';
import './SubscriptionsPage.scss';

const SubscriptionsPage = () => {
  // Stato per la gestione delle viste
  const [activeView, setActiveView] = useState('subscriptions');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  
  // Stato per i form
  const [isAddingSubscription, setIsAddingSubscription] = useState(false);
  const [isEditingSubscription, setIsEditingSubscription] = useState(false);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isAssigningSubscription, setIsAssigningSubscription] = useState(false);
  
  // Stato per i dati del form
  const [formData, setFormData] = useState({});
  const [clientList, setClientList] = useState([]);
  const [clientSubscriptions, setClientSubscriptions] = useState([]);
  
  // Hook personalizzato per la gestione delle operazioni sugli abbonamenti
  const {
    subscriptions,
    selectedSubscription,
    subscriptionPlans,
    loading,
    error,
    fetchSubscriptions,
    fetchSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    fetchSubscriptionPlans,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    assignSubscriptionToClient,
    getClientSubscriptions,
  } = useSubscriptions();

  // Carica la lista clienti (questa sarebbe una chiamata separata, simulo per ora)
  useEffect(() => {
    // Qui dovresti fare una chiamata API per ottenere la lista dei clienti
    // Simulo dei dati per il momento
    setClientList([
      { id: 1, name: 'Mario Rossi' },
      { id: 2, name: 'Giulia Bianchi' },
      { id: 3, name: 'Paolo Verdi' },
    ]);
  }, []);

  // Gestisce il cambio di abbonamento selezionato
  useEffect(() => {
    if (selectedSubscriptionId) {
      fetchSubscriptionById(selectedSubscriptionId);
      fetchSubscriptionPlans(selectedSubscriptionId);
    }
  }, [selectedSubscriptionId, fetchSubscriptionById, fetchSubscriptionPlans]);

  // Gestisce il cambio di cliente selezionato
  useEffect(() => {
    if (selectedClientId) {
      getClientSubscriptions(selectedClientId).then(data => {
        setClientSubscriptions(data);
      });
    }
  }, [selectedClientId, getClientSubscriptions]);

  // Gestori per i form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  // Gestore per la creazione di un abbonamento
  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    try {
      await createSubscription({
        name: formData.name,
        description: formData.description
      });
      setIsAddingSubscription(false);
      setFormData({});
    } catch (err) {
      console.error("Errore durante la creazione dell'abbonamento:", err);
    }
  };

  // Gestore per l'aggiornamento di un abbonamento
  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    try {
      await updateSubscription(selectedSubscriptionId, {
        name: formData.name,
        description: formData.description
      });
      setIsEditingSubscription(false);
      setFormData({});
    } catch (err) {
      console.error("Errore durante l'aggiornamento dell'abbonamento:", err);
    }
  };

  // Gestore per l'eliminazione di un abbonamento
  const handleDeleteSubscription = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo abbonamento?")) {
      try {
        await deleteSubscription(id);
        setSelectedSubscriptionId(null);
      } catch (err) {
        console.error("Errore durante l'eliminazione dell'abbonamento:", err);
        alert(err.message || "Impossibile eliminare l'abbonamento");
      }
    }
  };

  // Gestore per la creazione di un piano di abbonamento
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await createSubscriptionPlan(selectedSubscriptionId, {
        subscription_id: selectedSubscriptionId,
        duration_months: parseInt(formData.duration_months),
        price: formData.price,
        discount: formData.discount || 0
      });
      setIsAddingPlan(false);
      setFormData({});
    } catch (err) {
      console.error("Errore durante la creazione del piano:", err);
    }
  };

  // Gestore per l'aggiornamento di un piano
  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      await updateSubscriptionPlan(formData.id, {
        duration_months: parseInt(formData.duration_months),
        price: formData.price,
        discount: formData.discount || 0
      });
      setIsEditingPlan(false);
      setFormData({});
    } catch (err) {
      console.error("Errore durante l'aggiornamento del piano:", err);
    }
  };

  // Gestore per l'eliminazione di un piano
  const handleDeletePlan = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo piano?")) {
      try {
        await deleteSubscriptionPlan(id);
      } catch (err) {
        console.error("Errore durante l'eliminazione del piano:", err);
        alert(err.message || "Impossibile eliminare il piano");
      }
    }
  };

  // Gestore per l'assegnazione di un abbonamento a un cliente
  const handleAssignSubscription = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date(formData.start_date);
      // Calcola la data di fine in base alla durata del piano
      const selectedPlan = subscriptionPlans.find(plan => plan.id === parseInt(formData.subscription_plan_id));
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + selectedPlan.duration_months);
      
      await assignSubscriptionToClient({
        client_id: parseInt(formData.client_id),
        subscription_plan_id: parseInt(formData.subscription_plan_id),
        start_date: formData.start_date,
        end_date: endDate.toISOString().split('T')[0],
        payment_status: formData.payment_status,
        payment_method: formData.payment_method
      });
      
      setIsAssigningSubscription(false);
      setFormData({});
      
      // Se eravamo nella vista di un cliente, aggiorna i suoi abbonamenti
      if (selectedClientId) {
        const clientSubs = await getClientSubscriptions(selectedClientId);
        setClientSubscriptions(clientSubs);
      }
    } catch (err) {
      console.error("Errore durante l'assegnazione dell'abbonamento:", err);
    }
  };


  // Funzione per iniziare l'editing di un abbonamento
  const startEditingSubscription = (subscription) => {
    setFormData({
      name: subscription.name,
      description: subscription.description
    });
    setIsEditingSubscription(true);
  };

  // Funzione per iniziare l'editing di un piano
  const startEditingPlan = (plan) => {
    setFormData({
      id: plan.id,
      duration_months: plan.duration_months,
      price: plan.price,
      discount: plan.discount
    });
    setIsEditingPlan(true);
  };

  // Rendering condizionale dei form
  const renderSubscriptionForm = () => (
    <div className="subscription-form">
      <form onSubmit={isEditingSubscription ? handleUpdateSubscription : handleCreateSubscription}>
        <h3>{isEditingSubscription ? "Modifica abbonamento" : "Nuovo abbonamento"}</h3>
        
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descrizione</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditingSubscription ? "Aggiorna" : "Crea"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              isEditingSubscription ? setIsEditingSubscription(false) : setIsAddingSubscription(false);
              setFormData({});
            }}
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );

  const renderPlanForm = () => (
    <div className="plan-form">
      <form onSubmit={isEditingPlan ? handleUpdatePlan : handleCreatePlan}>
        <h3>{isEditingPlan ? "Modifica piano" : "Nuovo piano"}</h3>
        
        <div className="form-group">
          <label htmlFor="duration_months">Durata (mesi)</label>
          <input
            type="number"
            id="duration_months"
            name="duration_months"
            value={formData.duration_months || ''}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Prezzo (€)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || ''}
            onChange={handleNumberInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="discount">Sconto (%)</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount || '0'}
            onChange={handleNumberInputChange}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditingPlan ? "Aggiorna" : "Crea"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              isEditingPlan ? setIsEditingPlan(false) : setIsAddingPlan(false);
              setFormData({});
            }}
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );

  const renderAssignSubscriptionForm = () => (
    <div className="assign-subscription-form">
      <form onSubmit={handleAssignSubscription}>
        <h3>Assegna abbonamento a cliente</h3>
        
        <div className="form-group">
          <label htmlFor="client_id">Cliente</label>
          <select
            id="client_id"
            name="client_id"
            value={formData.client_id || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleziona un cliente</option>
            {clientList.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="subscription_plan_id">Piano abbonamento</label>
          <select
            id="subscription_plan_id"
            name="subscription_plan_id"
            value={formData.subscription_plan_id || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleziona un piano</option>
            {subscriptions.map(subscription => (
              <optgroup key={subscription.id} label={subscription.name}>
                {subscription.plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {`${subscription.name} - ${plan.duration_months} mesi - €${plan.price}`}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="start_date">Data inizio</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="payment_status">Stato pagamento</label>
          <select
            id="payment_status"
            name="payment_status"
            value={formData.payment_status || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleziona stato</option>
            <option value="pending">In attesa</option>
            <option value="paid">Pagato</option>
            <option value="failed">Fallito</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="payment_method">Metodo pagamento</label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleziona metodo</option>
            <option value="credit_card">Carta di credito</option>
            <option value="bank_transfer">Bonifico bancario</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Contanti</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Assegna</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsAssigningSubscription(false);
              setFormData({});
            }}
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );

  // Rendering delle viste principali
  const renderSubscriptionsList = () => (
    <div className="subscriptions-list">
      <div className="list-header">
        <h2>Abbonamenti</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsAddingSubscription(true);
            setFormData({});
          }}
        >
          Nuovo abbonamento
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Caricamento in corso...</div>
      ) : error ? (
        <div className="error">Si è verificato un errore: {error}</div>
      ) : (
        <div className="subscription-cards">
          {subscriptions.length === 0 ? (
            <div className="empty-state">
              <p>Nessun abbonamento trovato. Crea il tuo primo abbonamento!</p>
            </div>
          ) : (
            subscriptions.map(subscription => (
              <div
                key={subscription.id}
                className={`subscription-card ${selectedSubscriptionId === subscription.id ? 'selected' : ''}`}
                onClick={() => setSelectedSubscriptionId(subscription.id)}
              >
                <h3>{subscription.name}</h3>
                <p>{subscription.description}</p>
                <div className="plan-summary">
                  {subscription.plans.length > 0 ? (
                    <p>{subscription.plans.length} {subscription.plans.length === 1 ? 'piano' : 'piani'}</p>
                  ) : (
                    <p>Nessun piano</p>
                  )}
                </div>
                <div className="card-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingSubscription(subscription);
                    }}
                  >
                    Modifica
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubscription(subscription.id);
                    }}
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderSubscriptionDetails = () => {
    if (!selectedSubscription) return null;
    
    return (
      <div className="subscription-details">
        <div className="details-header">
          <h2>{selectedSubscription.name}</h2>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsAddingPlan(true);
                setFormData({});
              }}
            >
              Aggiungi piano
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedSubscriptionId(null)}
            >
              Torna alla lista
            </button>
          </div>
        </div>
        
        <div className="details-content">
          <div className="subscription-info">
            <h3>Dettagli abbonamento</h3>
            <p><strong>Descrizione:</strong> {selectedSubscription.description || 'Nessuna descrizione'}</p>
            <p><strong>Creato il:</strong> {new Date(selectedSubscription.created_at).toLocaleDateString()}</p>
            <p><strong>Aggiornato il:</strong> {new Date(selectedSubscription.updated_at).toLocaleDateString()}</p>
          </div>
          
          <div className="plans-section">
            <h3>Piani di abbonamento</h3>
            
            {subscriptionPlans.length === 0 ? (
              <div className="empty-state">
                <p>Nessun piano trovato. Aggiungi il tuo primo piano!</p>
              </div>
            ) : (
              <table className="plans-table">
                <thead>
                  <tr>
                    <th>Durata (mesi)</th>
                    <th>Prezzo (€)</th>
                    <th>Sconto (%)</th>
                    <th>Prezzo finale (€)</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionPlans.map(plan => (
                    <tr key={plan.id}>
                      <td>{plan.duration_months}</td>
                      <td>{plan.price.toFixed(2)}</td>
                      <td>{plan.discount ? plan.discount.toFixed(2) : '0.00'}</td>
                      <td>
                        {(plan.price - (plan.price * (plan.discount / 100))).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => startEditingPlan(plan)}
                        >
                          Modifica
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          Elimina
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderClientsView = () => (
    <div className="clients-view">
      <div className="view-header">
        <h2>Clienti con abbonamenti</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsAssigningSubscription(true);
            setFormData({});
          }}
        >
          Assegna abbonamento
        </button>
      </div>
      
      <div className="clients-list">
        <h3>Seleziona un cliente</h3>
        <div className="client-cards">
          {clientList.map(client => (
            <div
              key={client.id}
              className={`client-card ${selectedClientId === client.id ? 'selected' : ''}`}
              onClick={() => setSelectedClientId(client.id)}
            >
              <h4>{client.name}</h4>
              <p>Visualizza abbonamenti</p>
            </div>
          ))}
        </div>
      </div>
      
      {selectedClientId && (
        <div className="client-subscriptions">
          <h3>Abbonamenti del cliente</h3>
          
          {clientSubscriptions.length === 0 ? (
            <div className="empty-state">
              <p>Nessun abbonamento trovato per questo cliente.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsAssigningSubscription(true);
                  setFormData({ client_id: selectedClientId });
                }}
              >
                Assegna abbonamento
              </button>
            </div>
          ) : (
            <table className="client-subscriptions-table">
              <thead>
                <tr>
                  <th>Abbonamento</th>
                  <th>Piano</th>
                  <th>Data inizio</th>
                  <th>Data fine</th>
                  <th>Stato pagamento</th>
                  <th>Metodo pagamento</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {clientSubscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.subscription_name}</td>
                    <td>{sub.duration_months} mesi - €{sub.price.toFixed(2)}</td>
                    <td>{new Date(sub.start_date).toLocaleDateString()}</td>
                    <td>{new Date(sub.end_date).toLocaleDateString()}</td>
                    <td>
                      
                    </td>
                    <td>{sub.payment_method}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          // Apri form per estendere abbonamento
                          setIsAssigningSubscription(true);
                          setFormData({
                            client_id: selectedClientId,
                            // Pre-riempi con gli stessi valori per facilitare l'estensione
                            subscription_plan_id: sub.subscription_plan_id,
                            payment_method: sub.payment_method,
                            // Imposta la data di inizio a un giorno dopo la fine dell'abbonamento corrente
                            start_date: (() => {
                              const date = new Date(sub.end_date);
                              date.setDate(date.getDate() + 1);
                              return date.toISOString().split('T')[0];
                            })()
                          });
                        }}
                      >
                        Estendi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );

  // Render principale della pagina
  return (
    <div className="subscriptions-page">
      <div className="navigation-tabs">
        <button
          className={activeView === 'subscriptions' ? 'active' : ''}
          onClick={() => {
            setActiveView('subscriptions');
            setSelectedClientId(null);
          }}
        >
          Abbonamenti
        </button>
        <button
          className={activeView === 'clients' ? 'active' : ''}
          onClick={() => {
            setActiveView('clients');
            setSelectedSubscriptionId(null);
          }}
        >
          Clienti
        </button>
      </div>
      
      <div className="content-area">
        {/* Vista abbonamenti */}
        {activeView === 'subscriptions' && !selectedSubscriptionId && renderSubscriptionsList()}
        {activeView === 'subscriptions' && selectedSubscriptionId && renderSubscriptionDetails()}
        
        {/* Vista clienti */}
        {activeView === 'clients' && renderClientsView()}
        
        {/* Form modali */}
        {isAddingSubscription && renderSubscriptionForm()}
        {isEditingSubscription && renderSubscriptionForm()}
        {isAddingPlan && renderPlanForm()}
        {isEditingPlan && renderPlanForm()}
        {isAssigningSubscription && renderAssignSubscriptionForm()}
      </div>
    </div>
  );
};

export default SubscriptionsPage;