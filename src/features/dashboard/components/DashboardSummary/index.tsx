import Image from 'next/image';
import { ChevronRightIcon } from 'lucide-react';

import PageSubTitle from '@/shared/components/PageSubTitle';
import ProgressCircle from '@/shared/components/ProgressCircle';
import TaskCard from '@/shared/components/TaskCard';

import { mockTodoItems } from '../../allTodo/components/AllTodoContent/mock';
import Link from 'next/link';

export default function DashBoardSummary() {
  return (
    <section className="flex w-full flex-col gap-[40px] pb-[40px] md:flex-row md:gap-[12px] lg:gap-[32px] lg:pb-[34px]">
      <div className="flex w-full flex-col justify-between gap-[10px]">
        <PageSubTitle
          subTitle="최근 등록한 할 일"
          icons={<Image src={'/image/task-icon.png'} alt="Task Icon" width={40} height={40} />}
          actions={
            <Link
              href="/dashboard/all-todo"
              className="w-full cursor-pointer text-sm font-semibold text-[#ef6c08] md:text-base"
            >
              모두 보기 <ChevronRightIcon className="inline-block cursor-pointer" />
            </Link>
          }
        />
        <RecentPostCard />
      </div>
      <div className="flex w-full flex-col justify-between gap-[10px]">
        <PageSubTitle
          subTitle="내 진행 상황"
          icons={<Image src={'/image/progress-icon.png'} alt="Progress Icon" width={40} height={40} />}
        />
        <CurrentProgressCard />
      </div>
    </section>
  );
}

function RecentPostCard() {
  return (
    <article className="h-[256px] rounded-[40px] bg-[#FF8442] p-4 shadow-[0_10px_40px_0_rgba(255,158,89,0.40)] lg:p-8">
      {mockTodoItems.map((task) => (
        <TaskCard
          key={task.id}
          todo={{
            id: task.id,
            title: task.title,
            done: task.done ?? false,
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
        />
      ))}
    </article>
  );
}

function CurrentProgressCard() {
  return (
    <article className="relative h-[256px] rounded-[40px] bg-[#02CAB5] shadow-[0_10px_40px_0_rgba(2,202,181,0.40)]">
      <div className="absolute right-0 bottom-0">
        <Image
          src={'/image/progress-card-section-charactor-tablet.png'}
          alt="Progress card Tablet"
          width={140}
          height={88}
          className="block lg:hidden"
        />
        <Image
          src={'/image/progress-card-section-charactor-pc.png'}
          alt="Progress card PC"
          width={222}
          height={140}
          className="hidden lg:block"
        />
      </div>
      <div className="absolute flex h-full w-full items-center justify-start gap-8 p-6 lg:p-12">
        <div className="w-[120px]">
          <ProgressCircle percent={10} className="h-auto w-full" />
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="text-[clamp(12px,2vw,20px)] font-semibold text-white">체다치즈님의 진행도는</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[clamp(20px,5vw,60px)] leading-[1] font-bold text-white">74</span>
            <span className="text-[clamp(14px,2vw,30px)] text-white">%</span>
          </div>
        </div>
      </div>
    </article>
  );
}
