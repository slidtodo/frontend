'use client';
import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { FlagIcon, CalendarIcon, HashIcon, XIcon, LinkIcon } from 'lucide-react';

import Tag from '@/shared/components/Tag';

import { useModalStore } from '@/shared/stores/useModalStore';
import { TodoResponse } from '@/shared/lib/api';
import { noteQueries } from '@/shared/lib/queryKeys';
import { formatDate } from '@/shared/utils/utils';
interface DetailTodoModalComponentsProps {
  todo: TodoResponse | undefined;
}
const DetailTodoModalComponents = memo(function DetailTodoModalComponents({ todo }: DetailTodoModalComponentsProps) {
  const { closeModal } = useModalStore();

  if (!todo) return null;

  return (
    <div className="flex w-85.75 flex-col gap-6 rounded-3xl bg-white p-4 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] md:w-114 md:rounded-[40px] md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="text-xl font-semibold text-gray-800">{todo?.title}</span>
          <div className="bg-bearlog-500/10 text-bearlog-600 rounded-lg px-[5.5px] py-[3px] text-sm font-semibold">
            {todo?.done ? 'DONE' : 'TO DO'}
          </div>
        </div>
        <XIcon className="cursor-pointer text-slate-400" size={24} onClick={closeModal} />
      </div>
      <div className="flex flex-col gap-4">
        <DetailItemSummary icon={<FlagIcon size={18} />} label="목표" value={todo?.goal?.title} />
        <DetailItemSummary
          icon={<CalendarIcon size={18} />}
          label="마감기한"
          value={todo?.dueDate ? formatDate(todo.dueDate) : ''}
        />
        <DetailItemSummary
          icon={<HashIcon size={18} />}
          label="태그"
          value={todo?.tags?.map((tag) => (
            <Tag key={tag.id} string={tag.name ?? ''} />
          ))}
        />
      </div>
      {(todo?.imageUrl || todo?.linkUrl) && (
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold text-gray-700">첨부파일</span>
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <LinkIcon size={17} className="inline-block text-gray-400" />
              <a
                href={todo?.linkUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#1E90FF]"
              >
                {todo.linkUrl}
              </a>
            </div>
          </div>
        </div>
      )}

      {todo?.noteIds && todo.noteIds.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold">작성된 노트</span>
          {todo.noteIds.map((noteId) => (
            <NoteItem key={noteId} noteId={noteId} />
          ))}
        </div>
      )}
    </div>
  );
});
export default DetailTodoModalComponents;

interface DetailItemSummaryProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}
function DetailItemSummary({ icon, label, value }: DetailItemSummaryProps) {
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-1">
        <div className="flex items-center text-gray-400">{icon}</div>
        <span className="text-sm font-medium text-gray-400">{label}</span>
      </div>
      <div className="text-sm font-normal text-gray-700">{value}</div>
    </div>
  );
}

function NoteItem({ noteId }: { noteId: number }) {
  const { closeModal } = useModalStore();
  const router = useRouter();

  const { data: note } = useQuery({
    ...noteQueries.detail(noteId),
    enabled: Boolean(noteId) && noteId !== undefined,
  });

  if (!note) return null;

  return (
    <button
      onClick={() => {
        closeModal();
        router.push(`/goal/${note?.goalId}/note/${noteId}`);
      }}
      className="flex gap-2 rounded-2xl border border-gray-200 bg-white p-2"
    >
      <Image src={'/image/todo-note.svg'} alt="노트 이미지" width={32} height={32} />
      <span className="flex items-center text-base font-medium text-gray-700">{note?.title}</span>
    </button>
  );
}
