import clsx from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import DropdownItem from '@/shared/components/Dropdown/DropdownItem';
import { DropdownItemType } from '@/shared/types/types';


interface DropdownListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: DropdownItemType[];
  selectedId?: string;
  onSelectItem?: (item: DropdownItemType) => void;
}

const DropdownList = ({ items, selectedId, onSelectItem, className }: DropdownListProps) => {
  return (
    <div
      className={twMerge(
        clsx('overflow-hidden rounded-2xl bg-white shadow-[0px_4px_16px_-2px_rgba(0,0,0,0.1)]', className),
      )}
    >
      {items.map((item) => (
        <DropdownItem
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onSelectItem={onSelectItem}
        />
      ))}
    </div>
  );
};

export default DropdownList;