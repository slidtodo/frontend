'use client';

import FilterButton from '@/shared/components/Button/FilterButton';
import SearchInput from '@/shared/components/SearchInput';
import { DropdownItemType } from '@/shared/types/types';
import { useState } from 'react';

const items: DropdownItemType[] = [
  { label: '최신순', value: '1' },
  { label: '오래된 순', value: '2' },
];

export default function NoteListHeader() {
  const [selectedValue, setSelectedValue] = useState('1');

  return (
    <div className="flex w-full flex-1 justify-center gap-0 md:justify-end md:gap-2 lg:gap-[14px]">
      <SearchInput placeholder="노트를 검색해주세요" className="h-12 w-[248px] md:w-[280px] lg:w-[320px]" />
      <FilterButton items={items} value={selectedValue} onValueChange={setSelectedValue} />
    </div>
  );
}
