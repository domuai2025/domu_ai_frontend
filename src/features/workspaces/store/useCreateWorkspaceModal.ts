import { create } from 'zustand';

interface CreateWorkspaceModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCreateWorkspaceModal = create<CreateWorkspaceModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
})); 