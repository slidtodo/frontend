'use client';

import { CheckIcon, LinkIcon, ListIcon } from 'lucide-react';
import { useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TodoListItemProps {
  id: string;
  text: string;
  /** Whether the todo is marked as done (checkbox checked) */
  checked?: boolean;
  /** Whether the item is starred / bookmarked */
  starred?: boolean;
  /** Whether the item has an attached note */
  hasNote?: boolean;
  /** Whether the item has an attached link */
  hasLink?: boolean;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onMenuOpen?: (id: string) => void;
  onStarToggle?: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Icon components — inline SVGs for zero-dependency, accessible icons
// ---------------------------------------------------------------------------

/** 5-pointed star — bookmark / favourite */
function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? '#FF8442' : 'none'}
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path
        d="M12 2l2.582 7.948H22.5l-6.791 4.936 2.582 7.947L12 18.095l-6.291 4.736L8.291 14.884 1.5 9.948h7.918L12 2z"
        stroke={filled ? '#FF8442' : '#CCCCCC'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// TodoListItem
// ---------------------------------------------------------------------------

/**
 * A single to-do list row.
 *
 * Variants (driven by props + CSS hover):
 * - Default (unchecked)            → white checkbox, dark text
 * - Done (checked, no hover)       → orange checkbox, muted gray text
 * - Done + Hover (CSS :hover)      → orange background, orange bold text,
 *                                    edit & kebab buttons appear
 *
 * @example
 * <TodoListItem id="1" text="항목명" />
 * <TodoListItem id="2" text="완료된 항목" checked />
 */
export function TaskCard({
  id,
  text,
  checked: initialChecked = false,
  starred: initialStarred = false,
  hasNote = true,
  hasLink = true,
  onToggle,
  onEdit,
  onMenuOpen,
  onStarToggle,
}: TodoListItemProps) {
  const [checked, setChecked] = useState(initialChecked);
  const [starred, setStarred] = useState(initialStarred);

  function handleToggle() {
    setChecked((prev) => !prev);
    onToggle?.(id);
  }

  function handleStarToggle() {
    setStarred((prev) => !prev);
    onStarToggle?.(id);
  }

  return (
    /**
     * `group` enables Tailwind's group-hover utilities on children.
     * The item expands visually on hover: bg changes, extra buttons appear,
     * and (if checked) the text becomes orange + semibold.
     */
    <li
      className={[
        'group',
        'cursor-pointer',
        'relative flex items-center gap-2',
        'rounded-2xl px-2 py-[10px]',
        'transition-colors duration-150',
        'hover:bg-[rgba(255,158,89,0.2)]',
      ].join(' ')}
    >
      {/* ── Checkbox ─────────────────────────────────────────── */}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={`${text} ${checked ? '완료 취소' : '완료 처리'}`}
        onClick={handleToggle}
        className={[
          'relative flex cursor-pointer items-center justify-center',
          'size-4.5 shrink-0 rounded-md',
          'transition-colors duration-150',
          checked ? 'border-transparent bg-[#FF8442]' : 'border border-[#CCCCCC] bg-white',
        ].join(' ')}
      >
        {checked && <CheckIcon />}
      </button>

      {/* ── Text ─────────────────────────────────────────────── */}
      <span
        className={[
          'min-w-0 flex-1 truncate',
          'text-base leading-6 tracking-[-0.03em]',
          'transition-colors duration-150',
          // Base color: dark when unchecked, muted when checked
          checked ? 'font-medium text-[#737373]' : 'font-medium text-[#262626]',
          // On hover, override to orange + semibold when the item is checked
          checked ? 'group-hover:font-semibold group-hover:text-[#EF6C00]' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {text}
      </span>

      {/* ── Action buttons ───────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-2" role="toolbar" aria-label={`${text} 작업 도구`}>
         {/* //TODO 깃허브 아이콘 */}
        {hasNote && (
          <button
            type="button"
            aria-label="메모 보기"
            className="relative h-6 w-6 rounded-full bg-[#FF9E59]/20 p-1 group-hover:bg-white"
          >
            <ListIcon className="absolute inset-0 p-1 text-orange-600" />
          </button>
        )}

        {/* //TODO 설정 아이콘 */}
        {hasLink && (
          <button
            type="button"
            aria-label="링크 보기"
            className="relative h-6 w-6 rounded-full bg-[#FF9E59]/20 p-1 group-hover:bg-white"
          >
            <LinkIcon className="absolute inset-0 p-1 text-orange-600" />
          </button>
        )}

        {/* Always-visible: Star / favourite */}
        <button
          type="button"
          aria-label={starred ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={starred}
          onClick={handleStarToggle}
          className="h-6 w-6 rounded-full"
        >
          <StarIcon filled={starred} />
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
