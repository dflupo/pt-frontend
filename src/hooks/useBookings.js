import { useState, useCallback } from 'react';
import { bookingsAPI } from '../api/bookings';

export default function useBookings() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== SLOTS MANAGEMENT =====
  
  // Create a new time slot
  const createSlot = useCallback(async (slotData) => {
    setLoading(true);
    setError(null);
    try {
      const newSlot = await bookingsAPI.createSlot(slotData);
      setSlots(prev => [...prev, newSlot]);
      return newSlot;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating slot');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get available slots with filters
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

  // ===== BOOKINGS MANAGEMENT =====
  
  // Create a booking
  const createBooking = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingsAPI.createBooking(bookingData);
      
      // Update userBookings if the booking is for the current user
      setUserBookings(prev => [...prev, newBooking]);
      
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

  // Delete a booking
  const deleteBooking = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      // Find the booking to get the slot_id before removing it
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

  return {
    slots,
    selectedSlot,
    userBookings,
    loading,
    error,
    createSlot,
    fetchSlots,
    fetchSlotById,
    updateSlot,
    deleteSlot,
    createBooking,
    fetchUserBookings,
    deleteBooking
  };
}