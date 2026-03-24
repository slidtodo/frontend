'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, EllipsisVertical, GithubIcon, Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { TodoItem } from '@/shared/types/api';

/**
 * A single to-do list row.
 *
 * @example
 * <TaskCard
 *  todo={{
 *  id: '1',
 *  title: '항목명',
 *  done: true,
 *  }}
 *  variant='orange'
 * />
 */

interface TaskCardProps {
  todo: TodoItem;
  starred?: boolean;
  onClick?: () => void;
  onToggle?: (id: number) => void;
  onStarToggle?: (id: number) => void;
  variant?: 'default' | 'orange';
}

export function TaskCard({
  /**
   * [todo]
   * todo: id, title, done
   * issues/PR: number, state, title
   */
  todo,
  starred: initialStarred = false,
  onClick,
  // 이벤트 핸들러
  onToggle, // 체크박스
  onStarToggle, // 별
  /**
   * varaint: 'default' | 'orange'
   */
  variant = 'default',
}: TaskCardProps) {
  const [checked, setChecked] = useState(todo.done);
  const [starred, setStarred] = useState(initialStarred);

  const router = useRouter();
  const isOrange = variant === 'orange';

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
        className={twMerge(
          clsx(
            'relative flex cursor-pointer items-center justify-center',
            'size-4.5 shrink-0 rounded-md',
            'transition-colors duration-150',
            checked ? 'border-transparent bg-[#FF8442]' : 'border border-[#CCCCCC] bg-white',
            isOrange && 'border-none bg-orange-200',
          ),
        )}
      >
        {checked && <CheckIcon className={clsx(isOrange ? 'text-orange-500' : 'text-white')} />}
      </button>

      {/* ── Text ─────────────────────────────────────────────── */}
      {/** @TODO onClick에 모달 연결 */}
      <div
        onClick={onClick}
        className={clsx(
          'min-w-0 flex-1 cursor-pointer truncate',
          'text-base leading-6 tracking-[-0.03em]',
          'transition-colors duration-150',
          checked ? 'font-medium text-[#737373] group-hover:font-semibold group-hover:text-[#EF6C00]' : 'font-medium',
          isOrange ? 'text-[#ffffff] group-hover:text-white' : 'text-[#262626]',
        )}
      >
        {todo.title}
      </div>

      {/* ── Action buttons ───────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-2" role="toolbar" aria-label={`${todo.title} 작업 도구`}>
        <button
          className={clsx(
            'relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full p-1 group-hover:bg-white',
            isOrange ? 'bg-[#FFFFFF]/40' : 'bg-[#FF9E59]/20',
          )}
          onClick={() => router.push(`${todo.id}/note/create`)}
        >
          <Image src={'/image/todo-list.svg'} alt="todo-list menu" width={9} height={10} className="cursor-pointer" />
        </button>
        {/* //TODO 깃허브 아이콘 */}
        <button
          type="button"
          aria-label="메모 보기"
          className={clsx(
            'relative h-6 w-6 cursor-pointer rounded-full p-1 group-hover:bg-white',
            isOrange ? 'bg-[#FFFFFF]/40' : 'bg-[#FF9E59]/20',
          )}
        >
          <GithubIcon className="absolute inset-0 p-1 text-orange-600" />
        </button>

        {/* //TODO 설정 아이콘 */}
        <button
          type="button"
          aria-label="링크 보기"
          className={clsx(
            'relative h-6 w-6 cursor-pointer rounded-full p-1 group-hover:bg-white',
            isOrange ? 'bg-[#FFFFFF]/40' : 'bg-[#FF9E59]/20',
          )}
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
          <Star
            className={clsx('h-6 w-6', isOrange ? 'stroke-[#FFD19B]' : 'stroke-orange-400')}
            fill={starred ? (isOrange ? '#FFD19B' : '#FF8442') : 'none'}
          />
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
