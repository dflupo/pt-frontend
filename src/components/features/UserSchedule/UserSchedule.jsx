import React, { useState, useEffect } from 'react';
import useBookings from '../../../hooks/useBookings';
import { MdEdit, MdDelete, MdAccessTime, MdDateRange, MdAddCircle } from 'react-icons/md';
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
    day: 'MONDAY',
    start_time: '08:00',
    end_time: '09:00',
    user_id: userId,
    active: true
  });

  // State per controllare se mostrare la conferma eliminazione
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
    
    // Speciale gestione per l'orario di inizio che aggiorna automaticamente anche l'orario di fine
    if (name === 'start_time') {
      // Calcola orario di fine = orario di inizio + 1 ora
      const startHour = parseInt(value.split(':')[0], 10);
      const startMinutes = value.split(':')[1];
      const endHour = (startHour + 1) % 24; // Gestisce il caso in cui l'ora di inizio è 23
      const endTime = `${endHour.toString().padStart(2, '0')}:${startMinutes}`;
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        end_time: endTime
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
      day: 'MONDAY',
      start_time: '08:00',
      end_time: '09:00',
      user_id: userId,
      active: true
    });
    setIsEditing(false);
    setEditingScheduleId(null);
    setShowDeleteConfirm(false);
    setScheduleToDelete(null);
  };

  // Imposta la form per la modifica di uno schedule esistente
  const handleEdit = (schedule) => {
    setFormData({
      day: schedule.day.toUpperCase(),
      start_time: secondsToTimeString(schedule.start_time), 
      end_time: secondsToTimeString(schedule.end_time),
      user_id: userId,
      active: schedule.active !== false && schedule.active !== 0
    });
    setIsEditing(true);
    setEditingScheduleId(schedule.id);
    setShowDeleteConfirm(false);
  };

  // Prepara la conferma dell'eliminazione di uno schedule
  const confirmDelete = (scheduleId) => {
    setScheduleToDelete(scheduleId);
    setShowDeleteConfirm(true);
    setIsEditing(false);
  };

  // Esegue l'eliminazione effettiva
  const handleDelete = async () => {
    try {
      await deleteUserSchedule(scheduleToDelete);
      setShowDeleteConfirm(false);
      setScheduleToDelete(null);
      // Ricarica gli schedule aggiornati
      await fetchUserSchedules(userId);
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
      
      const scheduleData = {
        user_id: parseInt(userId),
        day: formData.day,
        start_time: startTimeSeconds,
        end_time: endTimeSeconds,
        active: formData.active ? 1 : 0
      };
      
      if (isEditing && editingScheduleId) {
        // Aggiornamento di uno schedule esistente
        await updateUserSchedule(editingScheduleId, scheduleData);
      } else {
        // Creazione di un nuovo schedule
        const newSchedule = await createUserSchedule(scheduleData);
        
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
      MONDAY: 'Lunedì',
      TUESDAY: 'Martedì',
      WEDNESDAY: 'Mercoledì',
      THURSDAY: 'Giovedì',
      FRIDAY: 'Venerdì',
      SATURDAY: 'Sabato',
      SUNDAY: 'Domenica'
    };
    // Assicuriamoci che il giorno sia in maiuscolo prima di cercarlo nel dizionario
    const upperDay = day ? day.toUpperCase() : '';
    return days[upperDay] || upperDay;
  };

  // Renderizza il pannello laterale (form o conferma eliminazione)
  const renderSidePanel = () => {
    const sidePanelClassName = "side-panel " + (showDeleteConfirm ? "delete-confirm-panel" : "schedule-form-container");
    
    return (
      <div className={sidePanelClassName}>
        {showDeleteConfirm ? (
          <>
            <h3>Conferma Eliminazione <MdDelete className="header-icon delete-icon" /></h3>
            <p className="delete-confirmation-text">Sei sicuro di voler eliminare questo orario predefinito?</p>
            <div className="form-actions">
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
          </>
        ) : (
          <>
            <h3>{editingScheduleId ? 'Modifica Orario' : 'Aggiungi turno'} {editingScheduleId ? <MdEdit className="header-icon" /> : <MdAddCircle className="header-icon" />}</h3>
            <form onSubmit={handleSubmit} className="schedule-form">
              <div className="form-group">
                <label htmlFor="day">Giorno:</label>
                <select
                  id="day"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  required
                >
                  <option value="MONDAY">Lunedì</option>
                  <option value="TUESDAY">Martedì</option>
                  <option value="WEDNESDAY">Mercoledì</option>
                  <option value="THURSDAY">Giovedì</option>
                  <option value="FRIDAY">Venerdì</option>
                  <option value="SATURDAY">Sabato</option>
                  <option value="SUNDAY">Domenica</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_time">Dalle:</label>
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
                  <label htmlFor="end_time">Alle:</label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                  {editingScheduleId ? 'Salva' : 'Aggiungi'}
                </button>
                {editingScheduleId && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={resetForm}
                  >
                    Annulla
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="schedule-card">
      <h2>Orari Predefiniti</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-indicator">Caricamento orari...</div>
      ) : (
        <div className="schedule-layout">
          <div className="schedule-content">
            {/* Lista degli schedule esistenti */}
            {userSchedules && userSchedules.length > 0 ? (
              <div className="schedule-list">
                {userSchedules.map((schedule) => (
                  <div 
                    key={schedule.id} 
                    className={`schedule-item ${(!schedule.active || schedule.active === 0) ? 'inactive-schedule' : ''} ${editingScheduleId === schedule.id ? 'active-schedule' : ''}`}
                  >
                    <div className="schedule-details">
                      <div className="schedule-day"><MdDateRange className="icon" /> {getDayName(schedule.day)}</div>
                      <div className="schedule-time">
                        <MdAccessTime className="icon" /> {secondsToTimeString(schedule.start_time)} - {secondsToTimeString(schedule.end_time)}
                        {(!schedule.active || schedule.active === 0) && (
                          <span className="schedule-status"> (Inattivo)</span>
                        )}
                      </div>
                    </div>
                    <div className="schedule-actions">
                      <button 
                        type="button" 
                        className="icon-button edit-button"
                        onClick={() => handleEdit(schedule)}
                        aria-label="Modifica"
                        title="Modifica"
                      >
                        <MdEdit />
                      </button>
                      <button 
                        type="button" 
                        className="icon-button delete-button"
                        onClick={() => confirmDelete(schedule.id)}
                        aria-label="Elimina"
                        title="Elimina"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Nessun orario predefinito impostato</div>
            )}
          </div>
          
          {/* Pannello laterale (form o conferma eliminazione) */}
          {renderSidePanel()}
        </div>
      )}
    </div>
  );
};

export default UserSchedule;