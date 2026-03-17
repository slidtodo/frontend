'use client';

import { LinkUploadModal } from '@/shared/components/Modal/LinkUploadModal';
import { useModalStore } from '@/shared/stores/useModalStore';
import clsx from 'clsx';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Link2, List, Underline } from 'lucide-react';
import { useState } from 'react';

export default function EditorToolbar() {
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const { openModal, closeModal } = useModalStore();

  const toggle = (tool: string) => {
    setActiveTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));
  };

  const handleLinkUploadClick = () => {
    toggle('link');
    openModal(<LinkUploadModal onConfirm={closeModal} />);
  };

  return (
    <div className={clsx('flex h-11 w-full items-center rounded-[18px] bg-[#FAFAFA]', 'text-slate-500', 'px-4 py-1.5')}>
      <button
        onClick={() => toggle('bold')}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('bold') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <Bold size={20} />
      </button>

      <button
        onClick={() => toggle('italic')}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('italic') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <Italic size={20} />
      </button>

      <button
        onClick={() => toggle('underline')}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('underline') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <Underline size={20} />
      </button>

      <button
        onClick={() => toggle('align-left')}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('align-left') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <AlignLeft size={20} />
      </button>

      <button
        onClick={() => toggle('align-center')}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('align-center') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <AlignCenter size={20} />
      </button>

      <button
        onClick={() => toggle('align-right')}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('align-right') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <AlignRight size={20} />
      </button>

      <button
        onClick={() => toggle('list')}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('list') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <List size={20} />
      </button>

      <button
        onClick={handleLinkUploadClick}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('link') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <Link2 size={20} className="rotate-135" />
      </button>
    </div>
  );
}
