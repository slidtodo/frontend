'use client';
import Image from 'next/image';
import { ChevronsRightIcon, SettingsIcon, LogOutIcon, FlagIcon, CopyCheckIcon, BellIcon } from 'lucide-react';

import { useSidebarContext } from '@/contexts/SidebarContext';

import Logo from '../../../../../public/image/main-logo.svg';
import TempCharacter from '../../../../../public/image/temp-character.svg';
export default function Sidebar() {
  const { isOpen, close } = useSidebarContext();

  return (
    <div className="m-8 flex flex-col gap-[140px] min-w-[298px]">
      <div className=" flex gap-8 flex-col items-end justify-center">
        <ChevronsRightIcon size={32} className="text-gray-400" />
        <div className="w-full flex gap-4 items-center pl-2  pr-[22px]">
          <Image src={Logo} alt="Logo" width={48} height={48} />
          <h2 className="text-4xl font-semibold text-gray-800 w-fit">Slid to do</h2>
        </div>
        <div className="flex gap-6 flex-col w-full">
          <div className="flex flex-col gap-3">메뉴들</div>
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
      <div className="flex flex-col gap-8 items-center">
        <div className="flex gap-4 w-full">
          <button className="w-full flex gap-2 flex-col items-center justify-center py-8 px-[22.5px] bg-[#FF8442] rounded-[32px]">
            <FlagIcon className="text-[#ffffff]" size={40} />
            <span className="text-[#ffffff] text-lg font-semibold">새 목표</span>
          </button>
          <button className="w-full flex gap-2 flex-col items-center justify-center py-8 px-[22.5px] bg-[#ffffff] border border-[#FF8442] rounded-[32px]">
            <CopyCheckIcon className="text-[#FF8442]" size={40} />
            <span className="text-[#FF8442] text-lg font-semibold">새 할일</span>
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

          <BellIcon
            size={64}
            className="p-[20px] border border-[#DDDDDD] rounded-[999px] text-[#737373] hover:bg-gray-100 transition-all duration-100"
          />
        </div>
      </div>
    </div>
  );
}
