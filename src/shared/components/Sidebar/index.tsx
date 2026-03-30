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

import SidebarMobileCase from './SidebarMobileCase';
import { SinglePostModal } from '../Modal/SinglePostModal';

import { useSidebarContext } from '@/contexts/SidebarContext';
import { useSidebarOpen } from '@/contexts/SidebarContext';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { useModalStore } from '@/shared/stores/useModalStore';
import { usePostGoal } from '@/lib/mutations';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import { MenuItem } from '@/contexts/SidebarContext';

export default function Sidebar() {
  const breakpoint = useBreakpoint();
  if (breakpoint === null) return null;
  if (breakpoint === 'mobile') return <SidebarMobile />;
  else return <SidebarDesktopTablet />;
}

// 모바일일 때 렌더링 되는 사이드바 컴포넌트
function SidebarMobile() {
  return (
    <div className="flex items-center border-b-2 border-[#DDDDDD] bg-white px-5 py-4">
      <MenuIcon size={24} className="pr-3 text-[#737373] hover:cursor-pointer" />
      <SidebarMobileCase />
    </div>
  );
}

// 데스크탑과 태블릿에서 렌더링 되는 사이드바 컴포넌트
function SidebarDesktopTablet() {
  const { openModal } = useModalStore();
  const { toggle, getMenus } = useSidebarContext();
  const isOpen = useSidebarOpen();
  const pathname = usePathname();

  const { mutate } = usePostGoal();

  const menus = getMenus();
  const projectName = 'Bearlog';
  // console.log('menus: ', menus);
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
            color="#CCCCCC"
            className={`${isOpen ? 'rotate-180' : ''} transition-transform duration-300`}
          />
        </button>

        <Link
          href="/dashboard"
          className={`flex items-center overflow-hidden ${isOpen ? 'w-full gap-4 pr-[22px] pl-2' : 'w-fit gap-0 p-0'}`}
        >
          <div className={`relative shrink-0 ${isOpen ? 'h-12 w-12' : 'h-8 w-8'}`}>
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
            <h2 className="pl-1 text-2xl font-semibold whitespace-nowrap text-gray-800 lg:text-3xl">{projectName}</h2>
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
              <SettingsIcon className="text-[#BBBBBB]" size={24} />
              <span className="text-lg font-semibold text-[#737373]">설정</span>
            </button>
            <button className="flex items-center justify-start gap-[10px] rounded-[20px] px-[14px] py-[10px] transition-all duration-100 hover:bg-gray-100">
              <LogOutIcon className="text-[#BBBBBB]" size={24} />
              <span className="text-lg font-semibold text-[#737373]">로그아웃</span>
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
            className="group flex w-full flex-col items-center justify-center gap-2 rounded-[32px] bg-[#FF8442] px-2 py-4 transition-all duration-200 hover:bg-[#F07533] hover:shadow-lg lg:px-[22.5px] lg:py-8"
          >
            <FlagIcon
              className="h-8 w-8 text-[#ffffff] transition-transform group-hover:scale-110 lg:h-10 lg:w-10"
              size={40}
            />
            <span className="text-md cursor-pointer font-semibold text-[#ffffff] transition-all group-hover:font-bold lg:text-lg">
              새 목표
            </span>
          </button>
          {/** TODO:   goalId: undefined as unknown as number 수정 필요 사이드바 전체적으로 연결할 때 해야함 */}
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
            className="group flex w-full flex-col items-center justify-center gap-2 rounded-[32px] border border-[#FF8442] bg-[#ffffff] px-2 py-4 transition-all duration-200 hover:bg-[#FEF2E3] hover:shadow-lg lg:px-[22.5px] lg:py-8"
          >
            <CopyCheckIcon
              className="h-8 w-8 text-[#FF8442] transition-transform group-hover:scale-110 lg:h-10 lg:w-10"
              size={40}
            />
            <span className="text-md cursor-pointer font-semibold text-[#FF8442] transition-all group-hover:font-bold lg:text-lg">
              새 할일
            </span>
          </button>
        </div>

        <div className="flex w-full justify-between gap-2">
          <button
            className={`w-full items-center justify-start gap-[8px] rounded-[999px] border border-[#DDDDDD] px-[20px] py-[12px] lg:pr-[42px] lg:pl-[12px] ${isOpen ? 'flex' : 'hidden'}`}
          >
            <Image src={'/image/temp-character.svg'} alt="Character" width={38} height={38} />
            <div className="flex flex-col items-start">
              <span className="w-fit text-sm font-medium lg:w-full">닉네임</span>
              <span className="hidden text-sm font-medium text-[#A0A0A0] lg:block">이메일</span>
            </div>
          </button>

          <button
            className={`group relative text-[#737373] transition-all duration-200 hover:bg-gray-100 hover:text-[#FF8442] ${
              isOpen ? 'rounded-[999px] border border-[#DDDDDD] p-[20px]' : 'p-0'
            }`}
          >
            <BellIcon size={24} className="transition-transform group-hover:scale-110" />
            <div
              className={`absolute top-0.5 right-0.5 rounded-full bg-[#FF8442] ${isOpen ? 'h-3 w-3' : 'h-2 w-2'}`}
            ></div>
          </button>
        </div>
      </div>
    </div>
  );
}

function isMenuActive(menu: MenuItem, pathname: string) {
  return menu.href === pathname || menu.subMenus?.some((subMenu) => subMenu.href === pathname);
}

function getMenuButtonClassName(isActive: boolean | undefined) {
  return `group flex w-full items-center justify-start gap-[8px] rounded-[20px] px-[12px] py-[10px] transition-all duration-200 lg:px-[16px] lg:py-[14px] ${
    isActive ? 'bg-[#FEF2E3]' : 'hover:bg-[#FEF2E3]'
  }`;
}

function getMenuLabelClassName(isActive: boolean | undefined) {
  return `text-lg font-semibold transition-all ${isActive ? 'font-bold text-[#DC5203]' : 'text-[#333333] group-hover:font-bold group-hover:text-[#DC5203]'}`;
}

function getMenuIconClassName(isActive: boolean | undefined) {
  return isActive ? 'text-[#EF6C00]' : 'text-[#CCCCCC] group-hover:text-[#EF6C00]';
}

function SidebarMenuEntry({ menu, pathname }: { menu: MenuItem; pathname: string }) {
  const isActive = isMenuActive(menu, pathname);

  if (!menu.subMenus?.length) {
    return (
      <Link href={menu.href} className={getMenuButtonClassName(isActive)}>
        <span className={getMenuIconClassName(isActive)}>{menu.icon}</span>
        <span className={getMenuLabelClassName(isActive)}>{menu.name}</span>
      </Link>
    );
  }

  return (
    <Accordion.Item value={menu.name} className="w-full">
      <AccordionTrigger menu={menu} isActive={isActive} />
      <AccordionContent>
        {menu.subMenus.map((subMenu) => {
          const isSubMenuActive = subMenu.href === pathname;
          return (
            <Link
              key={subMenu.name}
              href={subMenu.href}
              className={`group flex w-[calc(100%-1rem)] items-center justify-start gap-2 rounded-[20px] px-4 py-1 transition-all duration-200 lg:px-6 lg:py-2`}
            >
              <span
                className={`text-base transition-all ${
                  isSubMenuActive
                    ? 'font-bold text-[#DC5203]'
                    : 'font-semibold text-[#666666] group-hover:text-[#DC5203]'
                }`}
              >
                {subMenu.name}
              </span>
            </Link>
          );
        })}
      </AccordionContent>
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
      className={`${getMenuButtonClassName(isActive)} [&[data-state=closed]_.accordion-chevron-up]:hidden [&[data-state=open]_.accordion-chevron-down]:hidden`}
    >
      <span className={getMenuIconClassName(isActive)}>{menu.icon}</span>
      <span className={getMenuLabelClassName(isActive)}>{menu.name}</span>
      {children}
      <span className="ml-auto flex items-center text-[#A0A0A0]">
        <ChevronDownIcon className="accordion-chevron-down h-5 w-5" aria-hidden />
        <ChevronUpIcon className="accordion-chevron-up h-5 w-5" aria-hidden />
      </span>
    </Accordion.Trigger>
  );
}

function AccordionContent({ children, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <Accordion.Content className="w-full" {...props}>
      {children}
    </Accordion.Content>
  );
}
