'use client';

import { useSidebarContext } from '@/contexts/SidebarContext';

/**
 * TODO: 대시보드 관련 반응형 조정 필요
 */
interface MainProps {
  children: React.ReactNode;
}
export default function Main({ children }: MainProps) {
  const isOpen = useSidebarContext();
  return (
    <div className={`flex items-center justify-center bg-gray-50 w-full transition-all duration-300`}>
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">대시보드 메인 콘텐츠</h1>
        <p className="text-gray-600">여기에 대시보드의 주요 콘텐츠가 표시됩니다.</p>
        {children}
      </div>
    </div>
  );
}
