import React from 'react';
import Image from 'next/image';
import { FlagIcon, CalendarIcon, HashIcon, XIcon, LinkIcon } from 'lucide-react';

import Tag from '@/shared/components/Tag';

import type { TodoItem } from '@/shared/types/api';
import { useModalStore } from '@/shared/stores/useModalStore';
// import type{compone}
// TODO: 현재 디자인과 데이터 응답이 이상함 추후 API 명세 수정될 때 같이 수정 필요
interface DetailTodoModalProps {
  todo: any; // TODO: TodoItem 타입으로 수정 필요
}
export default function DetailTodoModal({ todo }: DetailTodoModalProps) {
  const { closeModal } = useModalStore();

  if (!todo) {
    return null;
  }
  return (
    <div className="flex w-85.75 flex-col gap-6 rounded-3xl bg-white p-4 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] md:w-114 md:rounded-[40px] md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="text-xl font-semibold text-[#262626]">{todo.title}</span>
          <div className="rounded-lg bg-[#FEEFDC] px-[5.5px] py-[3px] text-sm font-semibold text-[#EF6C00]">
            {todo.done ? 'DONE' : 'TO DO'}
          </div>
        </div>
        <XIcon className="cursor-pointer text-slate-400" size={24} onClick={closeModal} />
      </div>
      <div className="flex flex-col gap-4">
        <DetailItemSummary icon={<FlagIcon size={18} />} label="목표" value={todo.goal.title} />
        <DetailItemSummary icon={<CalendarIcon size={18} />} label="마감기한" value={todo.dueDate} />
        <DetailItemSummary
          icon={<HashIcon size={18} />}
          label="태그"
          value={todo.tags.map((tag) => (
            <Tag key={tag.id} string={tag.name} />
          ))}
        />
      </div>
      {(todo.fileUrl || todo.linkUrl) && (
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold text-[#333333]">첨부파일</span>
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <LinkIcon size={17} className="inline-block text-[#A4A4A4]" />
              <a
                href={todo.fileUrl ?? todo.linkUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#1E90FF]"
              >
                {todo.fileUrl ?? todo.linkUrl}
              </a>
            </div>
          </div>
        </div>
      )}

      {todo.noteIds.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold">작성된 노트</span>
          {todo.noteIds.map((noteId) => (
            <NoteItem key={noteId} noteId={noteId} />
          ))}
        </div>
      )}
    </div>
  );
}

interface DetailItemSummaryProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}
function DetailItemSummary({ icon, label, value }: DetailItemSummaryProps) {
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-1">
        <div className="flex items-center text-[#A4A4A4]">{icon}</div>
        <span className="text-sm font-medium text-[#A4A4A4]">{label}</span>
      </div>
      <div className="text-sm font-normal text-[#333333]">{value}</div>
    </div>
  );
}

// TODO: 노트 get api 연결후 수정필요
function NoteItem({ noteId }: { noteId: number }) {
  const noteTitle = '프로그래밍과 데이터 in JavaScript';
  return (
    <div className="flex gap-2 rounded-2xl border border-[#DDDDDD] bg-white p-2">
      <Image src={'/image/todo-note.svg'} alt="노트 이미지" width={32} height={32} />
      <span className="flex items-center text-base font-medium text-[#333333]">{noteTitle}</span>
    </div>
  );
}
