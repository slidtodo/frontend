import GoalItem from '@/features/goal/note/components/GoalItem';
import NoteListHeader from '@/features/goal/note/components/NoteListHeader';
import PageHeader from '@/shared/components/PageHeader';
import { Note } from '@/shared/types/types';
import { formatDate } from '@/shared/utils/utils';
import clsx from 'clsx';
import noteIcon from '@/features/goal/note/assets/icons/icon-note.png';
import Image from 'next/image';
import Tag from '@/shared/components/Tag';
import EllipsisButton from '@/features/goal/note/components/EllipsisButton';
import Empty from '@/shared/components/Empty';

// ---------------------------------------------------------------------------
// Mock 데이터(추후 삭제 예정)
// ---------------------------------------------------------------------------
export const MOCK_GOAL = {
  id: 1,
  title: '자바스크립트로 웹 서비스 만들기',
};

export const MOCK_NOTES = [
  { id: 1, title: '노트 제목1', todoId: 10, createdAt: '2026-03-17T00:00:00Z' },
  { id: 2, title: '노트 제목2', todoId: 11, createdAt: '2026-03-17T00:00:00Z' },
  { id: 3, title: '노트 제목3', todoId: 10, createdAt: '2026-03-17T00:00:00Z' },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * @TODO params로 goalId 가져오기
 * export default async function Page({ params }: { params: { goalId: string } })
 */
export default function Page() {
  return (
    <div className="mx-auto flex h-full min-h-screen w-full max-w-[1312px] flex-col">
      {/* 1. PageHeader + NoteListHeader */}
      <section
        className={clsx('mb-12 flex items-center justify-between', 'md:mt-4 md:mb-8 md:gap-4', 'lg:mt-10 lg:mb-12')}
      >
        <PageHeader title="노트 모아보기" />
        <NoteListHeader />
      </section>

      {/* 2. GoalItem */}
      {/* @TODO MOCK_GOAL → API 데이터로 대체 */}
      <section className="mb-3 md:mb-4 lg:mb-5">
        <GoalItem title={MOCK_GOAL.title} />
      </section>

      {/* 3. NoteList */}
      <NoteList />
    </div>
  );
}

// ---------------------------------------------------------------------------
// NoteList
// ---------------------------------------------------------------------------
/**
 * Note { id: number; title: string; todoId: number; createdAt: string;}
 */
async function NoteList() {
  /**
   * @TODO 실제 API로 대체
   * const res = await fetch(`{BASE_URL}/goals/{goalId}/notes`);
   * const data = await res.json();
   */

  if (!MOCK_NOTES || MOCK_NOTES.length === 0) return <Empty>아직 등록된 노트가 없어요</Empty>;

  return (
    <div className={clsx('flex flex-col gap-3', 'md:gap-4', 'lg:grid lg:grid-cols-2 lg:gap-[20px]')}>
      {MOCK_NOTES.map((note: Note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// NoteItem
// ---------------------------------------------------------------------------

async function NoteItem({ note }: { note: Note }) {
  const createDate = formatDate(new Date(note.createdAt));
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-[#FFF] p-4 md:gap-4 md:rounded-3xl md:px-[38px] md:pt-7 md:pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Image src={noteIcon} sizes="32" alt="노트 아이콘" className="md:w-10 md:h-10" />
          <h2 className="text-sm font-semibold text-[#1E293B] md:text-xl">{note.title}</h2>
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// TodoTitle
// ---------------------------------------------------------------------------
async function TodoTitle({ todoId }: { todoId: number }) {
  /**
   * @TODO 실제 API URL로 대체
   * const res = await fetch(`{BASE_URL}/todos/${todoId}`);
   */
  // const res = await fetch(`{BASE_URL}/todos/${todoId}`);
  // const data = await res.json();

  // return <div>{data.title}</div>;
  return (
    <div className="flex gap-2">
      <Tag string="TODO" variant="orange" className="semibold rounded-lg px-[5.5px] py-[3px] text-xs" />
      <p className="text-sm font-normal text-[#333]">{todoId} 할 일 제목</p>
    </div>
  );
}
