import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';
import { noteQueries, goalQueries } from '@/lib/queryKeys';
import NoteDetailClient from '@/features/note/components/NoteDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
interface NoteDetailPageProps {
  params: Promise<{ goalId: string; noteId: string }>;
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { goalId, noteId } = await params;

  const queryClient = new QueryClient();

  const [note] = await Promise.all([
    queryClient.fetchQuery(noteQueries.detail(Number(noteId))).catch(() => null),
    queryClient.prefetchQuery(goalQueries.detail(Number(goalId))),
  ]);

  if (!note) notFound();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailClient noteId={Number(noteId)} goalId={Number(goalId)} />
    </HydrationBoundary>
  );
}
