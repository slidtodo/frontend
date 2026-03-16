import { useModalStore } from '@/shared/stores/useModalStore';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

interface LinkUploadModalProps {
  onConfirm: (url: string) => void;
}

export function LinkUploadModal({ onConfirm }: LinkUploadModalProps) {
  const [url, setUrl] = useState('');
  const { closeModal } = useModalStore();

  return (
    <div className="w-85.75 rounded-3xl bg-white p-4 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] md:w-114 md:rounded-[40px] md:p-8">
      <div className="flex flex-col">
        <div className="mb-6 flex w-full items-center justify-between self-stretch md:mb-8">
          <h2 className="text-base font-semibold text-slate-800 md:text-xl">링크 업로드</h2>
          <XIcon className="cursor-pointer text-slate-400" size={24} onClick={closeModal} />
        </div>
        {/**
         * @TODO Input, Button 컴포넌트로 대체
         * onClick 수정
         */}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="링크를 입력하세요"
          className="mb-6 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 placeholder:text-sm placeholder:text-slate-500 focus:outline-none md:text-base md:placeholder:text-base"
          aria-label="링크 입력"
        />
        <button
          className="flex flex-1 items-center justify-center rounded-full bg-[#ff8442] px-[18px] py-[10px] text-sm font-semibold text-white md:py-[14px] md:text-lg md:text-[18px]"
          onClick={() => {
            onConfirm(url);
            closeModal();
          }}
        >
          확인
        </button>
      </div>
    </div>
  );

}

