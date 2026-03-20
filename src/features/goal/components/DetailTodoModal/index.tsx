import React from 'react';
import Image from 'next/image';
import { FlagIcon, CalendarIcon, HashIcon, XIcon, LinkIcon } from 'lucide-react';

import { TodoItem } from '@/shared/types/api';
import { useModalStore } from '@/shared/stores/useModalStore';

// TODO: 현재 디자인과 데이터 응답이 이상함 추후 API 명세 수정될 때 같이 수정 필요
interface DetailTodoModalProps {
  todo: TodoItem;
}
export default function DetailTodoModal({ todo }: DetailTodoModalProps) {
  const { closeModal } = useModalStore();

  if (!todo) {
    return null;
  }
  return (
    <div className="flex w-85.75 flex-col gap-6 rounded-3xl bg-white p-4 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] md:w-114 md:rounded-[40px] md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-semibold text-[#262626]">{todo.title}</span>
        </div>
        <XIcon className="cursor-pointer text-slate-400" size={24} onClick={closeModal} />
      </div>
      <div className="flex flex-col gap-4">
        <DetailItemSummary icon={<FlagIcon size={18} />} label="목표" value={todo.goal.title} />
        <DetailItemSummary icon={<CalendarIcon size={18} />} label="마감기한" value={'2026.09.12'} />
        <DetailItemSummary icon={<HashIcon size={18} />} label="태그" value={['코딩', '프로그래밍'].join(', ')} />
      </div>
      {todo.fileUrl ||
        (todo.linkUrl && (
          <div className="flex flex-col gap-2">
            <span className="text-base font-semibold text-[#333333]">첨부파일</span>
            <div className="flex flex-col gap-3">
              <div>
                <LinkIcon size={17} className="inline-block text-[#A4A4A4]" />
                <span className="ml-1 text-sm font-medium text-[#333333]">{todo.fileUrl ? '파일' : '링크'}</span>
              </div>
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
        ))}

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
  value: string;
}
function DetailItemSummary({ icon, label, value }: DetailItemSummaryProps) {
  return (
    <div className="flex gap-2">
      <div className="flex gap-1">
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
