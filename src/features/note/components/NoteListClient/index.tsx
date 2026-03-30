'use client';

import { useQuery } from '@tanstack/react-query';
import { noteQueries, goalQueries } from '@/lib/queryKeys';
import NoteItem from '@/features/note/components/NoteItem';
import GoalItem from '@/features/note/components/GoalItem';
import Empty from '@/shared/components/Empty';
import clsx from 'clsx';

interface NoteListClientProps {
  goalId: number;
}

export default function NoteListClient({ goalId }: NoteListClientProps) {
  const { data: goal } = useQuery(goalQueries.detail(goalId));
  const { data: noteList } = useQuery(noteQueries.list({ goalId }));

  const notes = noteList?.notes ?? [];

  return (
    <>
      <section className="mb-3 md:mb-4 lg:mb-5">
        <GoalItem title={goal?.title ?? ''} />
      </section>

      {notes.length === 0 ? (
        <Empty>아직 등록된 노트가 없어요</Empty>
      ) : (
        <section className={clsx('flex flex-col gap-3', 'md:gap-4', 'lg:grid lg:grid-cols-2 lg:gap-[20px]')}>
          {notes.map((note) => (
            <NoteItem key={note.id} note={{ id: note.id ?? 0, title: note.title ?? '', todoId: note.todoId ?? 0, createdAt: note.createdAt ?? '' }} goalId={String(goalId)} />
          ))}
        </section>
      )}
    </>
  );
}
