import { usePathname } from 'next/navigation';
import { BellIcon } from 'lucide-react';

import PageHeader from '@/shared/components/PageHeader';

export default function SidebarMobileCase() {
  // TODO: 전역관리가 좋아보임. 해당 데이터 받아오기
  const pathname = usePathname();
  const userName = '체다치즈';
  const allTodoCount = 5;
  const favoriteCount = 3;

  let title: string | undefined;
  let count: number | undefined;
  let actions: React.ReactNode = <BellButton />;

  if (pathname === '/dashboard' || /^\/goal\/[^/]+$/.test(pathname)) {
    title = `${userName}님의 대시보드`;
  } else if (pathname === '/dashboard/all-todo') {
    title = '모든 할 일';
    count = allTodoCount;
  } else if (/^\/goal\/[^/]+\/note$/.test(pathname)) {
    title = '노트 모아보기';
  } else if (/^\/goal\/[^/]+\/note\/create$/.test(pathname)) {
    title = '노트 작성하기';
    actions = (
      <div className="flex gap-1">
        <button type="button" className="px-[6px] text-[#737373] transition-all duration-200 hover:text-[#FF8442]">
          임시저장
        </button>
        <button type="button" className="px-[6px] text-[#737373] transition-all duration-200 hover:text-[#FF8442]">
          등록
        </button>
      </div>
    );
  } else if (/^\/goal\/[^/]+\/note\/[^/]+\/edit$/.test(pathname)) {
    title = '노트 수정하기';
    actions = (
      <div className="flex gap-1">
        <button type="button" className="px-[6px] text-[#737373] transition-all duration-200 hover:text-[#FF8442]">
          임시저장
        </button>
        <button type="button" className="px-[6px] text-[#737373] transition-all duration-200 hover:text-[#FF8442]">
          수정
        </button>
      </div>
    );
  } else if (pathname === '/favorite-todo') {
    title = '찜한 할 일';
    count = favoriteCount;
  } else if (pathname === '/calendar') {
    title = `${userName}님의 캘린더`;
  } else if (pathname === '/mypage') {
    title = '내 정보 관리';
  }

  if (!title) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-between">
      <PageHeader title={title} count={count} />
      {actions}
    </div>
  );
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
