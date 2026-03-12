'use client';

import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';
import { useState } from 'react';
import { DropdownItemType } from '@/shared/types/types';
import DropdownList from './DropdownList';
import { ChevronDown } from 'lucide-react';

const dropdownVariants = cva(
  'rounded-xl border border-slate-300 bg-mono-white flex p-4 items-center gap-2 self-stretch text-base font-medium justify-between',
  {
    variants: {
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

interface DropdownProps extends React.HTMLAttributes<HTMLButtonElement> {
  items: DropdownItemType[];
  selectedId: string;
  onSelectItem: (item: DropdownItemType) => void;
  isDisabled?: boolean;
  className?: string;
}

const Dropdown = ({ items, selectedId, onSelectItem, isDisabled, className }: DropdownProps) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const dropdownClasses = twMerge(clsx(dropdownVariants({ disabled: isDisabled }), className));

  const selectedItem = items.find((item) => item.id === selectedId);

  const handleSelectItem = (item: DropdownItemType) => {
    onSelectItem?.(item);
    setIsToggleOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setIsToggleOpen(!isToggleOpen)}
          className={twMerge(
            dropdownClasses,
            'flex w-full items-center gap-2',
            isToggleOpen && 'rounded-2xl border border-orange-500',
          )}
          disabled={isDisabled}
        >
          <span className="line-clamp-1 text-base font-normal">{selectedItem?.label} </span>
          {/* //TODO 선택된 아이템 표시 */}
          <ChevronDown size={16} className="text-slate-400 dark:text-white" />
        </button>
      </div>
      {/* //TODO onSelectedItem 내부 핸들러로 교체 */}
      {isToggleOpen && <DropdownList items={items} selectedId={selectedId} onSelectItem={handleSelectItem} />}
    </>
  );
};

export default Dropdown;
