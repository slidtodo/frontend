'use client';

import Image from 'next/image';

import PageSubTitle from '@/shared/components/PageSubTitle';
import GoalBox from '../GoalBox';

import { goalMockData } from './mock';

export default function DashboardDetail() {
  return (
    <section>
      <PageSubTitle
        subTitle="목표 별 할일"
        icons={<Image src={'/image/goal-icon.png'} alt="Goal Icon" width={40} height={40} />}
      />
      <div className="flex flex-col gap-[32px] pt-[10px]">
        {goalMockData.map((goal) => (
          <GoalBox key={goal.id} data={goal} />
        ))}
      </div>
    </section>
  );
}
