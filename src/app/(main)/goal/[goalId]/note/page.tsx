import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { noteQueries, goalQueries } from '@/lib/queryKeys';
import NoteListHeader from '@/features/note/components/NoteListHeader';
import NoteListClient from '@/features/note/components/NoteListClient';

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
        <NoteListHeader />
        <NoteListClient goalId={Number(goalId)} />
      </div>
    </HydrationBoundary>
  );
}
