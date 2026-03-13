import { useState } from 'react';

interface LinkUploadModalProps {
  onConfirm: (url: string) => void;
}

export function LinkUploadModal({ onConfirm }: LinkUploadModalProps) {
  const [url, setUrl] = useState('');

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <h2 className="text-base font-semibold text-slate-800">링크 업로드</h2>
      {/**
       * @TODO Input, Button 컴포넌트로 대체
       * onClick 수정
       */}
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="링크를 입력하세요"
        className="mb-4 w-full rounded-xl border border-[#e5e5e5] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#bbb] focus:ring-2 focus:ring-orange-400 focus:outline-none"
        aria-label="링크 입력"
      />
      <button onClick={() => onConfirm}>확인</button>
    </div>
  );
}
