import DashBoardSummary from '@/features/dashboard/components/DashboardSummary';
import DashboardDetail from '@/features/dashboard/components/DashBoardDetail';

/**
 * @description 해당 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 말아주세요
 * 'use client'로 변경 x
 */
export default async function DashboardPage() {
  return (
    <div className="flex w-full flex-col">
      <DashBoardSummary />
      <DashboardDetail />
    </div>
  );
}
