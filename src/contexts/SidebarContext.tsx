'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { LayoutGridIcon, FlagIcon, CalendarDaysIcon, ListCheckIcon } from 'lucide-react';

import { goalQueries } from '@/lib/queryKeys';
interface MenuBase {
  icon?: React.ReactNode;
  name: string;
}
interface SubMenu extends MenuBase {
  href: string;
}
export interface MenuItem extends MenuBase {
  href: string;
  subMenus?: SubMenu[];
}

interface SidebarContextType {
  toggle: () => void;
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

  const { data: goal } = useQuery(goalQueries.list());
  const goalData = useMemo(() => goal?.goals ?? [], [goal]);

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
        subMenus: goalData.map((goal) => ({
          name: goal.title ?? '',
          href: `/goal/${goal.id}`,
        })),
      },
      {
        icon: <ListCheckIcon />,
        name: '할 일',
        href: '/dashboard/all-todo',
      },
      // {
      //   icon: <CalendarDaysIcon />,
      //   name: '캘린더',
      //   href: '/calendar',
      // },
      // TODO: 소통게시판, 찜한 할일은 중간 이후에 활성화
      // {
      //   icon: <MessageSquareIcon />,
      //   name: '소통게시판',
      //   href: '/community',
      // },
      // {
      //   icon: <StarIcon />,
      //   name: '찜한 할일',
      //   href: '/favorite-todo',
      // },
    ];
  }, [goalData]);

  const sidebar = useMemo<SidebarContextType>(() => {
    const toggle = () => setIsOpen((prev) => !prev);
    const getMenus = () => allMenus;
    const getAccessibleMenus = () => allMenus;
    return { toggle, getMenus, getAccessibleMenus };
  }, [allMenus]);

  const currentMenu = useMemo(() => {
    return (
      allMenus.find((menu) => menu.href === pathname || menu.subMenus?.some((subMenu) => subMenu.href === pathname)) ||
      null
    );
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
  if (!context) throw new Error('useSidebarMenu must be used within SidebarProvider');
  return context;
}
