import { create } from 'zustand';

interface CreateChannelModalStore {
  isOpen: boolean;
  workspaceId?: string;
  open: (workspaceId: string) => void;
  close: () => void;
}

export const useCreateChannelModal = create<CreateChannelModalStore>((set) => ({
  isOpen: false,
  workspaceId: undefined,
  open: (workspaceId) => set({ isOpen: true, workspaceId }),
  close: () => set({ isOpen: false, workspaceId: undefined }),
})); 