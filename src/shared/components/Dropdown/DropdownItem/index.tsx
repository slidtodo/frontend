import { DropdownItemType } from '@/shared/types/types';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DropdownItemProps {
  item: DropdownItemType;
  isSelected: boolean;
  onSelectItem?: (item: DropdownItemType) => void;
}

const DropdownItem = ({ item, isSelected, onSelectItem }: DropdownItemProps) => {
  return (
    <div className="flex w-full bg-white p-1.5">
      <button
        onClick={() => onSelectItem?.(item)}
        disabled={item.disabled}
        className={twMerge(clsx('flex w-full', item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'))}
      >
        <div className={twMerge(clsx('w-full rounded-xl p-2 text-left', isSelected && 'bg-[#FEEFDC]'))}>
          <span className="text-base leading-6 font-medium tracking-[-0.48px] text-slate-700">{item.label}</span>
        </div>
      </button>
    </div>
  );
};

export default DropdownItem;
