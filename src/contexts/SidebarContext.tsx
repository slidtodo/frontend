'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { LayoutGridIcon, FlagIcon, CalendarDaysIcon, MessageSquareIcon, StarIcon } from 'lucide-react';

interface MenuBase {
  icon: React.ReactNode;
  name: string;
}
interface LeafMenu extends MenuBase {
  href: string;
  subMenus?: undefined;
}
interface ParentMenu extends MenuBase {
  href?: undefined;
  subMenus: MenuItem[];
}
type MenuItem = LeafMenu | ParentMenu;

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  getMenus: () => MenuItem[];
  // TODO: 혹시 권한이 필요없다면 해당 아래 코드는 삭제
  getAccessibleMenus: () => MenuItem[];
}

const SidebarOpenContext = createContext<boolean | undefined>(undefined);
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
const SidebarMenuContext = createContext<MenuItem | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  // TODO: 서브메뉴 목표랑 연결하도록 구현 필요
  const allMenus = useMemo<MenuItem[]>(() => {
    return [
      {
        icon: <LayoutGridIcon />,
        name: '대시보드',
        href: '/dashboard',
      },
      {
        icon: <FlagIcon />,
        name: '목표',
        href: '/goal',
      },
      {
        icon: <CalendarDaysIcon />,
        name: '캘린더',
        href: '/calendar',
      },
      {
        icon: <MessageSquareIcon />,
        name: '소통게시판',
        href: '/community',
      },
      {
        icon: <StarIcon />,
        name: '찜한 할일',
        href: '/favorite-todo',
      },
    ];
  }, []);

  const sidebar = useMemo<SidebarContextType>(() => {
    const toggle = () => setIsOpen((prev) => !prev);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const getMenus = () => allMenus;
    const getAccessibleMenus = () => allMenus;
    return { isOpen, toggle, open, close, getMenus, getAccessibleMenus };
  }, [allMenus, isOpen]);

  const currentMenu = useMemo(() => {
    return allMenus.find((menu) => 'href' in menu && menu.href === pathname) || null;
  }, [allMenus, pathname]);

  return (
    <SidebarOpenContext.Provider value={isOpen}>
      <SidebarContext.Provider value={sidebar}>
        <SidebarMenuContext.Provider value={currentMenu}>{children}</SidebarMenuContext.Provider>
      </SidebarContext.Provider>
    </SidebarOpenContext.Provider>
  );
}

export function useSidebarOpen() {
  const context = useContext(SidebarOpenContext);
  if (context === undefined) throw new Error('useSidebarOpen must be used within SidebarProvider');
  return context;
}
export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebarContext must be used within SidebarProvider');
  return context;
}
export function useSidebarMenu() {
  const context = useContext(SidebarMenuContext);
  if (context === undefined) throw new Error('useSidebarMenu must be used within SidebarProvider');
  return context;
}
