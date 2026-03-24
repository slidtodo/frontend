'use client';

import { Check, XIcon } from 'lucide-react';

interface ToastProps {
  children: React.ReactNode;
  subText?: string;
  onLoad: () => void;
  onClose: () => void;
}

export default function Toast({ children, subText, onLoad, onClose }: ToastProps) {
  return (
    <>
      {/* 포지션 래퍼 */}
      <div className="toast-animate fixed bottom-10 left-1/2 z-50 md:absolute md:top-13 md:left-1/2">
        <div className="flex h-10 -translate-x-1/2 items-center gap-1 rounded-[28px] bg-[#fff8e4] px-4 whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:-translate-x-[80%]">
          {/* 체크 아이콘 */}
          <span className="flex size-6 shrink-0 items-center justify-center">
            <Check fill="none" className="aria-hidden h-[10px] w-[14px]" />
          </span>

          {/* 텍스트 영역 */}
          <div className="flex items-center gap-1 text-[#ef6c00]">
            <button
              type="button"
              onClick={onLoad}
              className="text-[14px] leading-5 font-semibold tracking-[-0.42px] hover:underline"
            >
              {children}
            </button>

            {subText && (
              <>
                <span className="text-[12px] leading-4 font-medium">ㆍ</span>
                <span className="text-[14px] leading-5 font-semibold tracking-[-0.42px]">{subText}</span>
              </>
            )}
          </div>

          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={onClose}
            aria-label="토스트 닫기"
            className="ml-1 flex size-5 shrink-0 items-center justify-center rounded-full text-[#ef6c00] opacity-60 transition-opacity hover:opacity-100"
          >
            <XIcon size="10" fill="none" className="aria-hidden" />
          </button>
        </div>
      </div>
    </>
  );
}
