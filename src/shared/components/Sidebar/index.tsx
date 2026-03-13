'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronsRightIcon, SettingsIcon, LogOutIcon, FlagIcon, CopyCheckIcon, BellIcon, MenuIcon } from 'lucide-react';

import { useSidebarContext } from '@/contexts/SidebarContext';
import { useMobile } from '@/shared/hooks/useBreakPoint';

export default function Sidebar() {
  const isMobile = useMobile();

  if (isMobile) return <SidebarMobile />;

  return <SidebarDesktopTablet />;
}

// 모바일일 때 렌더링 되는 사이드바 컴포넌트
function SidebarMobile() {
  return (
    <div className="flex items-center justify-between py-4 px-5 bg-white border-b-2 border-[#DDDDDD]">
      <div className="flex gap-[12px]">
        <MenuIcon size={24} className="text-[#737373] hover:cursor-pointer" />
        {/* TODO: 체다치즈님의 목표 삭제하고 서버 데이터 가져와야 함 */}
        <span className="text-[#333333] text-base font-semibold">체다치즈님의 목표</span>
      </div>
      <button className="group relative  text-[#737373] hover:bg-gray-100 hover:text-[#FF8442] transition-all duration-200">
        <BellIcon size={24} className="group-hover:scale-110 transition-transform" />
        {/* 주황색 알람 점 */}
        <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#FF8442] rounded-full"></div>
      </button>
    </div>
  );
}

// 데스크탑과 태블릿에서 렌더링 되는 사이드바 컴포넌트
function SidebarDesktopTablet() {
  const { isOpen, toggle, getMenus } = useSidebarContext();
  const menus = getMenus();
  return (
    <div
      className={`flex flex-col   bg-white rounded-tr-[32px] rounded-br-[32px] transition-all duration-300  
      ${isOpen ? 'min-w-[250px] lg:min-w-[362px] p-4 lg:p-8 lg:gap-[140px] gap-[80px]' : 'min-w-[80px] py-8 px-6 gap-8'} `}
    >
      <div
        className={`flex gap-4 lg:gap-8 flex-col justify-center 
        ${isOpen ? 'items-end' : 'items-center w-fit'}`}
      >
        <button
          onClick={toggle}
          className="cursor-pointer hover:text-gray-600 transition-colors"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isOpen}
        >
          <ChevronsRightIcon size={32} />
        </button>
        <Link
          href="/dashboard"
          className={`flex items-center 
          ${isOpen ? 'gap-4 w-full pl-2 pr-[22px]' : 'gap-0 w-fit p-0'} `}
        >
          <div className={`relative ${isOpen ? 'w-12 h-12' : 'w-8 h-8'}`}>
            <Image
              priority
              src={'/image/main-logo.svg'}
              alt="Logo"
              fill
              className={`object-contain ${isOpen ? 'w-12 h-12' : 'w-8 h-8'}`}
            />
          </div>
          <h2
            className={`text-2xl lg:text-3xl font-semibold text-gray-800 w-fit transition-all duration-300  
            ${isOpen ? 'block' : 'hidden'}`}
          >
            Slid to do
          </h2>
        </Link>
        <div
          className={`flex gap-6 flex-col w-full transition-all duration-300  
          ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="flex flex-col gap-3">
            {menus.map((menu) => (
              <Link
                key={menu.name}
                href={menu.href}
                className="group w-full flex items-center justify-start gap-[8px] py-[10px] lg:py-[14px] px-[12px] lg:px-[16px] hover:bg-[#FEF2E3] rounded-[20px] transition-all duration-200"
              >
                <span className="text-[#CCCCCC] group-hover:text-[#EF6C00]">{menu.icon}</span>
                <span className="text-[#333333] text-lg font-semibold group-hover:text-[#DC5203] group-hover:font-bold">
                  {menu.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex flex-col w-full">
            <button className="flex items-center justify-start gap-[10px] py-[10px] px-[14px] hover:bg-gray-100 rounded-[20px] transition-all duration-100">
              <SettingsIcon className="text-[#BBBBBB]" size={24} />
              <span className="text-[#737373] text-lg font-semibold">설정</span>
            </button>
            <button className="flex items-center justify-start gap-[10px] py-[10px] px-[14px] hover:bg-gray-100 rounded-[20px] transition-all duration-100">
              <LogOutIcon className="text-[#BBBBBB] " size={24} />
              <span className="text-[#737373] text-lg font-semibold">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col gap-8 items-center transition-all duration-300  
        `}
      >
        <div className={`gap-4 w-full ${isOpen ? 'flex' : 'hidden'}`}>
          {/* TODO: 버튼 컴포넌트로 교체 필요 */}
          <button className="group w-full flex gap-2 flex-col items-center justify-center py-4 lg:py-8 px-2 lg:px-[22.5px] bg-[#FF8442] rounded-[32px] hover:bg-[#F07533] hover:shadow-lg transition-all duration-200">
            <FlagIcon
              className="text-[#ffffff] group-hover:scale-110 transition-transform w-8 lg:w-10 h-8 lg:h-10"
              size={40}
            />
            <span className="text-[#ffffff] text-md lg:text-lg font-semibold group-hover:font-bold transition-all">
              새 목표
            </span>
          </button>
          <button className="group w-full flex gap-2 flex-col items-center justify-center py-4 lg:py-8 px-2 lg:px-[22.5px] bg-[#ffffff] border border-[#FF8442] rounded-[32px] hover:bg-[#FEF2E3] hover:shadow-lg transition-all duration-200">
            <CopyCheckIcon
              className="text-[#FF8442] group-hover:scale-110 transition-transform w-8 lg:w-10 h-8 lg:h-10"
              size={40}
            />
            <span className="text-[#FF8442] text-md lg:text-lg font-semibold group-hover:font-bold transition-all">
              새 할일
            </span>
          </button>
        </div>
        <div className="flex gap-2 w-full justify-between">
          <button
            className={`w-full gap-[8px] items-center justify-start py-[12px] px-[20px] lg:pr-[42px] lg:pl-[12px] border border-[#DDDDDD] rounded-[999px] 
              ${isOpen ? 'flex' : 'hidden'}`}
          >
            <Image src={'/image/temp-character.svg'} alt="Character" width={38} height={38} />
            <div className="flex flex-col items-start ">
              <span className=" text-sm font-medium w-fit lg:w-full">닉네임</span>
              <span className="text-sm font-medium text-[#A0A0A0] hidden lg:block">이메일</span>
            </div>
          </button>

          {/* TODO: 알람 표시 기능구현 */}
          <button
            className={`group relative text-[#737373] hover:bg-gray-100 hover:text-[#FF8442] transition-all duration-200 
            ${isOpen ? 'p-[20px] border border-[#DDDDDD] rounded-[999px]' : 'p-0'} `}
          >
            <BellIcon size={24} className="group-hover:scale-110 transition-transform " />
            {/* 주황색 알람 점 */}
            <div
              className={`absolute top-0.5 right-0.5 bg-[#FF8442] rounded-full 
              ${isOpen ? 'w-3 h-3' : 'w-2 h-2'}`}
            ></div>
          </button>
        </div>
      </div>
    </div>
  );
}
