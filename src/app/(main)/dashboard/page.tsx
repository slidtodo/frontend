import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import DashBoardSummary from '@/features/dashboard/components/DashboardSummary';
import DashboardDetail from '@/features/dashboard/components/DashBoardDetail';

import { todoQueries, userQueries, goalQueries } from '@/lib/queryKeys';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(todoQueries.listServer({ sort: 'LATEST' })),
    queryClient.prefetchQuery(userQueries.currentServer()),
    queryClient.prefetchQuery(userQueries.progressServer()),
  ]);

  const goals = await queryClient.fetchQuery(goalQueries.listServer());

  await Promise.all(
    (goals.goals ?? [])
      .filter((goal) => goal.id != null)
      .map((goal) => queryClient.prefetchQuery(goalQueries.detailServer(goal.id!))),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex w-full flex-col">
        <DashBoardSummary />
        <DashboardDetail />
      </div>
    </HydrationBoundary>
  );
}

/**
 * refresh 토큰 처리 방안 필요
 * refresh proxy route 둘 중 하나에서 처리
 * proxy에서 하게 되면 페이지 접근 전에 실행되는거니 페이지 접근 전에 리프레쉬토큰 갱신
 * proxy에서 또 route 접근 전에 리프레쉬 갱신 할 수도 있음 근데 proxy는 엣지라 느릴 수도 -> 엣지는 간단계산만 해야함. cdn과 엣지의 연관성
 * 그럼 로그인 회원가입 페이지 제외 해서 해야함. (api, route 둘다 가능)
 *
 * route핸들러는 기본 서버로 가기 때문에 빨리 refresh 토큰 갱신 가능 api/refresh/route.ts
 * proxy에서 갱신 안 하고 존재 여부만 파악해서 그냥 리다이렉트 해서
 *
 * 그리고 실제 인증은 해당 api 호출할 때마다 함
 * route 핸들러에서 토큰 재발급해서 쿠키 업데이트함
 *
 * proxy에서 존재 여부만 파악하고 그럼 route에서 토큰 재발급 하는 방식으로 구현 -> 2중으로 검증하는 방식으로 구현
 *
 */
