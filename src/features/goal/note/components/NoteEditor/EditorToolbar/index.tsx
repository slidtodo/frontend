'use client';

import { LinkUploadModal } from '@/shared/components/Modal/LinkUploadModal';
import { useModalStore } from '@/shared/stores/useModalStore';
import clsx from 'clsx';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Link2, List, Underline } from 'lucide-react';
import { useState } from 'react';

const ALIGN_TOOLS = ['align-left', 'align-center', 'align-right'];

export default function EditorToolbar() {
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const { openModal } = useModalStore();

  const toggle = (tool: string) => {
    setActiveTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));
  };

  const toggleAlign = (tool: string) => {
    setActiveTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev.filter((t) => !ALIGN_TOOLS.includes(t)), tool],
    );
  };

  /**
   * @TODO
   * onConfirm에 넘겨주는 함수 링크 업로드 API로 바꾸기
   */
  const handleLinkUploadClick = () => {
    toggle('link');
    openModal(<LinkUploadModal onConfirm={(url) => console.log(url)} />, () =>
      setActiveTools((prev) => prev.filter((t) => t !== 'link')),
    );
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
        onClick={() => toggleAlign('align-left')}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('align-left') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <AlignLeft size={20} />
      </button>

      <button
        onClick={() => toggleAlign('align-center')}
        className={clsx(
          'cursor-pointer rounded-lg p-1.5 hover:bg-[#DDD]',
          activeTools.includes('align-center') && 'bg-[#DDD] text-slate-700',
        )}
      >
        <AlignCenter size={20} />
      </button>

      <button
        onClick={() => toggleAlign('align-right')}
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
