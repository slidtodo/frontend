import TaskCard from '@/shared/components/TaskCard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Hello, Worldzdz!</h1>
      <div className="w-110 bg-orange-500">
        <TaskCard
          todo={{
            id: '1',
            title: '항목명',
            done: true,
          }}
          variant="orange"
        />
      </div>
      <div className='w-110 bg-transparent'>
        <TaskCard
          todo={{
            id: '1',
            title: '항목명',
            done: true,
          }}
          variant="default"
        />
      </div>
    </main>
  );
}
