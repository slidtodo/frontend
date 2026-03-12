'use client';

import useOnClickOutside from '@/shared/hooks/useOnClickOutside';
import { DropdownItemType } from '@/shared/types/types';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

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

/**
 * Dropdown
 */
interface DropdownProps extends React.HTMLAttributes<HTMLButtonElement> {
  items: DropdownItemType[];
  selectedValue: string;
  onSelectItem: (item: DropdownItemType) => void;
  isDisabled?: boolean;
  className?: string;
}

function Dropdown({ items, selectedValue, onSelectItem, isDisabled, className }: DropdownProps) {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const dropdownClasses = twMerge(clsx(dropdownVariants({ disabled: isDisabled }), className));
  const selectedItem = items.find((item) => item.value === selectedValue);

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
}

/**
 * DropdownList
 */
interface DropdownListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: DropdownItemType[];
  onSelectItem: (item: DropdownItemType) => void;
}

function DropdownList({ items, onSelectItem, className }: DropdownListProps) {
  return (
    <div
      className={twMerge(
        clsx('w-full overflow-hidden rounded-2xl shadow-[0px_4px_16px_-2px_rgba(0,0,0,0.1)]', className),
      )}
    >
      {items.map((item) => (
        <DropdownItem key={item.value} item={item} onSelectItem={onSelectItem} />
      ))}
    </div>
  );
}

/**
 * DropdownItem
 */
interface DropdownItemProps {
  item: DropdownItemType;
  onSelectItem: (item: DropdownItemType) => void;
}

function DropdownItem({ item, onSelectItem }: DropdownItemProps) {
  return (
    <div className="flex w-full bg-white p-1.5">
      <button onClick={() => onSelectItem(item)} className={twMerge(clsx('flex w-full'))}>
        <div className={twMerge(clsx('w-full rounded-xl p-2 text-left hover:bg-[#FEEFDC]'))}>
          <span className="text-base leading-6 font-medium tracking-[-0.48px] text-slate-700">{item.label}</span>
        </div>
      </button>
    </div>
  );
}

export default Dropdown;
