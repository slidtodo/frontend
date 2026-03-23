import { PlusIcon } from 'lucide-react';

import Progressbar from '@/shared/components/Progressbar';
import TaskCard from '@/shared/components/TaskCard';
import SearchInput from '@/shared/components/SearchInput';
import Button from '@/shared/components/Button';
interface GoalBoxProps {
  data: {
    id: number;
    title: string;
    progress: number;
    todoList: { id: number; title: string; isCompleted: boolean; star: boolean }[];
    doneList: { id: number; title: string; star: boolean }[];
  };
}

export default function GoalBox({ data }: GoalBoxProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[40px] bg-white p-6 lg:px-8 lg:py-6">
      <div className="flex flex-col items-center gap-2 px-2 md:flex-row md:gap-12 lg:gap-8">
        <div className="flex w-full flex-1 flex-col gap-1 lg:flex-row lg:gap-4">
          <div className="font-base w-full max-w-[229px] overflow-hidden font-semibold text-ellipsis whitespace-nowrap text-[#333]">
            {data.title}
          </div>
          <Progressbar progress={data.progress} />
        </div>
        <div className="flex w-full flex-1 justify-between gap-0 md:justify-end md:gap-2 lg:gap-[14px]">
          <SearchInput placeholder="할 일을 검색해주세요" />
          <Button
            variant="secondary"
            className="rounded-full p-[10px] md:px-[14.5px] md:px-[18px] md:py-[10px] lg:py-[10px]"
          >
            <PlusIcon size={20} />
            <span className="hidden w-full w-max text-sm font-semibold md:block">할 일 추가</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row lg:gap-8">
        <ListBox title="TODO" variant="todo" items={data.todoList} />
        <ListBox title="DONE" variant="done" items={data.doneList} />
      </div>
    </article>
  );
}

interface ListBoxProps {
  title: string;
  variant: 'todo' | 'done';
  items: { id: number; title: string; star: boolean; isCompleted?: boolean }[];
}
function ListBox({ title, variant, items }: ListBoxProps) {
  let bgColor, textColor;
  switch (variant) {
    case 'todo':
      bgColor = 'bg-[#FFF8E4]';
      textColor = 'text-[#EE7016]';
      break;
    case 'done':
      bgColor = 'bg-[#ffffff]';
      textColor = 'text-[#A4A4A4]';
      break;
  }
  return (
    <div className={`flex max-h-[324px] flex-1 flex-col gap-4 rounded-[16px] ${bgColor} p-4 lg:rounded-[24px] lg:p-6`}>
      <span className={`text-sm font-bold ${textColor} lg:text-base`}>{title}</span>
      <div className="flex max-h-[236px] flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <TaskCard
            key={item.id}
            todo={{
              id: item.id,
              title: item.title,
              done: item.isCompleted ?? variant === 'done',
              fileUrl: null,
              linkUrl: null,
              userId: 0,
              goalId: 0,
              createdAt: new Date().toISOString(),
              source: 'manual',
              sourceItemId: null,
              updatedAt: new Date().toISOString(),
              noteIds: [],
              goal: {
                id: 0,
                title: '',
              },
            }}
            starred={item.star}
          />
        ))}
      </div>
    </div>
  );
}
