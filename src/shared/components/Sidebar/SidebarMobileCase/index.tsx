import { usePathname } from 'next/navigation';
import { BellIcon } from 'lucide-react';

import PageHeader from '@/shared/components/PageHeader';
import { useMobileHeaderStore } from '@/shared/stores/useMobileHeaderStore';
import { CurrentUserResponse } from '@/lib/api/fetchUsers';

interface SidebarMobileCaseProps {
  user: CurrentUserResponse | undefined;
}
export default function SidebarMobileCase({ user }: SidebarMobileCaseProps) {
  // TODO: 전역관리가 좋아보임. 해당 데이터 받아오기
  const pathname = usePathname();
  const slot = useMobileHeaderStore((s) => s.slot);

  const allTodoCount = 5;
  const favoriteCount = 3;

  let title: string | undefined;
  let count: number | undefined;
  const actions: React.ReactNode = <BellButton />;

  if (pathname === '/dashboard' || /^\/goal\/[^/]+$/.test(pathname)) {
    title = `${user?.nickname ?? '체다치즈'}님의 대시보드`;
  } else if (pathname === '/dashboard/all-todo') {
    title = '모든 할 일';
    count = allTodoCount;
  } else if (/^\/goal\/[^/]+\/note$/.test(pathname)) {
    title = '노트 모아보기';
  } else if (/^\/goal\/[^/]+\/note\/create$/.test(pathname)) {
    title = '노트 작성하기';
  } else if (/^\/goal\/[^/]+\/note\/[^/]+\/edit$/.test(pathname)) {
    title = '노트 수정하기';
  } else if (pathname === '/favorite-todo') {
    title = '찜한 할 일';
    count = favoriteCount;
  } else if (pathname === '/calendar') {
    title = `${user?.nickname ?? '체다치즈'}님의 캘린더`;
  } else if (pathname === '/mypage') {
    title = '내 정보 관리';
  }

  if (slot) {
    return (
      <div className="flex w-full items-center justify-between">
        {title && <PageHeader title={title} count={count} />}
        {slot}
      </div>
    );
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
      className="group duration-200group hover:text-bearlog-600 hover:bg-gray-100hover:text-[#FF8442] relative text-gray-500 transition-all duration-200"
      aria-label="알림"
    >
      <BellIcon color="#737373" size={24} className="transition-transform group-hover:scale-110" />
      <div className="bg-bearlog-500 absolute top-0.5 right-0.5 h-2 w-2 rounded-full" />
    </button>
  );
}
