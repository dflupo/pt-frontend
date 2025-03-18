import React, { useState, useEffect } from 'react';
import useBookings from '../../../hooks/useBookings';
import './UserSchedule.scss';

const UserSchedule = ({ userId }) => {
  // Utilizzo degli hook per la gestione degli schedule
  const {
    userSchedules,
    fetchUserSchedules,
    createUserSchedule,
    updateUserSchedule,
    deleteUserSchedule,
    autoBookUsers,
    loading,
    error,
  } = useBookings();

  // State locale per la form di creazione/modifica
  const [isEditing, setIsEditing] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [formData, setFormData] = useState({
    day_of_week: 'monday',
    start_time: '08:00',
    end_time: '09:00',
    user_id: userId,
    active: true
  });

  // State per controllare se mostrare la modale di conferma eliminazione
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  // Carica gli schedule quando il componente si monta o quando cambia l'userId
  useEffect(() => {
    if (userId) {
      fetchUserSchedules(userId);
    }
  }, [userId, fetchUserSchedules]);

  // Convertire secondi in formato HH:MM
  const secondsToTimeString = (seconds) => {
    if (typeof seconds !== 'number') {
      // Se è già una stringa in formato HH:MM o HH:MM:SS
      if (typeof seconds === 'string' && (seconds.length === 5 || seconds.length === 8)) {
        return seconds.substring(0, 5);
      }
      return '';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Convertire formato HH:MM in secondi
  const timeStringToSeconds = (timeString) => {
    if (!timeString) return 0;
    
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      return hours * 3600 + minutes * 60;
    }
    return 0;
  };

  // Gestisce il cambio dei campi della form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Esegui prenotazione automatica
  const doAutoBooking = async (userId) => {
    try {
      // Prepara i dati per la prenotazione automatica
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 28); // 4 settimane

      const autoBookData = {
        start_date: today.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        users: [parseInt(userId, 10)]
      };

      await autoBookUsers(autoBookData);
      console.log("Prenotazioni automatiche effettuate con successo");
    } catch (err) {
      console.error("Errore durante la prenotazione automatica:", err);
    }
  };

  // Reimposta la form ai valori di default
  const resetForm = () => {
    setFormData({
      day_of_week: 'monday',
      start_time: '08:00',
      end_time: '09:00',
      user_id: userId,
      active: true
    });
    setIsEditing(false);
    setEditingScheduleId(null);
  };

  // Imposta la form per la modifica di uno schedule esistente
  const handleEdit = (schedule) => {
    setFormData({
      day_of_week: schedule.day_of_week,
      start_time: secondsToTimeString(schedule.start_time), 
      end_time: secondsToTimeString(schedule.end_time),
      user_id: userId,
      active: schedule.active !== false && schedule.active !== 0 // Se non è esplicitamente false o 0, lo consideriamo attivo
    });
    setIsEditing(true);
    setEditingScheduleId(schedule.id);
  };

  // Conferma l'eliminazione di uno schedule
  const confirmDelete = (scheduleId) => {
    setScheduleToDelete(scheduleId);
    setShowDeleteConfirm(true);
  };

  // Esegue l'eliminazione effettiva
  const handleDelete = async () => {
    try {
      await deleteUserSchedule(scheduleToDelete);
      setShowDeleteConfirm(false);
      setScheduleToDelete(null);
    } catch (err) {
      console.error("Errore durante l'eliminazione dello schedule:", err);
    }
  };

  // Gestisce l'invio del form (creazione o aggiornamento)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Controlla che l'orario di fine sia dopo l'orario di inizio
    if (formData.start_time >= formData.end_time) {
      alert("L'orario di fine deve essere successivo all'orario di inizio");
      return;
    }

    try {
      // Converti orari da HH:MM a secondi
      const startTimeSeconds = timeStringToSeconds(formData.start_time);
      const endTimeSeconds = timeStringToSeconds(formData.end_time);
      
      if (isEditing && editingScheduleId) {
        // Aggiornamento di uno schedule esistente
        await updateUserSchedule(editingScheduleId, {
          day_of_week: formData.day_of_week,
          start_time: startTimeSeconds,
          end_time: endTimeSeconds,
          active: formData.active ? 1 : 0
        });
      } else {
        // Creazione di un nuovo schedule
        const newSchedule = await createUserSchedule({
          day_of_week: formData.day_of_week,
          start_time: startTimeSeconds,
          end_time: endTimeSeconds,
          user_id: userId,
          active: formData.active ? 1 : 0
        });
        
        // Esegui prenotazione automatica dopo la creazione dello schedule
        if (newSchedule && newSchedule.id) {
          await doAutoBooking(userId);
        }
      }
      resetForm();
      // Ricarica gli schedule aggiornati
      await fetchUserSchedules(userId);
    } catch (err) {
      console.error("Errore durante il salvataggio dello schedule:", err);
    }
  };

  // Traduci il giorno della settimana in italiano
  const getDayName = (day) => {
    const days = {
      monday: 'Lunedì',
      tuesday: 'Martedì',
      wednesday: 'Mercoledì',
      thursday: 'Giovedì',
      friday: 'Venerdì',
      saturday: 'Sabato',
      sunday: 'Domenica'
    };
    return days[day] || day;
  };

  return (
    <div className="schedule-card">
      <h2>Orari Predefiniti</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-indicator">Caricamento orari...</div>
      ) : (
        <>
          {/* Lista degli schedule esistenti */}
          {userSchedules && userSchedules.length > 0 ? (
            <div className="schedule-list">
              {userSchedules.map((schedule) => (
                <div key={schedule.id} className={`schedule-item ${(!schedule.active || schedule.active === 0) ? 'inactive-schedule' : ''}`}>
                  <div className="schedule-details">
                    <div className="schedule-day">{getDayName(schedule.day_of_week)}</div>
                    <div className="schedule-time">
                      {secondsToTimeString(schedule.start_time)} - {secondsToTimeString(schedule.end_time)}
                    </div>
                    {(!schedule.active || schedule.active === 0) && (
                      <div className="schedule-status">Inattivo</div>
                    )}
                  </div>
                  <div className="schedule-actions">
                    <button 
                      type="button" 
                      className="edit-button"
                      onClick={() => handleEdit(schedule)}
                    >
                      Modifica
                    </button>
                    <button 
                      type="button" 
                      className="delete-button"
                      onClick={() => confirmDelete(schedule.id)}
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nessun orario predefinito impostato</div>
          )}

          {/* Pulsante per aggiungere un nuovo schedule */}
          {!isEditing && (
            <button 
              type="button" 
              className="add-schedule-button"
              onClick={() => setIsEditing(true)}
            >
              Aggiungi Orario
            </button>
          )}

          {/* Form per la creazione o modifica di uno schedule */}
          {isEditing && (
            <div className="schedule-form-container">
              <h3>{editingScheduleId ? 'Modifica Orario' : 'Nuovo Orario'}</h3>
              <form onSubmit={handleSubmit} className="schedule-form">
                <div className="form-group">
                  <label htmlFor="day_of_week">Giorno:</label>
                  <select
                    id="day_of_week"
                    name="day_of_week"
                    value={formData.day_of_week}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="monday">Lunedì</option>
                    <option value="tuesday">Martedì</option>
                    <option value="wednesday">Mercoledì</option>
                    <option value="thursday">Giovedì</option>
                    <option value="friday">Venerdì</option>
                    <option value="saturday">Sabato</option>
                    <option value="sunday">Domenica</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="start_time">Orario inizio:</label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_time">Orario fine:</label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label htmlFor="active">Attivo:</label>
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Salva
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={resetForm}
                  >
                    Annulla
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* Modale di conferma eliminazione */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <h4>Conferma Eliminazione</h4>
            <p>Sei sicuro di voler eliminare questo orario predefinito?</p>
            <div className="modal-actions">
              <button
                type="button"
                className="confirm-button"
                onClick={handleDelete}
              >
                Elimina
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSchedule;