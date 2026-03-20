import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, EllipsisVerticalIcon } from 'lucide-react';

import ProgressCircle from '@/shared/components/ProgressCircle';

export default function GoalSummary() {
  // TODO: 예시로 고정된 goalId, 실제로는 동적으로 받아와야 함

  return (
    <section className="flex flex-col gap-6 xl:flex-row xl:gap-8">
      <GoalInfo />

      <div className="flex shrink-0 flex-col justify-between gap-6 md:flex-row xl:flex-1">
        <GoalProgress />
        <LinkNote />
      </div>
    </section>
  );
}

function GoalInfo() {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white xl:flex-1">
      <div className="flex items-center justify-center gap-4 py-5 pl-5 md:py-6 md:pl-6 lg:py-15 lg:pl-10">
        <Image src="/image/task-icon.png" alt="Task Icon" width={40} height={40} />
        <span className="overflow-hidden text-lg font-semibold text-ellipsis whitespace-nowrap lg:text-2xl">
          자바스크립트로 웹 서비스 만들기
        </span>
      </div>
      <EllipsisVerticalIcon size={24} color="#A4A4A4" className="mr-5 cursor-pointer md:mr-6 lg:mr-10" />
    </div>
  );
}

function GoalProgress() {
  const percent = 64; // TODO: 실제 진행률로 대체
  return (
    <div className="relative flex min-h-[160px] w-full gap-[31px] rounded-[32px] bg-[#FF8442] shadow-[0_10px_40px_0_rgba(255,158,89,0.40)]">
      <div className="absolute flex h-full w-full items-center justify-between gap-1 p-[34px]">
        <div className="w-[92px]">
          <ProgressCircle percent={percent} className="h-auto w-full" color="#FFA96C" />
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="text-[clamp(12px,2vw,20px)] font-semibold text-white">목표진행률</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[clamp(20px,5vw,60px)] leading-[1] font-bold text-white">{percent}</span>
            <span className="text-[clamp(14px,2vw,30px)] text-white">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkNote() {
  const goalId = 1;
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
