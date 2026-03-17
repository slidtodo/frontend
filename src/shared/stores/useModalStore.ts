import { create } from 'zustand';
import { ReactNode } from 'react';

interface ModalStore {
  isOpen: boolean;
  content: ReactNode | null;
  onClose?: () => void;
  openModal: (content: ReactNode, onClose?: () => void) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  isOpen: false,
  content: null,
  onClose: undefined,

  openModal: (content, onClose) => set({ isOpen: true, content, onClose }), 
  closeModal: () => {
    get().onClose?.();
    set({ isOpen: false, content: null, onClose: undefined });
  },
}));
