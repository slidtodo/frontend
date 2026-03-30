'use client';

import { useQuery } from '@tanstack/react-query';
import { todoQueries } from '@/lib/queryKeys';
import Tag from '@/shared/components/Tag';

export default function TodoTitle({ todoId }: { todoId: number }) {
  const { data: todo } = useQuery(todoQueries.detail(todoId));

  return (
    <div className="flex gap-2 items-center">
      <Tag
        string={todo?.done ? 'DONE' : 'TODO'}
        variant="orange"
        className="semibold rounded-lg px-[5.5px] py-0.75 text-xs h-[22px]"
      />
      <p className="text-sm font-normal text-[#333] line-clamp-1">{todo?.title}</p>
    </div>
  );
}
