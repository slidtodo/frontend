import GoalItem from '@/features/goal/note/components/GoalItem';
import NoteListHeader from '@/features/goal/note/components/NoteListHeader';
import ErrorSuspenseBoundary from '@/shared/components/ErrorSuspenseBoundary';
import PageHeader from '@/shared/components/PageHeader';
import { Note } from '@/shared/types/types';
import { formatDate } from '@/shared/utils/utils';
import clsx from 'clsx';

// ---------------------------------------------------------------------------
// Mock 데이터
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
    <div className="mx-auto flex h-full w-full max-w-[1312px] flex-col">
      {/* 1. PageHeader + NoteListHeader */}
      <section
        className={clsx('mb-12 flex items-center justify-between', 'md:mt-4 md:mb-8 md:gap-4', 'lg:mt-10 lg:mb-12')}
      >
        <PageHeader title="노트 모아보기" />
        <NoteListHeader />
      </section>

      {/* 2. GoalItem */}
      {/* @TODO MOCK_GOAL → API 데이터로 대체 */}
      <GoalItem title={MOCK_GOAL.title} />

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

  return (
    <div>
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
    <div>
      <h1>{note.title}</h1>
      <div>{createDate}</div>
      {/* <ErrorSuspenseBoundary> */}
      {/* <TodoTitle todoId={note.todoId} /> */}
      <TodoTitle todoId={10} />
      {/* </ErrorSuspenseBoundary> */}
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
  return <div>할 일 제목</div>;
}
