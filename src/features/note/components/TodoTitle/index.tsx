'use client';

import { useQuery } from '@tanstack/react-query';
import { todoQueries } from '@/lib/queryKeys';
import Tag from '@/shared/components/Tag';

export default function TodoTitle({ todoId }: { todoId: number }) {
  const { data: todo } = useQuery(todoQueries.detail(todoId));

  return (
    <div className="flex items-center gap-2">
      <Tag
        string={todo?.done ? 'DONE' : 'TODO'}
        variant="green"
        className="semibold h-[22px] rounded-lg px-[5.5px] py-0.75 text-xs"
      />
      <p className="line-clamp-1 text-sm font-normal text-[#333]">{todo?.title}</p>
    </div>
  );
}
