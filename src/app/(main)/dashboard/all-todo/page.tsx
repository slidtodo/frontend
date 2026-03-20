import PageHeader from '@/shared/components/PageHeader';
import AllTodoContent from '@/features/dashboard/allTodo/components/AllTodoContent';
import { mockTodoItems } from '@/features/dashboard/allTodo/components/AllTodoContent/mock';
/**
 * @description 해당 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 말아주세요
 * 'use client'로 변경 x
 * 서버 프리페치해서 넘겨주기
 */
export default function AllTodoPage() {
  return (
    <div className="mx-auto mb-[76px] flex max-w-[720px] flex-col gap-6">
      <PageHeader title="모든 할 일" count={mockTodoItems.length} className="pl-2" />
      <AllTodoContent />
    </div>
  );
}
