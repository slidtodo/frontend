'use client';

import { useRouter, useParams } from 'next/navigation';
import clsx from 'clsx';
import NoteCloseButton from '@/features/note/components/NoteEditor/EditorTitle/NoteCloseButton';

const ANIMATION_DURATION = 280;

export default function NoteDetailLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { goalId } = useParams<{ goalId: string }>();

  const handleClose = () => {
    setTimeout(() => router.push('/goal/' + goalId + '/note'), ANIMATION_DURATION);
  };

  return (
    <div className={clsx('fixed inset-0 z-50 overflow-y-auto bg-white')}>
      {children}
      <NoteCloseButton onClose={handleClose} />
    </div>
  );
}
