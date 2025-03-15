import React, { useState, useEffect } from 'react';
import useBookings from '../../hooks/useBookings';
import './ManageBookings.scss';

export default function ManageBookings() {
  // Stati locali
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Utilizza il nostro hook personalizzato
  const {
    slots,
    userBookings,
    loading,
    error,
    fetchSlots,
    createBooking,
    deleteBooking
  } = useBookings();

  // Genera i giorni della settimana corrente
  useEffect(() => {
    const days = [];
    const day = new Date(currentWeek);
    day.setDate(day.getDate() - day.getDay() + 1); // Inizia da lunedì

    for (let i = 0; i < 7; i++) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    
    setWeekDays(days);
  }, [currentWeek]);

  // Carica gli slot quando cambia la settimana
  useEffect(() => {
    if (weekDays.length > 0) {
      const startDate = weekDays[0].toISOString().split('T')[0];
      const endDate = weekDays[6].toISOString().split('T')[0];
      
      fetchSlots({ start_date: startDate, end_date: endDate });
    }
  }, [weekDays, fetchSlots]);

  // Funzione per navigare alla settimana precedente
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  // Funzione per navigare alla settimana successiva
  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  // Funzione per prenotare uno slot
  const bookSlot = async (slotId, userId) => {
    try {
      await createBooking({ slot_id: slotId, user_id: userId });
      // Ricarica gli slot per aggiornare lo stato
      const startDate = weekDays[0].toISOString().split('T')[0];
      const endDate = weekDays[6].toISOString().split('T')[0];
      await fetchSlots({ start_date: startDate, end_date: endDate });
    } catch (error) {
      console.error("Errore durante la prenotazione:", error);
    }
  };

  // Funzione per cancellare una prenotazione
  const cancelBooking = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      // Ricarica gli slot per aggiornare lo stato
      const startDate = weekDays[0].toISOString().split('T')[0];
      const endDate = weekDays[6].toISOString().split('T')[0];
      await fetchSlots({ start_date: startDate, end_date: endDate });
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };

  // Funzione per ottenere le ore del giorno (statiche per semplicità)
  const getTimeSlots = () => {
    return [
      { start: '07:00', end: '08:00' },
      { start: '08:00', end: '09:00' },
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
      { start: '17:00', end: '18:00' },
      { start: '18:00', end: '19:00' },
      { start: '20:00', end: '21:00' }
    ];
  };

  // Funzione per ottenere la classe dello slot in base alla disponibilità
  const getSlotClass = (date, time, slots) => {
    const dateStr = date.toISOString().split('T')[0];
    const slot = slots.find(s => 
      s.date === dateStr && 
      s.start_time?.substring(0, 5) === time.start && 
      s.end_time?.substring(0, 5) === time.end
    );
    
    if (!slot) return 'slot-management__slot slot-management__slot--gray';
    
    const bookingRatio = (slot.booked_count || 0) / slot.max_capacity;
    
    if (bookingRatio >= 0.8) return 'slot-management__slot slot-management__slot--red';
    if (bookingRatio >= 0.5) return 'slot-management__slot slot-management__slot--yellow';
    return 'slot-management__slot slot-management__slot--green';
  };

  // Trova gli slot per una data e ora specifiche
  const findSlot = (date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    return slots.find(s => 
      s.date === dateStr && 
      s.start_time?.substring(0, 5) === time.start && 
      s.end_time?.substring(0, 5) === time.end
    );
  };

  // Formatta la data nel formato "Lun 1 Marzo"
  const formatDayHeader = (date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Componente per visualizzare uno slot
  const SlotCell = ({ date, time }) => {
    const slot = findSlot(date, time);
    const slotClass = getSlotClass(date, time, slots);
    
    if (!slot) return (
      <div className={slotClass}>
        -
      </div>
    );
    
    return (
      <div 
        className={slotClass}
        onClick={() => setSelectedSlot(slot)}
      >
        <span>{time.start} - {time.end}</span>
        <span className="slot-management__slot-capacity">{`${slot.booked_count || 0}/${slot.max_capacity || 0}`}</span>
      </div>
    );
  };

  // Modal per visualizzare i dettagli dello slot
  const SlotDetailModal = ({ slot, onClose }) => {
    if (!slot) return null;
    
    return (
      <div className="slot-management__modal">
        <div className="slot-management__modal-content">
          <h3 className="slot-management__modal-header">{`${slot.date} ${slot.start_time?.substring(0, 5)} - ${slot.end_time?.substring(0, 5)}`}</h3>
          <p>Prenotazioni: {slot.booked_count || 0}/{slot.max_capacity}</p>
          
          <div className="slot-management__modal-users">
            <h4>Prenotati:</h4>
            {slot.bookings && slot.bookings.length > 0 ? (
              <ul>
                {slot.bookings.map(booking => (
                  <li key={booking.id}>
                    <span>{booking.user_name || `Utente #${booking.user_id}`}</span>
                    <button 
                      onClick={() => cancelBooking(booking.id)}
                      className="slot-management__button--red"
                    >
                      Annulla
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nessuna prenotazione</p>
            )}
          </div>
          
          <div className="slot-management__modal-actions">
            <button 
              className="slot-management__button slot-management__button--green"
              onClick={() => bookSlot(slot.id, 1)} // Usa un ID utente fisso per semplicità
            >
              Prenota
            </button>
            <button 
              className="slot-management__button slot-management__button--gray"
              onClick={onClose}
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente principale
  return (
    <div className="slot-management">
      <div className="slot-management__header">
        <h1>Gestione Sala</h1>
        <div className="slot-management__header-buttons">
          <button 
            className="slot-management__button"
            onClick={goToPreviousWeek}
          >
            &lt; Settimana Precedente
          </button>
          <button 
            className="slot-management__button"
            onClick={goToNextWeek}
          >
            Settimana Successiva &gt;
          </button>
        </div>
      </div>

      {/* Featured Slot Cards - Two examples like in the mockup */}
      <div className="slot-management__featured">
        <div className="slot-management__card">
          <h3 className="slot-management__card-header">Lunedì 1 Marzo<br />10:00 - 11:00</h3>
          <div className="slot-management__card-content">
            <div className="slot-management__card-users">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="slot-management__card-user">
                  <div className="slot-management__card-user-avatar">
                    <span>👤</span>
                  </div>
                  <span>Domenico Lupo</span>
                </div>
              ))}
            </div>
            <div className="slot-management__card-stats">
              <span>3/6</span>
            </div>
          </div>
        </div>
        
        <div className="slot-management__card">
          <h3 className="slot-management__card-header">Lunedì 1 Marzo<br />10:00 - 11:00</h3>
          <div className="slot-management__card-content">
            <div className="slot-management__card-users">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="slot-management__card-user">
                  <div className="slot-management__card-user-avatar">
                    <span>👤</span>
                  </div>
                  <span>Domenico Lupo</span>
                </div>
              ))}
            </div>
            <div className="slot-management__card-stats">
              <span>3/6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendary Weekly View */}
      <div className="slot-management__calendar">
        <table>
          <thead>
            <tr>
              <th style={{ width: '80px' }}></th>
              {weekDays.map((day, i) => (
                <th key={i}>
                  {formatDayHeader(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getTimeSlots().map((time, timeIndex) => (
              <tr key={timeIndex}>
                <td>
                  {time.start} - {time.end}
                </td>
                {weekDays.map((day, dayIndex) => (
                  <td key={dayIndex}>
                    <SlotCell date={day} time={time} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal per i dettagli dello slot */}
      {selectedSlot && (
        <SlotDetailModal 
          slot={selectedSlot} 
          onClose={() => setSelectedSlot(null)} 
        />
      )}

      {/* Loader e messaggi di errore */}
      {loading && (
        <div className="slot-management__loader">
          <div className="slot-management__loader-content">Caricamento in corso...</div>
        </div>
      )}
      
      {error && (
        <div className="slot-management__error">
          {error}
        </div>
      )}
    </div>
  );
};
