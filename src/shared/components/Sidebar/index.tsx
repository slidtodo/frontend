'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronsRightIcon, SettingsIcon, LogOutIcon, FlagIcon, CopyCheckIcon, BellIcon, MenuIcon } from 'lucide-react';

import { useSidebarContext, useSidebarOpen } from '@/contexts/SidebarContext';
import { useMobile } from '@/shared/hooks/useBreakPoint';

export default function Sidebar() {
  const isMobile = useMobile();

  if (isMobile) return <SidebarMobile />;

  return <SidebarDesktopTablet />;
}

// 모바일일 때 렌더링 되는 사이드바 컴포넌트
function SidebarMobile() {
  return (
    <div className="flex items-center justify-between border-b-2 border-[#DDDDDD] bg-white px-5 py-4">
      <div className="flex gap-[12px]">
        <MenuIcon size={24} className="text-[#737373] hover:cursor-pointer" />
        {/* TODO: 체다치즈님의 목표 삭제하고 서버 데이터 가져와야 함 */}
        <span className="text-base font-semibold text-[#333333]">체다치즈님의 목표</span>
      </div>
      <button className="group relative text-[#737373] transition-all duration-200 hover:bg-gray-100 hover:text-[#FF8442]">
        <BellIcon size={24} className="transition-transform group-hover:scale-110" />
        {/* 주황색 알람 점 */}
        <div className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-[#FF8442]"></div>
      </button>
    </div>
  );
}

// 데스크탑과 태블릿에서 렌더링 되는 사이드바 컴포넌트
function SidebarDesktopTablet() {
  const { toggle, getMenus } = useSidebarContext();
  const isOpen = useSidebarOpen();

  const menus = getMenus();
  return (
    <div
      className={`flex h-full flex-col justify-between rounded-tr-[32px] rounded-br-[32px] bg-white transition-all duration-300 ${isOpen ? 'min-w-[250px] p-4 lg:min-w-[362px] lg:p-8' : 'min-w-[80px] px-6 py-8'} `}
    >
      <div className={`flex flex-col justify-center gap-4 lg:gap-8 ${isOpen ? 'items-end' : 'w-fit items-center'}`}>
        <button
          onClick={toggle}
          className="cursor-pointer transition-colors hover:text-gray-600"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isOpen}
        >
          <ChevronsRightIcon size={32} color="#CCC" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <Link
          href="/dashboard"
          className={`flex items-center ${isOpen ? 'w-full gap-4 pr-[22px] pl-2' : 'w-fit gap-0 p-0'} `}
        >
          <div className={`relative ${isOpen ? 'h-12 w-12' : 'h-8 w-8'}`}>
            <Image
              priority
              src={'/image/main-logo.svg'}
              alt="Logo"
              fill
              className={`object-contain ${isOpen ? 'h-12 w-12' : 'h-8 w-8'}`}
            />
          </div>
          <h2
            className={`w-fit text-2xl font-semibold text-gray-800 transition-all duration-300 lg:text-3xl ${isOpen ? 'block' : 'hidden'}`}
          >
            Slid to do
          </h2>
        </Link>
        <div className={`flex w-full flex-col gap-6 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col gap-3">
            {menus.map((menu) => (
              <Link
                key={menu.name}
                href={menu.href}
                className="group flex w-full items-center justify-start gap-[8px] rounded-[20px] px-[12px] py-[10px] transition-all duration-200 hover:bg-[#FEF2E3] lg:px-[16px] lg:py-[14px]"
              >
                <span className="text-[#CCCCCC] group-hover:text-[#EF6C00]">{menu.icon}</span>
                <span className="text-lg font-semibold text-[#333333] group-hover:font-bold group-hover:text-[#DC5203]">
                  {menu.name}
                </span>
              </Link>
            ))}
          </div>
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
      <div className={`flex flex-col items-center gap-8 transition-all duration-300`}>
        <div className={`w-full gap-4 ${isOpen ? 'flex' : 'hidden'}`}>
          {/* TODO: 버튼 컴포넌트로 교체 필요 */}
          <button className="group flex w-full flex-col items-center justify-center gap-2 rounded-[32px] bg-[#FF8442] px-2 py-4 transition-all duration-200 hover:bg-[#F07533] hover:shadow-lg lg:px-[22.5px] lg:py-8">
            <FlagIcon
              className="h-8 w-8 text-[#ffffff] transition-transform group-hover:scale-110 lg:h-10 lg:w-10"
              size={40}
            />
            <span className="text-md font-semibold text-[#ffffff] transition-all group-hover:font-bold lg:text-lg">
              새 목표
            </span>
          </button>
          <button className="group flex w-full flex-col items-center justify-center gap-2 rounded-[32px] border border-[#FF8442] bg-[#ffffff] px-2 py-4 transition-all duration-200 hover:bg-[#FEF2E3] hover:shadow-lg lg:px-[22.5px] lg:py-8">
            <CopyCheckIcon
              className="h-8 w-8 text-[#FF8442] transition-transform group-hover:scale-110 lg:h-10 lg:w-10"
              size={40}
            />
            <span className="text-md font-semibold text-[#FF8442] transition-all group-hover:font-bold lg:text-lg">
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

          {/* TODO: 알람 표시 기능구현 */}
          <button
            className={`group relative text-[#737373] transition-all duration-200 hover:bg-gray-100 hover:text-[#FF8442] ${isOpen ? 'rounded-[999px] border border-[#DDDDDD] p-[20px]' : 'p-0'} `}
          >
            <BellIcon size={24} className="transition-transform group-hover:scale-110" />
            {/* 주황색 알람 점 */}
            <div className={`absolute top-0.5 right-0.5 rounded-full bg-[#FF8442] ${isOpen ? 'h-3 w-3' : 'h-2 w-2'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
