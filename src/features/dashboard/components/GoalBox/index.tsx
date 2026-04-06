'use client';

import { useCallback, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Progressbar from '@/shared/components/Progressbar';
import TaskCard, { type TaskCardTodo } from '@/shared/components/TaskCard';
import SearchInput from '@/shared/components/SearchInput';
import Button from '@/shared/components/Button';
import Empty from '@/shared/components/Empty';

import type { GoalDetailResponse } from '@/shared/lib/api';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';

interface GoalBoxProps {
  data: GoalDetailResponse;
}

export default function GoalBox({ data }: GoalBoxProps) {
  const router = useRouter();
  const { openTodoCreateModal } = useTodoCreateModal();

  const todoList = data.todoList ?? [];
  const doneList = data.doneList ?? [];
  const goalId = data.id;

  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;

  const filterTodos = useCallback(
    (todos: TaskCardTodo[]) => {
      if (!isSearching) return todos;

      return todos.filter((todo) => todo.title && todo.title.toLowerCase().includes(normalizedSearch));
    },
    [isSearching, normalizedSearch],
  );

  const visibleTodoList = filterTodos(todoList);
  const visibleDoneList = filterTodos(doneList);

  return (
    <article className="flex flex-col gap-4 rounded-[40px] bg-white p-6 lg:px-8 lg:py-6">
      <div className="flex flex-col items-center gap-2 px-2 md:flex-row md:gap-12 lg:gap-8">
        <div className="flex w-full flex-1 flex-col gap-1 lg:flex-row lg:gap-4">
          <div className="w-full max-w-[229px]">
            <button
              onClick={() => {
                if (goalId === undefined) return;
                router.push(`goal/${goalId}`);
              }}
              className="font-base overflow-hidden text-left font-semibold text-ellipsis whitespace-nowrap text-gray-700"
            >
              {data.title}
            </button>
          </div>
          <Progressbar progress={data.progress ?? 0} />
        </div>

        <div className="flex w-full flex-1 justify-between gap-0 md:justify-end md:gap-2 lg:gap-[14px]">
          <SearchInput placeholder="할 일을 검색해주세요" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button
            variant="primary"
            className="p-[10px] md:px-[14.5px] md:px-[18px] md:py-[10px] lg:py-[10px]"
            disabled={goalId === undefined}
            onClick={() => {
              if (goalId === undefined) return;

              openTodoCreateModal({
                goalDetailId: goalId,
                todo: {
                  title: '',
                  goalId,
                  dueDate: undefined,
                  linkUrl: undefined,
                  imageUrl: undefined,
                  tags: [],
                },
              });
            }}
          >
            <PlusIcon size={20} />
            <span className="hidden w-full w-max text-sm font-semibold md:block">할 일 추가</span>
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col justify-around gap-2 md:flex-row lg:gap-8">
        {visibleTodoList.length === 0 && visibleDoneList.length === 0 ? (
          <div className="h-40 md:h-80">
            <Empty>{isSearching ? '검색 결과가 없습니다.' : '현재 등록된 할 일이 없습니다.'}</Empty>
          </div>
        ) : (
          <>
            <ListBox title="TODO" mode="todo" items={visibleTodoList} />
            <ListBox title="DONE" mode="done" items={visibleDoneList} />
          </>
        )}
      </div>
    </article>
  );
}

interface ListBoxProps {
  title: string;
  mode: 'todo' | 'done';
  items: TaskCardTodo[];
}

function ListBox({ title, mode, items }: ListBoxProps) {
  const bgColor = mode === 'todo' ? 'bg-[#E5F9F2]' : 'bg-white';
  const textColor = mode === 'todo' ? 'text-[#00D185]' : 'text-gray-400';

  return (
    <div className={`flex max-h-[324px] flex-1 flex-col gap-4 rounded-[16px] ${bgColor} p-4 lg:rounded-[24px] lg:p-6`}>
      <span className={`text-sm font-bold ${textColor} lg:text-base`}>{title}</span>
      <div className="flex max-h-[236px] flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <TaskCard
            variant={mode === 'todo' ? 'green' : 'default'}
            key={item.id}
            todo={{
              ...item,
              done: item.done ?? mode === 'done',
            }}
            starred={item.favorite}
          />
        ))}
      </div>
    </div>
  );
}
