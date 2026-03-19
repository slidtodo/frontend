'use client';

import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';

export default function Home() {
  const { openTodoCreateModal } = useTodoCreateModal();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Hello, Worldzdz!</h1>
      <button onClick={openTodoCreateModal}>모달 버튼</button>
    </main>
  );
}
