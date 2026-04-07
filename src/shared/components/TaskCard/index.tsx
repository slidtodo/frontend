'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { CheckIcon, EllipsisVertical, SquareMenuIcon, Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import EditDeleteDropdown from '@/features/dashboard/components/EditDeleteDropdown';
import DetailTodoModal from '@/features/goal/components/DetailTodoModal';

import { useTodoEditModal } from '@/features/todo/hooks/useTodoEditModal';
import { useDeleteTodo } from '@/shared/lib/mutations';
import { useModalStore } from '@/shared/stores/useModalStore';
import { TodoResponse } from '@/shared/lib/api';

interface TaskCardProps {
  todo: TodoResponse;
  onCheckboxClick: () => void;
  onStareClick: () => void;
  variant?: 'default' | 'green';
}
export default function TaskCard({ todo, onCheckboxClick, onStareClick, variant = 'default' }: TaskCardProps) {
  const isGreen = variant === 'green';

  return (
    <li
      className={clsx(
        'group',
        'cursor-pointer',
        'relative flex items-center gap-2',
        'rounded-2xl px-2 py-2.5',
        'transition-all duration-150 ease-in-out',
        'hover:bg-[rgba(0,200,127,0.1)]',
      )}
    >
      <TaskCheckbox isGreen={isGreen} onCheckboxClick={onCheckboxClick} todo={todo} />

      <div className="flex shrink-0 items-center gap-2" role="toolbar" aria-label={`${todo.title} 작업 도구`}>
        <TaskLinkNoteCreate todo={todo} />
        <TaskLinkGithub />
        <TaskEditTodo todo={todo} />
        <TaskFavorite todo={todo} onStareClick={onStareClick} />
      </div>
    </li>
  );
}

interface TaskCheckboxProps {
  todo: TodoResponse;
  onCheckboxClick: () => void;
  isGreen: boolean;
}
function TaskCheckbox({ todo, isGreen, onCheckboxClick }: TaskCheckboxProps) {
  const { openModal } = useModalStore();

  return (
    <>
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.done ?? false}
        aria-label={`${todo.title} ${todo.done ? '완료 취소' : '완료 처리'}`}
        onClick={onCheckboxClick}
        className={twMerge(
          clsx(
            'relative flex cursor-pointer items-center justify-center',
            'size-4.5 shrink-0 rounded-md',
            'transition-all duration-150 ease-in-out',
            todo.done ? 'bg-bearlog-500 border-none' : 'border border-gray-300 bg-white',
            isGreen ? '' : 'border-none',
          ),
        )}
      >
        {todo.done && <CheckIcon size={16} color="#ffffff" />}
      </button>
      <button
        type="button"
        onClick={() => {
          if (todo.id) openModal(<DetailTodoModal todoId={todo.id} />);
        }}
        className={clsx(
          'group min-w-0 flex-1 cursor-pointer truncate text-left',
          'text-base leading-6 tracking-[-0.03em]',
          'transition-all duration-150 ease-in-out',
          todo.done ? 'group-hover:text-bearlog-600 font-medium group-hover:font-semibold' : '',
          isGreen ? 'text-gray-800' : 'group-hover:text-bearlog-600 text-gray-500 group-hover:font-semibold',
        )}
      >
        {todo.title}
      </button>
    </>
  );
}

interface TaskLinkNoteCreateProps {
  todo: TodoResponse;
}
function TaskLinkNoteCreate({ todo }: TaskLinkNoteCreateProps) {
  if (!todo.goal?.id || !todo.id) return null;

  return (
    <Link
      href={`/goal/${todo.goal.id}/note/create?todoId=${todo.id}`}
      className={'relative flex h-6 w-6 cursor-pointer items-center justify-center'}
    >
      <Image src="/image/go-note.png" alt="Note menu" width={24} height={24} className="absolute inset-0" />
      {/** TODO: 해당 위 SquareMenuIcon 디자인이 완성되지 않음  */}
    </Link>
  );
}

function TaskLinkGithub() {
  return (
    <button type="button" aria-label="GitHub 링크 이동">
      <Image src="/image/github-icon.png" alt="GitHub menu" width={24} height={24} className="cursor-pointer" />
    </button>
  );
}

interface TaskLinkDetailProps {
  todo: TodoResponse;
}
function TaskEditTodo({ todo }: TaskLinkDetailProps) {
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
        aria-label="편집 모달 보기"
        onClick={() => setOpen((prev) => !prev)}
        className={'relative h-6 w-6 cursor-pointer rounded-full bg-[rgba(0,200,127,0.1)] p-1'}
      >
        <EllipsisVertical color="#008354" className="absolute inset-0 p-1" />
      </button>

      {open && (
        <EditDeleteDropdown
          handleEdit={() => {
            if (todo.id === undefined) return;

            openTodoEditModal({
              goalDetailId: todo.goal?.id,
              todo: { id: todo.id, title: todo.title, done: todo.done ?? false },
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
  todo: TodoResponse;
  onStareClick: () => void;
}
function TaskFavorite({ todo, onStareClick }: TaskFavoriteProps) {
  return (
    <button
      type="button"
      aria-label={todo.favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      aria-pressed={todo.favorite}
      onClick={onStareClick}
      className="h-6 w-6 cursor-pointer rounded-full"
    >
      <Star className={'h-6 w-6 stroke-[rgba(0,200,127,0.1)]'} fill={todo.favorite ? '#00c87f' : 'none'} />
    </button>
  );
}
