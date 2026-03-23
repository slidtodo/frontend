'use client';

import { useCallback, useRef } from 'react';
import { SearchIcon } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
  onIconClick?: () => void;
}
export default function SearchInput({ placeholder, className, onIconClick, ...props }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = useCallback(() => {
    if (onIconClick) {
      onIconClick();
    } else {
      inputRef.current?.focus();
    }
  }, [onIconClick]);

  return (
    <div
      className={`flex items-center gap-2 rounded-[999px] border-[1px] border-[#A4A4A4] bg-white px-4 py-2 ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-sm font-medium text-[#404040] outline-none placeholder:text-[#A4A4A4] focus:ring-0"
        ref={inputRef}
        {...props}
      />
      <SearchIcon size={20} className="text-[#A4A4A4]" onClick={handleIconClick} />
    </div>
  );
}
