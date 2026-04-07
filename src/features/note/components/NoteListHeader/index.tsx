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
    <section className={clsx('mb-6 flex items-center justify-between md:mb-8 md:gap-4 lg:mb-12')}>
      {!isMobile && <PageHeader title="노트 모아보기" />}
      <div className="flex w-full flex-1 justify-between gap-0 md:justify-end md:gap-2 lg:gap-4">
        <SearchInput
          placeholder="노트를 검색해주세요"
          className="min-w-[248px] border-gray-300 px-5 py-3 md:px-[17px] md:py-[10px] lg:w-[320px] lg:px-5 lg:py-3"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onIconClick={onSearch}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            onClick={onCreateNote}
            className="ml-2 flex flex-shrink-0 gap-[6px] px-5 py-3 md:ml-0 md:px-[17px] md:py-[10px] lg:px-[18px] lg:py-[10px]"
          >
            <PlusIcon size={20} />
            <span className="text-sm font-semibold transition-all duration-200 lg:text-base">노트 등록</span>
          </Button>
          <FilterButton items={items} value={sort} onValueChange={onSortChange} />
        </div>
      </div>
    </section>
  );
}
