import './SlotsComparision.scss';
import { MdGroups2, MdDragIndicator } from "react-icons/md";

export default function SlotsComparision({ selectedSlots }) {
  
    // Funzione per formattare la data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Verifica se dateString è già un oggetto Date
    const date = typeof dateString === 'string' 
      ? new Date(dateString) 
      : dateString;
    
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };
  
  // Funzione per formattare l'orario
  const formatTime = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    
    // Se sono stringhe di tipo HH:MM:SS, estrai solo HH:MM
    if (typeof startTime === 'string' && typeof endTime === 'string') {
      return `${startTime.substring(0, 5)} - ${endTime.substring(0, 5)}`;
    }
    
    // Altrimenti trattali come oggetti Date
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    return `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - 
            ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  };

  // Renderizza una card dello slot
  const renderSlotCard = (slot, colIndex) => {
    if (!slot) {
      return (
        <div className={`col-${colIndex}`}>
          <div className="comparision-card empty">
            <div className="empty-message">
              Seleziona uno slot per visualizzare i dettagli
            </div>
          </div>
        </div>
      );
    }
    
    // Formatta la data in base al formato dei dati
    const slotDate = slot.slot_date || slot.date || (slot.start_time_obj ? slot.start_time_obj.toISOString().split('T')[0] : '');
    
    return (
      <div className={`col-${colIndex}`}>
        <div className="comparision-card">
          <div className="header">
            <div className="title">
              <h4>{formatDate(slotDate)}</h4>
              <h4>{formatTime(slot.start_time, slot.end_time)}</h4>
            </div>
            <div className={`capability ${slot.booked_count >= slot.max_capacity ? 'full' : 'free'}`}>
              <span className='capability-icon'>
                <MdGroups2 />
              </span>
              <p>{slot.booked_count}/{slot.max_capacity}</p>
            </div>
          </div>

          <div className="users">
            {slot.bookings && slot.bookings.length > 0 ? (
              slot.bookings.map(booking => (
                <div key={booking.id} className="user">
                  <span className="drag">
                    <MdDragIndicator />
                  </span>
                  <h5>{booking.user_name || 'Domenico Lupo'}</h5>
                </div>
              ))
            ) : (
              <div className="no-bookings">
                Nessun utente prenotato per questo slot
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="comparision">
      {/* Prima colonna con il primo slot selezionato */}
      {renderSlotCard(selectedSlots[0], 1)}
      
      {/* Colonna centrale vuota (spaziatore) */}
      <div className="col-2 spacer">
        {selectedSlots[0] && selectedSlots[1] && (
          <div className="comparison-arrows">
            {/* Qui puoi aggiungere frecce o altri elementi di comparazione */}
          </div>
        )}
      </div>
      
      {/* Terza colonna con il secondo slot selezionato */}
      {renderSlotCard(selectedSlots[1], 3)}
    </div>
  );
}