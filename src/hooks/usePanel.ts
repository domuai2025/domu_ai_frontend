import { create } from 'zustand';

interface PanelStore {
  isOpen: boolean;
  panelContent: React.ReactNode | null;
  parentMessageId: string | null;
  profileMemberId: string | null;
  open: (content: React.ReactNode) => void;
  close: () => void;
}

export const usePanel = create<PanelStore>((set) => ({
  isOpen: false,
  panelContent: null,
  parentMessageId: null,
  profileMemberId: null,
  open: (content) => set({ isOpen: true, panelContent: content }),
  close: () => set({ isOpen: false, panelContent: null, parentMessageId: null, profileMemberId: null }),
}));
