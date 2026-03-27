'use client';
import { useQuery } from '@tanstack/react-query';

import DetailTodoModalComponents from './DetailTodoModalComponets';

import { todoQueries } from '@/lib/queryKeys';

interface DetailTodoModalProps {
  todoId: number;
}
export default function DetailTodoModal({ todoId }: DetailTodoModalProps) {
  const { data: todo } = useQuery({
    ...todoQueries.detail(todoId),
    enabled: Boolean(todoId) && todoId !== undefined,
  });

  return <DetailTodoModalComponents todo={todo} />;
}
