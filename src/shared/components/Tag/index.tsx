'use client';
import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface TagProps {
  string: string;
  onClose?: () => void;
  variant?: 'green' | 'orange' | 'purple';
  className?: string;
}

const variantStyles = {
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-500',
  purple: 'bg-purple-100 text-purple-500',
};

const Tag = forwardRef<HTMLDivElement, TagProps>(({ string, onClose, variant = 'green', className }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge(
        'inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium',
        variantStyles[variant],
        className,
      )}
    >
      <span>{string}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-1 hover:opacity-70" aria-label="태그 삭제">
          <X size={14} />
        </button>
      )}
    </div>
  );
});
Tag.displayName = 'Tag';

export default Tag;
