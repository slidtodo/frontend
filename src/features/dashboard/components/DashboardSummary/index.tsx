'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRightIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import PageHeader from '@/shared/components/PageHeader';
import PageSubTitle from '@/shared/components/PageSubTitle';
import ProgressCircle from '@/shared/components/ProgressCircle';
import TaskCard from '@/shared/components/TaskCard';

import { todoQueries, userQueries } from '@/lib/queryKeys';

export default function DashBoardSummary() {
  const { data: user } = useQuery(userQueries.current());

  return (
    <>
      <PageHeader title={`${user?.nickname}님의 대시보드`} className="pb-[30px] text-black lg:pb-[34px]" />
      <section className="flex w-full flex-col gap-[40px] pb-[40px] md:flex-row md:gap-[12px] lg:gap-[32px] lg:pb-[34px]">
        <div className="flex w-full flex-col justify-between gap-[10px]">
          <PageSubTitle
            subTitle="최근 등록한 할 일"
            icons={<Image src={'/image/task.png'} alt="Task Icon" width={40} height={40} />}
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
            icons={<Image src={'/image/progress.png'} alt="Progress Icon" width={40} height={40} />}
          />
          <CurrentProgressCard />
        </div>
      </section>
    </>
  );
}

function RecentPostCard() {
  const now = new Date();

  const { data: todos } = useQuery(
    todoQueries.list({
      sort: 'LATEST',
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    }),
  );

  const recentTodos =
    todos?.todos?.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()) ?? [];

  return (
    <article className="flex h-[256px] flex-col gap-[6px] rounded-[40px] bg-[#FF8442] p-4 shadow-[0_10px_40px_0_rgba(255,158,89,0.40)] lg:p-8">
      {recentTodos.length > 0 ? (
        recentTodos.map((task) => <TaskCard key={task.id} todo={task} variant="orange" />)
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-white">최근 등록한 할 일이 없습니다.</span>
        </div>
      )}
    </article>
  );
}

function CurrentProgressCard() {
  const { data: percents } = useQuery(userQueries.progress());

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
          <ProgressCircle percent={percents?.totalProgress ?? 0} className="h-auto w-full" color="#009D97" />
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="text-[clamp(12px,2vw,20px)] font-semibold text-white">체다치즈님의 진행도는</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[clamp(20px,5vw,60px)] leading-[1] font-bold text-white">
              {percents?.totalProgress}
            </span>
            <span className="text-[clamp(14px,2vw,30px)] text-white">%</span>
          </div>
        </div>
      </div>
    </article>
  );
}
