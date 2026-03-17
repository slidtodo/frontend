import DashBoardSummary from '@/features/dashboard/components/DashboardSummary';
import DashboardDetail from '@/features/dashboard/components/DashBoardDetail';
import PageHeader from '@/shared/components/PageHeader';
/**
 * TODO: SEO 최적화 필요
 * @description 해당 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 말아주세요
 * 'use client'로 변경 x
 */
export default function DashboardPage() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader title="체다치즈님의 대시보드" className="pb-[30px] text-black lg:pb-[34px]" />
      <DashBoardSummary />
      <DashboardDetail />
    </div>
  );
}
