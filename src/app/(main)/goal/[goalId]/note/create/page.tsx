import NoteCreateClient from '../../../../../../features/note/components/NoteCreateClient';
import { fetchTodos } from '@/lib/api/fetchTodos';
import { fetchGoals } from '@/lib/api/fetchGoals';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ goalId: string }>;
  searchParams: Promise<{ todoId?: string }>;
}) {
  const { goalId } = await params;
  // const { todoId } = await searchParams;
  // @TODO 13번 줄 주석 풀고 15번 줄 주석
  const todoId = 8;

  const [goal, todo] = await Promise.all([
    fetchGoals.getGoal(Number(goalId)),
    todoId ? fetchTodos.getTodo(Number(todoId)) : Promise.resolve(null),
  ]);

  return <NoteCreateClient goal={goal} todo={todo} />;
}
