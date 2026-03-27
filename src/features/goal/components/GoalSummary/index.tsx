'use client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, EllipsisVerticalIcon } from 'lucide-react';

import PageHeader from '@/shared/components/PageHeader';
import ProgressCircle from '@/shared/components/ProgressCircle';

import { userQueries, goalQueries } from '@/lib/queryKeys';
import { GoalDetailResponse } from '@/lib/api';

interface GoalSummaryProps {
  goalId: number;
}
export default function GoalSummary({ goalId }: GoalSummaryProps) {
  const { data: user } = useQuery(userQueries.current());
  const { data: goalDetail } = useQuery({
    ...goalQueries.detail(goalId),
    enabled: !!goalId,
  });

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title={`${user?.nickname}님의 목표`} className="pl-2" />
      <section className="flex flex-col gap-6 xl:flex-row xl:gap-8">
        <GoalInfo goalDetail={goalDetail} />

        <div className="flex shrink-0 flex-col justify-between gap-6 md:flex-row xl:flex-1">
          <GoalProgress goalDetail={goalDetail} />
          <LinkNote goalDetail={goalDetail} />
        </div>
      </section>
    </div>
  );
}

interface GoalInfoProps {
  goalDetail: GoalDetailResponse | undefined;
}
function GoalInfo({ goalDetail }: GoalInfoProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white xl:flex-1">
      <div className="flex items-center justify-center gap-4 py-5 pl-5 md:py-6 md:pl-6 lg:py-15 lg:pl-10">
        <Image src="/image/task.png" alt="Task Icon" width={40} height={40} />
        <span className="overflow-hidden text-lg font-semibold text-ellipsis whitespace-nowrap lg:text-2xl">
          {goalDetail?.title}
        </span>
      </div>
      <EllipsisVerticalIcon size={24} color="#A4A4A4" className="mr-5 cursor-pointer md:mr-6 lg:mr-10" />
    </div>
  );
}

interface GoalProgressProps {
  goalDetail: GoalDetailResponse | undefined;
}
function GoalProgress({ goalDetail }: GoalProgressProps) {
  if (!goalDetail) return null; // TODO: 대체 컴포넌트 추가 필요
  return (
    <div className="relative flex min-h-[160px] w-full gap-[31px] rounded-[32px] bg-[#FF8442] shadow-[0_10px_40px_0_rgba(255,158,89,0.40)]">
      <div className="absolute flex h-full w-full items-center justify-between gap-1 p-[34px]">
        <div className="w-[92px]">
          <ProgressCircle percent={goalDetail.progress} className="h-auto w-full" color="#FFA96C" />
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="text-[clamp(12px,2vw,20px)] font-semibold text-white">목표진행률</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[clamp(20px,5vw,60px)] leading-[1] font-bold text-white">{goalDetail.progress}</span>
            <span className="text-[clamp(14px,2vw,30px)] text-white">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LinkNoteProps {
  goalDetail: GoalDetailResponse | undefined;
}
function LinkNote({ goalDetail }: LinkNoteProps) {
  const goalId = goalDetail?.id;
  return (
    <div className="relative min-h-[160px] w-full rounded-[32px] bg-[#02CAB5] shadow-[0_10px_40px_0_rgba(2,202,181,0.40)]">
      <Link className="absolute bottom-1/5 left-1/7 flex items-center gap-['2px']" href={`/goal/${goalId}/note`}>
        <span className="text-lg font-bold text-white">노트 모아보기</span>
        <ChevronRightIcon size={24} color="#ffffff" className="cursor-pointer" />
      </Link>

      <Image
        src={'/image/note-group.svg'}
        alt="Note Group"
        width={100}
        height={100}
        className="absolute top-1/2 right-0 -translate-y-1/2 transform"
      />
    </div>
  );
}
