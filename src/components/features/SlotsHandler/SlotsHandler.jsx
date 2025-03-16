import './SlotsHandler.scss';
import { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function SlotsHandler({
  currentWeekStart,
  currentWeekEnd,
  goToPreviousWeek,
  goToNextWeek,
  slots,
  loading,
  error,
  onSlotSelect,
  selectedSlots
}) {
  const [viewMode, setViewMode] = useState('week'); // 'week' o 'month'
  const [weeklySlots, setWeeklySlots] = useState([]);
  
  // Funzione per formattare la data per la visualizzazione del titolo della settimana
  function formatWeekTitle(startDate, endDate) {
    const startMonth = startDate.toLocaleDateString('it-IT', { month: 'long' });
    const endMonth = endDate.toLocaleDateString('it-IT', { month: 'long' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    
    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    }
  }
  
  // Funzione per formattare il titolo del giorno della settimana
  function formatWeekdayTitle(date) {
    const day = date.getDate();
    const weekday = date.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase();
    return `${weekday} ${day}`;
  }
  
  // Organizzazione degli slot per giorno della settimana
  useEffect(() => {
    if (slots && slots.length > 0) {
      // Ottieni i giorni della settimana
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeekStart);
        day.setDate(day.getDate() + i);
        weekDays.push({
          date: day,
          formattedTitle: formatWeekdayTitle(day),
          dayString: day.toISOString().split('T')[0], // Formato YYYY-MM-DD
          slots: []
        });
      }
      
      // Assegna gli slot ai giorni della settimana
      slots.forEach(slot => {
        const slotDate = slot.slot_date || new Date(slot.start_time_obj).toISOString().split('T')[0];
        
        // Trova l'indice del giorno
        const dayIndex = weekDays.findIndex(day => day.dayString === slotDate);
        
        if (dayIndex >= 0) {
          weekDays[dayIndex].slots.push(slot);
        }
      });
      
      // Ordina gli slot per ogni giorno in base all'ora di inizio
      weekDays.forEach(day => {
        day.slots.sort((a, b) => {
          const timeA = a.start_time;
          const timeB = b.start_time;
          return timeA.localeCompare(timeB);
        });
      });
      
      setWeeklySlots(weekDays);
    } else {
      // Se non ci sono slot, inizializza comunque i giorni della settimana
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeekStart);
        day.setDate(day.getDate() + i);
        weekDays.push({
          date: day,
          formattedTitle: formatWeekdayTitle(day),
          dayString: day.toISOString().split('T')[0],
          slots: []
        });
      }
      setWeeklySlots(weekDays);
    }
  }, [slots, currentWeekStart]);
  
  // Verifica se uno slot è selezionato
  const isSlotSelected = (slotId) => {
    return selectedSlots[0]?.id === slotId || selectedSlots[1]?.id === slotId;
  };
  
  return (
    <div className="slots-handler">
      <div className="control-bar">
        
        <div className="week-selector">
          <button 
            className="nav-button" 
            onClick={goToPreviousWeek}
            aria-label="Settimana precedente"
          >
            <span className="chevron">
                <MdChevronLeft />
            </span>
          </button>
          <div className="week-title">
            {formatWeekTitle(currentWeekStart, currentWeekEnd)}
          </div>
          <button 
            className="nav-button" 
            onClick={goToNextWeek}
            aria-label="Settimana successiva"
          >
            <span className="chevron">
                <MdChevronRight />
            </span>
          </button>
        </div>
        
        <div className="actions">
          {/* Eventuali azioni aggiuntive possono essere aggiunte qui */}
        </div>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Caricamento slot in corso...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="weekdays-deck">
          {weeklySlots.map((weekday, index) => (
            <div id={`w${index + 1}`} key={index} className="weekday">
              <div className="weekday-title">{weekday.formattedTitle}</div>
              <div className="slots-deck">
                {weekday.slots.length > 0 ? (
                  weekday.slots.map(slot => (
                    <div 
                      key={slot.id} 
                      className={`slot ${slot.booked_count >= slot.max_capacity ? 'full' : ''} ${isSlotSelected(slot.id) ? 'selected' : ''}`}
                      onClick={() => onSlotSelect(slot)}
                    >
                      <span className="time">{slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                      <span className="capacity">{slot.booked_count}/{slot.max_capacity}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-slots"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}