'use client';

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EllipsisVerticalIcon, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Button from '@/shared/components/Button';
import Empty from '@/shared/components/Empty';
import Progressbar from '@/shared/components/Progressbar';
import SearchInput from '@/shared/components/SearchInput';
import TaskCardWrapper from '../TaskCardWrapper';
import EditDeleteDropdown from '../EditDeleteDropdown';

import type { GoalDetailResponse } from '@/shared/lib/api';
import { useDisconnectGithubGoal } from '@/shared/lib/query/mutations';
import { useModalStore } from '@/shared/stores/useModalStore';
import { PopupModal } from '@/shared/components/Modal/PopupModal';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import { useGithubTodoCreateModal } from '@/features/todo/hooks/useGithubTodoCreateModal';

interface GoalBoxProps {
  data: GoalDetailResponse;
}

export default function GoalBox({ data }: GoalBoxProps) {
  const router = useRouter();
  const { openTodoCreateModal } = useTodoCreateModal();
  const { openGithubTodoCreateModal } = useGithubTodoCreateModal();
  const { openModal } = useModalStore();
  const { mutate: disconnectGithubGoal } = useDisconnectGithubGoal(data.id);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleDisconnect = () => {
    setDropdownOpen(false);
    openModal(
      <PopupModal
        variant={{ type: 'githubRepoDisconnect' }}
        onConfirm={() => disconnectGithubGoal()}
      />,
    );
  };

  return (
    <article className="flex flex-col gap-4 rounded-[40px] bg-white p-6 lg:px-8 lg:py-6">
      <div className="flex flex-col items-center gap-2 px-2 md:flex-row md:gap-12 lg:gap-8">
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
            {isGithubGoal && (
              <span className="rounded-full bg-[#F6F8FA] px-3 py-1 text-xs font-semibold text-gray-600">GitHub</span>
            )}
            {isGithubGoal && (
              <div className="relative ml-auto shrink-0">
                <button
                  ref={dropdownButtonRef}
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <EllipsisVerticalIcon size={24} color="#A4A4A4" />
                </button>
                {dropdownOpen && (
                  <EditDeleteDropdown
                    handleEdit={() => {}}
                    handleDelete={handleDisconnect}
                    onClose={() => setDropdownOpen(false)}
                    anchorRef={dropdownButtonRef}
                    editLabel="수정 불가"
                    editDisabled={true}
                    deleteLabel="연결 해제"
                  />
                )}
              </div>
            )}
          </div>

          {isGithubGoal && data.repositoryFullName && (
            <span className="text-sm text-gray-500">{data.repositoryFullName}</span>
          )}
          <Progressbar progress={data.progress ?? 0} />
        </div>

        <div className="flex w-full flex-1 justify-between gap-0 md:justify-end md:gap-2 lg:gap-[14px]">
          <SearchInput placeholder="할 일을 검색해 주세요" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button
            variant="primary"
            className="p-[10px] md:px-[14.5px] md:px-[18px] md:py-[10px] lg:py-[10px]"
            disabled={data.id === undefined}
            onClick={handleAddTodo}
          >
            <PlusIcon size={20} />
            <span className="hidden w-max text-sm font-semibold md:block">
              {isGithubGoal ? '이슈/PR 추가' : '할 일 추가'}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col justify-around gap-2 md:flex-row lg:gap-8">
        {visibleTodoList.length === 0 && visibleDoneList.length === 0 ? (
          <div className="h-40 md:h-80">
            <Empty>{isSearching ? '검색 결과가 없습니다.' : '현재 등록된 할 일이 없습니다.'}</Empty>
          </div>
        ) : (
          <>
            <ListBox title="TODO" mode="todo" items={visibleTodoList} />
            <ListBox title="DONE" mode="done" items={visibleDoneList} />
          </>
        )}
      </div>
    </article>
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
    <div className={`flex max-h-[324px] flex-1 flex-col gap-4 rounded-[16px] ${bgColor} p-4 lg:rounded-[24px] lg:p-6`}>
      <span className={`text-sm font-bold ${textColor} lg:text-base`}>{title}</span>
      <div className="flex max-h-[236px] flex-col gap-1 overflow-y-auto">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <TaskCardWrapper key={item.id} item={item} mode={mode} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
