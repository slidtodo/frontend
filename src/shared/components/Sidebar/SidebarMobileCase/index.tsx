'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import PageHeader from '@/shared/components/PageHeader';
import NotificationDropdown from '@/shared/components/Sidebar/NotificationDropdown';
import { useMobileHeaderStore } from '@/shared/stores/useMobileHeaderStore';
import { CurrentUserResponse } from '@/shared/lib/api/fetchUsers';
import { todoQueries } from '@/shared/lib/query/queryKeys';
import { useQuery } from '@tanstack/react-query';

interface SidebarMobileCaseProps {
  user: CurrentUserResponse | undefined;
}
export default function SidebarMobileCase({ user }: SidebarMobileCaseProps) {
  const pathname = usePathname();
  const slot = useMobileHeaderStore((s) => s.slot);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { data: todoList } = useQuery(todoQueries.list());
  const favoriteCount = todoList?.todos?.filter((todo) => todo.favorite).length ?? 0;

  let title: string | undefined;
  let count: number | undefined;
  const actions: React.ReactNode = (
    <NotificationDropdown
      isOpen={notificationOpen}
      onOpen={() => setNotificationOpen(true)}
      onClose={() => setNotificationOpen(false)}
      isSidebarOpen={false}
      placement="bottom"
    />
  );

  if (pathname === '/dashboard') {
    title = `${user?.nickname ?? '체다치즈'}님의 대시보드`;
  } else if (/^\/goal\/[^/]+$/.test(pathname)) {
    title = `${user?.nickname ?? '체다치즈'}님의 목표`;
  } else if (pathname === '/dashboard/all-todo') {
    title = '모든 할 일';
    count = todoList?.totalCount;
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

