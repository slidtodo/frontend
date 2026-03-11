'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggle, open, close }}>{children}</SidebarContext.Provider>
  );
}

export function useSidebarOpen() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebarOpen must be used within SidebarProvider');
  return context.isOpen;
}
export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebarContext must be used within SidebarProvider');
  return context;
}
