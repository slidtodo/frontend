'use client';

import { cn } from '@/lib/utils';
import { DropdownList } from '@/shared/components/Dropdown';
import { DropdownItemType } from '@/shared/types/types';
import { ListFilterIcon } from 'lucide-react';
import { useState } from 'react';

const items: DropdownItemType[] = [
  { label: '최신순', value: '1' },
  { label: '오래된 순', value: '2' },
];

const FilterButton = () => {
  const [selectedValue, setSelectedValue] = useState('1');
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = items.find((item) => item.value === selectedValue)?.label;

  return (
    <div className="relative flex w-20">
      {/* 토글 버튼 */}
      <button className="flex cursor-pointer items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-sm font-medium text-[#737373]">{selectedLabel}</span>
        <ListFilterIcon size={20} className="text-[#737373]" />
      </button>

      {/* 목록 */}
      {isOpen && (
        <div className="absolute top-full right-0 text-nowrap">
          <DropdownList
            items={items}
            onSelectItem={(item) => {
              setSelectedValue(item.value);
              setIsOpen(false);
            }}
            className='w-[102px]'
          />
        </div>
      )}
    </div>
  );
};

export default FilterButton;
