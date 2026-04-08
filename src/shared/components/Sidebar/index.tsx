'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronsRightIcon,
  SettingsIcon,
  LogOutIcon,
  FlagIcon,
  CopyCheckIcon,
  MenuIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  XIcon,
} from 'lucide-react';
import { Accordion } from 'radix-ui';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import SidebarMobileCase from './SidebarMobileCase';
import SinglePostModal from '../Modal/SinglePostModal';
import { SettingsModal } from '../Modal/SettingsModal';
import NotificationDropdown from './NotificationDropdown';

import { useSidebarContext, useSidebarOpen, MenuItem } from '@/shared/contexts/SidebarContext';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { useModalStore } from '@/shared/stores/useModalStore';
import { usePostGoal, usePostLogout } from '@/shared/lib/query/mutations';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import { userQueries } from '@/shared/lib/query/queryKeys';
import { CurrentUserResponse } from '@/shared/lib/api';

// TODO: 전체적으로 정리필요
export default function Sidebar() {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === 'tablet';
  const isMobile = breakpoint === 'mobile';

  const { data: user } = useQuery(userQueries.current());

  if (breakpoint === null) return null;

  if (isMobile) return <SidebarMobile user={user} />;
  else return <SidebarDesktopTablet user={user} isTablet={isTablet} />;
}

// 모바일일 때 렌더링 되는 사이드바 컴포넌트
interface SidebarMobileProps {
  user: CurrentUserResponse | undefined;
}
function SidebarMobile({ user }: SidebarMobileProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { mutate } = usePostGoal();
  const { mutate: logout } = usePostLogout();
  const { openTodoCreateModal } = useTodoCreateModal();
  const pathname = usePathname();
  const { menus, goals } = useSidebarContext();
  const { openModal } = useModalStore();
  const selectedGoalId = getSelectedGoalId(pathname, goals);

  const openMobileMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setMobileMenuMounted(true);
    requestAnimationFrame(() => setMobileMenuOpen(true));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);

    closeTimeoutRef.current = setTimeout(() => {
      setMobileMenuMounted(false);
      closeTimeoutRef.current = null;
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="flex items-center gap-3 border-b-2 border-gray-200 bg-white px-5 py-4">
        <button onClick={openMobileMenu} className="cursor-pointer transition-colors hover:text-gray-600">
          <MenuIcon size={24} className="text-gray-500" />
        </button>
        <SidebarMobileCase user={user} />
      </div>

      {/* Mobile Menu Modal */}
      {mobileMenuMounted && (
        <>
          {/* Overlay */}
          <button
            type="button"
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex w-full items-center justify-center overflow-hidden">
            <div
              className={`h-full w-full overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col gap-6 p-6">
                <div className="flex w-full justify-end">
                  <button onClick={closeMobileMenu} className="w-fit cursor-pointer text-gray-400 hover:text-gray-600">
                    <XIcon size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 rounded-2xl shadow-[0_3px_20px_rgba(0,200,127,0.35)]">
                    <Image priority src="/image/bearlog-icon.png" alt="Logo" fill className="object-contain" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Bearlog</h2>
                </div>
              </div>

              {/* Menu Items */}
              <div className="px-4 py-6">
                <Accordion.Root
                  type="multiple"
                  defaultValue={menus.filter((menu) => isMenuActive(menu, pathname)).map((menu) => menu.name)}
                  className="flex flex-col gap-2"
                >
                  {menus.map((menu) => (
                    <SidebarMenuEntry key={menu.name} menu={menu} pathname={pathname} onClose={closeMobileMenu} />
                  ))}
                </Accordion.Root>

                {/* Settings & Logout */}
                <div className="mt-6 pt-4">
                  <button
                    onClick={() => {
                      openModal(<SettingsModal />);
                      closeMobileMenu();
                    }}
                    className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-3 transition-all hover:bg-gray-50"
                  >
                    <SettingsIcon color="#BBBBBB" size={20} />
                    <span className="text-lg font-semibold text-gray-500">설정</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-3 transition-all hover:bg-gray-50"
                  >
                    <LogOutIcon color="#BBBBBB" size={20} />
                    <span className="text-lg font-semibold text-gray-500">로그아웃</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      openModal(
                        <SinglePostModal
                          title="목표 생성"
                          placeholder="목표 제목을 입력하세요"
                          onConfirm={(title) => mutate({ title })}
                        />,
                      );
                      closeMobileMenu();
                    }}
                    className="group bg-bearlog-500 flex flex-1 items-center justify-center gap-1 rounded-full py-3 transition-all hover:shadow-lg"
                  >
                    <FlagIcon color="#FFFFFF" className="h-6 w-6 transition-transform group-hover:scale-110" />
                    <span className="text-base font-semibold text-white">새 목표</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedGoalId) return;
                      openTodoCreateModal({
                        goalDetailId: selectedGoalId,
                        todo: {
                          title: '',
                          goalId: selectedGoalId,
                          dueDate: undefined,
                          linkUrl: undefined,
                          imageUrl: undefined,
                          tags: [],
                        },
                      });
                      closeMobileMenu();
                    }}
                    disabled={!selectedGoalId}
                    className="group border-bearlog-500 flex flex-1 items-center justify-center gap-1 rounded-full border bg-white py-3 transition-all hover:shadow-lg disabled:opacity-50"
                  >
                    <CopyCheckIcon color="#00C87F" className="h-6 w-6 transition-transform group-hover:scale-110" />
                    <span className="text-bearlog-600 text-base font-semibold">새 할일</span>
                  </button>
                </div>
              </div>

              {/* Profile */}
              <div className="p-4">
                <Link
                  href="/mypage"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-full border border-gray-200 px-4 py-2"
                >
                  <Image
                    src={user?.profileImageUrl || '/image/default-profile.png'}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-800">{user?.nickname}</p>
                    <p className="truncate text-xs text-gray-400">{user?.email}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// 데스크탑과 태블릿에서 렌더링 되는 사이드바 컴포넌트
interface SidebarDesktopTabletProps {
  user: CurrentUserResponse | undefined;
  isTablet: boolean;
}
function SidebarDesktopTablet({ user, isTablet }: SidebarDesktopTabletProps) {
  const { openModal } = useModalStore();
  const { toggle, menus, goals } = useSidebarContext();
  const isOpen = useSidebarOpen();
  const pathname = usePathname();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { mutate } = usePostGoal();
  const { mutate: logout } = usePostLogout();

  const { openTodoCreateModal } = useTodoCreateModal();
  const selectedGoalId = getSelectedGoalId(pathname, goals);

  return (
    <>
      {isTablet && isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={toggle}
        />
      )}
      <div
        className={clsx(
          'flex flex-col rounded-tr-[32px] rounded-br-[32px] bg-white transition-all duration-300',
          isOpen ? 'p-4' : 'min-w-[80px] gap-8 px-6 py-8',
          isOpen &&
            (isTablet
              ? 'fixed top-0 left-0 z-50 h-full w-[320px] shadow-2xl'
              : 'gap-[80px] lg:min-w-[362px] lg:gap-[140px] lg:p-8'),
        )}
      >
        <div className={`flex flex-col justify-center gap-4 lg:gap-8 ${isOpen ? 'items-end' : 'w-fit items-center'}`}>
          <button
            onClick={toggle}
            className="cursor-pointer transition-colors hover:text-gray-600"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={isOpen}
          >
            <ChevronsRightIcon
              size={32}
              color="#cccccc"
              className={`${isOpen ? 'rotate-180' : ''} transition-transform duration-300`}
            />
          </button>

          <Link
            href="/dashboard"
            className={`flex items-center ${isOpen ? 'w-full gap-4 pr-[22px] pl-2' : 'w-fit gap-0 p-0'}`}
          >
            <div
              className={`relative shrink-0 ${isOpen ? 'h-12 w-12' : 'h-8 w-8'} rounded-2xl shadow-[0_3px_20px_rgba(0,200,127,0.35)]`}
            >
              {/* TODO: 해당 로고 바뀌면 교체 필요 */}
              <Image
                priority
                src={'/image/bearlog-icon.png'}
                alt="Logo"
                fill
                className={`object-contain ${isOpen ? 'h-12 w-12' : 'h-8 w-8'}`}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? 'max-w-[220px] opacity-100' : 'max-w-0 opacity-0'
              }`}
              aria-hidden={!isOpen}
            >
              <h2 className="pl-1 text-2xl leading-[42px] font-semibold whitespace-nowrap text-gray-800 lg:text-3xl">
                Bearlog
              </h2>
            </div>
          </Link>

          <div className={`flex w-full flex-col gap-6 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
            <Accordion.Root
              type="multiple"
              defaultValue={menus.filter((menu) => isMenuActive(menu, pathname)).map((menu) => menu.name)}
              className="flex flex-col gap-3"
            >
              {menus.map((menu) => (
                <SidebarMenuEntry key={menu.name} menu={menu} pathname={pathname} />
              ))}
            </Accordion.Root>

            <div className="flex w-full flex-col">
              <button
                onClick={() => openModal(<SettingsModal />)}
                className="flex items-center justify-start gap-[10px] rounded-[20px] px-[14px] py-[10px] transition-all duration-100 hover:bg-gray-100"
              >
                <SettingsIcon color="#BBBBBB" size={24} />
                <span className="text-lg font-semibold text-gray-500">설정</span>
              </button>
              <button
                onClick={() => logout()}
                className="flex items-center justify-start gap-[10px] rounded-[20px] px-[14px] py-[10px] transition-all duration-100 hover:bg-gray-100"
              >
                <LogOutIcon color="#BBBBBB" size={24} />
                <span className="text-lg font-semibold text-gray-500">로그아웃</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 transition-all duration-300">
          <div className={`w-full gap-4 ${isOpen ? 'flex' : 'hidden'}`}>
            <button
              onClick={() =>
                openModal(
                  <SinglePostModal
                    title="목표 생성"
                    placeholder="목표 제목을 입력하세요"
                    onConfirm={(title) => mutate({ title })}
                  />,
                )
              }
              className="group bg-bearlog-500 flex w-full flex-col items-center justify-center gap-2 rounded-[32px] px-2 py-4 transition-all duration-200 hover:shadow-lg lg:px-[22.5px] lg:py-8"
            >
              <FlagIcon
                color="#FFFFFF"
                className="h-8 w-8 transition-transform group-hover:scale-110 lg:h-10 lg:w-10"
                size={40}
              />
              <span className="text-md cursor-pointer font-semibold text-[#ffffff] transition-all group-hover:font-bold lg:text-lg">
                새 목표
              </span>
            </button>
            <button
              onClick={() => {
                if (!selectedGoalId) return;

                openTodoCreateModal({
                  goalDetailId: selectedGoalId,
                  todo: {
                    title: '',
                    goalId: selectedGoalId,
                    dueDate: undefined,
                    linkUrl: undefined,
                    imageUrl: undefined,
                    tags: [],
                  },
                });
              }}
              disabled={!selectedGoalId}
              className="group border-bearlog-500 flex w-full flex-col items-center justify-center gap-2 rounded-[32px] border bg-[#ffffff] px-2 py-4 transition-all duration-200 hover:shadow-lg lg:px-[22.5px] lg:py-8"
            >
              <CopyCheckIcon
                color="#00C87F"
                className="h-8 w-8 transition-transform group-hover:scale-110 lg:h-10 lg:w-10"
                size={40}
              />
              <span className="text-md text-bearlog-600 cursor-pointer font-semibold transition-all group-hover:font-bold lg:text-lg">
                새 할일
              </span>
            </button>
          </div>

          <div className="flex w-full justify-between gap-2">
            <Link
              href="/mypage"
              className={`w-full items-center justify-start gap-[8px] rounded-[999px] border border-gray-200 px-[20px] py-[12px] lg:pr-[42px] lg:pl-[12px] ${isOpen ? 'flex' : 'hidden'}`}
            >
              <Image
                src={user?.profileImageUrl || '/image/default-profile.png'}
                alt="Character Profile Image"
                width={38}
                height={38}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col items-start">
                <div className="flex items-center justify-center">
                  <span className="w-15 truncate text-sm font-medium lg:w-full">{user?.nickname}</span>
                  <ChevronRightIcon size={16} color="#A0A0A0" className="hidden lg:block" />
                </div>
                <span className="hidden truncate text-sm font-medium text-[#A0A0A0] lg:block">{user?.email}</span>
              </div>
            </Link>

            <NotificationDropdown
              isOpen={notificationOpen}
              onClose={() => setNotificationOpen(false)}
              isSidebarOpen={isOpen}
              onOpen={() => setNotificationOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function isMenuActive(menu: MenuItem, pathname: string) {
  return menu.href === pathname || menu.subMenus?.some((subMenu) => subMenu.href === pathname);
}

function getSelectedGoalId(pathname: string, goals: { id?: number }[]) {
  const pathnameGoalId = pathname.startsWith('/goal/') ? Number(pathname.split('/')[2]) : undefined;
  return goals.find((goal) => goal.id === pathnameGoalId)?.id ?? goals[0]?.id;
}

function SidebarMenuEntry({ menu, pathname, onClose }: { menu: MenuItem; pathname: string; onClose?: () => void }) {
  const isActive = isMenuActive(menu, pathname);

  if (!menu.subMenus?.length) {
    return (
      <Link
        href={menu.href}
        onClick={onClose}
        className="group flex w-full items-center justify-start gap-[8px] rounded-[20px] px-[12px] py-[10px] transition-all duration-200 lg:px-[16px] lg:py-[14px]"
      >
        <span
          className={`transition-all duration-200 ${
            isActive ? 'text-[#008354] transition-all' : 'text-gray-300 transition-all group-hover:text-[#339C76]'
          }`}
        >
          {menu.icon}
        </span>
        <span
          className={`text-lg transition-all ${isActive ? 'font-bold text-[#339C76]' : 'font-semibold text-gray-700 group-hover:font-bold group-hover:text-[#339C76]'}`}
        >
          {menu.name}
        </span>
      </Link>
    );
  }

  return (
    <Accordion.Item value={menu.name} className="flex w-full flex-col gap-2">
      <AccordionTrigger menu={menu} isActive={isActive} />
      <Accordion.Content
        forceMount
        className="group/submenu grid w-full overflow-hidden transition-[grid-template-rows] duration-300 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
      >
        <div className="min-h-0">
          <div className="transition-all duration-300 ease-out group-data-[state=closed]/submenu:-translate-y-1.5 group-data-[state=closed]/submenu:opacity-0 group-data-[state=open]/submenu:translate-y-0 group-data-[state=open]/submenu:opacity-100">
            {menu.subMenus.map((subMenu) => {
              const isSubMenuActive = subMenu.href === pathname;
              return (
                <Link
                  key={subMenu.href}
                  href={subMenu.href}
                  onClick={onClose}
                  className={`group flex w-[calc(100%-1rem)] items-center justify-start gap-2 rounded-[20px] px-4 py-1 transition-all duration-200 hover:bg-[#F2FBF7] lg:px-6 lg:py-2 ${
                    isSubMenuActive ? 'bg-[#F2FBF7]' : ''
                  }`}
                >
                  <span
                    className={`text-sm transition-all ${
                      isSubMenuActive
                        ? 'font-bold text-[#339C76]'
                        : 'font-semibold text-gray-700 group-hover:text-[#339C76]'
                    }`}
                  >
                    {subMenu.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  menu: MenuItem;
  isActive: boolean | undefined;
}
function AccordionTrigger({ children, menu, isActive, ...props }: AccordionTriggerProps) {
  return (
    <Accordion.Trigger
      {...props}
      className={`group flex w-full items-center justify-start gap-[8px] rounded-[20px] px-[12px] py-[10px] transition-all duration-200 lg:px-[16px] lg:py-[14px]`}
    >
      <span className={isActive ? 'text-[#339C76]' : 'text-gray-300 group-hover:text-[#339C76]'}>{menu.icon}</span>
      <span
        className={`text-lg font-semibold transition-all ${isActive ? 'font-bold text-[#339C76]' : 'text-gray-700 group-hover:font-bold group-hover:text-[#339C76]'}`}
      >
        {menu.name}
      </span>
      {children}
      <span className="relative ml-auto flex items-center justify-center text-[#A0A0A0]">
        <ChevronDownIcon
          size={24}
          className="accordion-chevron-down absolute transition-all duration-200 ease-out group-data-[state=open]:-rotate-180 group-data-[state=open]:opacity-0"
          aria-hidden
        />
        <ChevronUpIcon
          size={24}
          className="accordion-chevron-up absolute rotate-180 opacity-0 transition-all duration-200 ease-out group-data-[state=open]:rotate-0 group-data-[state=open]:opacity-100"
          aria-hidden
        />
      </span>
    </Accordion.Trigger>
  );
}
