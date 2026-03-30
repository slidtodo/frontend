'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { CheckIcon, EllipsisVertical, GithubIcon, Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import EditDeleteDropdown from '@/features/dashboard/components/EditDeleteDropdown';
import { useTodoEditModal } from '@/features/todo/hooks/useTodoEditModal';
import type { TodoResponse } from '@/lib/api';
import { useDeleteTodo, usePatchTodoFavorite } from '@/lib/mutations';

interface TaskCardProps {
  todo: NonNullable<TodoResponse>;
  starred?: boolean;
  onTitleClick?: () => void;
  onToggle?: (id: number) => void;
  variant?: 'default' | 'orange';
}

export function TaskCard({
  todo,
  starred: initialStarred = false,
  onTitleClick,
  onToggle,
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
      <TaskCheckbox isOrange={isOrange} onToggle={onToggle} todo={todo} onTitleClick={onTitleClick} />

      <div className="flex shrink-0 items-center gap-2" role="toolbar" aria-label={`${todo.title} 작업 도구`}>
        <TaskLinkNoteCreate isOrange={isOrange} todo={todo} />
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
      <Image src="/image/todo-list.svg" alt="todo-list menu" width={9} height={10} className="cursor-pointer" />
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { openTodoEditModal } = useTodoEditModal();
  const { mutate: deleteTodo } = useDeleteTodo(todo.id);

  const handleDelete = () => {
    deleteTodo();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="수정 보기"
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          'relative h-6 w-6 cursor-pointer rounded-full p-1 group-hover:bg-white',
          isOrange ? 'bg-[#FFFFFF]/40' : 'bg-[#FF9E59]/20',
        )}
      >
        <EllipsisVertical className="absolute inset-0 p-1 text-orange-600" />
      </button>

      {open && (
        <EditDeleteDropdown
          handleEdit={() => {
            if (todo.id === undefined) return;

            openTodoEditModal({
              goalDetailId: todo.goal?.id,
              todo: { id: todo.id, title: todo.title, done: todo.done },
            });
            setOpen(false);
          }}
          handleDelete={handleDelete}
          onClose={() => setOpen(false)}
          anchorRef={buttonRef}
        />
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
