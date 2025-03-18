import { useState, useCallback } from 'react';
import { bookingsAPI } from '../api/bookings';

export default function useBookings() {
  // State for slots and bookings management
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [slotTemplates, setSlotTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userSchedules, setUserSchedules] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== SLOTS MANAGEMENT =====
  
  // Fetch available slots with filters
  const fetchSlots = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsAPI.getSlots(filters);
      setSlots(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading slots');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get slot by ID
  const fetchSlotById = useCallback(async (slotId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsAPI.getSlotById(slotId);
      setSelectedSlot(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading slot');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a slot
  const updateSlot = useCallback(async (slotId, slotData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSlot = await bookingsAPI.updateSlot(slotId, slotData);
      setSlots(prev => prev.map(slot => 
        slot.id === slotId ? { ...slot, ...updatedSlot } : slot
      ));
      if (selectedSlot && selectedSlot.id === slotId) {
        setSelectedSlot({ ...selectedSlot, ...updatedSlot });
      }
      return updatedSlot;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating slot');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedSlot]);

  // Delete a slot
  const deleteSlot = useCallback(async (slotId) => {
    setLoading(true);
    setError(null);
    try {
      await bookingsAPI.deleteSlot(slotId);
      setSlots(prev => prev.filter(slot => slot.id !== slotId));
      if (selectedSlot && selectedSlot.id === slotId) {
        setSelectedSlot(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting slot');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedSlot]);

  // Generate slots using server templates
  const generateSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingsAPI.generateSlots();
      // After generating, fetch the updated slots
      await fetchSlots();
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error generating slots');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSlots]);

  // ===== SLOT TEMPLATES MANAGEMENT =====
  
  // Fetch slot templates
  const fetchSlotTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsAPI.getSlotTemplates();
      setSlotTemplates(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading slot templates');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific slot template
  const fetchSlotTemplateById = useCallback(async (templateId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsAPI.getSlotTemplateById(templateId);
      setSelectedTemplate(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading slot template');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new slot template
  const createSlotTemplate = useCallback(async (templateData) => {
    setLoading(true);
    setError(null);
    try {
      const newTemplate = await bookingsAPI.createSlotTemplate(templateData);
      setSlotTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating slot template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a slot template
  const updateSlotTemplate = useCallback(async (templateId, templateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTemplate = await bookingsAPI.updateSlotTemplate(templateId, templateData);
      setSlotTemplates(prev => prev.map(template => 
        template.id === templateId ? { ...template, ...updatedTemplate } : template
      ));
      if (selectedTemplate && selectedTemplate.id === templateId) {
        setSelectedTemplate({ ...selectedTemplate, ...updatedTemplate });
      }
      return updatedTemplate;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating slot template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  // Delete a slot template
  const deleteSlotTemplate = useCallback(async (templateId) => {
    setLoading(true);
    setError(null);
    try {
      await bookingsAPI.deleteSlotTemplate(templateId);
      setSlotTemplates(prev => prev.filter(template => template.id !== templateId));
      if (selectedTemplate && selectedTemplate.id === templateId) {
        setSelectedTemplate(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting slot template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  // ===== BOOKINGS MANAGEMENT =====
  
  // Create a booking
  const createBooking = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingsAPI.createBooking(bookingData);
      
      // Update userBookings if the booking is for the current user
      if (bookingData.user_id) {
        setUserBookings(prev => [...prev, newBooking]);
      }
      
      // Update the slot availability in the slots list
      setSlots(prev => prev.map(slot => {
        if (slot.id === bookingData.slot_id) {
          return { 
            ...slot, 
            booked_count: (slot.booked_count || 0) + 1,
            available: slot.max_capacity - ((slot.booked_count || 0) + 1)
          };
        }
        return slot;
      }));
      
      return newBooking;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user bookings
  const fetchUserBookings = useCallback(async (userId, futureOnly = true) => {
    setLoading(true);
    setError(null);
    try {
      const bookings = await bookingsAPI.getUserBookings(userId, futureOnly);
      setUserBookings(bookings);
      return bookings;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading user bookings');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get bookings for a specific slot
  const fetchSlotBookings = useCallback(async (slotId) => {
    setLoading(true);
    setError(null);
    try {
      // Usa l'endpoint corretto per ottenere le prenotazioni dello slot
      const bookings = await bookingsAPI.getSlotBookings(slotId);
      return bookings;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading slot bookings');
      console.error(`Error fetching bookings for slot ${slotId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Move a booking from one slot to another
  const moveBooking = useCallback(async (userId, fromSlotId, toSlotId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingsAPI.moveBooking(userId, fromSlotId, toSlotId);
      
      // Update userBookings
      await fetchUserBookings(userId);
      
      // Update the slots data to reflect the change
      await fetchSlots();
      
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error moving booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserBookings, fetchSlots]);

  // Delete a booking
  const deleteBooking = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      // Find the booking to get details before deleting
      const booking = userBookings.find(b => b.id === bookingId);
      
      await bookingsAPI.deleteBooking(bookingId);
      
      // Remove the booking from userBookings
      setUserBookings(prev => prev.filter(b => b.id !== bookingId));
      
      // Update the slot availability if we have the slot in our list
      if (booking && booking.slot_id) {
        setSlots(prev => prev.map(slot => {
          if (slot.id === booking.slot_id) {
            return { 
              ...slot, 
              booked_count: Math.max(0, (slot.booked_count || 0) - 1),
              available: slot.max_capacity - Math.max(0, (slot.booked_count || 0) - 1)
            };
          }
          return slot;
        }));
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userBookings]);

  // ===== USER SCHEDULES MANAGEMENT =====
  
  // Fetch user schedules
  const fetchUserSchedules = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const schedules = await bookingsAPI.getUserSchedules(userId);
      setUserSchedules(schedules);
      console.log('User schedules:', schedules);
      return schedules;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading user schedules');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a user schedule
  const createUserSchedule = useCallback(async (scheduleData) => {
    setLoading(true);
    setError(null);
    try {
      const newSchedule = await bookingsAPI.createUserSchedule(scheduleData);
      setUserSchedules(prev => [...prev, newSchedule]);
      return newSchedule;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating user schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a user schedule
  const updateUserSchedule = useCallback(async (scheduleId, scheduleData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSchedule = await bookingsAPI.updateUserSchedule(scheduleId, scheduleData);
      setUserSchedules(prev => 
        prev.map(schedule => schedule.id === scheduleId ? { ...schedule, ...updatedSchedule } : schedule)
      );
      return updatedSchedule;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating user schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a user schedule
  const deleteUserSchedule = useCallback(async (scheduleId) => {
    setLoading(true);
    setError(null);
    try {
      await bookingsAPI.deleteUserSchedule(scheduleId);
      setUserSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting user schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-book users into slots
  const autoBookUsers = useCallback(async (autoBookData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingsAPI.autoBookUsers(autoBookData);
      
      // Refresh slots after auto-booking
      await fetchSlots();
      
      // If the current user is part of the auto-booking, refresh their bookings
      if (autoBookData.users && autoBookData.users.length > 0) {
        // This is simplified - you might need to check if the current user ID is in the list
        // and then refresh only their bookings
      }
      
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error auto-booking users');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSlots]);


  
  return {
    // State
    slots,
    selectedSlot,
    userBookings,
    slotTemplates,
    selectedTemplate,
    userSchedules,
    loading,
    error,
    
    // Slots methods
    fetchSlots,
    fetchSlotById,
    updateSlot,
    deleteSlot,
    generateSlots,
    
    // Slot templates methods
    fetchSlotTemplates,
    fetchSlotTemplateById,
    createSlotTemplate,
    updateSlotTemplate,
    deleteSlotTemplate,
    
    // Bookings methods
    createBooking,
    fetchUserBookings,
    fetchSlotBookings,
    moveBooking,
    deleteBooking,
    
    // User schedules methods
    fetchUserSchedules,
    createUserSchedule,
    updateUserSchedule,
    deleteUserSchedule,
    autoBookUsers
  };
}