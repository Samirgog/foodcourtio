import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee, InviteLink, EmployeeInviteRequest, EmployeeStatusUpdate } from '../types';
import { generateId } from '../utils';

interface EmployeeState {
  employees: Employee[];
  inviteLinks: InviteLink[];
  isLoading: boolean;
  error: string | null;
  lastGeneratedInvite: InviteLink | null;
}

interface EmployeeActions {
  // Employee management
  fetchEmployees: (restaurantId: string) => Promise<void>;
  removeEmployee: (employeeId: string) => Promise<void>;
  updateEmployeeStatus: (employeeId: string, isActive: boolean) => Promise<void>;
  
  // Invite link management
  generateInviteLink: (restaurantId: string, expiresInHours?: number) => Promise<InviteLink>;
  getInviteLinks: (restaurantId: string) => Promise<void>;
  revokeInviteLink: (inviteLinkId: string) => Promise<void>;
  
  // Utilities
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  clearLastGeneratedInvite: () => void;
}

type EmployeeStore = EmployeeState & EmployeeActions;

// Mock data for demonstration
const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    restaurantId: 'rest-1',
    telegramUserId: '123456789',
    name: 'John Smith',
    username: 'johnsmith',
    isActive: true,
    invitedAt: '2024-01-10T10:00:00Z',
    joinedAt: '2024-01-10T12:30:00Z',
    lastSeen: '2024-01-15T18:45:00Z',
  },
  {
    id: 'emp-2',
    restaurantId: 'rest-1',
    telegramUserId: '987654321',
    name: 'Maria Garcia',
    username: 'maria_garcia',
    isActive: true,
    invitedAt: '2024-01-12T14:20:00Z',
    joinedAt: '2024-01-12T15:45:00Z',
    lastSeen: '2024-01-15T20:10:00Z',
  },
  {
    id: 'emp-3',
    restaurantId: 'rest-1',
    telegramUserId: '456789123',
    name: 'Alex Chen',
    isActive: false,
    invitedAt: '2024-01-08T09:15:00Z',
    joinedAt: '2024-01-08T11:20:00Z',
    lastSeen: '2024-01-14T16:30:00Z',
  },
];

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      employees: [],
      inviteLinks: [],
      isLoading: false,
      error: null,
      lastGeneratedInvite: null,

      // Actions
      fetchEmployees: async (restaurantId: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));

          const restaurantEmployees = mockEmployees.filter(emp => emp.restaurantId === restaurantId);

          set({
            employees: restaurantEmployees,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch employees',
          });
        }
      },

      removeEmployee: async (employeeId: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            employees: state.employees.filter(emp => emp.id !== employeeId),
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to remove employee',
          });
          throw error;
        }
      },

      updateEmployeeStatus: async (employeeId: string, isActive: boolean) => {
        // Optimistic update
        set(state => ({
          employees: state.employees.map(emp =>
            emp.id === employeeId ? { ...emp, isActive } : emp
          ),
        }));

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Update is already applied optimistically
        } catch (error) {
          // Revert optimistic update on error
          set(state => ({
            employees: state.employees.map(emp =>
              emp.id === employeeId ? { ...emp, isActive: !isActive } : emp
            ),
            error: error instanceof Error ? error.message : 'Failed to update employee status',
          }));
          throw error;
        }
      },

      generateInviteLink: async (restaurantId: string, expiresInHours: number = 24) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          const token = generateId() + generateId(); // Generate a longer token
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + expiresInHours);

          const inviteLink: InviteLink = {
            id: generateId(),
            restaurantId,
            token,
            url: `https://t.me/foodcourtio_bot?start=${token}`,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString(),
            isUsed: false,
          };

          set(state => ({
            inviteLinks: [...state.inviteLinks, inviteLink],
            lastGeneratedInvite: inviteLink,
            isLoading: false,
          }));

          return inviteLink;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to generate invite link',
          });
          throw error;
        }
      },

      getInviteLinks: async (restaurantId: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));

          // Filter invite links for the restaurant
          const restaurantInviteLinks = get().inviteLinks.filter(link => link.restaurantId === restaurantId);

          set({
            inviteLinks: restaurantInviteLinks,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch invite links',
          });
        }
      },

      revokeInviteLink: async (inviteLinkId: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));

          set(state => ({
            inviteLinks: state.inviteLinks.filter(link => link.id !== inviteLinkId),
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to revoke invite link',
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearLastGeneratedInvite: () => {
        set({ lastGeneratedInvite: null });
      },
    }),
    {
      name: 'employee-storage',
      partialize: (state) => ({
        employees: state.employees,
        inviteLinks: state.inviteLinks,
      }),
    }
  )
);