import { formatDate } from '@/shared/utils/utils';
import EllipsisButton from '../EllipsisButton';
import Image from 'next/image';
import { Note } from '@/shared/types/types';
import noteIcon from '@/features/goal/note/assets/icons/icon-note.png';
import { TodoTitle } from '@/app/(main)/goal/[id]/note/page';

export default async function NoteItem({ note }: { note: Note }) {
  const createDate = formatDate(new Date(note.createdAt));
  return (
    <article className="flex flex-col gap-3 rounded-[20px] bg-[#FFF] p-4 md:gap-4 md:rounded-3xl md:px-[38px] md:pt-7 md:pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Image src={noteIcon} sizes="32" alt="노트 아이콘" className="md:w-10 md:h-10" />
          <h1 className="text-sm font-semibold text-[#1E293B] md:text-xl">{note.title}</h1>
        </div>
        <EllipsisButton
          items={[
            { label: '수정하기', value: 'edit' },
            { label: '삭제하기', value: 'delete' },
          ]}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* <ErrorSuspenseBoundary> */}
        {/* <TodoTitle todoId={note.todoId} /> */}
        {/* </ErrorSuspenseBoundary> */}

        <TodoTitle todoId={10} />
        <div>
          <p className="text-xs font-normal text-[#A4A4A4]">{createDate}</p>
        </div>
      </div>
    </article>
  );
}
