import EditorTitle from '@/features/goal/note/components/NoteEditor/EditorTitle';
import EditorMeta from '@/features/goal/note/components/NoteEditor/EditorMeta';
import EditorContent from '@/features/goal/note/components/NoteEditor/EditorContent';
import { notFound } from 'next/navigation';

interface NoteDetailPageProps {
  params: Promise<{ goalId: string; noteId: string }>;
}

// @TODO API 연결로 대체
async function getNote(goalId: string, noteId: string) {
  /**
   * @TODO API 연결
   * const res = await fetch(`/api/goals/${goalId}/notes/${noteId}`, {캐시 설정});
   * if (!res.ok) return null;
   * return res.json();
   */

  return {
    title: '노트 제목',
    content: '노트 내용...',
    goal: { title: '올해 안에 풀스택 개발자 되기' },
    todos: { title: 'React 컴포넌트 설계 공부하기', done: false },
    tags: [{ id: '1', string: 'React', variant: 'green' as const }],
    createdAt: '2026-03-23T00:00:00.000Z',
  };
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { goalId, noteId } = await params;
  const note = await getNote(goalId, noteId);

  if (!note) notFound();

  // @TODO ErrorSuspenseBoundary 처리가 의미 있을지 고민
  return (
    <div className="p-5 md:p-10">
      <EditorTitle title={note.title} readOnly />
      <EditorMeta goal={note.goal} todos={note.todos} tags={note.tags} createdAt={note.createdAt} />
      <hr className="mt-4 mb-5 border-[#DDD] md:mt-6" />
      <EditorContent content={note.content} readOnly />
    </div>
  );
}
