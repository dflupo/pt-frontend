import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MdEdit, MdCheck, MdClose, MdDelete } from 'react-icons/md';
import useSubscriptions from '../../hooks/useSubscriptions';
import './SubscriptionDetailsPage.scss';
import TopBar from '../../components/common/TopBar/TopBar';

const SubscriptionDetailsPage = () => {
  const { subscriptionName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isEditing = searchParams.get('edit') === 'true';
  const editPlanId = searchParams.get('editPlan');

  const [formData, setFormData] = useState({});
  const [planFormData, setPlanFormData] = useState({
    duration_months: '',
    price: '',
    discount: 0
  });
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [editingTitleInline, setEditingTitleInline] = useState(false);
  const [editingDescriptionInline, setEditingDescriptionInline] = useState(false);
  const [inlineTitleValue, setInlineTitleValue] = useState('');
  const [inlineDescriptionValue, setInlineDescriptionValue] = useState('');
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingPlanField, setEditingPlanField] = useState(null);
  const [deletingPlanId, setDeletingPlanId] = useState(null);
  const [updateFeedback, setUpdateFeedback] = useState({ planId: null, show: false });
  // Nuovo stato per gestire modifiche inline dei piani
  const [localPlans, setLocalPlans] = useState([]);

  const {
    subscriptions,
    selectedSubscription,
    subscriptionPlans,
    loading,
    error,
    fetchSubscriptions,
    fetchSubscriptionById,
    updateSubscription,
    deleteSubscription,
    fetchSubscriptionPlans,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan
  } = useSubscriptions();

  useEffect(() => {
    fetchSubscriptions().then(data => {
      const subscription = data.find(sub => sub.name === subscriptionName);
      if (subscription) {
        fetchSubscriptionById(subscription.id);
        fetchSubscriptionPlans(subscription.id);
      } else {
        navigate('/abbonamenti', { replace: true });
      }
    });
  }, [fetchSubscriptions, fetchSubscriptionById, fetchSubscriptionPlans, subscriptionName, navigate]);

  // Sincronizza lo stato locale dei piani con quello globale
  useEffect(() => {
    setLocalPlans(subscriptionPlans);
  }, [subscriptionPlans]);

  useEffect(() => {
    if (selectedSubscription) {
      setInlineTitleValue(selectedSubscription.name);
      setInlineDescriptionValue(selectedSubscription.description || '');
      if (isEditing) {
        setFormData({
          name: selectedSubscription.name,
          description: selectedSubscription.description
        });
      }
    }
  }, [selectedSubscription, isEditing]);

  useEffect(() => {
    if (editPlanId && subscriptionPlans.length > 0) {
      const planToEdit = subscriptionPlans.find(plan => plan.id === parseInt(editPlanId));
      if (planToEdit) {
        setPlanFormData({
          id: planToEdit.id,
          duration_months: planToEdit.duration_months,
          price: planToEdit.price,
          discount: planToEdit.discount || 0
        });
      }
    }
  }, [editPlanId, subscriptionPlans]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue;
    if (name === 'duration_months') {
      parsedValue = parseInt(value) || '';
    } else if (name === 'price') {
      parsedValue = parseFloat(value) || 0;
    } else if (name === 'discount') {
      parsedValue = parseFloat(value) || 0;
    } else {
      parsedValue = value;
    }
    setPlanFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  // Specifico onFocus per lo sconto: se il valore è 0 lo svuoto
  const handleDiscountFocus = (e) => {
    if (e.target.value === "0" || e.target.value === "0.00") {
      setPlanFormData(prev => ({ ...prev, discount: '' }));
    }
  };

  const handleInlineTitleChange = (e) => {
    setInlineTitleValue(e.target.value);
  };

  const handleInlineDescriptionChange = (e) => {
    setInlineDescriptionValue(e.target.value);
  };

  const saveInlineTitle = async () => {
    if (!selectedSubscription || !inlineTitleValue.trim()) return;

    try {
      await updateSubscription(selectedSubscription.id, {
        name: inlineTitleValue,
        description: selectedSubscription.description
      });
      setEditingTitleInline(false);
      navigate(`/abbonamenti/${inlineTitleValue}`, { replace: true });
      fetchSubscriptionById(selectedSubscription.id);
    } catch (err) {
      console.error("Errore durante l'aggiornamento del titolo:", err);
    }
  };

  const saveInlineDescription = async () => {
    if (!selectedSubscription) return;

    try {
      await updateSubscription(selectedSubscription.id, {
        name: selectedSubscription.name,
        description: inlineDescriptionValue
      });
      setEditingDescriptionInline(false);
      fetchSubscriptionById(selectedSubscription.id);
    } catch (err) {
      console.error("Errore durante l'aggiornamento della descrizione:", err);
    }
  };

  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    if (!selectedSubscription) return;

    try {
      await updateSubscription(selectedSubscription.id, {
        name: formData.name,
        description: formData.description
      });
      
      navigate(`/abbonamenti/${formData.name}`, { replace: true });
    } catch (err) {
      console.error("Errore durante l'aggiornamento dell'abbonamento:", err);
    }
  };

  const handleDeleteSubscription = async () => {
    if (!selectedSubscription) return;

    if (window.confirm("Sei sicuro di voler eliminare questo abbonamento?")) {
      try {
        await deleteSubscription(selectedSubscription.id);
        navigate('/abbonamenti', { replace: true });
      } catch (err) {
        console.error("Errore durante l'eliminazione dell'abbonamento:", err);
        alert(err.message || "Impossibile eliminare l'abbonamento");
      }
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!selectedSubscription) return;

    try {
      await createSubscriptionPlan(selectedSubscription.id, {
        subscription_id: selectedSubscription.id,
        duration_months: planFormData.duration_months,
        price: planFormData.price,
        discount: planFormData.discount
      });
      setIsAddingPlan(false);
      setPlanFormData({
        duration_months: '',
        price: '',
        discount: 0
      });
      fetchSubscriptionPlans(selectedSubscription.id);
    } catch (err) {
      console.error("Errore durante la creazione del piano:", err);
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    if (!planFormData.id) return;

    try {
      await updateSubscriptionPlan(planFormData.id, {
        duration_months: planFormData.duration_months,
        price: planFormData.price,
        discount: planFormData.discount
      });
      
      navigate(`/abbonamenti/${subscriptionName}`, { replace: true });
      setPlanFormData({
        duration_months: '',
        price: '',
        discount: 0
      });
      if (selectedSubscription) {
        fetchSubscriptionPlans(selectedSubscription.id);
      }
    } catch (err) {
      console.error("Errore durante l'aggiornamento del piano:", err);
    }
  };

  const handleInlinePlanEdit = (planId, field) => {
    setEditingPlanId(planId);
    setEditingPlanField(field);
  };

  const handleInlinePlanChange = (e, planId, field) => {
    const value = e.target.value;
    setLocalPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        let parsedValue;
        if (field === 'duration_months') {
          parsedValue = parseInt(value) || '';
        } else if (field === 'price' || field === 'discount') {
          parsedValue = parseFloat(value) || 0;
        } else {
          parsedValue = value;
        }
        return { ...plan, [field]: parsedValue };
      }
      return plan;
    }));
  };

  const saveInlinePlanEdit = async (planId) => {
    const planToUpdate = localPlans.find(plan => plan.id === planId);
    if (!planToUpdate) return;

    try {
      await updateSubscriptionPlan(planId, {
        duration_months: planToUpdate.duration_months,
        price: planToUpdate.price,
        discount: planToUpdate.discount || 0
      });
      
      setEditingPlanId(null);
      setEditingPlanField(null);
      
      // Feedback visivo
      setUpdateFeedback({ planId, show: true });
      setTimeout(() => setUpdateFeedback({ planId: null, show: false }), 2000);
      
      if (selectedSubscription) {
        fetchSubscriptionPlans(selectedSubscription.id);
      }
    } catch (err) {
      console.error("Errore durante l'aggiornamento del piano:", err);
    }
  };

  const cancelInlinePlanEdit = () => {
    setEditingPlanId(null);
    setEditingPlanField(null);
    if (selectedSubscription) {
      fetchSubscriptionPlans(selectedSubscription.id);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (deletingPlanId === planId) {
      try {
        await deleteSubscriptionPlan(planId);
        setDeletingPlanId(null);
        if (selectedSubscription) {
          fetchSubscriptionPlans(selectedSubscription.id);
        }
      } catch (err) {
        console.error("Errore durante l'eliminazione del piano:", err);
        alert(err.message || "Impossibile eliminare il piano");
      }
    } else {
      setDeletingPlanId(planId);
    }
  };

  const cancelDeletePlan = () => {
    setDeletingPlanId(null);
  };

  if (loading) {
    return <div className="loading-container">Caricamento in corso...</div>;
  }

  if (error) {
    return <div className="error-container">Errore: {error}</div>;
  }

  if (!selectedSubscription) {
    return <div className="not-found-container">Abbonamento non trovato</div>;
  }

  // Calcolo in tempo reale del prezzo finale per il piano
  const finalPrice = planFormData.price
    ? (planFormData.price * (1 - ((parseFloat(planFormData.discount) || 0) / 100))).toFixed(2)
    : '0.00';

  const renderSubscriptionEditForm = () => (
    <div className="subscription-edit-form">
      <h2>Modifica Abbonamento</h2>
      <form onSubmit={handleUpdateSubscription}>
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Inserisci nome abbonamento"
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
            placeholder="Inserisci descrizione"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Aggiorna</button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(`/abbonamenti/${subscriptionName}`)}
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );

  const renderPlanForm = () => (
    <div className="plan-form">
      <h3>{editPlanId ? 'Modifica Piano' : 'Nuovo Piano'}</h3>
      <form onSubmit={editPlanId ? handleUpdatePlan : handleCreatePlan}>
        <div className="form-group">
          <label htmlFor="duration_months">Durata (mesi)</label>
          <input
            type="number"
            id="duration_months"
            name="duration_months"
            placeholder="Inserisci durata (mesi)"
            value={planFormData.duration_months}
            onChange={handlePlanInputChange}
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Prezzo (€)</label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Inserisci prezzo (€)"
            value={planFormData.price}
            onChange={handlePlanInputChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="discount">Sconto (%)</label>
          <input
            type="number"
            id="discount"
            name="discount"
            placeholder="Inserisci sconto (%)"
            value={planFormData.discount}
            onFocus={handleDiscountFocus}
            onChange={handlePlanInputChange}
            step="0.01"
            min="0"
            max="100"
          />
        </div>
        
        {/* Campo prezzo finale in tempo reale */}
        <div className="form-group">
          <label htmlFor="final_price">Prezzo Finale (€)</label>
          <input
            type="text"
            id="final_price"
            name="final_price"
            value={finalPrice}
            readOnly
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editPlanId ? 'Aggiorna' : 'Crea'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (editPlanId) {
                navigate(`/abbonamenti/${subscriptionName}`);
              } else {
                setIsAddingPlan(false);
              }
              setPlanFormData({
                duration_months: '',
                price: '',
                discount: 0
              });
            }}
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );

  const renderSubscriptionDetails = () => (
    <div className="subscription-details">
        <TopBar title={"Dettagli Abbonamento"}/>
      <div className="details-header">
        <div className="title-section">
          {editingTitleInline ? (
            <div className="inline-edit-container">
              <input
                type="text"
                value={inlineTitleValue}
                onChange={handleInlineTitleChange}
                className="inline-edit-input"
              />
              <div className="inline-edit-actions">
                <button className="inline-action-btn success" onClick={saveInlineTitle}>
                  <MdCheck />
                </button>
                <button className="inline-action-btn danger" onClick={() => setEditingTitleInline(false)}>
                  <MdClose />
                </button>
              </div>
            </div>
          ) : (
            <div className="editable-field">
                <h1 onClick={() => setEditingTitleInline(true)}>
                    {selectedSubscription.name} 
                    <span><MdEdit className="edit-icon" onClick={() => setEditingTitleInline(true)} /></span>
                </h1>
            </div>
          )}
          
          {editingDescriptionInline ? (
            <div className="inline-edit-container">
              <textarea
                value={inlineDescriptionValue}
                onChange={handleInlineDescriptionChange}
                className="inline-edit-textarea"
                rows="3"
              />
              <div className="inline-edit-actions">
                <button className="inline-action-btn success" onClick={saveInlineDescription}>
                  <MdCheck />
                </button>
                <button className="inline-action-btn danger" onClick={() => setEditingDescriptionInline(false)}>
                  <MdClose />
                </button>
              </div>
            </div>
          ) : (
            <div className="editable-field">
              <p className="description" onClick={() => setEditingDescriptionInline(true)}>
                {selectedSubscription.description || 'Aggiungi una descrizione...'}
                <MdEdit className="edit-icon" onClick={() => setEditingDescriptionInline(true)} />
              </p>
            </div>
          )}
        </div>
        
        <div className="actions-section">
          <button
            className="btn btn-danger"
            onClick={handleDeleteSubscription}
          >
            Elimina Abbonamento
          </button>
        </div>
      </div>
      
      <div className="plans-section">
        <div className="plans-header">
          <h2>Piani</h2>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddingPlan(true)}
            disabled={isAddingPlan || editPlanId}
          >
            Aggiungi Piano
          </button>
        </div>
        
        {isAddingPlan && renderPlanForm()}
        {editPlanId && renderPlanForm()}
        
        {!isAddingPlan && !editPlanId && (
          localPlans.length > 0 ? (
            <div className="plans-table-container">
              <table className="plans-table">
                <thead>
                  <tr>
                    <th>Durata (mesi)</th>
                    <th>Prezzo (€)</th>
                    <th>Sconto (%)</th>
                    <th>Prezzo Finale (€)</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {localPlans.map(plan => (
                    <tr key={plan.id} className={updateFeedback.show && updateFeedback.planId === plan.id ? 'updated-row' : ''}>
                      {deletingPlanId === plan.id ? (
                        <td colSpan="5" className="delete-confirmation">
                          <span>Sei sicuro di voler eliminare il piano di {plan.duration_months} mesi?</span>
                          <div className="delete-actions">
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeletePlan(plan.id)}>
                              Elimina
                            </button>
                            <button className="btn btn-sm btn-secondary" onClick={cancelDeletePlan}>
                              Annulla
                            </button>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td>
                            {editingPlanId === plan.id && editingPlanField === 'duration_months' ? (
                              <div className="inline-edit-field">
                                <input
                                  type="number"
                                  value={plan.duration_months}
                                  onChange={(e) => handleInlinePlanChange(e, plan.id, 'duration_months')}
                                  min="1"
                                  className="inline-edit-input"
                                />
                                <div className="inline-edit-actions">
                                  <button className="inline-action-btn success" onClick={() => saveInlinePlanEdit(plan.id)}>
                                    <MdCheck />
                                  </button>
                                  <button className="inline-action-btn danger" onClick={cancelInlinePlanEdit}>
                                    <MdClose />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="editable-cell" onClick={() => handleInlinePlanEdit(plan.id, 'duration_months')}>
                                <div className="inner">
                                    <span className='value'>{plan.duration_months}</span>
                                    <span className='icon'><MdEdit className="edit-icon-small" /></span>
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            {editingPlanId === plan.id && editingPlanField === 'price' ? (
                              <div className="inline-edit-field">
                                <input
                                  type="number"
                                  value={plan.price}
                                  onChange={(e) => handleInlinePlanChange(e, plan.id, 'price')}
                                  step="0.01"
                                  min="0"
                                  className="inline-edit-input"
                                />
                                <div className="inline-edit-actions">
                                  <button className="inline-action-btn success" onClick={() => saveInlinePlanEdit(plan.id)}>
                                    <MdCheck />
                                  </button>
                                  <button className="inline-action-btn danger" onClick={cancelInlinePlanEdit}>
                                    <MdClose />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="editable-cell" onClick={() => handleInlinePlanEdit(plan.id, 'price')}>
                                <div className="inner">
                                    <span className='value'>{plan.price.toFixed(2)}</span>
                                    <span className='icon'><MdEdit className="edit-icon-small" /></span>
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            {editingPlanId === plan.id && editingPlanField === 'discount' ? (
                              <div className="inline-edit-field">
                                <input
                                  type="number"
                                  value={plan.discount || 0}
                                  onChange={(e) => handleInlinePlanChange(e, plan.id, 'discount')}
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  className="inline-edit-input"
                                />
                                <div className="inline-edit-actions">
                                  <button className="inline-action-btn success" onClick={() => saveInlinePlanEdit(plan.id)}>
                                    <MdCheck />
                                  </button>
                                  <button className="inline-action-btn danger" onClick={cancelInlinePlanEdit}>
                                    <MdClose />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="editable-cell" onClick={() => handleInlinePlanEdit(plan.id, 'discount')}>
                                <div className="inner">
                                    <span className='value'>{(plan.discount || 0).toFixed(2)}</span>
                                    <span className='icon'><MdEdit className="edit-icon-small" /></span>
                                </div>
                              </div>
                            )}
                          </td>
                          <td>{(plan.price * (1 - (plan.discount || 0) / 100)).toFixed(2)}</td>
                          <td className="actions-cell">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeletePlan(plan.id)}
                            >
                              <MdDelete />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-plans">
              <p>Nessun piano disponibile per questo abbonamento.</p>
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="subscription-details-page">
      {isEditing ? renderSubscriptionEditForm() : renderSubscriptionDetails()}
    </div>
  );
};

export default SubscriptionDetailsPage;
