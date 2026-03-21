'use client';

import { useRouter } from 'next/navigation';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

export default function NoteCloseButton() {
  const router = useRouter();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => router.back(), 300);
  };

  return (
    <>
      {closing && <div className="animate-slide-out-right fixed inset-0 z-[200] bg-white" />}
      <button type="button" onClick={handleClose} className="cursor-pointer">
        <XIcon size={24} className="stroke-[#A4A4A4]" />
      </button>
    </>
  );
}
