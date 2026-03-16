import { useRef } from 'react';
import { SearchIcon } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classNames?: string;
  placeholder?: string;
  onIconClick?: () => void;
}
export default function SearchInput({ placeholder, classNames, onIconClick, ...props }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`flex items-center gap-2 rounded-[999px] border-[1px] border-[#A4A4A4] bg-white px-4 py-2 ${classNames}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-sm font-medium text-[#737373] focus:ring-0"
        ref={inputRef}
        {...props}
      />
      <SearchIcon size={20} className="text-[#A4A4A4]" onClick={onIconClick} />
    </div>
  );
}
