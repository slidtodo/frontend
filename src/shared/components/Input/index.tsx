'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type InputType = 'text' | 'email' | 'password';

interface InputProps {
  type?: InputType;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export default function Input({ type = 'text', placeholder, value, onChange, disabled, className, ref }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative w-[400px]">
      <input
        ref={ref}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
                    w-full h-[56px] rounded-2xl border border-gray-200
                    px-6 text-base text-[#737373]
                    outline-none bg-white
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${className ?? ''}
                `}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-[#737373]"
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
        </button>
      )}
    </div>
  );
}
