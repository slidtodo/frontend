'use client';

import { useState } from 'react';
import { SunIcon, MoonIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import Button from '@/shared/components/Button';
import { useModalStore } from '@/shared/stores/useModalStore';
import { useLanguage, type Language } from '@/shared/contexts/LanguageContext';

export function SettingsModal() {
  const { closeModal } = useModalStore();
  const { language, setLanguage, t } = useLanguage();
  const [tempLanguage, setTempLanguage] = useState<Language>(language);
  const [isDark, setIsDark] = useState(false);

  const handleConfirm = () => {
    setLanguage(tempLanguage);
    closeModal();
  };

  const handleCancel = () => {
    setTempLanguage(language);
    closeModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="h-103 w-114 rounded-3xl bg-white p-8 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">{t.settings.title}</h2>
        <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-600" aria-label={t.common.close}>
          <XIcon size={20} />
        </button>
      </div>

      {/* 언어 */}
      <div className="mb-6 flex flex-col gap-2">
        <label htmlFor="language-select" className="text-sm font-medium text-slate-700">{t.settings.language}</label>
        <div className="relative h-14 w-98">
          <select
            id="language-select"
            value={tempLanguage}
            onChange={(e) => setTempLanguage(e.target.value as Language)}
            className="h-full w-full appearance-none rounded-2xl border border-gray-200 px-4 text-sm text-slate-800 outline-none focus:border-gray-400"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="zh">简体中文</option>
            <option value="ja">日本語</option>
          </select>
          <ChevronDownIcon size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* 다크모드 */}
      <div className="mb-8 flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">{t.settings.darkMode}</label>
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
          onClick={handleCancel}
        >
          {t.settings.cancel}
        </Button>
        <Button
          variant="primary"
          className="h-14 w-48 text-sm"
          onClick={handleConfirm}
        >
          {t.settings.confirm}
        </Button>
      </div>
    </div>
  );
}
