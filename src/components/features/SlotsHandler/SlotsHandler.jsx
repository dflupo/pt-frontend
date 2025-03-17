import './SlotsHandler.scss';
import { useState, useEffect, useRef } from 'react';
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
  const [weeklySlots, setWeeklySlots] = useState([]);
  const [isChangingWeek, setIsChangingWeek] = useState(false);
  const [direction, setDirection] = useState(null); // 'prev' o 'next' per animazione
  const weekTitleRef = useRef(null);
  const weekdaysRef = useRef(null);
  
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
  
  // Cambio settimana precedente con transizione migliorata
  const handlePrevWeek = () => {
    if (loading || isChangingWeek) return;
    
    setDirection('prev');
    setIsChangingWeek(true);
    
    // Avvia transizione del titolo
    if (weekTitleRef.current) {
      weekTitleRef.current.classList.add('changing', 'slide-right');
    }
    
    // Prepara la transizione del contenuto impostando opacità
    if (weekdaysRef.current) {
      weekdaysRef.current.classList.add('transitioning', 'slide-right');
    }
    
    // Esegui il cambio di settimana dopo una breve pausa per mostrare l'animazione di uscita
    setTimeout(() => {
      goToPreviousWeek();
      
      // Ripristina le classi dopo la transizione completata
      setTimeout(() => {
        if (weekTitleRef.current) {
          weekTitleRef.current.classList.remove('changing', 'slide-right');
        }
        
        if (weekdaysRef.current) {
          weekdaysRef.current.classList.remove('transitioning', 'slide-right');
          
          // Aggiungi e rimuovi classe per animazione di entrata
          weekdaysRef.current.classList.add('entering');
          setTimeout(() => {
            weekdaysRef.current.classList.remove('entering');
          }, 300);
        }
        
        setIsChangingWeek(false);
      }, 300);
    }, 250); // Bilanciato per evitare flash durante la transizione
  };
  
  // Cambio settimana successiva con transizione migliorata
  const handleNextWeek = () => {
    if (loading || isChangingWeek) return;
    
    setDirection('next');
    setIsChangingWeek(true);
    
    // Avvia transizione del titolo
    if (weekTitleRef.current) {
      weekTitleRef.current.classList.add('changing', 'slide-left');
    }
    
    // Prepara la transizione del contenuto impostando opacità
    if (weekdaysRef.current) {
      weekdaysRef.current.classList.add('transitioning', 'slide-left');
    }
    
    // Esegui il cambio di settimana dopo una breve pausa per mostrare l'animazione di uscita
    setTimeout(() => {
      goToNextWeek();
      
      // Ripristina le classi dopo la transizione completata
      setTimeout(() => {
        if (weekTitleRef.current) {
          weekTitleRef.current.classList.remove('changing', 'slide-left');
        }
        
        if (weekdaysRef.current) {
          weekdaysRef.current.classList.remove('transitioning', 'slide-left');
          
          // Aggiungi e rimuovi classe per animazione di entrata
          weekdaysRef.current.classList.add('entering');
          setTimeout(() => {
            weekdaysRef.current.classList.remove('entering');
          }, 300);
        }
        
        setIsChangingWeek(false);
      }, 300);
    }, 250); // Bilanciato per evitare flash durante la transizione
  };
  
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
            onClick={handlePrevWeek}
            aria-label="Settimana precedente"
            disabled={loading || isChangingWeek}
          >
            <span className="chevron">
                <MdChevronLeft />
            </span>
          </button>
          <div 
            ref={weekTitleRef} 
            className={`week-title ${isChangingWeek ? 'changing' : ''}`}
          >
            {formatWeekTitle(currentWeekStart, currentWeekEnd)}
          </div>
          <button 
            className="nav-button" 
            onClick={handleNextWeek}
            aria-label="Settimana successiva"
            disabled={loading || isChangingWeek}
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
        <div className="loading-indicator fade-in">
          Caricamento...
        </div>
      ) : error ? (
        <div className="error-message fade-in">{error}</div>
      ) : (
        <div 
          ref={weekdaysRef}
          className="weekdays-deck"
        >
          {weeklySlots.map((weekday, index) => (
            <div id={`w${index + 1}`} key={index} className="weekday">
              <div className="weekday-title">{weekday.formattedTitle}</div>
              <div className="slots-deck">
                {weekday.slots.length > 0 ? (
                  weekday.slots.map(slot => {
                    // Determine the current status of the slot
                    const now = new Date();
                    const slotDate = new Date(weekday.date);
                    const [hours, minutes] = slot.end_time.split(':');
                    slotDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                    
                    // Calculate if the slot is gone (in the past)
                    const isGone = slotDate < now;
                    
                    // Calculate capacity status
                    const isFull = slot.booked_count >= slot.max_capacity;
                    const isAlmostFull = !isFull && slot.booked_count >= slot.max_capacity * 0.8;
                    const isFree = slot.booked_count < slot.max_capacity * 0.8;
                    
                    // Build the class name
                    let statusClass = '';
                    if (isGone) statusClass = 'gone';
                    else if (isFull) statusClass = 'full';
                    else if (isAlmostFull) statusClass = 'almost-full';
                    else if (isFree) statusClass = 'free';
                    
                    return (
                      <div 
                        key={slot.id} 
                        className={`slot ${statusClass} ${isSlotSelected(slot.id) ? 'selected' : ''}`}
                        onClick={() => !isChangingWeek && onSlotSelect(slot)}
                      >
                        <span className="time">{slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                        <span className="capacity">{slot.booked_count}/{slot.max_capacity}</span>
                      </div>
                    );
                  })
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