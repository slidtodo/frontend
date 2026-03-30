import EditorTitle from '@/features/note/components/NoteEditor/EditorTitle';
import EditorMeta from '@/features/note/components/NoteEditor/EditorMeta';
import EditorContent from '@/features/note/components/NoteEditor/EditorContent';
import { notFound } from 'next/navigation';
import { fetchNotes } from '@/lib/api/fetchNotes';
import { fetchGoals } from '@/lib/api/fetchGoals';

export default async function NoteDetailPage({ params }: { params: Promise<{ goalId: string; noteId: string }> }) {
  const { goalId, noteId } = await params;

  const [note, goal] = await Promise.all([
    fetchNotes.getNote(Number(noteId)).catch(() => null),
    fetchGoals.getGoal(Number(goalId)).catch(() => null),
  ]);

  if (!note) notFound();

  const tags = (note.todo?.tags ?? []).map((t) => ({ id: String(t.id), string: t.name ?? '' }));

  return (
    <div className="p-5 md:p-10">
      <EditorTitle title={note.title ?? ''} readOnly />
      <EditorMeta
        goal={{ title: goal?.title ?? '' }}
        todos={{ title: note.todo?.title ?? '', done: note.todo?.done ?? false }}
        tags={tags}
        createdAt={note.createdAt ?? ''}
      />
      <hr className="mt-4 mb-5 border-[#DDD] md:mt-6" />
      <EditorContent content={note.content ?? ''} readOnly />
    </div>
  );
}
