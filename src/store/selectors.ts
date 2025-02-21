import { useAppStore } from './index';
import { useUIStore } from './ui-store';

// Specific selectors to prevent unnecessary re-renders
export const useTheme = () => useAppStore((state) => state.theme);
export const useSidebarState = () => useAppStore((state) => state.sidebarCollapsed);
export const useCurrentWorkspace = () => useAppStore((state) => state.currentWorkspace);
export const useNotifications = () => useAppStore((state) => state.notifications);

export const useModalState = (modalId: string) => 
  useUIStore((state) => state.activeModals.includes(modalId));
export const useLoadingState = (key: string) =>
  useUIStore((state) => state.loadingStates[key]);
export const useError = (key: string) =>
  useUIStore((state) => state.errors[key]); 