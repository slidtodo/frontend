'use client';
import { PlusIcon } from 'lucide-react';

import Button from '@/shared/components/Button';
import TaskCard from '@/shared/components/TaskCard';
import Empty from '@/shared/components/Empty';

import { mockTodo } from './mock';

export default function AllTodoContent() {
  return (
    <section className="flex flex-col gap-3">
      <AllTodoFilter />
      <AllTodoFetcher />
    </section>
  );
}

function AllTodoFilter() {
  const todoButtons = [
    { id: 1, label: 'ALL' },
    { id: 2, label: 'TO DO' },
    { id: 3, label: 'DONE' },
  ];
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
      >
        <PlusIcon size={20} color="#737373" />
        <span className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-[#737373]">
          할 일 추가
        </span>
      </Button>
    </div>
  );
}
// TODO: 상위에서 상태 받고 API 연동해서 리액트 쿼리로 필터링된 할 일 리스트 보여주기
function AllTodoFetcher() {
  return (
    <section className="rounded-4xl bg-white p-4 md:p-8">
      <div className="flex max-h-[680px] flex-col gap-4 overflow-y-auto">
        {mockTodo.length > 0 ? (
          mockTodo.map((todo) => <TaskCard key={todo.id} todo={todo} />)
        ) : (
          <Empty>할 일이 없습니다. 새로운 할 일을 추가해보세요!</Empty>
        )}
      </div>
    </section>
  );
}
