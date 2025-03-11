import { useState, useEffect, useCallback } from 'react';
import { staffAPI } from '../api/staff';

export default function useStaff() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaffMember, setSelectedStaffMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all staff members
  const fetchStaffMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffAPI.getAllStaff();
      setStaffMembers(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading staff members');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load staff member by ID
  const fetchStaffMemberById = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffAPI.getStaffById(staffId);
      setSelectedStaffMember(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading staff member');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new staff member
  const createStaffMember = useCallback(async (staffData) => {
    setLoading(true);
    setError(null);
    try {
      const newStaffMember = await staffAPI.createStaff(staffData);
      setStaffMembers(prev => [...prev, newStaffMember]);
      return newStaffMember;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating staff member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a staff member
  const updateStaffMember = useCallback(async (staffId, staffData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedStaffMember = await staffAPI.updateStaff(staffId, staffData);
      setStaffMembers(prev => prev.map(staff => 
        staff.id === staffId ? { ...staff, ...updatedStaffMember } : staff
      ));
      if (selectedStaffMember && selectedStaffMember.id === staffId) {
        setSelectedStaffMember({ ...selectedStaffMember, ...updatedStaffMember });
      }
      return updatedStaffMember;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating staff member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedStaffMember]);

  // Delete a staff member
  const deleteStaffMember = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);
    try {
      await staffAPI.deleteStaff(staffId);
      setStaffMembers(prev => prev.filter(staff => staff.id !== staffId));
      if (selectedStaffMember && selectedStaffMember.id === staffId) {
        setSelectedStaffMember(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting staff member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedStaffMember]);

  // Load staff members on initialization
  useEffect(() => {
    fetchStaffMembers();
  }, [fetchStaffMembers]);

  return {
    staffMembers,
    selectedStaffMember,
    loading,
    error,
    fetchStaffMembers,
    fetchStaffMemberById,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember
  };
}