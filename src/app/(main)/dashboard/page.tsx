import { dehydrate, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

import DashBoardSummary from '@/features/dashboard/components/DashboardSummary';
import DashboardDetail from '@/features/dashboard/components/DashBoardDetail';

import { todoQueries, userQueries, goalQueries } from '@/lib/queryKeys';
import { fetchUsers } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * @description 해당 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 말아주세요
 * 'use client'로 변경 X
 */
export default async function DashboardPage() {
  // const queryClient = new QueryClient();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const res = await fetch(`${process.env.API_BASE_URL}/api/v1/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      redirect('/login');
    }
    return response.json();
  });
  console.log('User res', res);
  //

  /**
   * refresh 토큰 처리 방안 필요
   * refresh proxy route 둘 중 하나에서 처리
   * proxy에서 하게 되면 페이지 접근 전에 실행되는거니 페이지 접근 전에 리프레쉬토큰 갱신
   * proxy에서 또 route 접근 전에 리프레쉬 갱신 할 수도 있음 근데 proxy는 엣지라 느릴 수도
   * 그럼 로그인 회원가입 페이지 제외 해서 해야함. (api, route 둘다 가능)
   *
   * route핸들러는 기본 서버로 가기 때문에 빨리 refresh 토큰 갱신 가능
   * proxy에서 갱신 안 하고 존재 여부만 파악해서 그냥 리다이렉트 해서
   *
   * 그리고 실제 인증은 해당 api 호출할 때마다 함
   * route 핸들러에서 토큰 재발급해서 쿠키 업데이트함
   *
   * proxy에서 존재 여부만 파악하고 그럼 route에서 토큰 재발급 하는 방식으로 구현
   *
   */

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
