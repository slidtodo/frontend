'use client';

import { TaskCardProps } from '@/shared/types/types';
import clsx from 'clsx';
import { CheckIcon, EllipsisVertical, GithubIcon, Star } from 'lucide-react';
import { useState } from 'react';

// ---------------------------------------------------------------------------
// TaskCard
// ---------------------------------------------------------------------------

/**
 * A single to-do list row.
 *
 * @example
 * <TaskCard id="1" text="항목명" />
 * <TaskCard id="2" text="완료된 항목" checked />
 */
export function TaskCard({
  /**
   * [todo]
   * todo: id, title, done
   * issues/PR: number, state, title
   */
  todo,
  starred: initialStarred = false,

  // 이벤트 핸들러
  onToggle, // 체크박스
  onStarToggle, // 별
}: TaskCardProps) {
  const [checked, setChecked] = useState(todo.done);
  const [starred, setStarred] = useState(initialStarred);

  function handleToggle() {
    setChecked((prev) => !prev);
    onToggle?.(todo.id);
    // TODO API 연결
  }

  function handleStarToggle() {
    setStarred((prev) => !prev);
    onStarToggle?.(todo.id);
  }

  return (
    /**
     * `group` -> group-hover: 처럼 사용 가능
     */
    <li
      className={clsx(
        'group',
        'cursor-pointer',
        'relative flex items-center gap-2',
        'rounded-2xl px-2 py-2.5',
        'transition-colors duration-150',
        'hover:bg-[rgba(255,158,89,0.2)]',
      )}
    >
      {/* ── Checkbox ─────────────────────────────────────────── */}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={`${todo.title} ${checked ? '완료 취소' : '완료 처리'}`}
        onClick={handleToggle}
        className={[
          'relative flex cursor-pointer items-center justify-center',
          'size-4.5 shrink-0 rounded-md',
          'transition-colors duration-150',
          checked ? 'border-transparent bg-[#FF8442]' : 'border border-[#CCCCCC] bg-white',
        ].join(' ')}
      >
        {checked && <CheckIcon className="text-white" />}
      </button>

      {/* ── Text ─────────────────────────────────────────────── */}
      {/** @TODO onClick에 모달 연결 */}
      <div
        className={[
          'min-w-0 flex-1 truncate',
          'text-base leading-6 tracking-[-0.03em]',
          'transition-colors duration-150',
          checked ? 'font-medium text-[#737373]' : 'font-medium text-[#262626]',
          checked ? 'group-hover:font-semibold group-hover:text-[#EF6C00]' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {todo.title}
      </div>

      {/* ── Action buttons ───────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-2" role="toolbar" aria-label={`${todo.title} 작업 도구`}>
        {/* //TODO 깃허브 아이콘 */}
        <button
          type="button"
          aria-label="메모 보기"
          className="relative h-6 w-6 cursor-pointer rounded-full bg-[#FF9E59]/20 p-1 group-hover:bg-white"
        >
          <GithubIcon className="absolute inset-0 p-1 text-orange-600" />
        </button>

        {/* //TODO 설정 아이콘 */}
        <button
          type="button"
          aria-label="링크 보기"
          className="relative h-6 w-6 cursor-pointer rounded-full bg-[#FF9E59]/20 p-1 group-hover:bg-white"
        >
          <EllipsisVertical className="absolute inset-0 p-1 text-orange-600" />
        </button>

        <button
          type="button"
          aria-label={starred ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={starred}
          onClick={handleStarToggle}
          className="h-6 w-6 cursor-pointer rounded-full"
        >
          <Star className="h-6 w-6 stroke-orange-400" fill={starred ? '#FF8442' : 'none'} />
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
