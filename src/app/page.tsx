'use client';

import TodoCreateModal from '@/features/todo/components/manual/TodoCreateModal';
import { useModalStore } from '@/shared/stores/useModalStore';

export default function Home() {
  const { openModal } = useModalStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Hello, Worldzdz!</h1>
      <button onClick={() => openModal(<TodoCreateModal />, undefined, 'bottom')}>모달 버튼</button>
    </main>
  );
}
