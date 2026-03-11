'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronsRightIcon, SettingsIcon, LogOutIcon, FlagIcon, CopyCheckIcon, BellIcon, MenuIcon } from 'lucide-react';

import { useSidebarContext } from '@/contexts/SidebarContext';
import { useMobile } from '@/shared/hooks/useBreakPoint';

import Logo from '../../../../../public/image/main-logo.svg';
import TempCharacter from '../../../../../public/image/temp-character.svg';

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
        <MenuIcon size={24} className="text-[#737373]" />
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
      className={`flex flex-col gap-[140px] bg-white rounded-tr-[32px] rounded-br-[32px] transition-all duration-300  ${isOpen ? 'min-w-[362px] p-8' : 'min-w-[96px] py-8 px-6'} `}
    >
      <div className={`flex gap-8 flex-col justify-center   ${isOpen ? 'items-end' : 'items-center w-fit'}`}>
        <button onClick={toggle} className="cursor-pointer hover:text-gray-600 transition-colors">
          <ChevronsRightIcon size={32} className={`text-gray-400 transition-transform `} />
        </button>
        <Link
          href="/dashboard"
          className={`flex items-center  ${isOpen ? 'gap-4 w-full pl-2 pr-[22px]' : 'gap-0 w-fit p-0'} `}
        >
          <Image priority src={Logo} alt="Logo" width={48} height={48} />
          <h2
            className={`text-3xl font-semibold text-gray-800 w-fit transition-all duration-300  ${isOpen ? 'block' : 'hidden'}`}
          >
            Slid to do
          </h2>
        </Link>
        <div className={`flex gap-6 flex-col w-full  transition-all duration-300  ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col gap-3">
            {menus.map((menu) => {
              if ('href' in menu && menu.href) {
                return (
                  <Link
                    key={menu.name}
                    href={menu.href}
                    className="group w-full flex items-center justify-start gap-[8px] py-[14px] px-[16px] hover:bg-[#FEF2E3] rounded-[20px] transition-all duration-200"
                  >
                    <span className="text-[#CCCCCC] group-hover:text-[#EF6C00]">{menu.icon}</span>
                    <span className="text-[#333333] text-lg font-semibold group-hover:text-[#DC5203]">{menu.name}</span>
                  </Link>
                );
              }
              return null;
            })}
          </div>
          <div className="flex flex-col w-full">
            <button className="flex items-center justify-start gap-[10px] py-[10px] px-[14px] hover:bg-gray-100 rounded-md transition-all duration-100">
              <SettingsIcon className="text-[#BBBBBB]" size={24} />
              <span className="text-[#737373] text-lg font-semibold">설정</span>
            </button>
            <button className="flex items-center justify-start gap-[10px] py-[10px] px-[14px] hover:bg-gray-100 rounded-md transition-all duration-100">
              <LogOutIcon className="text-[#BBBBBB] " size={24} />
              <span className="text-[#737373] text-lg font-semibold">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
      <div className={`flex flex-col gap-8 items-center transition-all duration-300  ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex gap-4 w-full">
          {/* TODO: 버튼 컴포넌트로 교체 필요 */}
          <button className="group w-full flex gap-2 flex-col items-center justify-center py-8 px-[22.5px] bg-[#FF8442] rounded-[32px] hover:bg-[#F07533] hover:shadow-lg transition-all duration-200">
            <FlagIcon className="text-[#ffffff] group-hover:scale-110 transition-transform" size={40} />
            <span className="text-[#ffffff] text-lg font-semibold group-hover:font-bold transition-all">새 목표</span>
          </button>
          <button className="group w-full flex gap-2 flex-col items-center justify-center py-8 px-[22.5px] bg-[#ffffff] border border-[#FF8442] rounded-[32px] hover:bg-[#FEF2E3] hover:shadow-lg transition-all duration-200">
            <CopyCheckIcon className="text-[#FF8442] group-hover:scale-110 transition-transform" size={40} />
            <span className="text-[#FF8442] text-lg font-semibold group-hover:font-bold transition-all">새 할일</span>
          </button>
        </div>
        <div className="flex gap-2 w-full">
          <button className="flex gap-[8px] items-center justify-center py-[12px] pr-[42px] pl-[12px] border border-[#DDDDDD] rounded-[999px]">
            <Image src={TempCharacter} alt="Character" width={38} height={38} />
            <div className="flex flex-col items-start w-[126px]">
              <span className="text-sm font-medium">닉네임</span>
              <span className="text-sm font-medium text-[#A0A0A0]">이메일</span>
            </div>
          </button>

          {/* TODO: 알람 표시 기능구현 */}
          <button className="group relative p-[20px] border border-[#DDDDDD] rounded-[999px] text-[#737373] hover:bg-gray-100 hover:text-[#FF8442] transition-all duration-200">
            <BellIcon size={24} className="group-hover:scale-110 transition-transform" />
            {/* 주황색 알람 점 */}
            <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-[#FF8442] rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
