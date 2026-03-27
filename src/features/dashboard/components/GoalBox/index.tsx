'use client';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Progressbar from '@/shared/components/Progressbar';
import TaskCard from '@/shared/components/TaskCard';
import SearchInput from '@/shared/components/SearchInput';
import Button from '@/shared/components/Button';

import type { GoalDetailResponse } from '@/lib/api';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';

type GoalItem = GoalDetailResponse;
type GoalTodoItem = NonNullable<GoalDetailResponse['todoList']>[number];
type GoalDoneItem = NonNullable<GoalDetailResponse['doneList']>[number];

interface GoalBoxProps {
  data: GoalItem;
}

export default function GoalBox({ data }: GoalBoxProps) {
  const router = useRouter();

  const todoList = data.todoList ?? [];
  const doneList = data.doneList ?? [];

  const { openTodoCreateModal } = useTodoCreateModal();
  return (
    <article className="flex flex-col gap-4 rounded-[40px] bg-white p-6 lg:px-8 lg:py-6">
      <div className="flex flex-col items-center gap-2 px-2 md:flex-row md:gap-12 lg:gap-8">
        <div className="flex w-full flex-1 flex-col gap-1 lg:flex-row lg:gap-4">
          <div className="w-full max-w-[229px]">
            <button
              onClick={() => router.push(`goal/${data.id}`)}
              className="font-base overflow-hidden text-left font-semibold text-ellipsis whitespace-nowrap text-[#333]"
            >
              {data.title}
            </button>
          </div>
          <Progressbar progress={data.progress ?? 0} />
        </div>

        <div className="flex w-full flex-1 justify-between gap-0 md:justify-end md:gap-2 lg:gap-[14px]">
          <SearchInput placeholder="할 일을 검색해주세요" />
          <Button
            variant="secondary"
            className="rounded-full p-[10px] md:px-[14.5px] md:px-[18px] md:py-[10px] lg:py-[10px]"
            onClick={() => openTodoCreateModal({ goalDetailId: data.id })}
          >
            <PlusIcon size={20} />
            <span className="hidden w-full w-max text-sm font-semibold md:block">할 일 추가</span>
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col justify-around gap-2 md:flex-row lg:gap-8">
        {todoList.length === 0 && doneList.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="py-10 text-[#A4A4A4]">현재 등록된 할 일이 없습니다.</span>
          </div>
        ) : (
          <>
            <ListBox title="TODO" variant="todo" items={todoList} />
            <ListBox title="DONE" variant="done" items={doneList} />
          </>
        )}
      </div>
    </article>
  );
}

interface ListBoxProps {
  title: string;
  variant: 'todo' | 'done';
  items: GoalTodoItem[] | GoalDoneItem[];
}

function ListBox({ title, variant, items }: ListBoxProps) {
  const bgColor = variant === 'todo' ? 'bg-[#FFF8E4]' : 'bg-[#ffffff]';
  const textColor = variant === 'todo' ? 'text-[#EE7016]' : 'text-[#A4A4A4]';

  return (
    <div className={`flex max-h-[324px] flex-1 flex-col gap-4 rounded-[16px] ${bgColor} p-4 lg:rounded-[24px] lg:p-6`}>
      <span className={`text-sm font-bold ${textColor} lg:text-base`}>{title}</span>
      <div className="flex max-h-[236px] flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <TaskCard key={item.id} todo={item} starred={item.favorite} />
        ))}
      </div>
    </div>
  );
}
