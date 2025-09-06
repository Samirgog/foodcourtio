import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar and navigation
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Modals and dialogs
  activeModal: string | null;
  modalData: any;
  
  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;
  
  // Theme and appearance
  isDarkMode: boolean;
  previewMode: boolean;
  selectedThemeId: string;
  
  // Context menu
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    items: Array<{
      label: string;
      action: () => void;
      icon?: string;
      danger?: boolean;
    }>;
  } | null;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    timestamp: number;
  }>;
  
  // Search and filters
  searchQuery: string;
  activeFilters: Record<string, any>;
  
  // Drag and drop
  dragState: {
    isDragging: boolean;
    draggedItem: any;
    dragType: string | null;
  };
}

interface UIActions {
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Modals
  openModal: (modalName: string, data?: any) => void;
  closeModal: () => void;
  
  // Loading
  setGlobalLoading: (loading: boolean, message?: string) => void;
  
  // Theme
  toggleDarkMode: () => void;
  setDarkMode: (darkMode: boolean) => void;
  setPreviewMode: (preview: boolean) => void;
  setSelectedTheme: (themeId: string) => void;
  
  // Context menu
  openContextMenu: (x: number, y: number, items: UIState['contextMenu']['items']) => void;
  closeContextMenu: () => void;
  
  // Notifications
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Search and filters
  setSearchQuery: (query: string) => void;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  
  // Drag and drop
  setDragState: (state: Partial<UIState['dragState']>) => void;
  clearDragState: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: true,
      sidebarCollapsed: false,
      activeModal: null,
      modalData: null,
      globalLoading: false,
      loadingMessage: null,
      isDarkMode: false,
      previewMode: false,
      selectedThemeId: 'modern',
      contextMenu: null,
      notifications: [],
      searchQuery: '',
      activeFilters: {},
      dragState: {
        isDragging: false,
        draggedItem: null,
        dragType: null,
      },

      // Actions
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      toggleSidebarCollapse: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      openModal: (modalName: string, data?: any) => {
        set({ activeModal: modalName, modalData: data });
      },

      closeModal: () => {
        set({ activeModal: null, modalData: null });
      },

      setGlobalLoading: (loading: boolean, message?: string) => {
        set({ globalLoading: loading, loadingMessage: message || null });
      },

      toggleDarkMode: () => {
        set(state => ({ isDarkMode: !state.isDarkMode }));
      },

      setDarkMode: (darkMode: boolean) => {
        set({ isDarkMode: darkMode });
      },

      setPreviewMode: (preview: boolean) => {
        set({ previewMode: preview });
      },

      setSelectedTheme: (themeId: string) => {
        set({ selectedThemeId: themeId });
      },

      openContextMenu: (x: number, y: number, items: UIState['contextMenu']['items']) => {
        set({
          contextMenu: {
            isOpen: true,
            x,
            y,
            items,
          },
        });
      },

      closeContextMenu: () => {
        set({ contextMenu: null });
      },

      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now();
        const newNotification = {
          ...notification,
          id,
          timestamp,
          duration: notification.duration || 5000,
        };

        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration
        if (newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },

      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setFilter: (key: string, value: any) => {
        set(state => ({
          activeFilters: { ...state.activeFilters, [key]: value },
        }));
      },

      clearFilters: () => {
        set({ activeFilters: {} });
      },

      setDragState: (newState: Partial<UIState['dragState']>) => {
        set(state => ({
          dragState: { ...state.dragState, ...newState },
        }));
      },

      clearDragState: () => {
        set({
          dragState: {
            isDragging: false,
            draggedItem: null,
            dragType: null,
          },
        });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        sidebarCollapsed: state.sidebarCollapsed,
        isDarkMode: state.isDarkMode,
        selectedThemeId: state.selectedThemeId,
      }),
    }
  )
);

// Convenience hooks for common UI patterns
export const useNotifications = () => {
  const notifications = useUIStore(state => state.notifications);
  const addNotification = useUIStore(state => state.addNotification);
  const removeNotification = useUIStore(state => state.removeNotification);
  const clearNotifications = useUIStore(state => state.clearNotifications);

  const showSuccess = (title: string, message?: string) => {
    addNotification({ type: 'success', title, message });
  };

  const showError = (title: string, message?: string) => {
    addNotification({ type: 'error', title, message, duration: 8000 });
  };

  const showWarning = (title: string, message?: string) => {
    addNotification({ type: 'warning', title, message });
  };

  const showInfo = (title: string, message?: string) => {
    addNotification({ type: 'info', title, message });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export const useModal = () => {
  const activeModal = useUIStore(state => state.activeModal);
  const modalData = useUIStore(state => state.modalData);
  const openModal = useUIStore(state => state.openModal);
  const closeModal = useUIStore(state => state.closeModal);

  const isOpen = (modalName: string) => activeModal === modalName;

  return {
    activeModal,
    modalData,
    openModal,
    closeModal,
    isOpen,
  };
};

export const useContextMenu = () => {
  const contextMenu = useUIStore(state => state.contextMenu);
  const openContextMenu = useUIStore(state => state.openContextMenu);
  const closeContextMenu = useUIStore(state => state.closeContextMenu);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    isOpen: contextMenu?.isOpen || false,
  };
};