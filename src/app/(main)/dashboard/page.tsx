import { dehydrate, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

import DashBoardSummary from '@/features/dashboard/components/DashboardSummary';
import DashboardDetail from '@/features/dashboard/components/DashBoardDetail';

import { todoQueries, userQueries, goalQueries } from '@/lib/queryKeys';
export const dynamic = 'force-dynamic';

/**
 * @description 해당 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 말아주세요
 * 'use client'로 변경 X
 */
export default async function DashboardPage() {
  // const queryClient = new QueryClient();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  console.log('accessToken', accessToken);

  if (!accessToken) {
    redirect('/login');
  }

  const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  const currentUserResponse = await fetch(`${apiBaseUrl}/api/v1/users/me`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!currentUserResponse.ok) {
    redirect('/login');
  }

  const res = await currentUserResponse.json();
  // await Promise.all([
  //   queryClient.prefetchQuery(todoQueries.list({ sort: 'LATEST' })),
  //   queryClient.prefetchQuery(userQueries.current()),
  //   queryClient.prefetchQuery(userQueries.progress()),
  //   queryClient.prefetchQuery(goalQueries.list()),
  // ]);
  // console.log('UserServer res', res);
  return (
    <div className="flex w-full flex-col">
      <DashBoardSummary res={res} />
      {/* <DashboardDetail /> */}
    </div>
  );
}
