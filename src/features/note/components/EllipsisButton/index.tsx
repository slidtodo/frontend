'use client';

import useOnClickOutside from '@/shared/hooks/useOnClickOutside';
import { EllipsisVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import { DropdownList } from '@/shared/components/Dropdown';
import { DropdownItemType } from '@/shared/types/types';
import { useModalStore } from '@/shared/stores/useModalStore';
import { PopupModal } from '@/shared/components/Modal/PopupModal';
import { useDeleteNote } from '@/features/note/hooks/useDeleteNote';
import { useToastStore } from '@/shared/stores/useToastStore';

interface EllipsisButtonProps {
  items: DropdownItemType[];
  noteId: number;
}

export default function EllipsisButton({ items, noteId }: EllipsisButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { openModal } = useModalStore();
  const { showToast } = useToastStore();

  const { mutate: handleDelete } = useDeleteNote(noteId, {
    onError: () => showToast('노트 삭제에 실패했습니다', 'fail'),
  });

  useOnClickOutside(ref, () => setIsOpen(false));

  const handleSelectItem = (value: string) => {
    if (value === 'edit') {
      // 수정 모달 열기
    }
    if (value === 'delete') {
      openModal(<PopupModal variant={{ type: 'noteDelete' }} onConfirm={() => handleDelete()} />);
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
