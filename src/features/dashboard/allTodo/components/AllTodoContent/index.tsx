'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';

import Button from '@/shared/components/Button';
import TaskCard from '@/shared/components/TaskCard';
import Empty from '@/shared/components/Empty';
import { DataBoundary } from '@/shared/components/ErrorSuspenseBoundary';
import { todoQueries } from '@/lib/queryKeys';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import type { TodoResponse } from '@/lib/api';
import { TodoOptions } from '@/shared/types/types';

export default function AllTodoContent() {
  const [selectedFilter, setSelectedFilter] = useState<TodoOptions>('ALL');

  const now = new Date();
  const { data: todos } = useQuery(
    todoQueries.list({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      done: selectedFilter === 'ALL' ? undefined : selectedFilter === 'DONE' ? true : false,
    }),
  );

  return (
    <section className="flex flex-col gap-3">
      <AllTodoFilter selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
      {todos && todos.length === 0 ? (
        <Empty>등록된 할 일이 없습니다.</Empty>
      ) : (
        <DataBoundary>
          <AllTodoFetcher todos={todos} />
        </DataBoundary>
      )}
    </section>
  );
}

interface AllTodoFilterProps {
  selectedFilter: TodoOptions;
  setSelectedFilter: React.Dispatch<React.SetStateAction<TodoOptions>>;
}
function AllTodoFilter({ selectedFilter, setSelectedFilter }: AllTodoFilterProps) {
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
                ? 'bg-[#FFA565]/20 text-[#EF6C00]'
                : 'text-[#A4A4A4] hover:bg-[#FFA565]/20 hover:text-[#EF6C00]'
            }`}
            onClick={() => setSelectedFilter(button.label)}
          >
            {button.label}
          </button>
        ))}
      </div>
      <Button
        variant="cancel"
        className="flex items-center gap-1 bg-[#F2F2F2] px-3 py-[10px] hover:bg-[#E0E0E0] md:px-[20px]"
        onClick={openTodoCreateModal}
      >
        <PlusIcon size={20} color="#737373" />
        <span className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-[#737373]">
          할 일 추가
        </span>
      </Button>
    </div>
  );
}

interface AllTodoFetcherProps {
  todos: TodoResponse[] | undefined;
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
