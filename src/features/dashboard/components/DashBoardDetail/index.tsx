'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import PageSubTitle from '@/shared/components/PageSubTitle';
import GoalBox from '../GoalBox';

import { goalQueries } from '@/lib/queryKeys';
import { GoalListResponse } from '@/lib/api';

type GoalItem = NonNullable<GoalListResponse['goals']>[number];
type GoalItemWithId = GoalItem & { id: number };

export default function DashboardDetail() {
  const { data: goals } = useQuery(goalQueries.list());

  return (
    <section>
      <PageSubTitle
        subTitle="목표 별 할일"
        icons={<Image src={'/image/goal.png'} alt="Goal Icon" width={40} height={40} />}
      />
      <div className="flex flex-col gap-[32px] pt-[10px]">
        {goals?.goals?.map((goal) =>
          goal.id != null ? <GoalDetailItem key={goal.id} goal={goal as GoalItemWithId} /> : null,
        )}
      </div>
    </section>
  );
}

function GoalDetailItem({ goal }: { goal: GoalItemWithId }) {
  const { data: goalDetail } = useQuery(goalQueries.detail(goal.id));

  return null;
  // return <GoalBox data={goal} detail={goalDetail} />;
}
