import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MdEdit, MdCheck, MdClose, MdDelete } from 'react-icons/md';
import useSubscriptions from '../../hooks/useSubscriptions';
import './SubscriptionDetailsPage.scss';

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
    const parsedValue = name === 'duration_months' ? parseInt(value) || '' : 
                        name === 'price' || name === 'discount' ? parseFloat(value) || 0 : 
                        value;
    setPlanFormData(prev => ({ ...prev, [name]: parsedValue }));
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
    const updatedPlans = subscriptionPlans.map(plan => {
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
    });
    // Aggiorniamo lo stato locale
    const planIndex = subscriptionPlans.findIndex(p => p.id === planId);
    if (planIndex !== -1) {
      const newSubscriptionPlans = [...subscriptionPlans];
      let parsedValue;
      if (field === 'duration_months') {
        parsedValue = parseInt(value) || '';
      } else if (field === 'price' || field === 'discount') {
        parsedValue = parseFloat(value) || 0;
      } else {
        parsedValue = value;
      }
      newSubscriptionPlans[planIndex] = { ...newSubscriptionPlans[planIndex], [field]: parsedValue };
      // Non aggiorniamo lo stato globale qui, solo la visualizzazione
    }
  };

  const saveInlinePlanEdit = async (planId) => {
    const planToUpdate = subscriptionPlans.find(plan => plan.id === planId);
    if (!planToUpdate) return;

    try {
      await updateSubscriptionPlan(planId, {
        duration_months: planToUpdate.duration_months,
        price: planToUpdate.price,
        discount: planToUpdate.discount || 0
      });
      
      setEditingPlanId(null);
      setEditingPlanField(null);
      
      // Mostra il feedback visivo
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
    // Resetta i valori modificati richiedendo nuovamente i dati
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
            value={planFormData.discount}
            onChange={handlePlanInputChange}
            step="0.01"
            min="0"
            max="100"
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
            <div className="editable-field" onClick={() => setEditingTitleInline(true)}>
              <h1>{selectedSubscription.name}</h1>
              <MdEdit className="edit-icon" />
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
            <div className="editable-field" onClick={() => setEditingDescriptionInline(true)}>
              <p className="description">{selectedSubscription.description || 'Aggiungi una descrizione...'}</p>
              <MdEdit className="edit-icon" />
            </div>
          )}
        </div>
        
        <div className="actions-section">
          <button
            className="btn btn-danger"
            onClick={handleDeleteSubscription}
          >
            Elimina
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
          subscriptionPlans.length > 0 ? (
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
                  {subscriptionPlans.map(plan => (
                    <tr key={plan.id} className={updateFeedback.show && updateFeedback.planId === plan.id ? 'updated-row' : ''}>
                      {deletingPlanId === plan.id ? (
                        <td colSpan="5" className="delete-confirmation">
                          <div className="delete-message">
                            Sei sicuro di voler eliminare il piano di {plan.duration_months} mesi?
                          </div>
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
                                {plan.duration_months}
                                <MdEdit className="edit-icon-small" />
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
                                {plan.price.toFixed(2)}
                                <MdEdit className="edit-icon-small" />
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
                                {(plan.discount || 0).toFixed(2)}
                                <MdEdit className="edit-icon-small" />
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