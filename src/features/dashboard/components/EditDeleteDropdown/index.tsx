'use client';

import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { createPortal } from 'react-dom';

interface EditDeleteDropdownProps {
  handleEdit: () => void;
  handleDelete: () => void;
  onClose?: () => void;
  anchorRef: RefObject<HTMLElement | null>;
}

interface DropdownPosition {
  top: number;
  left: number;
}

export default function EditDeleteDropdown({ handleEdit, handleDelete, onClose, anchorRef }: EditDeleteDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();

  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const updatePosition = () => {
      const anchor = anchorRef.current;
      const dropdown = dropdownRef.current;
      if (!anchor || !dropdown) return;

      const anchorRect = anchor.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const margin = 8;
      const maxLeft = window.innerWidth - dropdownRect.width - margin;

      setPosition({
        top: anchorRect.bottom + margin,
        left: Math.max(margin, Math.min(anchorRect.right - dropdownRect.width, maxLeft)),
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;

      onClose?.();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [anchorRef, onClose]);

  return createPortal(
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: position.top, left: position.left }}
      className="z-50 min-w-[140px] rounded-xl border border-orange-100 bg-white p-1 shadow-lg"
    >
      <button
        type="button"
        className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-orange-50"
        onClick={handleEdit}
      >
        {t.common.edit}
      </button>
      <button
        type="button"
        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
        onClick={handleDelete}
      >
        {t.common.delete}
      </button>
    </div>,
    document.body,
  );
}
