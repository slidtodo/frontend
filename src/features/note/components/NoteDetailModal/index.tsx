'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import NoteCloseButton from '@/features/note/components/NoteEditor/EditorTitle/NoteCloseButton';

const ANIMATION_DURATION = 300;

export default function NoteDetailModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => router.back(), ANIMATION_DURATION);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={handleClose} />
      <div
        className={clsx(
          'fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white',
          'lg:w-[744px] lg:rounded-l-[40px]',
          closing ? 'note-panel-exit' : 'note-panel-enter',
        )}
      >
        {children}
        <NoteCloseButton onClose={handleClose} />
      </div>
    </>
  );
}
