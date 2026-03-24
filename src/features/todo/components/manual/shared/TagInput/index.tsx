'use client';

import { TAG_COLORS } from '@/shared/constants/constants';
import { getColorIndex } from '@/shared/utils/utils';
import { XIcon } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function TagInput({ tags, onAddTag, onRemoveTag }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (e.nativeEvent.isComposing) return;

      const trimmed = inputValue.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onAddTag(trimmed);
        setInputValue('');
      }
    }

    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      if (e.nativeEvent.isComposing) return;
      onRemoveTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex min-h-[44px] w-full flex-wrap items-center gap-2 rounded-xl border border-[#CCC] px-3 py-2 md:min-h-[56px] md:rounded-2xl md:px-4 md:py-3">
      {tags.map((tag) => {
        const color = TAG_COLORS[getColorIndex(tag)];
        return (
          <div
            key={tag}
            className={`flex items-center gap-[2px] rounded-full border py-1 pr-[3px] pl-2 ${color.bg} ${color.border}`}
          >
            <span className={`text-xs leading-4 font-medium ${color.text}`}>{tag}</span>
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="flex cursor-pointer items-center justify-center p-[2px]"
            >
              <XIcon size={12} className={color.icon} />
            </button>
          </div>
        );
      })}

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? '입력 후 Enter' : ''}
        className="min-w-[80px] flex-1 border-none bg-transparent p-0 text-sm text-[#333] placeholder:text-[#737373] focus:outline-none md:text-base"
      />
    </div>
  );
}
