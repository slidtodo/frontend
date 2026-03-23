
import { formatDate } from '@/shared/utils/utils';
import EllipsisButton from '../EllipsisButton';
import Image from 'next/image';
import { Note } from '@/shared/types/types';
import noteIcon from '@/features/goal/note/assets/icons/icon-note.png';
import TodoTitle from '@/features/goal/note/components/TodoTitle';
import Link from 'next/link';

export default async function NoteItem({ note, goalId }: { note: Note; goalId: string }) {
  const createDate = formatDate(new Date(note.createdAt));
  return (
    <Link href={`/goal/${goalId}/note/${note.id}`}>
      <article className="flex flex-col gap-3 rounded-[20px] bg-[#FFF] p-4 md:gap-4 md:rounded-3xl md:px-[38px] md:pt-7 md:pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Image src={noteIcon} sizes="32" alt="노트 아이콘" className="md:h-10 md:w-10" />

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
    </Link>
  );
}
