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
  
  const [slotLoading, setSlotLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Stato per la navigazione settimanale (condiviso tra i componenti)
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [currentWeekEnd, setCurrentWeekEnd] = useState(getEndOfWeek(new Date()));
  
  // Stato per gli slot selezionati (massimo 2)
  const [selectedSlots, setSelectedSlots] = useState([null, null]);
  
  // Stato per tenere traccia degli slot processati (con formato corretto per React)
  const [processedSlots, setProcessedSlots] = useState([]);
  
  // Refs for smooth transitions
  const contentRef = useRef(null);
  
  // Funzione per ottenere l'inizio della settimana (lunedì)
  function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adattamento per la domenica
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
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }
  
  // Helper function for smooth transitions
  const triggerTransition = async (callback) => {
    // Start transition
    setIsTransitioning(true);
    
    if (contentRef.current) {
      contentRef.current.style.opacity = '0.6';
      contentRef.current.style.transform = 'scale(0.98)';
    }
    
    // Wait for transition effect
    setTimeout(async () => {
      // Execute the actual callback
      await callback();
      
      // End transition with slight delay for visual effect
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.opacity = '1';
          contentRef.current.style.transform = 'scale(1)';
        }
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };
  
  // Navigazione alla settimana precedente
  const goToPreviousWeek = () => {
    triggerTransition(() => {
      const newStart = new Date(currentWeekStart);
      newStart.setDate(newStart.getDate() - 7);
      
      setCurrentWeekStart(newStart);
      setCurrentWeekEnd(getEndOfWeek(newStart));
    });
  };
  
  // Navigazione alla settimana successiva
  const goToNextWeek = () => {
    triggerTransition(() => {
      const newStart = new Date(currentWeekStart);
      newStart.setDate(newStart.getDate() + 7);
      
      setCurrentWeekStart(newStart);
      setCurrentWeekEnd(getEndOfWeek(newStart));
    });
  };

  // Funzione per gestire la selezione degli slot
  const handleSlotSelect = async (slot) => {
    try {
      setSlotLoading(true);
      console.log("Slot selezionato:", slot);
      
      // Add a visual transition
      if (contentRef.current) {
        contentRef.current.style.opacity = '0.8';
      }
      
      // Recupera le prenotazioni dello slot usando l'endpoint corretto
      const bookings = await fetchSlotBookings(slot.id);
      console.log("Prenotazioni recuperate:", bookings);
      
      // Crea una copia dettagliata dello slot con le prenotazioni
      const detailedSlot = { 
        ...slot, 
        bookings: bookings || [] 
      };
      
      setSelectedSlots(prevSelected => {
        // Se lo slot è già selezionato, lo deselezioniamo
        if (prevSelected[0]?.id === slot.id) {
          return [null, prevSelected[1]];
        } else if (prevSelected[1]?.id === slot.id) {
          return [prevSelected[0], null];
        }
        
        // Altrimenti, aggiungiamo lo slot nella prima posizione libera
        if (prevSelected[0] === null) {
          return [detailedSlot, prevSelected[1]];
        } else if (prevSelected[1] === null) {
          return [prevSelected[0], detailedSlot];
        } else {
          // Se entrambe le posizioni sono occupate, sostituiamo la prima
          return [detailedSlot, prevSelected[1]];
        }
      });
    } catch (err) {
      console.error("Errore nel caricamento dei dettagli dello slot:", err);
    } finally {
      // Restore opacity with a smooth transition
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.opacity = '1';
        }
        setSlotLoading(false);
      }, 300);
    }
  };
  
  // Wrapper per la funzione moveBooking
  const handleMoveBooking = useCallback(async (userId, fromSlotId, toSlotId) => {
    console.log(`Tentativo di spostamento: utente ${userId} da slot ${fromSlotId} a slot ${toSlotId}`);
    try {
      // Verifica che moveBooking sia una funzione
      if (typeof moveBooking !== 'function') {
        console.error('moveBooking non è una funzione valida');
        throw new Error('Funzione moveBooking non disponibile');
      }

      // Chiamata all'API per spostare la prenotazione
      await moveBooking(userId, fromSlotId, toSlotId);
      console.log('Spostamento completato con successo');
      
      // Add a brief delay for a smoother transition effect
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Aggiorna gli slot selezionati dopo lo spostamento
      if (selectedSlots[0]?.id === fromSlotId || selectedSlots[0]?.id === toSlotId) {
        const updatedSlot = await fetchSlotById(selectedSlots[0].id);
        const bookings = await fetchSlotBookings(selectedSlots[0].id);
        const detailedSlot = { ...updatedSlot, bookings: bookings || [] };
        
        setSelectedSlots(prev => [detailedSlot, prev[1]]);
      }
      
      if (selectedSlots[1]?.id === fromSlotId || selectedSlots[1]?.id === toSlotId) {
        const updatedSlot = await fetchSlotById(selectedSlots[1].id);
        const bookings = await fetchSlotBookings(selectedSlots[1].id);
        const detailedSlot = { ...updatedSlot, bookings: bookings || [] };
        
        setSelectedSlots(prev => [prev[0], detailedSlot]);
      }
      
      // Aggiorna anche l'elenco completo degli slot
      const filters = {
        start_date: formatDateForAPI(currentWeekStart),
        end_date: formatDateForAPI(currentWeekEnd)
      };
      await fetchSlots(filters);
      
    } catch (error) {
      console.error('Errore durante lo spostamento della prenotazione:', error);
      throw error; // Rilancia l'errore per gestirlo nel componente figlio
    }
  }, [moveBooking, selectedSlots, fetchSlotById, fetchSlotBookings, fetchSlots, currentWeekStart, currentWeekEnd]);
  
  // Wrapper per la funzione deleteBooking
  const handleDeleteBooking = useCallback(async (bookingId) => {
    console.log(`Tentativo di cancellazione della prenotazione ${bookingId}`);
    try {
      // Verifica che deleteBooking sia una funzione
      if (typeof deleteBooking !== 'function') {
        console.error('deleteBooking non è una funzione valida');
        throw new Error('Funzione deleteBooking non disponibile');
      }

      // Add a slight delay for animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Chiamata all'API per cancellare la prenotazione
      await deleteBooking(bookingId);
      console.log('Cancellazione completata con successo');
      
      // Aggiorna gli slot selezionati dopo la cancellazione
      for (let i = 0; i < selectedSlots.length; i++) {
        if (selectedSlots[i]) {
          const updatedSlot = await fetchSlotById(selectedSlots[i].id);
          const bookings = await fetchSlotBookings(selectedSlots[i].id);
          const detailedSlot = { ...updatedSlot, bookings: bookings || [] };
          
          setSelectedSlots(prev => {
            const newSelected = [...prev];
            newSelected[i] = detailedSlot;
            return newSelected;
          });
        }
      }
      
      // Add another brief delay for smoother transitions
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Aggiorna anche l'elenco completo degli slot
      const filters = {
        start_date: formatDateForAPI(currentWeekStart),
        end_date: formatDateForAPI(currentWeekEnd)
      };
      await fetchSlots(filters);
      
      return true;
    } catch (error) {
      console.error('Errore durante la cancellazione della prenotazione:', error);
      throw error; // Rilancia l'errore per gestirlo nel componente figlio
    }
  }, [deleteBooking, selectedSlots, fetchSlotById, fetchSlotBookings, fetchSlots, currentWeekStart, currentWeekEnd]);
  
  // Funzione per processare gli slot per renderli compatibili con i componenti
  const processSlots = (slotsData) => {
    if (!slotsData || !slotsData.length) return [];
    
    return slotsData.map(slot => {
      // Crea un oggetto Date completo combinando slot_date e start_time/end_time
      const startTimeDate = new Date(`${slot.slot_date}T${slot.start_time}`);
      const endTimeDate = new Date(`${slot.slot_date}T${slot.end_time}`);
      
      return {
        ...slot,
        date: slot.slot_date, // Aggiunge il campo date che alcuni componenti potrebbero aspettarsi
        start_time_obj: startTimeDate, // Oggetto Date per start_time
        end_time_obj: endTimeDate, // Oggetto Date per end_time
        // Aggiungi un array di prenotazioni vuoto se non presente
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
        className={`content-container ${isTransitioning ? 'transitioning' : ''}`}
        style={{
          transition: 'all 0.3s ease',
          opacity: 1,
          transform: 'scale(1)'
        }}
      >
        <div className="comparision-container">
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