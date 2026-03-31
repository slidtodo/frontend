'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { noteQueries, goalQueries } from '@/lib/queryKeys';
import NoteItem from '@/features/note/components/NoteItem';
import GoalItem from '@/features/note/components/GoalItem';
import Pagination from '@/features/note/components/Pagination';
import Empty from '@/shared/components/Empty';
import clsx from 'clsx';

interface NoteListClientProps {
  goalId: number;
  search?: string;
  sort?: 'LATEST' | 'OLDEST';
}

export default function NoteListClient({ goalId, search, sort }: NoteListClientProps) {
  const [page, setPage] = useState(1);
  const [prevSearch, setPrevSearch] = useState(search);
  const [prevSort, setPrevSort] = useState(sort);

  if (search !== prevSearch || sort !== prevSort) {
    setPrevSearch(search);
    setPrevSort(sort);
    setPage(1);
  }

  const { data: goal } = useQuery(goalQueries.detail(goalId));
  const { data: noteList } = useQuery({
    ...noteQueries.list({ goalId, page: page - 1, search, sort }),
    placeholderData: keepPreviousData,
  });

  const notes = (noteList?.notes ?? []).filter((note) => note.id != null);
  const currentPage = (noteList?.pageInfo?.page ?? 0) + 1;
  const totalPages = noteList?.pageInfo?.totalPages ?? 1;

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
            <NoteItem
              key={note.id}
              note={{
                id: note.id!,
                title: note.title ?? '',
                todoId: note.todoId ?? 0,
                createdAt: note.createdAt ?? '',
              }}
              goalId={String(goalId)}
            />
          ))}
        </section>
      )}

      {notes.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}
