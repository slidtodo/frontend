// import clsx from "clsx";

// export default function NoteDetailLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className={clsx(
//       'fixed inset-0 z-50 bg-white overflow-y-auto',
//       'lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[744px] lg:animate-slide-in-right lg:shadow-[-4px_0_24px_rgba(0,0,0,0.1)] lg:rounded-l-[40px]',
//     )}>
//       {children}
//     </div>
//   );
// }
// layout.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import NoteCloseButton from '@/features/goal/note/components/NoteEditor/EditorTitle/NoteCloseButton';

export default function NoteDetailLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => router.back(), 280);
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
