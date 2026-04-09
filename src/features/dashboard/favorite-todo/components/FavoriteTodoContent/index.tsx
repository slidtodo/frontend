'use client';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';

import Button from '@/shared/components/Button';
import Empty from '@/shared/components/Empty';
import { DataBoundary } from '@/shared/components/ErrorSuspenseBoundary';
import PageHeader from '@/shared/components/PageHeader';
import TaskCardWrapper from '@/features/dashboard/components/TaskCardWrapper';
import FavoriteTodoDropdownGoal from '../FavoriteTodoDropdownGoal';

import { goalQueries, todoQueries } from '@/shared/lib/query/queryKeys';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import type { TodoListResponse } from '@/shared/lib/api';
import { TodoOptions } from '@/shared/types/types';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';

export default function FavoriteTodoContent() {
  const breakpoint = useBreakpoint();

  const [selectedFilter, setSelectedFilter] = useState<TodoOptions>('ALL');
  const done = selectedFilter === 'ALL' ? undefined : selectedFilter === 'DONE';

  const [selectedGoal, setSelectedGoal] = useState<string>('');

  const { data: todoList } = useQuery({
    ...todoQueries.list({ done }),
    placeholderData: (prev) => prev,
  });

  const favoriteTodos = useMemo(() => todoList?.todos?.filter((todo) => todo.favorite) ?? [], [todoList]);
  const goalFilteredTodos = useMemo(() => {
    if (selectedGoal === '') {
      return favoriteTodos;
    }
    return selectedGoal ? favoriteTodos.filter((todo) => String(todo.goal?.id) === selectedGoal) : favoriteTodos;
  }, [selectedGoal, favoriteTodos]);

  const favoriteTodoList: TodoListResponse = {
    todos: goalFilteredTodos,
    nextCursor: todoList?.nextCursor ?? null,
    hasMore: todoList?.hasMore ?? false,
    totalCount: favoriteTodos.length,
  };

  if (!todoList) return null;

  return (
    <div className="mx-auto mb-[76px] flex h-full max-w-[720px] flex-col gap-6">
      {breakpoint !== 'mobile' && (
        <PageHeader
          title="찜한 할 일"
          count={favoriteTodoList?.totalCount ?? favoriteTodoList?.todos?.length ?? 0}
          className="pl-2"
        />
      )}
      <section className="flex h-full flex-col gap-3">
        <AllTodoFilter todos={favoriteTodoList} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />

        <DataBoundary>
          <AllTodoFetcher todos={favoriteTodoList} selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal} />
        </DataBoundary>
      </section>
    </div>
  );
}

interface AllTodoFilterProps {
  todos: TodoListResponse;
  selectedFilter: TodoOptions;
  setSelectedFilter: React.Dispatch<React.SetStateAction<TodoOptions>>;
}
function AllTodoFilter({ todos, selectedFilter, setSelectedFilter }: AllTodoFilterProps) {
  const todoButtons: { id: number; label: TodoOptions }[] = [
    { id: 1, label: 'ALL' },
    { id: 2, label: 'TO DO' },
    { id: 3, label: 'DONE' },
  ];
  const { data: goalList } = useQuery(goalQueries.list());
  const { openTodoCreateModal } = useTodoCreateModal();
  const defaultGoalId = todos.todos?.[0]?.goal?.id ?? goalList?.goals?.[0]?.id;

  return (
    <div className="flex justify-between px-2">
      <div className="flex gap-0 md:gap-2">
        {todoButtons.map((button) => (
          <button
            key={button.id}
            className={`cursor-pointer overflow-hidden rounded-2xl px-4 py-2 text-base font-bold text-ellipsis whitespace-nowrap transition-all duration-200 ${
              selectedFilter === button.label
                ? 'text-bearlog-600 bg-bearlog-500/20'
                : 'hover:text-bearlog-600 hover:bg-bearlog-500/20 text-gray-400'
            }`}
            onClick={() => setSelectedFilter(button.label)}
          >
            {button.label}
          </button>
        ))}
      </div>
      <Button
        variant="cancel"
        className="group hover:bg-bearlog-500 flex items-center gap-1 bg-[#F2F2F2] px-3 py-[10px] md:px-[20px]"
        disabled={!defaultGoalId}
        onClick={() => {
          if (!defaultGoalId) return;

          openTodoCreateModal({
            goalDetailId: defaultGoalId,
            todo: {
              title: '',
              goalId: defaultGoalId,
              dueDate: undefined,
              linkUrl: undefined,
              imageUrl: undefined,
              tags: [],
            },
          });
        }}
      >
        <PlusIcon size={20} className="text-gray-500 group-hover:text-white" />
        <span className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-gray-500 group-hover:text-white">
          할 일 추가
        </span>
      </Button>
    </div>
  );
}

interface AllTodoFetcherProps {
  todos: TodoListResponse;
  selectedGoal: string;
  setSelectedGoal: React.Dispatch<React.SetStateAction<string>>;
}

function AllTodoFetcher({ todos, selectedGoal, setSelectedGoal }: AllTodoFetcherProps) {
  const { data: goalList } = useQuery(goalQueries.list());

  const goalItems = [
    { label: '전체 목표', value: '' },
    ...(goalList?.goals
      ? goalList.goals.map((goal) => ({
          label: goal.title ?? '',
          value: String(goal.id),
        }))
      : []),
  ];

  return (
    <section
      className={`flex flex-col gap-5 rounded-4xl bg-white p-4 md:p-8 ${todos.todos?.length === 0 ? 'h-full' : 'h-fit'}`}
    >
      <FavoriteTodoDropdownGoal
        selectedValue={selectedGoal}
        onSelectItem={(item) => setSelectedGoal(item.value)}
        items={goalItems}
      />

      <div className="flex h-full flex-col gap-4 overflow-y-auto">
        {(todos.todos?.length ?? 0) === 0 ? (
          <Empty>등록된 할 일이 없습니다.</Empty>
        ) : (
          <div className="space-y-4">
            {todos.todos?.map((todo) => (
              <TaskCardWrapper key={todo.id} item={todo} mode="todo" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
