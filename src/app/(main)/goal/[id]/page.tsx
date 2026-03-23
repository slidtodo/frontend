import PageHeader from '@/shared/components/PageHeader';

import GoalSummary from '@/features/goal/components/GoalSummary';
import GoalDetail from '@/features/goal/components/GoalDetail';
/**
 * @description 해당 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 말아주세요
 * 'use client'로 변경 x
 */
export default function GoalDetailPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="체다치즈님의 목표" className="pl-2" />
      <div className="flex flex-col gap-16">
        <GoalSummary />
        <GoalDetail />
      </div>
    </div>
  );
}
