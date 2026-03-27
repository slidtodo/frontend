import NoteCreateClient from '../../../../../../features/note/components/NoteCreateClient';
import { fetchTodos } from '@/lib/api/fetchTodos';
import { fetchGoals } from '@/lib/api/fetchGoals';

interface PageProps {
  params: Promise<{ goalId: string }>;
  searchParams: Promise<{ todoId?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { goalId } = await params;
  const { todoId } = await searchParams;

  const [goal, todo] = await Promise.all([
    fetchGoals.getGoal(Number(goalId)),
    todoId ? fetchTodos.getTodo(Number(todoId)) : Promise.resolve(null),
  ]);

  return <NoteCreateClient goal={goal} todo={todo} />;
}
