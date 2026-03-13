import DashBoardSummary from '@/features/dashboard/components/DashboardSummary';
import DashboardDetail from '@/features/dashboard/components/DashBoardDetail';

/**
 * TODO: SEO 최적화 필요
 * @description 해당 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 말아주세요
 * 'use client'로 변경 x
 */

export default function DashboardPage() {
  return (
    <div className="flex w-full flex-col">
      {/* TODO: 페이지 헤더 컴포넌트로 변경 필요 */}
      <span className="hidden pb-[31px] md:block lg:pb-[34px]">체다치즈님의 대시보드</span>
      <DashBoardSummary />
      <DashboardDetail />
    </div>
  );
}
