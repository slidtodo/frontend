import { useState } from 'react';
import { XIcon } from 'lucide-react';

import Button from '../../Button';
import Input from '../../Input';

import { useModalStore } from '@/shared/stores/useModalStore';

interface SinglePostModalProps {
  title?: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'email' | 'url';
  onConfirm: (value: string) => void;
}

export function SinglePostModal({
  title = '링크 입력',
  placeholder = '링크를 입력해주세요',
  defaultValue = '',
  inputType = 'url',
  onConfirm,
}: SinglePostModalProps) {
  const [value, setValue] = useState(defaultValue);
  const { closeModal } = useModalStore();

  return (
    <div className="w-85.75 rounded-3xl bg-white p-4 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] md:w-114 md:rounded-[40px] md:p-8">
      <div className="flex flex-col">
        <div className="mb-6 flex w-full items-center justify-between self-stretch md:mb-8">
          <h2 className="text-base font-semibold text-slate-800 md:text-xl">{title}</h2>
          <XIcon className="cursor-pointer text-slate-400" size={24} onClick={closeModal} />
        </div>

        <Input
          type={inputType}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="mb-6 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 placeholder:text-sm placeholder:text-slate-500 focus:outline-none md:text-base md:placeholder:text-base"
          aria-label={placeholder}
        />

        <Button
          className="flex flex-1 items-center justify-center rounded-full bg-[#ff8442] px-[18px] py-[10px] text-sm font-semibold text-white md:py-[14px] md:text-[18px]"
          onClick={() => {
            onConfirm(value);
            closeModal();
          }}
        >
          확인
        </Button>
      </div>
    </div>
  );
}
