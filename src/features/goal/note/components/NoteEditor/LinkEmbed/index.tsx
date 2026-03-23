// features/goal/note/components/NoteEditor/LinkEmbed/index.tsx
'use client';

import { XIcon } from 'lucide-react';
import { useState } from 'react';

interface LinkEmbedProps {
  url: string;
  onRemove: () => void;
}

// URL에서 사이트 이름 추출
function getSiteName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return hostname.split('.')[0]; // "codeit.kr" → "codeit"
  } catch {
    return url;
  }
}

// favicon URL 생성
function getFaviconUrl(url: string): string {
  try {
    const { origin } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=24`;
  } catch {
    return '';
  }
}

export default function LinkEmbed({ url, onRemove }: LinkEmbedProps) {
  return (
    <div className="flex w-full flex-col gap-1 rounded-[14px] bg-[#FAFAFA] px-4 py-[14px]">
      {/* 상단 — 파비콘 + 사이트명 + 삭제 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* 파비콘 */}
          <div className="flex size-6 items-center justify-center overflow-hidden">
            <img
              src={getFaviconUrl(url)}
              alt="favicon"
              className="size-4"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          {/* 사이트 제목 */}
          <p className="text-sm font-medium text-[#333] tracking-[-0.42px]">
            {getSiteName(url)}
          </p>
        </div>
        {/* 삭제 버튼 */}
        <button
          type="button"
          onClick={onRemove}
          className="cursor-pointer text-[#A4A4A4] hover:text-[#333] transition-colors"
        >
          <XIcon size={20} />
        </button>
      </div>

      {/* 하단 — URL */}
      <p className="ml-[5px] truncate text-xs font-normal text-[#A4A4A4]">
        {url}
      </p>
    </div>
  );
}