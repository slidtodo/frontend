'use client';

import { XIcon } from 'lucide-react';

interface DraftNoteToastProps {
  onLoad: () => void;
  onClose: () => void;
}

export default function DraftNoteToast({ onLoad, onClose }: DraftNoteToastProps) {
  return (
    <div className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 md:absolute md:top-13 md:-translate-x-[80%]">
      <div className="relative">
        {/* 말풍선 꼬리 (우측 상단) */}
        <div
          className="absolute -top-[8px] right-5 h-0 w-0"
          style={{
            borderLeft: '10px solid transparent',
            borderRight: '0px solid transparent',
            borderBottom: '10px solid #E6FAF3',
          }}
        />

        {/* 말풍선 본체 */}
        <div className="bg-bearlog-100 flex w-[281px] flex-col gap-2 rounded-[20px] px-5 py-4 shadow-[0_0_30px_rgba(0,0,0,0.05)]">
          {/* 상단: 텍스트 + X 버튼 */}
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm leading-5 font-normal tracking-[-0.42px] text-gray-600">
              임시 저장된 노트가 있어요.
              <br />
              저장된 노트를 불러오시겠어요?
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-0.5 shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-500"
            >
              <XIcon size={20} />
            </button>
          </div>

          {/* 불러오기 버튼 */}
          <button
            type="button"
            onClick={onLoad}
            className="hover:text-bearlog-600 text-bearlog-500 cursor-pointer text-left text-sm leading-5 font-semibold tracking-[-0.42px] transition-opacity hover:opacity-75"
          >
            불러오기
          </button>
        </div>
      </div>
    </div>
  );
}
