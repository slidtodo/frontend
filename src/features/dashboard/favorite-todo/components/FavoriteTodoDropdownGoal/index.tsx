'use client';

import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { DropdownList } from '@/shared/components/Dropdown';
import useOnClickOutside from '@/shared/hooks/useOnClickOutside';
import { DropdownItemType } from '@/shared/types/types';
import { dropdownVariants } from '@/shared/components/Dropdown';

interface FavoriteTodoDropdownGoalProps {
  items: DropdownItemType[];
  selectedValue: string;
  onSelectItem: (item: DropdownItemType) => void;
  defaultValue?: string;
}

export default function FavoriteTodoDropdownGoal({
  items,
  selectedValue,
  onSelectItem,
  defaultValue,
}: FavoriteTodoDropdownGoalProps) {
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const selectedItem =
    items.find((item) => item.value === selectedValue) ?? items.find((item) => item.value === defaultValue);

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => {
    setIsToggleOpen(false);
  });

  const handleSelectItem = (item: DropdownItemType) => {
    onSelectItem(item);
    setIsToggleOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsToggleOpen((prev) => !prev)}
        className={[
          dropdownVariants({ disabled: false }),
          'flex w-full items-center justify-between gap-2',
          isToggleOpen && 'rounded-2xl border border-[#FF8442]',
        ].join(' ')}
      >
        <span className="line-clamp-1 text-sm font-normal md:text-base">{selectedItem?.label ?? '선택해주세요'}</span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#A4A4A4] transition-transform ${isToggleOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isToggleOpen && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1">
          <DropdownList className="w-full" items={items} onSelectItem={handleSelectItem} />
        </div>
      )}
    </div>
  );
}
