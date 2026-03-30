'use client';

import useOnClickOutside from '@/shared/hooks/useOnClickOutside';
import { EllipsisVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import { DropdownList } from '@/shared/components/Dropdown';
import { DropdownItemType } from '@/shared/types/types';

interface EllipsisButtonProps {
  items: DropdownItemType[];
}

export default function EllipsisButton({ items }: EllipsisButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const handleSelectItem = async (value: string) => {
    if (value === 'edit') {
      // 수정 API 호출 or 모달 열기
    }
    if (value === 'delete') {
      // 삭제 API 호출
    }
  };

  return (
    <div ref={ref} className="relative flex">
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer"
      >
        <EllipsisVertical size={16} className="stroke-[#A4A4A4] md:h-6 md:w-6" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-10 text-nowrap">
          <DropdownList
            items={items}
            onSelectItem={(item) => {
              handleSelectItem(item.value);
              setIsOpen(false);
            }}
            className="w-[102px]"
          />
        </div>
      )}
    </div>
  );
}
