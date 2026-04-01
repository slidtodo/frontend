'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { CheckIcon, EllipsisVertical, GithubIcon, Star } from 'lucide-react';
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
  variant?: 'default' | 'orange';
}
export default function TaskCard({
  todo,
  starred: initialStarred = false,
  onCheckboxClick,
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
      <TaskCheckbox isOrange={isOrange} onCheckboxClick={onCheckboxClick} todo={todo} />

      <div className="flex shrink-0 items-center gap-2" role="toolbar" aria-label={`${todo.title} 작업 도구`}>
        <TaskLinkNoteCreate isOrange={isOrange} todo={todo} />
        <TaskLinkGithub isOrange={isOrange} />
        <TaskEditTodo isOrange={isOrange} todo={todo} />
        <TaskFavorite isOrange={isOrange} initialStarred={initialStarred} todo={todo} />
      </div>
    </li>
  );
}

interface TaskCheckboxProps {
  todo: TaskCardTodo;
  onCheckboxClick?: (id: number, done: boolean) => void;
  isOrange: boolean;
}
function TaskCheckbox({ todo, isOrange, onCheckboxClick }: TaskCheckboxProps) {
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
            'transition-colors duration-150',
            checked ? 'border-transparent bg-[#FF8442]' : 'border border-[#CCCCCC] bg-white',
            isOrange && 'border-none bg-orange-200',
          ),
        )}
      >
        {checked && <CheckIcon className={clsx(isOrange ? 'text-orange-500' : 'text-white')} />}
      </button>
      <button
        type="button"
        onClick={() => {
          if (todo.id) openModal(<DetailTodoModal todoId={todo.id} />);
        }}
        className={clsx(
          'min-w-0 flex-1 cursor-pointer truncate text-left',
          'text-base leading-6 tracking-[-0.03em]',
          'transition-colors duration-150',
          checked ? 'font-medium text-[#737373] group-hover:font-semibold group-hover:text-[#EF6C00]' : 'font-medium',
          isOrange ? 'text-[#ffffff] group-hover:text-white' : 'text-[#262626]',
        )}
      >
        {todo.title}
      </button>
    </>
  );
}

interface TaskLinkNoteCreateProps {
  isOrange: boolean;
  todo: TaskCardTodo;
}

function TaskLinkNoteCreate({ isOrange, todo }: TaskLinkNoteCreateProps) {
  const { data: goal } = useQuery({
    ...todoQueries.detail(todo.id as number),
    enabled: !!todo.id,
  });

  if (!goal?.goal?.id || !todo.id) return null;
  return (
    <Link
      href={`/goal/${goal.goal.id}/note/create?todoId=${todo.id}`}
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
  todo: TaskCardTodo;
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
  isOrange: boolean;
  initialStarred?: boolean;
  todo: TaskCardTodo;
}

function TaskFavorite({ isOrange, initialStarred, todo }: TaskFavoriteProps) {
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
      <Star
        className={clsx('h-6 w-6', isOrange ? 'stroke-[#FFD19B]' : 'stroke-orange-400')}
        fill={starred ? (isOrange ? '#FFD19B' : '#FF8442') : 'none'}
      />
    </button>
  );
}
