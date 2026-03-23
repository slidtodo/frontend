// shared/StatusField/index.tsx
'use client';

import FormField from '@/shared/components/FormField';
import { CheckIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatusFieldProps {
  done: boolean;
  onChange: (done: boolean) => void;
  errorMessage?: string;
}

export default function StatusField({ done, onChange, errorMessage }: StatusFieldProps) {
  return (
    <FormField label="상태" required>
      <div className="flex gap-2">
        {/* TO DO */}
        <button
          type="button"
          onClick={() => onChange(false)}
          className="flex w-[76px] cursor-pointer items-center gap-[6px]"
        >
          <div
            className={clsx(
              'flex size-[18px] shrink-0 items-center justify-center rounded-[6px] border',
              !done ? 'border-transparent bg-[#FF8442]' : 'border-[#CCC] bg-white',
            )}
          >
            {!done && <CheckIcon size={12} className="stroke-white stroke-2" />}
          </div>
          <span className="text-sm font-medium text-[#737373]">TO DO</span>
        </button>

        {/* DONE */}
        <button
          type="button"
          onClick={() => onChange(true)}
          className="flex w-[76px] cursor-pointer items-center gap-[6px]"
        >
          <div
            className={clsx(
              'flex size-[18px] shrink-0 items-center justify-center rounded-[6px] border',
              done ? 'border-transparent bg-[#FF8442]' : 'border-[#CCC] bg-white',
            )}
          >
            {done && <CheckIcon size={12} className="stroke-white stroke-2" />}
          </div>
          <span className="text-sm font-medium text-[#737373]">DONE</span>
        </button>
      </div>
      {errorMessage && <p className="px-1 text-xs text-red-500">{errorMessage}</p>}
    </FormField>
  );
}
