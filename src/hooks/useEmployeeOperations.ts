import { useCallback, useEffect } from 'react';
import { useEmployeeStore, useRestaurantStore, useNotifications } from '../stores';
import { InviteLink } from '../types';

/**
 * Custom hook for managing employees in a restaurant
 */
export const useEmployees = (restaurantId?: string) => {
  const { 
    employees, 
    isLoading, 
    error, 
    fetchEmployees,
    clearError 
  } = useEmployeeStore();

  // Fetch employees when restaurantId changes
  useEffect(() => {
    if (restaurantId) {
      fetchEmployees(restaurantId);
    }
  }, [restaurantId, fetchEmployees]);

  // Filter employees for the current restaurant
  const restaurantEmployees = restaurantId 
    ? employees.filter(emp => emp.restaurantId === restaurantId)
    : employees;

  const refetch = useCallback(() => {
    if (restaurantId) {
      fetchEmployees(restaurantId);
    }
  }, [restaurantId, fetchEmployees]);

  return {
    employees: restaurantEmployees,
    isLoading,
    error,
    refetch,
    clearError,
  };
};

/**
 * Custom hook for generating and managing invite links
 */
export const useGenerateInvite = () => {
  const { 
    generateInviteLink, 
    lastGeneratedInvite,
    clearLastGeneratedInvite,
    isLoading, 
    error 
  } = useEmployeeStore();
  const { addNotification } = useNotifications();

  const generateInvite = useCallback(async (restaurantId: string, expiresInHours?: number): Promise<InviteLink | null> => {
    try {
      const inviteLink = await generateInviteLink(restaurantId, expiresInHours);
      
      addNotification({
        type: 'success',
        title: 'Invite Link Generated',
        message: 'Share this link with your employee to invite them.',
      });
      
      return inviteLink;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Generate Link',
        message: 'Please try again later.',
      });
      return null;
    }
  }, [generateInviteLink, addNotification]);

  return {
    generateInvite,
    lastGeneratedInvite,
    clearLastGeneratedInvite,
    isLoading,
    error,
  };
};

/**
 * Custom hook for removing employees
 */
export const useRemoveEmployee = () => {
  const { removeEmployee, isLoading } = useEmployeeStore();
  const { addNotification } = useNotifications();

  const remove = useCallback(async (employeeId: string, employeeName: string): Promise<boolean> => {
    try {
      await removeEmployee(employeeId);
      
      addNotification({
        type: 'success',
        title: 'Employee Removed',
        message: `${employeeName} has been removed from your team.`,
      });
      
      return true;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Remove Employee',
        message: 'Please try again later.',
      });
      return false;
    }
  }, [removeEmployee, addNotification]);

  return {
    remove,
    isLoading,
  };
};

/**
 * Custom hook for updating employee status
 */
export const useEmployeeStatus = () => {
  const { updateEmployeeStatus, isLoading } = useEmployeeStore();
  const { addNotification } = useNotifications();

  const updateStatus = useCallback(async (
    employeeId: string, 
    employeeName: string, 
    isActive: boolean
  ): Promise<boolean> => {
    try {
      await updateEmployeeStatus(employeeId, isActive);
      
      addNotification({
        type: 'success',
        title: 'Status Updated',
        message: `${employeeName} is now ${isActive ? 'active' : 'inactive'}.`,
      });
      
      return true;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Update Status',
        message: 'Please try again later.',
      });
      return false;
    }
  }, [updateEmployeeStatus, addNotification]);

  return {
    updateStatus,
    isLoading,
  };
};

/**
 * Custom hook that combines all employee operations for a restaurant
 */
export const useEmployeeManagement = (restaurantId?: string) => {
  const employeeData = useEmployees(restaurantId);
  const inviteOperations = useGenerateInvite();
  const removeOperations = useRemoveEmployee();
  const statusOperations = useEmployeeStatus();
  
  // Get current restaurant info
  const { currentRestaurant } = useRestaurantStore();
  const activeRestaurantId = restaurantId || currentRestaurant?.id;

  const hasEmployees = employeeData.employees.length > 0;
  const activeEmployees = employeeData.employees.filter(emp => emp.isActive);
  const inactiveEmployees = employeeData.employees.filter(emp => !emp.isActive);

  return {
    // Employee data
    ...employeeData,
    activeEmployees,
    inactiveEmployees,
    hasEmployees,
    
    // Operations
    generateInvite: inviteOperations.generateInvite,
    removeEmployee: removeOperations.remove,
    updateEmployeeStatus: statusOperations.updateStatus,
    
    // Invite link data
    lastGeneratedInvite: inviteOperations.lastGeneratedInvite,
    clearLastGeneratedInvite: inviteOperations.clearLastGeneratedInvite,
    
    // Loading states
    isGeneratingInvite: inviteOperations.isLoading,
    isRemovingEmployee: removeOperations.isLoading,
    isUpdatingStatus: statusOperations.isLoading,
    
    // Restaurant context
    restaurantId: activeRestaurantId,
  };
};