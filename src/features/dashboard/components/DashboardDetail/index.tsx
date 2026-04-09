'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import PageSubTitle from '@/shared/components/PageSubTitle';
import GoalBox from '../GoalBox';
import Empty from '@/shared/components/Empty';

import { goalQueries } from '@/shared/lib/query/queryKeys';
import { GoalListResponse } from '@/shared/lib/api';
import { useLanguage } from '@/shared/contexts/LanguageContext';

export default function DashboardDetail() {
  const { data: goals } = useQuery(goalQueries.list());
  const { t } = useLanguage();

  if (!goals || goals?.goals?.length === 0) {
    return <Empty>{t.dashboard.noGoal}</Empty>;
  }

  return (
    <section>
      <PageSubTitle
        subTitle={t.dashboard.goalByTodo}
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
