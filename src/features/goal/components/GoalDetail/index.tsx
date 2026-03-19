import { CalendarIcon, PlusIcon } from 'lucide-react';

import PageSubTitle from '@/shared/components/PageSubTitle';
import Button from '@/shared/components/Button';
import TaskCard from '@/shared/components/TaskCard';
import Empty from '@/shared/components/Empty';

import { mockTodo } from '@/features/dashboard/allTodo/components/AllTodoContent/mock';

export default function GoalDetail() {
  return (
    <section className="flex flex-col gap-8 lg:flex-row">
      <div className="flex flex-1 flex-col gap-[10px]">
        <PageSubTitle
          subTitle="TO DO"
          textClassName="font-semibold"
          actions={
            <div className="flex gap-2">
              <Button
                variant="cancel"
                className="rounded-[999px] rounded-full bg-[#F2F2F2] p-[10px] md:px-[14.5px] md:px-[18px] md:py-[10px] lg:py-[10px]"
              >
                <CalendarIcon size={20} color="#737373" />
                <span className="hidden w-full w-max text-sm font-semibold text-[#737373] md:block">할 일 추가</span>
              </Button>
              <Button className="rounded-[999px] rounded-full p-[10px] md:px-[14.5px] md:px-[18px] md:py-[10px] lg:py-[10px]">
                <PlusIcon size={20} />
                <span className="hidden w-full w-max text-sm font-semibold md:block">할 일 추가</span>
              </Button>
            </div>
          }
        />
        <section className="rounded-2xl bg-[#FFF8E4] px-[28px] py-[32px]">
          <div className="flex max-h-[512px] flex-col gap-4 overflow-y-auto">
            {mockTodo.length > 0 ? (
              mockTodo.map((todo) => <TaskCard key={todo.id} todo={todo} />)
            ) : (
              <Empty>할 일이 없습니다. 새로운 할 일을 추가해보세요!</Empty>
            )}
          </div>
        </section>
      </div>
      <div className="flex flex-1 flex-col gap-[10px]">
        <PageSubTitle subTitle="DONE" textClassName="font-semibold" className="py-[6px]" />
        <section className="rounded-2xl bg-[#ffffff] px-[28px] py-[32px]">
          <div className="flex max-h-[512px] flex-col gap-4 overflow-y-auto">
            {mockTodo.length > 0 ? (
              mockTodo.map((todo) => <TaskCard key={todo.id} todo={todo} />)
            ) : (
              <Empty>할 일이 없습니다. 새로운 할 일을 추가해보세요!</Empty>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
