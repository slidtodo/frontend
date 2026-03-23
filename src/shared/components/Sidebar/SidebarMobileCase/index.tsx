import { usePathname } from 'next/navigation';
import { BellIcon } from 'lucide-react';

import PageHeader from '@/shared/components/PageHeader';

export default function SidebarMobileCase() {
  // TODO: 전역관리가 좋아보임. 해당 데이터 받아오기
  const pathname = usePathname();
  const userName = '체다치즈';
  const allTodoCount = 5;
  const favoriteCount = 3;

  if (pathname === '/dashboard' || /^\/goal\/[^/]+$/.test(pathname)) {
    return (
      <div className="flex w-full items-center justify-between">
        <PageHeader title={`${userName}님의 대시보드`} />
        <BellButton />
      </div>
    );
  }

  if (pathname === '/dashboard/all-todo') {
    return (
      <div className="flex w-full items-center justify-between">
        <PageHeader title="모든 할 일" count={allTodoCount} />
        <BellButton />
      </div>
    );
  }

  if (/^\/goal\/[^/]+\/note$/.test(pathname)) {
    return (
      <div className="flex w-full items-center justify-between">
        <PageHeader title="노트 모아보기" />
        <BellButton />
      </div>
    );
  }

  if (/^\/goal\/[^/]+\/note\/create$/.test(pathname)) {
    return (
      <div className="flex w-full items-center justify-between">
        <PageHeader title="노트 작성하기" />
        <div className="flex gap-1">
          <button type="button" className="px-[6px] text-[#737373] transition-all duration-200 hover:text-[#FF8442]">
            임시저장
          </button>
          <button type="button" className="px-[6px] text-[#737373] transition-all duration-200 hover:text-[#FF8442]">
            등록
          </button>
        </div>
      </div>
    );
  }

  if (pathname === '/favorite-todo') {
    return (
      <div className="flex w-full items-center justify-between">
        <PageHeader title="찜한 할 일" count={favoriteCount} />
        <BellButton />
      </div>
    );
  }

  if (pathname === '/calendar') {
    return (
      <div className="flex w-full items-center justify-between">
        <PageHeader title={`${userName}님의 캘린더`} />
        <BellButton />
      </div>
    );
  }

  if (pathname === '/mypage') {
    return (
      <div className="flex w-full items-center justify-between">
        <PageHeader title="내 정보 관리" />
        <BellButton />
      </div>
    );
  }

  return null;
}

function BellButton() {
  return (
    <button
      type="button"
      className="group relative text-[#737373] transition-all duration-200 hover:bg-gray-100 hover:text-[#FF8442]"
      aria-label="알림"
    >
      <BellIcon size={24} className="transition-transform group-hover:scale-110" />
      <div className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-[#FF8442]" />
    </button>
  );
}
