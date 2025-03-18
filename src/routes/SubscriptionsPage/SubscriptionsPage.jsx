import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSubscriptions from '../../hooks/useSubscriptions';
import TopBar from '../../components/common/TopBar/TopBar'
import { MdAdd } from 'react-icons/md';
import './SubscriptionsPage.scss';

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const { subscriptionName } = useParams();
  const [activeView, setActiveView] = useState('subscriptions');
  const [isAddingSubscription, setIsAddingSubscription] = useState(false);
  const [isEditingSubscription, setIsEditingSubscription] = useState(false);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [formData, setFormData] = useState({});

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
  } = useSubscriptions();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    if (subscriptionName) {
      const subscription = subscriptions.find(sub => sub.name === subscriptionName);
      if (subscription) {
        fetchSubscriptionById(subscription.id);
      }
    }
  }, [subscriptionName, subscriptions, fetchSubscriptionById]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    try {
      const newSubscription = await createSubscription({
        name: formData.name,
        description: formData.description
      });
      setIsAddingSubscription(false);
      setFormData({});
      // Reindirizza alla pagina dei dettagli del nuovo abbonamento
      navigate(`/abbonamenti/${newSubscription.name}`);
    } catch (err) {
      console.error("Errore durante la creazione dell'abbonamento:", err);
    }
  };

  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    try {
      await updateSubscription(selectedSubscription.id, {
        name: formData.name,
        description: formData.description
      });
      setIsEditingSubscription(false);
      setFormData({});
    } catch (err) {
      console.error("Errore durante l'aggiornamento dell'abbonamento:", err);
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo abbonamento?")) {
      try {
        await deleteSubscription(id);
        navigate('/abbonamenti');
      } catch (err) {
        console.error("Errore durante l'eliminazione dell'abbonamento:", err);
        alert(err.message || "Impossibile eliminare l'abbonamento");
      }
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await createSubscriptionPlan(selectedSubscription.id, {
        subscription_id: selectedSubscription.id,
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

  const renderAddSubscriptionCard = () => (
    <div className="add-subscription-card" onClick={() => setIsAddingSubscription(true)}>
      <div className="add-icon">
        <MdAdd size={48} />
      </div>
      <p>Aggiungi abbonamento</p>
    </div>
  );

  const renderSubscriptionForm = () => (
    <div className="new-subscription-card">
      <form onSubmit={handleCreateSubscription}>
        <h3>Nuovo Abbonamento</h3>
        
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
            autoFocus
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
            {isEditingSubscription ? "Aggiorna" : "Salva"}
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

  const renderSubscriptionsList = () => (
    <div className="subscriptions-list">
      <div className="subscription-cards">
        {loading ? (
          <div className="loading">Caricamento in corso...</div>
        ) : error ? (
          <div className="error">Si è verificato un errore: {error}</div>
        ) : (
          <>
            {subscriptions.map(subscription => (
              <div
                key={subscription.id}
                className={`subscription-card ${subscriptionName === subscription.name ? 'selected' : ''}`}
                onClick={() => navigate(`/abbonamenti/${subscription.name}`)}
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
              </div>
            ))}
            
            {/* Carta per aggiungere un nuovo abbonamento */}
            {isAddingSubscription ? renderSubscriptionForm() : renderAddSubscriptionCard()}
          </>
        )}
      </div>
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
              onClick={() => navigate('/abbonamenti')}
            >
              Torna alla lista
            </button>
            </div>
        </div>

        <div className="details-content">
          <div className="subscription-info">
            <h3>Informazioni</h3>
            <p><strong>Nome:</strong> {selectedSubscription.name}</p>
            <p><strong>Descrizione:</strong> {selectedSubscription.description}</p>
          </div>

          <div className="plans-section">
            <h3>Piani</h3>
            {subscriptionPlans.length === 0 ? (
              <p>Nessun piano disponibile.</p>
            ) : (
              <table className="plans-table">
                <thead>
                  <tr>
                    <th>Durata (mesi)</th>
                    <th>Prezzo (€)</th>
                    <th>Sconto (%)</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionPlans.map(plan => (
                    <tr key={plan.id}>
                      <td>{plan.duration_months}</td>
                      <td>{plan.price}</td>
                      <td>{plan.discount}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setFormData({
                              id: plan.id,
                              duration_months: plan.duration_months,
                              price: plan.price,
                              discount: plan.discount,
                            });
                            setIsEditingPlan(true);
                          }}
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

  return (
    <div className="subscriptions-page">
      <TopBar title="Abbonamenti" />
      
      {isEditingSubscription
        ? renderSubscriptionForm()
        : renderSubscriptionsList()}
    </div>
  );
};

export default SubscriptionsPage;