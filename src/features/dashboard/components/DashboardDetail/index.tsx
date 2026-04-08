'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import Empty from '@/shared/components/Empty';
import PageSubTitle from '@/shared/components/PageSubTitle';
import GoalBox from '../GoalBox';

import { GoalListResponse } from '@/shared/lib/api';
import { goalQueries } from '@/shared/lib/query/queryKeys';
import { useTodoModeStore } from '@/shared/stores/useTodoModeStore';

export default function DashboardDetail() {
  const mode = useTodoModeStore((state) => state.mode);
  const { data: goals } = useQuery(goalQueries.list());

  const visibleGoals = goals?.goals?.filter((goal) => goal.source === mode) ?? [];

  if (mode === 'MANUAL' && visibleGoals.length === 0) {
    return <Empty>최초로 등록할 목표가 없어요.</Empty>;
  }

  return (
    <section className="flex flex-col gap-6">
      {visibleGoals.length === 0 ? (
        <Empty>{mode === 'GITHUB' ? '연결된 GitHub 저장소 목표가 없습니다.' : '등록된 목표가 없습니다.'}</Empty>
      ) : (
        <>
          <PageSubTitle
            subTitle={mode === 'GITHUB' ? '연결된 GitHub 목표' : '목표 별 할 일'}
            icons={<Image src={'/image/goal-todo.png'} alt="Goal Icon" width={40} height={40} />}
          />
          <div className="flex flex-col gap-[32px] pt-[10px]">
            {visibleGoals.map((goal) => (
              <GoalDetailItem key={goal.id} goal={goal} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function GoalDetailItem({ goal }: { goal: GoalListResponse['goals'][number] }) {
  const { data: goalDetail } = useQuery(goalQueries.detail(goal.id));

  if (!goalDetail) return null;

  return <GoalBox data={goalDetail} />;
}

