import { dehydrate, QueryClient } from '@tanstack/react-query';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

import AllTodoContent from '@/features/dashboard/allTodo/components/AllTodoContent';
import { todoQueries } from '@/lib/queryKeys';
/**
 * @description 해당 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 말아주세요
 * 'use client'로 변경 x
 */
export default async function AllTodoPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(todoQueries.list({ done: undefined }));

  const dehydratedState = dehydrate(queryClient);
  return (
    <ReactQueryProvider state={dehydratedState}>
      <AllTodoContent />
    </ReactQueryProvider>
  );
}
