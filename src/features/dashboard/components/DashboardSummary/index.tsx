'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import PageHeader from '@/shared/components/PageHeader';
import PageSubTitle from '@/shared/components/PageSubTitle';
import ProgressCircle from '@/shared/components/ProgressCircle';
import TabChangeMode from '@/shared/components/TabChangeMode';
import TaskCardWrapper from '../TaskCardWrapper';
import GithubRepoConnectModal from '@/shared/components/Modal/GithubRepoConnectModal';

import { useBreakpoint } from '@/shared/hooks/useBreakPoint';

import { todoQueries, userQueries, goalQueries } from '@/shared/lib/query/queryKeys';
import { useModalStore } from '@/shared/stores/useModalStore';
import { useTodoModeStore, TodoMode } from '@/shared/stores/useTodoModeStore';
import { useLanguage } from '@/shared/contexts/LanguageContext';

export default function DashBoardSummary() {
  const { data: user } = useQuery(userQueries.current());
  const { data: goals, isFetched: isGoalsFetched } = useQuery(goalQueries.list());
  const breakpoint = useBreakpoint();

  const mode = useTodoModeStore((state) => state.mode);
  const setMode = useTodoModeStore((state) => state.setMode);
  const { openModal } = useModalStore();

  const githubGoals = goals?.goals?.filter((goal) => goal.source === 'GITHUB') ?? [];

  // GITHUB 모드 세션 내에서 레포 연결 모달 중복 오픈 방지
  const githubModalOpenedRef = useRef(false);
  const prevGithubGoalsLengthRef = useRef(githubGoals.length);

  const handleModeChange = (nextMode: TodoMode) => {
    setMode(nextMode);
  };

  /**
   * GITHUB 모드로 전환 시 연결된 레포가 없으면 레포 연결 모달 오픈.
   * - handleModeChange에서 처리하지 않고 useEffect로 처리하는 이유:
   *   goals 쿼리가 아직 로딩 중일 때 모드를 전환하면 githubGoals가 빈 배열로 평가되어
   *   오판이 발생할 수 있기 때문에 isGoalsFetched 이후 판단.
   * - MANUAL 전환 시 ref 초기화 → GITHUB 재진입 시 조건 재평가
   * - 레포가 있다가 해제된 경우(length > 0 → 0) ref 초기화 → 바로 모달 오픈
   */
  useEffect(() => {
    const prevLength = prevGithubGoalsLengthRef.current;
    prevGithubGoalsLengthRef.current = githubGoals.length;

    if (mode !== 'GITHUB') {
      githubModalOpenedRef.current = false;
      return;
    }

    // 레포가 있다가 모두 해제된 경우 → 모달 다시 열 수 있도록 ref 초기화
    if (prevLength > 0 && githubGoals.length === 0) {
      githubModalOpenedRef.current = false;
    }

    if (isGoalsFetched && githubGoals.length === 0 && !githubModalOpenedRef.current) {
      githubModalOpenedRef.current = true;
      openModal(<GithubRepoConnectModal />, undefined, 'bottom');
    }
  }, [mode, isGoalsFetched, githubGoals.length, openModal]);

  const { t } = useLanguage();

  return (
    <>
      <div className="flex items-center justify-end pb-[30px] md:justify-between lg:pb-[34px]">
        {breakpoint !== 'mobile' && <PageHeader title={`${user?.nickname}${t.dashboard.title}`} />}

        <div className="flex shrink-0 justify-end md:w-fit">
          <TabChangeMode mode={mode} onModeChange={handleModeChange} />
        </div>
      </div>
      <section className="flex w-full flex-col gap-[40px] pb-[40px] md:flex-row md:gap-[12px] lg:gap-[32px] lg:pb-[34px]">
        <div className="flex w-full flex-col justify-between gap-[10px]">
          <PageSubTitle
            subTitle={t.dashboard.recentTodo}
            icons={<Image src={'/image/task-green.png'} alt="Task Icon" width={40} height={40} />}
            actions={
              <Link
                href="/dashboard/all-todo"
                className="text-bearlog-500 w-full cursor-pointer text-sm font-semibold md:text-base"
              >
                {t.dashboard.viewAll} <ChevronRightIcon className="inline-block cursor-pointer" />
              </Link>
            }
          />
          <RecentPostCard />
        </div>
        <div className="flex w-full flex-col justify-between gap-[10px]">
          <PageSubTitle
            subTitle={t.dashboard.myProgress}
            icons={<Image src={'/image/progress-green.png'} alt="Progress Icon" width={40} height={40} />}
          />
          <CurrentProgressCard />
        </div>
      </section>
    </>
  );
}

function RecentPostCard() {
  const { data: todos } = useQuery(
    todoQueries.list({
      sort: 'LATEST',
    }),
  );
  const { t } = useLanguage();

  const recentTodos = todos?.todos?.slice(0, 4) ?? [];

  return (
    <article className="flex h-[187px] h-fit flex-col gap-[6px] rounded-[40px] bg-white px-4 py-[18px] md:h-[229px] md:p-4 lg:h-[256px] lg:p-8">
      {recentTodos.length > 0 ? (
        recentTodos.map((item) => <TaskCardWrapper key={item.id} item={item} mode="todo" />)
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-gray-500">{t.dashboard.noRecentTodo}</span>
        </div>
      )}
    </article>
  );
}

function CurrentProgressCard() {
  const { data: percents } = useQuery(userQueries.progress());
  const { t } = useLanguage();

  return (
    <article className="bg-bearlog-500 relative h-[187px] rounded-[40px] shadow-[0_10px_40px_0_rgba(2,202,181,0.40)] md:h-[229px] lg:h-[256px]">
      <div className="absolute right-0 bottom-0">
        <Image
          src={'/image/teaching-bear-lg.png'}
          alt="Progress card Tablet"
          width={140}
          height={88}
          className="block lg:hidden"
        />
        <Image
          src={'/image/teaching-bear-xl.png'}
          alt="Progress card PC"
          width={222}
          height={140}
          className="hidden lg:block"
        />
      </div>
      <div className="absolute flex h-full w-full items-center justify-start gap-8 p-6 lg:p-12">
        <div className="w-[120px]">
          <ProgressCircle percent={percents?.totalProgress ?? 0} className="h-auto w-full" color="#008354" />
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="text-[clamp(12px,2vw,20px)] font-semibold text-white">{t.dashboard.todoProgress}</span>
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
