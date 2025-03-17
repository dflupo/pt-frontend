import './SlotsComparision.scss';
import { MdGroups2, MdDragIndicator, MdDelete } from "react-icons/md";
import { useState, useCallback, useRef, useEffect } from 'react';

export default function SlotsComparision({ selectedSlots, moveBooking, deleteBooking }) {
  // Stato per tenere traccia dell'utente appena spostato
  const [movedUsers, setMovedUsers] = useState({});
  // Stato per tracciare gli errori di spostamento
  const [dragErrors, setDragErrors] = useState({});
  // Stato per il popup di conferma cancellazione
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Stato per memorizzare i dettagli della prenotazione da cancellare
  const [bookingToDelete, setBookingToDelete] = useState(null);
  
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
  
  // Funzione per pulire tutti gli effetti di hover al termine del drag
  const cleanupDragEffects = useCallback(() => {
    // Rimuovi tutti gli elementi con classe 'drag-over'
    document.querySelectorAll('.drag-over').forEach(element => {
      element.classList.remove('drag-over');
    });
    
    // Rimuovi tutti gli elementi con classe 'cancel-drag-over'
    document.querySelectorAll('.cancel-drag-over').forEach(element => {
      element.classList.remove('cancel-drag-over');
    });
  }, []);
  
  // Aggiungi un event listener globale per il dragend
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      cleanupDragEffects();
    };
    
    document.addEventListener('dragend', handleGlobalDragEnd);
    
    // Cleanup
    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, [cleanupDragEffects]);
  
  // Handler per l'inizio del drag
  const handleDragStart = (e, booking, slotId) => {
    console.log('Inizio trascinamento:', booking.user_name, 'dallo slot', slotId);
    
    // Salva i dati dell'utente trascinato e dello slot di origine
    const dragData = JSON.stringify({
      bookingId: booking.id,
      userId: booking.user_id,
      userName: booking.user_name,
      fromSlotId: slotId
    });
    
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  // Handler per la fine del drag
  const handleDragEnd = () => {
    // Assicuriamoci di pulire gli effetti di hover
    cleanupDragEffects();
  };
  
  // Handler per il drop
  const handleDrop = useCallback(async (e, toSlotId) => {
    e.preventDefault();
    console.log('Drop rilevato sullo slot:', toSlotId);
    
    // Pulisci gli effetti di hover
    cleanupDragEffects();
    
    try {
      // Verifica che ci siano dati nel dataTransfer
      const jsonData = e.dataTransfer.getData('application/json');
      if (!jsonData) {
        console.error('Nessun dato trovato nel drag and drop');
        return;
      }
      
      const data = JSON.parse(jsonData);
      const { userId, fromSlotId, bookingId, userName } = data;
      
      console.log(`Tentativo di spostamento: ${userName} (${userId}) da ${fromSlotId} a ${toSlotId}`);
      
      // Non fare nulla se lo slot di destinazione è lo stesso di quello di origine
      if (fromSlotId === toSlotId) {
        console.log('Drop sullo stesso slot di origine, nessuna azione necessaria');
        return;
      }
      
      // Verifica che moveBooking esista
      if (typeof moveBooking !== 'function') {
        console.error('moveBooking non è una funzione valida');
        throw new Error('Funzione di spostamento non disponibile');
      }
      
      // Chiama l'API per spostare la prenotazione
      await moveBooking(userId, fromSlotId, toSlotId);
      console.log('Spostamento completato con successo');
      
      // Rimuovi eventuali errori precedenti per questo booking
      if (dragErrors[bookingId]) {
        setDragErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[bookingId];
          return newErrors;
        });
      }
      
      // Aggiorna lo stato per il feedback visivo
      setMovedUsers(prev => ({
        ...prev,
        [bookingId]: true
      }));
      
      // Rimuovi il feedback dopo 2 secondi
      setTimeout(() => {
        setMovedUsers(prev => {
          const newState = { ...prev };
          delete newState[bookingId];
          return newState;
        });
      }, 2000);
    } catch (error) {
      console.error('Errore durante lo spostamento della prenotazione:', error);
      
      // Estrai l'ID della prenotazione per il feedback di errore
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const bookingId = data.bookingId;
        
        // Aggiungi lo stato di errore
        setDragErrors(prev => ({
          ...prev,
          [bookingId]: true
        }));
        
        // Rimuovi il feedback di errore dopo 2 secondi
        setTimeout(() => {
          setDragErrors(prev => {
            const newState = { ...prev };
            delete newState[bookingId];
            return newState;
          });
        }, 2000);
      } catch (parseError) {
        console.error('Errore nel recuperare l\'ID della prenotazione:', parseError);
      }
    }
  }, [moveBooking, dragErrors, cleanupDragEffects]);
  
  // Handler per il drop nella zona di cancellazione
  const handleCancelDrop = useCallback(async (e) => {
    e.preventDefault();
    
    // Pulisci gli effetti di hover
    cleanupDragEffects();
    
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      if (!jsonData) {
        console.error('Nessun dato trovato nel drag and drop');
        return;
      }
      
      const data = JSON.parse(jsonData);
      
      // Salva i dati della prenotazione da cancellare e mostra il popup di conferma
      setBookingToDelete({
        id: data.bookingId,
        userId: data.userId,
        name: data.userName,
        slotId: data.fromSlotId
      });
      
      setShowConfirmation(true);
      
    } catch (error) {
      console.error('Errore durante la preparazione della cancellazione:', error);
    }
  }, [cleanupDragEffects]);
  
  // Conferma la cancellazione della prenotazione
  const confirmDelete = useCallback(async () => {
    if (!bookingToDelete || !deleteBooking) return;
    
    try {
      await deleteBooking(bookingToDelete.id);
      console.log(`Prenotazione ${bookingToDelete.id} cancellata con successo`);
      
      // Nascondi il popup di conferma
      setShowConfirmation(false);
      setBookingToDelete(null);
    } catch (error) {
      console.error('Errore durante la cancellazione della prenotazione:', error);
    }
  }, [bookingToDelete, deleteBooking]);
  
  // Annulla la cancellazione
  const cancelDelete = () => {
    setShowConfirmation(false);
    setBookingToDelete(null);
  };
  
  // Handler per prevenire comportamenti di default durante il drag
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Handler per l'entrata del drag nella zona di drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Gestione per le comparison-card
    if (e.currentTarget.classList.contains('comparision-card')) {
      e.currentTarget.classList.add('drag-over');
    }
    
    // Gestione per la zona di cancellazione
    if (e.currentTarget.classList.contains('cancel-booking')) {
      e.currentTarget.classList.add('cancel-drag-over');
    }
  };
  
  // Handler per l'uscita del drag dalla zona di drop
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { relatedTarget } = e;
    
    // Verifica se stiamo uscendo veramente dall'elemento e non entrando in un figlio
    if (!e.currentTarget.contains(relatedTarget)) {
      // Gestione per le comparison-card
      if (e.currentTarget.classList.contains('comparision-card')) {
        e.currentTarget.classList.remove('drag-over');
      }
      
      // Gestione per la zona di cancellazione
      if (e.currentTarget.classList.contains('cancel-booking')) {
        e.currentTarget.classList.remove('cancel-drag-over');
      }
    }
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
    
    // Determine the current status of the slot
    const now = new Date();
    const slotDateObj = new Date(slotDate);
    const [hours, minutes] = slot.end_time.split(':');
    slotDateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    
    // Calculate if the slot is gone (in the past)
    const isGone = slotDateObj < now;
    
    // Calculate capacity status
    const isFull = slot.booked_count >= slot.max_capacity;
    const isAlmostFull = !isFull && slot.booked_count >= slot.max_capacity * 0.8;
    const isFree = slot.booked_count < slot.max_capacity * 0.8;
    
    // Build the status class
    let statusClass = '';
    if (isGone) statusClass = 'gone';
    else if (isFull) statusClass = 'full';
    else if (isAlmostFull) statusClass = 'almost-full';
    else if (isFree) statusClass = 'free';
    
    return (
      <div className={`col-${colIndex}`}>
        <div 
          className="comparision-card" 
          data-slot-id={slot.id}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, slot.id)}
        >
          <div className="header">
            <div className="title">
              <h4>{formatDate(slotDate)}</h4>
              <h4>{formatTime(slot.start_time, slot.end_time)}</h4>
            </div>
            <div className={`capability ${statusClass}`}>
              <span className='capability-icon'>
                <MdGroups2 />
              </span>
              <p>{slot.booked_count}/{slot.max_capacity}</p>
            </div>
          </div>

          <div className="users">
            {slot.bookings && slot.bookings.length > 0 ? (
              slot.bookings.map(booking => (
                <div 
                  key={booking.id} 
                  className={`user ${movedUsers[booking.id] ? 'moved' : ''} ${dragErrors[booking.id] ? 'error' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, booking, slot.id)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="drag">
                    <MdDragIndicator />
                  </span>
                  <h5>{booking.user_name || 'Errore Nome Utente!'}</h5>
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

  // Renderizza il popup di conferma della cancellazione
  const renderConfirmation = () => {
    if (!showConfirmation || !bookingToDelete) return null;
    
    // Trova lo slot per mostrare le informazioni
    const slot = selectedSlots.find(s => s && s.id === bookingToDelete.slotId);
    const slotInfo = slot ? `${formatDate(slot.slot_date || slot.date)} ${formatTime(slot.start_time, slot.end_time)}` : '';
    
    return (
      <div className="confirmation-popup">
        <h4>Conferma Cancellazione</h4>
        <p>Sei sicuro di voler annullare la prenotazione di:</p>
        <p className="booking-details"><strong>{bookingToDelete.name}</strong></p>
        <p>Per lo slot: <strong>{slotInfo}</strong></p>
        
        <div className="confirmation-buttons">
          <button className="confirm-button" onClick={confirmDelete}>
            Conferma
          </button>
          <button className="cancel-button" onClick={cancelDelete}>
            Annulla
          </button>
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
        {(selectedSlots[0] || selectedSlots[1]) && (
          <div className="comparision-actions">
            {showConfirmation ? (
              renderConfirmation()
            ) : (
              <div 
                className="cancel-booking"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleCancelDrop}
              >
                <div className="trash-icon">
                  <MdDelete />
                </div>
                <div className="cancel-content">
                  <span>Annulla prenotazione</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Terza colonna con il secondo slot selezionato */}
      {renderSlotCard(selectedSlots[1], 3)}
    </div>
  );
}