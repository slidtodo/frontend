'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { CheckIcon, EllipsisVertical, SquareMenuIcon, Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import EditDeleteDropdown from '@/features/dashboard/components/EditDeleteDropdown';
import DetailTodoModal from '@/features/goal/components/DetailTodoModal';

import { useTodoEditModal } from '@/features/todo/hooks/useTodoEditModal';
import { useDeleteTodo, usePatchTodo, usePatchTodoFavorite } from '@/lib/mutations';
import { todoQueries } from '@/lib/queryKeys';
import { useToastStore } from '@/shared/stores/useToastStore';
import { useModalStore } from '@/shared/stores/useModalStore';

export interface TaskCardTodo {
  id?: number;
  title?: string;
  done?: boolean;
  favorite?: boolean;
  goal?: {
    id?: number;
  };
}

interface TaskCardProps {
  todo: TaskCardTodo;
  starred?: boolean;
  onCheckboxClick?: (id: number, done: boolean) => void;
  variant?: 'default' | 'green';
}
export default function TaskCard({
  todo,
  starred: initialStarred = false,
  onCheckboxClick,
  variant = 'default',
}: TaskCardProps) {
  const isGreen = variant === 'green';

  return (
    <li
      className={clsx(
        'group',
        'cursor-pointer',
        'relative flex items-center gap-2',
        'rounded-2xl px-2 py-2.5',
        'transition-all duration-150',
        'hover:bg-[rgba(0,200,127,0.1)]',
      )}
    >
      <TaskCheckbox isGreen={isGreen} onCheckboxClick={onCheckboxClick} todo={todo} />

      <div className="flex shrink-0 items-center gap-2" role="toolbar" aria-label={`${todo.title} 작업 도구`}>
        <TaskLinkNoteCreate todo={todo} />
        <TaskLinkGithub />
        <TaskEditTodo todo={todo} />
        <TaskFavorite initialStarred={initialStarred} todo={todo} />
      </div>
    </li>
  );
}

interface TaskCheckboxProps {
  todo: TaskCardTodo;
  onCheckboxClick?: (id: number, done: boolean) => void;
  isGreen: boolean;
}
function TaskCheckbox({ todo, isGreen, onCheckboxClick }: TaskCheckboxProps) {
  const { showToast } = useToastStore();
  const { openModal } = useModalStore();

  const patchTodo = usePatchTodo(todo.id);
  const checked = todo.done ?? false;

  const handleCheckboxClick = async () => {
    if (todo.id === undefined) return;

    try {
      await patchTodo.mutateAsync({
        done: !checked,
      });
      onCheckboxClick?.(todo.id, !checked);
      showToast(`할 일을${!checked ? ' 완료했습니다.' : ' 미완료 처리했습니다.'}`);
    } catch (error) {
      console.error('할 일 상태 업데이트 실패:', error);
    }
  };

  return (
    <>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={`${todo.title} ${checked ? '완료 취소' : '완료 처리'}`}
        onClick={handleCheckboxClick}
        className={twMerge(
          clsx(
            'relative flex cursor-pointer items-center justify-center',
            'size-4.5 shrink-0 rounded-md',
            'transition-all duration-150',
            checked ? 'bg-bearlog-500 border-transparent' : 'border border-gray-300 bg-white',
            isGreen && 'border-none',
          ),
        )}
      >
        {checked && <CheckIcon size={16} color="#ffffff" />}
      </button>
      <button
        type="button"
        onClick={() => {
          if (todo.id) openModal(<DetailTodoModal todoId={todo.id} />);
        }}
        className={clsx(
          'group min-w-0 flex-1 cursor-pointer truncate text-left',
          'text-base leading-6 tracking-[-0.03em]',
          'transition-all duration-150',
          checked ? 'group-hover:text-bearlog-600 font-medium group-hover:font-semibold' : '',
          isGreen ? 'text-gray-800' : 'group-hover:text-bearlog-600 text-gray-500 group-hover:font-semibold',
        )}
      >
        {todo.title}
      </button>
    </>
  );
}

interface TaskLinkNoteCreateProps {
  todo: TaskCardTodo;
}

function TaskLinkNoteCreate({ todo }: TaskLinkNoteCreateProps) {
  const { data: goal } = useQuery({
    ...todoQueries.detail(todo.id as number),
    enabled: !!todo.id,
  });

  if (!goal?.goal?.id || !todo.id) return null;
  return (
    <Link
      href={`/goal/${goal.goal.id}/note/create?todoId=${todo.id}`}
      className={
        'relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[rgba(0,200,127,0.1)] p-1'
      }
    >
      <SquareMenuIcon size={12} color="#008354" />
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
  todo: TaskCardTodo;
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
  initialStarred?: boolean;
  todo: TaskCardTodo;
}

function TaskFavorite({ initialStarred, todo }: TaskFavoriteProps) {
  const { showToast } = useToastStore();

  const [starred, setStarred] = useState(initialStarred);
  const { mutate: patchTodoFavorite } = usePatchTodoFavorite(todo.id);

  function handleStarToggle() {
    const nextStarred = !starred;
    setStarred(nextStarred);

    patchTodoFavorite(undefined, {
      onSuccess: () => {
        showToast(`즐겨찾기에 ${nextStarred ? '추가되었습니다.' : '해제되었습니다.'}`);
      },
      onError: (error) => {
        console.error(error);
        setStarred(!nextStarred);
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
      <Star className={'h-6 w-6 stroke-[rgba(0,200,127,0.1)]'} fill={starred ? '#00c87f' : 'none'} />
    </button>
  );
}
