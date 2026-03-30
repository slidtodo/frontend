import { dehydrate, QueryClient } from '@tanstack/react-query';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { noteQueries, goalQueries } from '@/lib/queryKeys';
import NoteDetailClient from '@/features/note/components/NoteDetailClient';
import { notFound } from 'next/navigation';

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
    <ReactQueryProvider state={dehydratedState}>
      <NoteDetailClient noteId={Number(noteId)} goalId={Number(goalId)} />
    </ReactQueryProvider>
  );
}
