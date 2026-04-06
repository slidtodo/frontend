'use client';

import clsx from 'clsx';
import { PlusIcon } from 'lucide-react';

import Button from '@/shared/components/Button';
import FilterButton from '@/shared/components/Button/FilterButton';
import PageHeader from '@/shared/components/PageHeader';
import SearchInput from '@/shared/components/SearchInput';

import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { DropdownItemType } from '@/shared/types/types';

const items: DropdownItemType[] = [
  { label: '최신순', value: 'LATEST' },
  { label: '오래된 순', value: 'OLDEST' },
];

interface NoteListHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  sort: string;
  onSortChange: (value: string) => void;
  onCreateNote: () => void;
}

export default function NoteListHeader({
  search,
  onSearchChange,
  onSearch,
  sort,
  onSortChange,
  onCreateNote,
}: NoteListHeaderProps) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <section className={clsx('mb-12 flex items-center justify-between md:mb-8 md:gap-4 lg:mb-12')}>
      {!isMobile && <PageHeader title="노트 모아보기" />}
      <div className="flex w-full flex-1 justify-between gap-0 md:justify-end md:gap-2 lg:gap-4">
        <SearchInput
          placeholder="노트를 검색해주세요"
          className="h-12 min-w-[150px] md:w-[242px] lg:w-[320px]"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onIconClick={onSearch}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={onCreateNote} className="ml-2 h-12 flex-shrink-0 px-4">
            <PlusIcon size={20} />
            <span className="hidden font-semibold transition-all duration-200 md:block">노트 등록</span>
          </Button>
          <FilterButton items={items} value={sort} onValueChange={onSortChange} />
        </div>
      </div>
    </section>
  );
}
