'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';

import Button from '@/shared/components/Button';
import TaskCard from '@/shared/components/TaskCard';
import Empty from '@/shared/components/Empty';
import { DataBoundary } from '@/shared/components/ErrorSuspenseBoundary';
import PageHeader from '@/shared/components/PageHeader';

import { todoQueries } from '@/lib/queryKeys';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import type { TodoListResponse } from '@/lib/api';
import { TodoOptions } from '@/shared/types/types';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';

export default function AllTodoContent() {
  const breakpoint = useBreakpoint();

  const [selectedFilter, setSelectedFilter] = useState<TodoOptions>('ALL');
  const { data: todoList } = useQuery(
    todoQueries.list({
      done: selectedFilter === 'ALL' ? undefined : selectedFilter === 'DONE' ? true : false,
    }),
  );

  if (!todoList) return null;
  return (
    <div className="mx-auto mb-[76px] flex max-w-[720px] flex-col gap-6">
      {breakpoint !== 'mobile' && (
        <PageHeader title="모든 할 일" count={todoList?.totalCount ?? todoList?.todos?.length ?? 0} className="pl-2" />
      )}
      <section className="flex flex-col gap-3">
        <AllTodoFilter todos={todoList.todos} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
        {todoList && (todoList.todos?.length ?? 0) === 0 ? (
          <Empty>등록된 할 일이 없습니다.</Empty>
        ) : (
          <DataBoundary>
            <AllTodoFetcher todos={todoList.todos} />
          </DataBoundary>
        )}
      </section>
    </div>
  );
}

interface AllTodoFilterProps {
  todos: TodoListResponse['todos'];
  selectedFilter: TodoOptions;
  setSelectedFilter: React.Dispatch<React.SetStateAction<TodoOptions>>;
}
function AllTodoFilter({ todos, selectedFilter, setSelectedFilter }: AllTodoFilterProps) {
  const todoButtons: { id: number; label: TodoOptions }[] = [
    { id: 1, label: 'ALL' },
    { id: 2, label: 'TO DO' },
    { id: 3, label: 'DONE' },
  ];
  const { openTodoCreateModal } = useTodoCreateModal();

  return (
    <div className="flex justify-between px-2">
      <div className="flex gap-0 md:gap-2">
        {todoButtons.map((button) => (
          <button
            key={button.id}
            className={`cursor-pointer overflow-hidden rounded-2xl px-4 py-2 text-base font-bold text-ellipsis whitespace-nowrap transition-all duration-200 ${
              selectedFilter === button.label
                ? 'text-bearlog-600 bg-bearlog-500/20'
                : 'hover:text-bearlog-600 hover:bg-bearlog-500/20 text-gray-400'
            }`}
            onClick={() => setSelectedFilter(button.label)}
          >
            {button.label}
          </button>
        ))}
      </div>
      <Button
        variant="cancel"
        className="group hover:bg-bearlog-500 flex items-center gap-1 bg-[#F2F2F2] px-3 py-[10px] md:px-[20px]"
        onClick={() => {
          if (todos?.[0]?.goal?.id === undefined) return;
          openTodoCreateModal({
            goalDetailId: undefined,
            todo: {
              title: '',
              goalId: todos?.[0]?.goal?.id,
              dueDate: undefined,
              linkUrl: undefined,
              imageUrl: undefined,
              tags: [],
            },
          });
        }}
      >
        <PlusIcon size={20} className="text-gray-500 group-hover:text-white" />
        <span className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-gray-500 group-hover:text-white">
          할 일 추가
        </span>
      </Button>
    </div>
  );
}

interface AllTodoFetcherProps {
  todos: TodoListResponse['todos'];
}
function AllTodoFetcher({ todos }: AllTodoFetcherProps) {
  return (
    <section className="rounded-4xl bg-white p-4 md:p-8">
      <div className="flex max-h-[680px] flex-col gap-4 overflow-y-auto">
        {todos?.map((todo) => (
          <TaskCard key={todo.id} todo={todo} />
        ))}
      </div>
    </section>
  );
}
