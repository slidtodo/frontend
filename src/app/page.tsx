import TaskCard from '@/shared/components/TaskCard';

export default function Home() {
  return (
    <div className="mx-auto flex h-screen w-150 flex-col justify-center">
      <TaskCard id="1" text="해야할 일 하기" />
      <TaskCard id="1" text="해야할 일 하기" />
      <TaskCard id="1" text="해야할 일 하기" />
      <TaskCard id="1" text="해야할 일 하기" />
    </div>
  );
}
