import { create } from 'zustand';

interface UIState {
  activeModals: string[];
  loadingStates: Record<string, boolean>;
  errors: Record<string, Error | null>;
  // Actions
  showModal: (modalId: string) => void;
  hideModal: (modalId: string) => void;
  setLoading: (key: string, isLoading: boolean) => void;
  setError: (key: string, error: Error | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeModals: [],
  loadingStates: {},
  errors: {},

  showModal: (modalId) => set((state) => ({
    activeModals: [...state.activeModals, modalId]
  })),
  hideModal: (modalId) => set((state) => ({
    activeModals: state.activeModals.filter(id => id !== modalId)
  })),
  setLoading: (key, isLoading) => set((state) => ({
    loadingStates: { ...state.loadingStates, [key]: isLoading }
  })),
  setError: (key, error) => set((state) => ({
    errors: { ...state.errors, [key]: error }
  }))
})); 