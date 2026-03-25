import { dehydrate, QueryClient } from '@tanstack/react-query';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

import DashBoardSummary from '@/features/dashboard/components/DashboardSummary';
import DashboardDetail from '@/features/dashboard/components/DashBoardDetail';

import { todoQueries, userQueries, goalQueries } from '@/lib/queryKeys';

export const dynamic = 'force-dynamic';

/**
 * @description 해당 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 말아주세요
 * 'use client'로 변경하지말아주세요
 */
export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(todoQueries.list({ sort: 'LATEST' })),
    queryClient.prefetchQuery(userQueries.current()),
    queryClient.prefetchQuery(userQueries.progress()),
    queryClient.prefetchQuery(goalQueries.list()),
  ]);

  return (
    <ReactQueryProvider state={dehydrate(queryClient)}>
      <div className="flex w-full flex-col">
        <DashBoardSummary />
        <DashboardDetail />
      </div>
    </ReactQueryProvider>
  );
}
