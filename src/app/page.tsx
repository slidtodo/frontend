'use client';
import { useTodoEditModal } from '@/features/todo/hooks/useTodoEditModal';

export default function Home() {
  const { openTodoEditModal } = useTodoEditModal();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Hello, Worldzdz!</h1>
      <button
        onClick={() =>
          openTodoEditModal({
            done: true,
            title: '모달 실험',
            goalId: 1,
            dueDate: null,
            linkUrl: null,
            imageUrl: null,
            tags: ['태그1', '태그2'],
          })
        }
      >
        수정 모달 열기
      </button>
    </main>
  );
}
