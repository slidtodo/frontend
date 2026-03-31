// features/goal/note/components/NoteEditor/LinkEmbedPreview/index.tsx
'use client';

import { ChevronLeftIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface LinkEmbedPreviewProps {
  url: string;
}

export default function LinkEmbedPreview({ url }: LinkEmbedPreviewProps) {
  const [isOpen, setIsOpen] = useState(true);

  const proxyUrl = `/api/link-proxy?url=${encodeURIComponent(url)}`;

  return (
    <>
      {/* ── lg 이상 — 오른쪽 고정 패널 ── */}
      <div
        className={clsx(
          'hidden lg:flex',
          'fixed top-0 right-0 h-full flex-col items-start justify-center',
          'border-l border-[#DDD] bg-[#FAFAFA]',
          'px-10',
          isOpen ? 'w-[734px]' : 'w-0 overflow-hidden px-0',
          'transition-all duration-300',
        )}
      >
        {isOpen && (
          <div className="relative h-[376px] w-full overflow-hidden border border-[#CCC]">
            <iframe
              src={proxyUrl}
              className="h-full w-full border-0"
              title="링크 미리보기"
            />
          </div>
        )}
      </div>

      {/* lg 패널 접기/펼치기 버튼 — 패널 왼쪽에 고정 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'hidden lg:flex',
          'fixed top-1/2 z-10 -translate-y-1/2',
          'h-[60px] w-[38px] items-center justify-center',
          'rounded-tl-2xl rounded-bl-2xl',
          'border border-[#DDD] bg-[#FAFAFA]',
          'transition-all duration-300',
          isOpen ? 'right-[734px]' : 'right-0',
        )}
      >
        <ChevronLeftIcon
          size={24}
          className={clsx('stroke-[#535353] transition-transform duration-300', !isOpen && 'rotate-180')}
        />
      </button>

      {/* ── md 이하 — 하단 패널 ── */}
      <div className={clsx('lg:hidden', 'fixed right-0 bottom-0 left-0 z-10', 'border-t border-[#DDD] bg-[#FAFAFA]')}>
        {/* md 접기/펼치기 버튼 — 패널 위쪽 중앙 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'absolute -top-[38px] left-1/2 -translate-x-1/2',
            'flex items-center justify-center',
            'md:h-[38px] md:w-[60px] md:rotate-90 md:rounded-tl-2xl md:rounded-bl-2xl',
            'h-[28px] w-[38px] rotate-90 rounded-tl-[12px] rounded-bl-[12px]',
            'border border-[#DDD] bg-[#FAFAFA]',
          )}
        >
          {isOpen ? (
            <ChevronUpIcon size={20} className="stroke-[#535353]" />
          ) : (
            <ChevronDownIcon size={20} className="stroke-[#535353]" />
          )}
        </button>

        {isOpen && (
          <div className="h-[280px] w-full overflow-hidden md:h-[337px]">
            <iframe
              src={proxyUrl}
              className="h-full w-full border-0"
              title="링크 미리보기"
            />
          </div>
        )}
      </div>
    </>
  );
}
