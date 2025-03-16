import { useState, useEffect } from 'react';
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
    fetchSlotBookings 
  } = useBookings();
  
    
  const [slotLoading, setSlotLoading] = useState(false);

  // Stato per la navigazione settimanale (condiviso tra i componenti)
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [currentWeekEnd, setCurrentWeekEnd] = useState(getEndOfWeek(new Date()));
  
  // Stato per gli slot selezionati (massimo 2)
  const [selectedSlots, setSelectedSlots] = useState([null, null]);
  
  // Stato per tenere traccia degli slot processati (con formato corretto per React)
  const [processedSlots, setProcessedSlots] = useState([]);
  
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
  
  // Navigazione alla settimana precedente
  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    
    setCurrentWeekStart(newStart);
    setCurrentWeekEnd(getEndOfWeek(newStart));
  };
  
  // Navigazione alla settimana successiva
  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    
    setCurrentWeekStart(newStart);
    setCurrentWeekEnd(getEndOfWeek(newStart));
  };


// Funzione per gestire la selezione degli slot
const handleSlotSelect = async (slot) => {
  try {
    setSlotLoading(true); // Usa lo stato locale per il caricamento
    console.log("Slot selezionato:", slot);
    
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
    setSlotLoading(false); // Ripristina lo stato al termine
  }
};
  
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
      <TopBar title="Manage Bookings" />

      <div className="comparision-container">
        <SlotsComparision 
          selectedSlots={selectedSlots} 
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
  );
}