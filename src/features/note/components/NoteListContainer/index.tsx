'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NoteListHeader from '@/features/note/components/NoteListHeader';
import NoteListClient from '@/features/note/components/NoteListClient';

interface NoteListContainerProps {
  goalId: number;
}

export default function NoteListContainer({ goalId }: NoteListContainerProps) {
  const [searchInput, setSearchInput] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [sort, setSort] = useState<'LATEST' | 'OLDEST'>('LATEST');
  const router = useRouter();
  return (
    <>
      <NoteListHeader
        search={searchInput}
        onSearchChange={setSearchInput}
        onSearch={() => setSubmittedSearch(searchInput)}
        sort={sort}
        onSortChange={(v) => {
          if (v === 'LATEST' || v === 'OLDEST') {
            setSort(v);
          }
        }}
        onCreateNote={() => router.push(`/goal/${goalId}/note/create`)}
      />
      <NoteListClient goalId={goalId} search={submittedSearch} sort={sort} />
    </>
  );
}
