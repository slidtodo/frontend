'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import PageSubTitle from '@/shared/components/PageSubTitle';
import GoalBox from '../GoalBox';
import Empty from '@/shared/components/Empty';

import { goalQueries } from '@/shared/lib/query/queryKeys';
import { GoalListResponse } from '@/shared/lib/api';

export default function DashboardDetail() {
  const { data: goals } = useQuery(goalQueries.list());

  if (!goals || goals?.goals?.length === 0) {
    return <Empty>최근에 등록한 목표가 없어요</Empty>;
  }

  return (
    <section>
      <PageSubTitle
        subTitle="목표 별 할일"
        icons={<Image src={'/image/goal-todo.png'} alt="Goal Icon" width={40} height={40} />}
      />
      <div className="flex flex-col gap-[32px] pt-[10px]">
        {goals?.goals?.map((goal) => (
          <GoalDetailItem key={goal.id} goal={goal} />
        ))}
      </div>
    </section>
  );
}

function GoalDetailItem({ goal }: { goal: GoalListResponse['goals'][number] }) {
  const { data: goalDetail } = useQuery(goalQueries.detail(goal.id));

  if (!goalDetail) return null;

  return <GoalBox data={goalDetail} />;
}
