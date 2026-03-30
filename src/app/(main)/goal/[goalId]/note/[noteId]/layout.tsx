'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import clsx from 'clsx';
import NoteCloseButton from '@/features/note/components/NoteEditor/EditorTitle/NoteCloseButton';

export default function NoteDetailLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { goalId } = useParams<{ goalId: string }>();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => router.push(`/goal/${goalId}/note`), 280);
  };

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 overflow-y-auto bg-white',
        'lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[744px] lg:rounded-l-[40px]',
        closing ? 'lg:animate-slide-out-right' : 'lg:animate-slide-in-right',
      )}
    >
      {children}
      <NoteCloseButton onClose={handleClose} />
    </div>
  );
}
