'use client';

import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';
import { DropdownItemType } from '@/shared/types/types';
import DropdownList from './DropdownList';
import { ChevronDown } from 'lucide-react';
import useOnClickOutside from '@/shared/hooks/useOnClickOutside';

const dropdownVariants = cva(
  'rounded-xl border border-slate-300 bg-mono-white flex p-4 items-center gap-2 self-stretch text-base font-medium justify-between',
  {
    variants: {
      // TODO size 추가
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

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsToggleOpen(false));

  const handleSelectItem = (item: DropdownItemType) => {
    onSelectItem(item);
    setIsToggleOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
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
      <div className="absolute top-full right-0 left-0 z-50 mt-1">
        {isToggleOpen && <DropdownList className="absolute" items={items} onSelectItem={handleSelectItem} />}
      </div>
    </div>
  );
};

export default Dropdown;
