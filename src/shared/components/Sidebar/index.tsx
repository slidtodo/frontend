'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronsRightIcon,
  SettingsIcon,
  LogOutIcon,
  FlagIcon,
  CopyCheckIcon,
  BellIcon,
  MenuIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';
import { Accordion } from 'radix-ui';
import { useQuery } from '@tanstack/react-query';

import SidebarMobileCase from './SidebarMobileCase';
import { SinglePostModal } from '../Modal/SinglePostModal';

import { useSidebarContext, useSidebarOpen, MenuItem } from '@/contexts/SidebarContext';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { useModalStore } from '@/shared/stores/useModalStore';
import { usePostGoal } from '@/lib/mutations';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import { userQueries } from '@/lib/queryKeys';
import { CurrentUserResponse } from '@/lib/api';

export default function Sidebar() {
  const breakpoint = useBreakpoint();

  const { data: user } = useQuery(userQueries.current());

  if (breakpoint === null) return null;

  if (breakpoint === 'mobile') return <SidebarMobile user={user} />;
  else return <SidebarDesktopTablet user={user} />;
}

// 모바일일 때 렌더링 되는 사이드바 컴포넌트
interface SidebarMobileProps {
  user: CurrentUserResponse | undefined;
}
function SidebarMobile({ user }: SidebarMobileProps) {
  return (
    <div className="flex items-center border-b-2 border-gray-200 bg-white px-5 py-4">
      <MenuIcon size={24} className="pr-3 text-gray-500 hover:cursor-pointer" />
      <SidebarMobileCase user={user} />
    </div>
  );
}

// 데스크탑과 태블릿에서 렌더링 되는 사이드바 컴포넌트
interface SidebarDesktopTabletProps {
  user: CurrentUserResponse | undefined;
}
function SidebarDesktopTablet({ user }: SidebarDesktopTabletProps) {
  const { openModal } = useModalStore();
  const { toggle, getMenus } = useSidebarContext();
  const isOpen = useSidebarOpen();
  const pathname = usePathname();

  const { mutate } = usePostGoal();

  const menus = getMenus();
  const projectName = 'Bearlog';
  const { openTodoCreateModal } = useTodoCreateModal();

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-tr-[32px] rounded-br-[32px] bg-white transition-all duration-300 ${
        isOpen ? 'min-w-[250px] gap-[80px] p-4 lg:min-w-[362px] lg:gap-[140px] lg:p-8' : 'min-w-[80px] gap-8 px-6 py-8'
      }`}
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
              src={'/image/main-logo.svg'}
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
              {projectName}
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
            <button className="flex items-center justify-start gap-[10px] rounded-[20px] px-[14px] py-[10px] transition-all duration-100 hover:bg-gray-100">
              <SettingsIcon color="#BBBBBB" size={24} />
              <span className="text-lg font-semibold text-gray-500">설정</span>
            </button>
            <button className="flex items-center justify-start gap-[10px] rounded-[20px] px-[14px] py-[10px] transition-all duration-100 hover:bg-gray-100">
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
            onClick={() =>
              openTodoCreateModal({
                goalDetailId: undefined,
                todo: {
                  title: '',
                  goalId: undefined as unknown as number,
                  dueDate: undefined,
                  linkUrl: undefined,
                  imageUrl: undefined,
                  tags: [],
                },
              })
            }
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
            <Image src={user?.profileImageUrl || '/image/default-profile.png'} alt="Character" width={38} height={38} />
            <div className="flex flex-col items-start">
              <span className="w-fit text-sm font-medium lg:w-full">{user?.nickname}</span>
              <span className="hidden text-sm font-medium text-[#A0A0A0] lg:block">{user?.email}</span>
            </div>
          </Link>

          <button
            className={`group hover:text-bearlog-600 relative text-gray-500 transition-all duration-200 ${
              isOpen ? 'rounded-[999px] border border-gray-200 p-[20px]' : 'p-0'
            }`}
          >
            <BellIcon size={24} className="transition-transform group-hover:scale-110" />
            <div
              className={`bg-bearlog-500 absolute top-[2px] right-[5px] rounded-full ${isOpen ? 'h-3 w-3' : 'h-2 w-2'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function isMenuActive(menu: MenuItem, pathname: string) {
  return menu.href === pathname || menu.subMenus?.some((subMenu) => subMenu.href === pathname);
}

function SidebarMenuEntry({ menu, pathname }: { menu: MenuItem; pathname: string }) {
  const isActive = isMenuActive(menu, pathname);

  if (!menu.subMenus?.length) {
    return (
      <Link
        href={menu.href}
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
      <Accordion.Content className="w-full">
        {menu.subMenus.map((subMenu) => {
          const isSubMenuActive = subMenu.href === pathname;
          return (
            <Link
              key={subMenu.href}
              href={subMenu.href}
              className={`group flex w-[calc(100%-1rem)] items-center justify-start gap-2 rounded-[20px] px-4 py-1 transition-all duration-200 lg:px-6 lg:py-2`}
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
