import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';
import { useState } from 'react';
import { DropdownItemType } from '@/shared/types/types';
import DropdownList from '../DropdownList';

const dropdownTriggerVariants = cva(
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

interface DropdownTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  items: DropdownItemType[];
  selectedId?: string;
  onSelectItem?: (item: DropdownItemType) => void;
  isDisabled?: boolean;
  className?: string;
}

const DropdownTrigger = ({
  children,
  items,
  selectedId,
  onSelectItem,
  isDisabled,
  className,
}: DropdownTriggerProps) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const dropdownClasses = twMerge(clsx(dropdownTriggerVariants({ disabled: isDisabled }), className));

  return (
    <>
      <button
        onClick={() => setIsToggleOpen(!isToggleOpen)}
        className={twMerge(
          dropdownClasses,
          'flex w-full items-center gap-2 text-base font-normal',
          isToggleOpen && 'rounded-2xl border border-orange-500',
        )}
        disabled={isDisabled}
      >
        {children}
      </button>
      {isToggleOpen && <DropdownList items={items} selectedId={selectedId} onSelectItem={onSelectItem} />}
    </>
  );
};

export default DropdownTrigger;
