import GoalItem from '@/features/goal/note/components/GoalItem';
import NoteListHeader from '@/features/goal/note/components/NoteListHeader';
import clsx from 'clsx';
import { Note } from '@/shared/types/types';
import Empty from '@/shared/components/Empty';
import NoteItem from '@/features/goal/note/components/NoteItem';

/**
 * @TODO mock 데이터 추후 삭제 예정
 */
export const MOCK_GOAL = {
  id: 1,
  title: '자바스크립트로 웹 서비스 만들기',
};

export const MOCK_NOTES = [
  { id: 1, title: '노트 제목1', todoId: 10, createdAt: '2026-03-17T00:00:00Z' },
  { id: 2, title: '노트 제목2', todoId: 11, createdAt: '2026-03-17T00:00:00Z' },
  { id: 3, title: '노트 제목3', todoId: 10, createdAt: '2026-03-17T00:00:00Z' },
];

/**
 * @TODO params로 goalId 가져오기
 * export default async function Page({ params }: { params: { goalId: string } })
 */
export default function Page() {
  return (
    <div className="mx-auto flex h-full min-h-screen w-full max-w-[1312px] flex-col">
      {/* 1. Header */}
      <NoteListHeader />
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

export async function NoteList() {
  /**
   * @TODO 실제 API로 대체
   * const res = await fetch(`{BASE_URL}/goals/{goalId}/notes`);
   * const data = await res.json();
   */

  if (!MOCK_NOTES || MOCK_NOTES.length === 0) return <Empty>아직 등록된 노트가 없어요</Empty>;

  return (
    <section className={clsx('flex flex-col gap-3', 'md:gap-4', 'lg:grid lg:grid-cols-2 lg:gap-[20px]')}>
      {MOCK_NOTES.map((note: Note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </section>
  );
}
