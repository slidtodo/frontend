import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { noteQueries, goalQueries } from '@/lib/queryKeys';
import NoteListContainer from '@/features/note/components/NoteListContainer';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(goalQueries.detail(Number(goalId))),
    queryClient.prefetchQuery(noteQueries.list({ goalId: Number(goalId), page: 0 })),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="mx-auto flex h-full min-h-screen w-full max-w-[1312px] flex-col">
        <NoteListContainer goalId={Number(goalId)} />
      </div>
    </HydrationBoundary>
  );
}
