'use client';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';

import Button from '@/shared/components/Button';
import TaskCard from '@/shared/components/TaskCard';
import Empty from '@/shared/components/Empty';

import { todoQueries } from '@/lib/queryKeys';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import type { TodoResponse } from '@/lib/api';

export default function AllTodoContent() {
  const now = new Date();
  const { data: todos } = useQuery(
    todoQueries.list({ year: now.getFullYear(), month: now.getMonth() + 1, sort: 'LATEST' }),
  );

  return (
    <section className="flex flex-col gap-3">
      <AllTodoFilter />
      <AllTodoFetcher todos={todos} />
    </section>
  );
}

function AllTodoFilter() {
  const todoButtons = [
    { id: 1, label: 'ALL' },
    { id: 2, label: 'TO DO' },
    { id: 3, label: 'DONE' },
  ];
  const { openTodoCreateModal } = useTodoCreateModal();
  // TODO: 머지되면 모달 추가 만들어야 함
  return (
    <div className="flex justify-between px-2">
      <div className="flex gap-0 md:gap-2">
        {todoButtons.map((button) => (
          <button
            key={button.id}
            className="cursor-pointer overflow-hidden rounded-2xl px-4 py-2 text-base font-bold text-ellipsis whitespace-nowrap text-[#A4A4A4] transition-all duration-200 hover:bg-[#FFA565]/20 hover:text-[#EF6C00]"
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
