import Image from 'next/image';
import { ChevronRightIcon } from 'lucide-react';

import PageSubTitle from '@/shared/components/PageSubTitle';
import ProgressCircle from '@/shared/components/ProgressCircle';
import TaskCard from '@/shared/components/TaskCard';

export default function DashBoardSummary() {
  return (
    <section className="flex w-full flex-col gap-[40px] pb-[40px] md:flex-row md:gap-[12px] lg:gap-[32px] lg:pb-[34px]">
      <div className="flex w-full flex-col justify-between gap-[10px]">
        <PageSubTitle
          subTitle="최근 등록한 할 일"
          icons={<Image src={'/image/task-icon.png'} alt="Task Icon" width={40} height={40} />}
          actions={
            <span className="w-full cursor-pointer text-base font-semibold text-[#ef6c08]">
              모두 보기 <ChevronRightIcon className="inline-block cursor-pointer" />
            </span>
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

// TODO: PageHeader 컴포넌트에 TaskCard 컴포넌트가 있으므로 머지되면 그 후 구현
function RecentPostCard() {
  const mockData = [
    { id: 1, title: '할 일 1', done: true, star: true },
    { id: 2, title: '할 일 2', done: false, star: false },
    { id: 3, title: '할 일 3', done: false, star: false },
  ];
  return (
    <article className="h-[256px] rounded-[40px] bg-[#FF8442] p-4 shadow-[0_10px_40px_0_rgba(255,158,89,0.40)] lg:p-8">
      {mockData.map((task) => (
        <TaskCard
          key={task.id}
          todo={{
            id: String(task.id),
            title: task.title,
            done: task.done,
            star: task.star,
          }}
          starred={task.id === 1} // 예시: 첫 번째만 별 표시
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
          <ProgressCircle percent={74} className="h-auto w-full" />
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
