'use client';

import FilterButton from '@/shared/components/Button/FilterButton';
import PageHeader from '@/shared/components/PageHeader';
import SearchInput from '@/shared/components/SearchInput';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { DropdownItemType } from '@/shared/types/types';
import clsx from 'clsx';

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
}

export default function NoteListHeader({ search, onSearchChange, onSearch, sort, onSortChange }: NoteListHeaderProps) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <section
      className={clsx('mb-12 flex items-center justify-between', 'md:mt-4 md:mb-8 md:gap-4', 'lg:mt-10 lg:mb-12')}
    >
      {!isMobile && <PageHeader title="노트 모아보기" />}
      <div className="flex w-full flex-1 justify-between gap-0 md:justify-end md:gap-2 lg:gap-[14px]">
        <SearchInput
          placeholder="노트를 검색해주세요"
          className="h-12 w-[248px] md:w-[280px] lg:w-[320px]"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onIconClick={onSearch}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <FilterButton items={items} value={sort} onValueChange={onSortChange} />
      </div>
    </section>
  );
}
