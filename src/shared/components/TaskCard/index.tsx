'use client';

import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { CheckIcon, EllipsisVertical, GithubIcon, Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import type { TodoResponse } from '@/lib/api';
import { usePatchTodoFavorite, useDeleteTodo, usePatchTodo } from '@/lib/mutations';
import useOnClickOutside from '@/shared/hooks/useOnClickOutside';
import { useTodoEditModal } from '@/features/todo/hooks/useTodoEditModal';

interface TaskCardProps {
  todo: NonNullable<TodoResponse>;
  starred?: boolean;
  onTitleClick?: () => void;
  onToggle?: (id: number) => void;
  variant?: 'default' | 'orange';
}

/**
 * TODO
 * 할 일 수정, 삭제 로직
 * 할 일 Done으로 post 하는 로직
 */
export function TaskCard({
  /**
   * [todo]
   * todo: id, title, done
   * issues/PR: number, state, title
   */
  todo,
  starred: initialStarred = false,
  onTitleClick,
  onToggle, // 체크박스
  variant = 'default',
}: TaskCardProps) {
  const isOrange = variant === 'orange';

  return (
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
      {/*checked + todo title*/}
      <TaskCheckbox isOrange={isOrange} onToggle={onToggle} todo={todo} onTitleClick={onTitleClick} />

      {/* ── Action buttons ───────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-2" role="toolbar" aria-label={`${todo.title} 작업 도구`}>
        <TaskLinkNoteCreate isOrange={isOrange} todo={todo} />

        {/* //TODO 깃허브 아이콘 */}
        <TaskLinkGithub isOrange={isOrange} />
        <TaskEditTodo isOrange={isOrange} todo={todo} />
        <TaskFavorite isOrange={isOrange} initialStarred={initialStarred} todo={todo} />
      </div>
    </li>
  );
}

export default TaskCard;

interface TaskCheckboxProps {
  todo: NonNullable<TodoResponse>;
  onToggle?: (id: number) => void;
  isOrange: boolean;
  onTitleClick?: () => void;
}
function TaskCheckbox({ todo, isOrange, onToggle, onTitleClick }: TaskCheckboxProps) {
  const [checked, setChecked] = useState(todo.done);

  function handleToggle() {
    setChecked((prev) => !prev);
    if (todo.id !== undefined) {
      onToggle?.(todo.id);
    }
    // TODO API 연결
  }

  return (
    <>
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
      <div
        onClick={onTitleClick}
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
    </>
  );
}

interface TaskLinkNoteCreateProps {
  isOrange: boolean;
  todo: NonNullable<TodoResponse>;
}
function TaskLinkNoteCreate({ isOrange, todo }: TaskLinkNoteCreateProps) {
  return (
    <Link
      href={`/goal/${todo.goal?.id}/note/create`}
      className={clsx(
        'relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full p-1 group-hover:bg-white',
        isOrange ? 'bg-[#FFFFFF]/40' : 'bg-[#FF9E59]/20',
      )}
    >
      <Image src={'/image/todo-list.svg'} alt="todo-list menu" width={9} height={10} className="cursor-pointer" />
    </Link>
  );
}

interface TaskLinkGithubProps {
  isOrange: boolean;
}
function TaskLinkGithub({ isOrange }: TaskLinkGithubProps) {
  return (
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
  );
}

interface TaskLinkDetailProps {
  isOrange: boolean;
  todo: NonNullable<TodoResponse>;
}
function TaskEditTodo({ isOrange, todo }: TaskLinkDetailProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openTodoEditModal } = useTodoEditModal();

  useOnClickOutside(dropdownRef, () => {
    setOpen(false);
  });

  const { mutate: deleteTodo } = useDeleteTodo(todo.id);

  const handleDelete = () => {
    deleteTodo();
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label="설정 보기"
        onClick={() => setOpen(!open)}
        className={clsx(
          'relative h-6 w-6 cursor-pointer rounded-full p-1 group-hover:bg-white',
          isOrange ? 'bg-[#FFFFFF]/40' : 'bg-[#FF9E59]/20',
        )}
      >
        <EllipsisVertical className="absolute inset-0 p-1 text-orange-600" />
      </button>

      {open && (
        <div className="absolute top-8 right-0 z-10 min-w-[140px] rounded-xl border border-orange-100 bg-white p-1 shadow-lg">
          <button
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-orange-50"
            onClick={() => {
              if (todo.id === undefined) return;

              openTodoEditModal({
                goalDetailId: todo.goal?.id,
                todo: { id: todo.id, title: todo.title, done: todo.done },
              });
            }}
          >
            수정
          </button>
          <button
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

interface TaskFavoriteProps {
  isOrange: boolean;
  initialStarred?: boolean;
  todo: NonNullable<TodoResponse>;
}
function TaskFavorite({ isOrange, initialStarred, todo }: TaskFavoriteProps) {
  const [starred, setStarred] = useState(initialStarred);

  const { mutate: patchTodoFavorite } = usePatchTodoFavorite(todo.id);

  function handleStarToggle() {
    setStarred((prev) => !prev);

    patchTodoFavorite(undefined, {
      onError: () => {
        setStarred((prev) => !prev);
      },
    });
  }
  return (
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
  );
}
