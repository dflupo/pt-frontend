import { useState, useEffect, useCallback, useRef } from 'react';
import './ManageBookings.scss';
import TopBar from '../../components/common/TopBar/TopBar';
import SlotsHandler from '../../components/features/SlotsHandler/SlotsHandler';
import SlotsComparision from '../../components/features/SlotsComparision/SlotsComparision';
import useBookings from '../../hooks/useBookings';

export default function ManageBookings() {
  // Utilizzo dell'hook useBookings
  const { 
    slots, 
    loading, 
    error, 
    fetchSlots,
    fetchSlotById, 
    fetchSlotBookings,
    moveBooking,
    deleteBooking
  } = useBookings();
  
  const [weekChanging, setWeekChanging] = useState(false);

  // Stato per la navigazione settimanale
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [currentWeekEnd, setCurrentWeekEnd] = useState(getEndOfWeek(new Date()));
  
  // Stato per gli slot selezionati (massimo 2)
  const [selectedSlots, setSelectedSlots] = useState([null, null]);
  
  // Stato per tenere traccia degli slot processati
  const [processedSlots, setProcessedSlots] = useState([]);
  
  // Refs
  const contentRef = useRef(null);
  const comparisonRef = useRef(null);
  
  // Funzione per ottenere l'inizio della settimana (lunedì)
  function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }
  
  // Funzione per ottenere la fine della settimana (domenica)
  function getEndOfWeek(date) {
    const startOfWeek = getStartOfWeek(new Date(date));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  }
  
  // Funzione per formattare la data nel formato richiesto dall'API
  function formatDateForAPI(date) {
    return date.toISOString().split('T')[0];
  }
  
  // Navigazione alla settimana precedente con transizione fluida
  const goToPreviousWeek = useCallback(() => {
    // Aggiorniamo lo stato per indicare che stiamo cambiando settimana
    setWeekChanging(true);
    
    // Applichiamo l'effetto di transizione sul contenitore
    if (contentRef.current) {
      contentRef.current.classList.add('changing-week', 'prev-week');
    }
    
    // Impostiamo un timeout per permettere alla transizione di essere visibile
    setTimeout(() => {
      // Aggiorniamo gli stati relativi alle date
      const newStart = new Date(currentWeekStart);
      newStart.setDate(newStart.getDate() - 7);
      
      setCurrentWeekStart(newStart);
      setCurrentWeekEnd(getEndOfWeek(newStart));
      
      // Resettiamo le classi di transizione e lo stato di weekChanging
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.classList.remove('changing-week', 'prev-week');
        }
        setWeekChanging(false);
      }, 200);
    }, 300);
  }, [currentWeekStart]);
  
  // Navigazione alla settimana successiva con transizione fluida
  const goToNextWeek = useCallback(() => {
    // Aggiorniamo lo stato per indicare che stiamo cambiando settimana
    setWeekChanging(true);
    
    // Applichiamo l'effetto di transizione sul contenitore
    if (contentRef.current) {
      contentRef.current.classList.add('changing-week', 'next-week');
    }
    
    // Impostiamo un timeout per permettere alla transizione di essere visibile
    setTimeout(() => {
      // Aggiorniamo gli stati relativi alle date
      const newStart = new Date(currentWeekStart);
      newStart.setDate(newStart.getDate() + 7);
      
      setCurrentWeekStart(newStart);
      setCurrentWeekEnd(getEndOfWeek(newStart));
      
      // Resettiamo le classi di transizione e lo stato di weekChanging
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.classList.remove('changing-week', 'next-week');
        }
        setWeekChanging(false);
      }, 200);
    }, 300);
  }, [currentWeekStart]);

  // Gestione ottimizzata della selezione degli slot con animazione
  const handleSlotSelect = async (slot) => {
    try {
      console.log("Slot selezionato:", slot.id);
      
      // Aggiorniamo l'interfaccia in modo immediato per feedback utente
      setSelectedSlots(prevSelected => {
        // Se lo slot è già selezionato, lo deselezioniamo
        if (prevSelected[0]?.id === slot.id) {
          return [null, prevSelected[1]];
        } else if (prevSelected[1]?.id === slot.id) {
          return [prevSelected[0], null];
        }
        
        // Altrimenti, aggiungiamo lo slot nella prima posizione libera
        // Con un oggetto slot temporaneo senza prenotazioni per feedback immediato
        const tempSlot = { ...slot, bookings: [] };
        
        if (prevSelected[0] === null) {
          return [tempSlot, prevSelected[1]];
        } else if (prevSelected[1] === null) {
          return [prevSelected[0], tempSlot];
        } else {
          // Se entrambe le posizioni sono occupate, sostituiamo la prima
          return [tempSlot, prevSelected[1]];
        }
      });
      
      // Animazione del contenitore di comparazione durante il caricamento
      if (comparisonRef.current) {
        comparisonRef.current.classList.add('loading-data');
      }
      
      // Recupera le prenotazioni dello slot in background
      const bookings = await fetchSlotBookings(slot.id);
      
      // Aggiorna l'interfaccia con i dati completi
      setSelectedSlots(prevSelected => {
        const detailedSlot = { ...slot, bookings: bookings || [] };
        
        // Aggiorna lo slot corretto in base all'ID
        if (prevSelected[0]?.id === slot.id) {
          return [detailedSlot, prevSelected[1]];
        } else if (prevSelected[1]?.id === slot.id) {
          return [prevSelected[0], detailedSlot];
        }
        
        // Se lo slot non è più selezionato, mantieni lo stato attuale
        return prevSelected;
      });
      
      // Rimuovi la classe di caricamento dopo un breve ritardo per permettere l'animazione
      setTimeout(() => {
        if (comparisonRef.current) {
          comparisonRef.current.classList.remove('loading-data');
          
          // Aggiungi una classe di completamento che triggera l'animazione di fade-in
          comparisonRef.current.classList.add('data-loaded');
          
          // Rimuovi la classe dopo l'animazione
          setTimeout(() => {
            if (comparisonRef.current) {
              comparisonRef.current.classList.remove('data-loaded');
            }
          }, 600);
        }
      }, 300);
    } catch (err) {
      console.error("Errore nel caricamento dei dettagli dello slot:", err);
      
      // Gestisci l'errore aggiornando l'UI
      if (comparisonRef.current) {
        comparisonRef.current.classList.remove('loading-data');
        comparisonRef.current.classList.add('loading-error');
        
        setTimeout(() => {
          if (comparisonRef.current) {
            comparisonRef.current.classList.remove('loading-error');
          }
        }, 1000);
      }
    }
  };
  
  // Wrapper per la funzione moveBooking (ottimizzato per feedback utente)
  const handleMoveBooking = useCallback(async (userId, fromSlotId, toSlotId) => {
    console.log(`Tentativo di spostamento: utente ${userId} da slot ${fromSlotId} a slot ${toSlotId}`);
    try {
      if (typeof moveBooking !== 'function') {
        throw new Error('Funzione moveBooking non disponibile');
      }

      // Effettua la chiamata API
      await moveBooking(userId, fromSlotId, toSlotId);
      console.log('Spostamento completato con successo');
      
      // Aggiorna gli slot selezionati in modo ottimistico
      Promise.all([
        ...(selectedSlots[0]?.id === fromSlotId || selectedSlots[0]?.id === toSlotId 
          ? [fetchSlotById(selectedSlots[0].id).then(async updatedSlot => {
              const bookings = await fetchSlotBookings(selectedSlots[0].id);
              const detailedSlot = { ...updatedSlot, bookings: bookings || [] };
              setSelectedSlots(prev => [detailedSlot, prev[1]]);
            })] 
          : []),
        ...(selectedSlots[1]?.id === fromSlotId || selectedSlots[1]?.id === toSlotId 
          ? [fetchSlotById(selectedSlots[1].id).then(async updatedSlot => {
              const bookings = await fetchSlotBookings(selectedSlots[1].id);
              const detailedSlot = { ...updatedSlot, bookings: bookings || [] };
              setSelectedSlots(prev => [prev[0], detailedSlot]);
            })] 
          : [])
      ]);
      
      // Aggiorna l'elenco completo degli slot in background
      const filters = {
        start_date: formatDateForAPI(currentWeekStart),
        end_date: formatDateForAPI(currentWeekEnd)
      };
      fetchSlots(filters);
      
    } catch (error) {
      console.error('Errore durante lo spostamento della prenotazione:', error);
      throw error;
    }
  }, [moveBooking, selectedSlots, fetchSlotById, fetchSlotBookings, fetchSlots, currentWeekStart, currentWeekEnd]);
  
  // Wrapper per la funzione deleteBooking
  const handleDeleteBooking = useCallback(async (bookingId) => {
    console.log(`Tentativo di cancellazione della prenotazione ${bookingId}`);
    try {
      if (typeof deleteBooking !== 'function') {
        throw new Error('Funzione deleteBooking non disponibile');
      }

      // Chiamata API
      await deleteBooking(bookingId);
      console.log('Cancellazione completata con successo');
      
      // Aggiorna gli slot in modo non bloccante
      Promise.all(
        selectedSlots
          .filter(slot => slot !== null)
          .map(async (slot, index) => {
            const updatedSlot = await fetchSlotById(slot.id);
            const bookings = await fetchSlotBookings(slot.id);
            const detailedSlot = { ...updatedSlot, bookings: bookings || [] };
            
            setSelectedSlots(prev => {
              const newSelected = [...prev];
              newSelected[index] = detailedSlot;
              return newSelected;
            });
          })
      );
      
      // Aggiorna l'elenco completo degli slot in background
      const filters = {
        start_date: formatDateForAPI(currentWeekStart),
        end_date: formatDateForAPI(currentWeekEnd)
      };
      fetchSlots(filters);
      
      return true;
    } catch (error) {
      console.error('Errore durante la cancellazione della prenotazione:', error);
      throw error;
    }
  }, [deleteBooking, selectedSlots, fetchSlotById, fetchSlotBookings, fetchSlots, currentWeekStart, currentWeekEnd]);
  
  // Funzione per processare gli slot
  const processSlots = (slotsData) => {
    if (!slotsData || !slotsData.length) return [];
    
    return slotsData.map(slot => {
      // Crea un oggetto Date completo combinando slot_date e start_time/end_time
      const startTimeDate = new Date(`${slot.slot_date}T${slot.start_time}`);
      const endTimeDate = new Date(`${slot.slot_date}T${slot.end_time}`);
      
      return {
        ...slot,
        date: slot.slot_date,
        start_time_obj: startTimeDate,
        end_time_obj: endTimeDate,
        bookings: slot.bookings || []
      };
    });
  };
  
  // Effetto per recuperare gli slot quando cambia la settimana
  useEffect(() => {
    const loadWeeklySlots = async () => {
      const filters = {
        start_date: formatDateForAPI(currentWeekStart),
        end_date: formatDateForAPI(currentWeekEnd)
      };
      
      try {
        await fetchSlots(filters);
      } catch (err) {
        console.error("Errore nel caricamento degli slot:", err);
      }
    };
    
    loadWeeklySlots();
  }, [currentWeekStart, currentWeekEnd, fetchSlots]);
  
  // Effetto per processare gli slot quando cambiano
  useEffect(() => {
    const processed = processSlots(slots);
    setProcessedSlots(processed);
  }, [slots]);

  return (
    <div className="manage-bookings">
      <TopBar title="Gestione Prenotazioni" />

      <div 
        ref={contentRef} 
        className={`content-container ${weekChanging ? 'week-transitioning' : ''}`}
      >
        <div 
          ref={comparisonRef} 
          className="comparision-container"
        >
          <SlotsComparision 
            selectedSlots={selectedSlots}
            moveBooking={handleMoveBooking} 
            deleteBooking={handleDeleteBooking} 
          />
        </div>

        <div className="slots-container">
          <SlotsHandler 
            currentWeekStart={currentWeekStart}
            currentWeekEnd={currentWeekEnd}
            goToPreviousWeek={goToPreviousWeek}
            goToNextWeek={goToNextWeek}
            slots={processedSlots}
            loading={loading}
            error={error}
            onSlotSelect={handleSlotSelect}
            selectedSlots={selectedSlots}
          />
        </div>
      </div>
    </div>
  );
}