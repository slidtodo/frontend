'use client';

import { useState } from 'react';
import { SunIcon, MoonIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import Button from '@/shared/components/Button';
import { useModalStore } from '@/shared/stores/useModalStore';

export function SettingsModal() {
  const { closeModal } = useModalStore();
  const [language, setLanguage] = useState('ko');
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="h-103 w-114 rounded-3xl bg-white p-8 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">설정</h2>
        <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600" aria-label="닫기">
          <XIcon size={20} />
        </button>
      </div>

      {/* 언어 */}
      <div className="mb-6 flex flex-col gap-2">
        <label htmlFor="language-select" className="text-sm font-medium text-slate-700">언어</label>
        <div className="relative h-14 w-98">
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-full w-full appearance-none rounded-2xl border border-gray-200 px-4 text-sm text-slate-800 outline-none focus:border-gray-400"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
          <ChevronDownIcon size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* 다크모드 */}
      <div className="mb-8 flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">다크모드</label>
        <div className="flex h-14 w-56 gap-2.5 rounded-full bg-gray-100 p-2">
          <button
            type="button"
            onClick={() => setIsDark(false)}
            className={`flex flex-1 items-center justify-center rounded-full transition-colors ${
              !isDark ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-400 hover:text-slate-600'
            }`}
          >
            <SunIcon size={20} />
          </button>
          <button
            type="button"
            onClick={() => setIsDark(true)}
            className={`flex flex-1 items-center justify-center rounded-full transition-colors ${
              isDark ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-400 hover:text-slate-600'
            }`}
          >
            <MoonIcon size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="cancel"
          className="h-14 w-48 text-sm text-gray-500"
          onClick={closeModal}
        >
          취소
        </Button>
        <Button
          variant="primary"
          className="h-14 w-48 text-sm"
          onClick={closeModal}
        >
          확인
        </Button>
      </div>
    </div>
  );
}
