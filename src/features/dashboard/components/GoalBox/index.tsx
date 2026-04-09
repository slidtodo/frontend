'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Button from '@/shared/components/Button';
import Empty from '@/shared/components/Empty';
import Progressbar from '@/shared/components/Progressbar';
import SearchInput from '@/shared/components/SearchInput';
import TaskCardWrapper from '../TaskCardWrapper';

import type { GoalDetailResponse } from '@/shared/lib/api';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import { useGithubTodoCreateModal } from '@/features/todo/hooks/useGithubTodoCreateModal';
import { useLanguage } from '@/shared/contexts/LanguageContext';

interface GoalBoxProps {
  data: GoalDetailResponse;
}
export default function GoalBox({ data }: GoalBoxProps) {
  const { openTodoCreateModal } = useTodoCreateModal();
  const { openGithubTodoCreateModal } = useGithubTodoCreateModal();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;

  const filterTodos = useCallback(
    (todos: GoalDetailResponse['todoList']) => {
      if (!isSearching) return todos;
      return todos.filter((todo) => todo.title.toLowerCase().includes(normalizedSearch));
    },
    [isSearching, normalizedSearch],
  );

  const visibleTodoList = filterTodos(data.todoList);
  const visibleDoneList = filterTodos(data.doneList);
  const isGithubGoal = data.source === 'GITHUB';

  const handleAddTodo = () => {
    if (data.id === undefined) return;

    if (isGithubGoal) {
      openGithubTodoCreateModal({
        goalId: data.id,
        goalTitle: data.title,
      });
    } else {
      openTodoCreateModal({
        goalDetailId: data.id,
        todo: {
          title: '',
          goalId: data.id,
          dueDate: undefined,
          linkUrl: undefined,
          imageUrl: undefined,
          tags: [],
        },
      });
    }
  };

  return (
    <article className="flex flex-col gap-4 rounded-[40px] bg-white p-6 lg:px-8 lg:py-6">
      <div className="flex flex-col items-center gap-2 px-2 md:flex-row md:gap-12 lg:gap-8">
        <GoalName data={data} />

        <div className="flex w-full flex-1 justify-between gap-0 md:justify-end md:gap-2 lg:gap-[14px]">
          <SearchInput
            placeholder={t.todo.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            variant="primary"
            className="p-[10px] md:px-[14.5px] md:px-[18px] md:py-[10px] lg:py-[10px]"
            disabled={data.id === undefined}
            onClick={handleAddTodo}
          >
            <PlusIcon size={20} />
            <span className="hidden w-max text-sm font-semibold md:block">
              {isGithubGoal ? t.todo.addGithubTodo : t.todo.addTodo}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col justify-around gap-2 md:flex-row lg:gap-8">
        {visibleTodoList.length === 0 && visibleDoneList.length === 0 ? (
          <div className="h-40 md:h-80">
            <Empty>{isSearching ? t.todo.noSearchResult : t.todo.emptyTodo}</Empty>
          </div>
        ) : (
          <>
            <ListBox title={t.allTodo.todo} mode="todo" items={visibleTodoList} />
            <ListBox title={t.allTodo.done} mode="done" items={visibleDoneList} />
          </>
        )}
      </div>
    </article>
  );
}

interface GoalNameProps {
  data: GoalDetailResponse;
}
function GoalName({ data }: GoalNameProps) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-1 flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="w-full max-w-[229px]">
          <button
            onClick={() => {
              if (data.id === undefined) return;
              router.push(`goal/${data.id}`);
            }}
            className="font-base overflow-hidden text-left font-semibold text-ellipsis whitespace-nowrap text-gray-700"
          >
            {data.title}
          </button>
        </div>
        <Progressbar progress={data.progress ?? 0} />
      </div>
    </div>
  );
}
interface ListBoxProps {
  title: string;
  mode: 'todo' | 'done';
  items: GoalDetailResponse['todoList'];
}
function ListBox({ title, mode, items }: ListBoxProps) {
  const bgColor = mode === 'todo' ? 'bg-[#E5F9F2]' : 'bg-white';
  const textColor = mode === 'todo' ? 'text-[#00D185]' : 'text-gray-400';

  return (
    <div
      className={`flex h-[324px] flex-1 flex-col gap-4 overflow-hidden rounded-[16px] ${bgColor} p-4 lg:rounded-[24px] lg:p-6`}
    >
      <span className={`shrink-0 text-sm font-bold ${textColor} lg:text-base`}>{title}</span>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex w-full min-w-0 flex-col gap-1">
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((item) => (
              <TaskCardWrapper key={item.id} item={item} mode={mode} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
