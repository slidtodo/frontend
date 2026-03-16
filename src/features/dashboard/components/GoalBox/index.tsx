import { PlusIcon } from 'lucide-react';

import Progressbar from '@/shared/components/Progressbar';
import TaskCard from '@/shared/components/TaskCard';
// import Input from '@/shared/components/Input';
import SearchInput from '@/shared/components/SearchInput';
import Button from '@/shared/components/Button';
interface GoalBoxProps {
  data: {
    id: number;
    title: string;
    description: string;
    progress: number;
    todoList: { id: number; title: string; isCompleted: boolean; star: boolean }[];
    doneList: { id: number; title: string; star: boolean }[];
  };
}

export default function GoalBox({ data }: GoalBoxProps) {
  return (
    <article className="] flex flex-col gap-4 rounded-[40px] bg-white px-8 py-6">
      <div className="flex flex-col items-center gap-2 px-2 md:flex-row md:gap-8">
        <div className="flex w-full flex-1 gap-4">
          <div className="font-base w-full max-w-[229px] overflow-hidden font-semibold text-ellipsis whitespace-nowrap text-[#333]">
            {data.title}
          </div>
          <Progressbar progress={data.progress} />
        </div>
        <div className="flex w-full flex-1 justify-between gap-[14px] md:justify-end">
          <SearchInput placeholder="할 일을 검색해주세요" />
          <Button
            variant="secondary"
            className="rounded-[999px] rounded-full p-[10px] md:px-[14.5px] md:px-[18px] md:py-[10px] lg:py-[10px]"
          >
            <PlusIcon size={20} />
            <span className="hidden w-full w-max text-sm font-semibold md:block">할 일 추가</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:gap-8">
        {/** TODO: todo / done 일때 백그라운드 다르게 */}
        <div className={`flex max-h-[324px] flex-1 flex-col gap-4 rounded-[24px] bg-[#FFF8E4] p-6`}>
          <span className="font-base font-bold text-[#EE7016]">TODO </span>
          <div className="flex max-h-[236px] flex-col gap-1 overflow-y-auto">
            {data.todoList.map((todo) => (
              <TaskCard
                id={`todo-${todo.id}`}
                key={todo.id}
                text={todo.title}
                checked={todo.isCompleted}
                hasGithubLink={false}
              />
            ))}
          </div>
        </div>
        <div className={`flex max-h-[324px] flex-1 flex-col gap-4 rounded-[24px] bg-[#ffffff] p-6`}>
          <span className="font-base font-bold text-[#A4A4A4]">DONE</span>
          <div className="flex max-h-[236px] flex-col gap-1 overflow-y-auto">
            {data.doneList.map((done) => (
              <TaskCard id={`done-${done.id}`} key={done.id} text={done.title} checked={true} hasGithubLink={false} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
