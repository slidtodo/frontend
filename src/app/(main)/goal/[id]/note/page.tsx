import GoalItem from '@/features/goal/note/components/GoalItem';
import NoteListHeader from '@/features/goal/note/components/NoteListHeader';
import PageHeader from '@/shared/components/PageHeader';
import clsx from 'clsx';

/**
 * url(goalId)로 goal 데이터 가져오기
 * @param param0
 * @returns
 */
// async function getGoal(id: string) {
//   const res = await fetch(`.../${id}`, {
//     cache: "force-cache" // 고민
//   });

//   if (!res.ok) throw new Error('Failed to fetch');
//
//   return res.json();
// }

export default function Page() {
  /**
   * @TODO Page 컴포넌트에서 params로 id 가져오기
   */
  // export default function Page({ params }: { params: { id: string } }) {
  // const data = await getGoal(params.id)
  /**
   * @TODO data 목데이터 API로 대체
   */
  const data = {
    id: 1,
    title: '자바스크립트로 웹 서비스 만들기',
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1312px] flex-col">
      {/** 1. PageHeader + NoteListHeader(검색바, 필터) */}
      <section
        className={clsx('mb-12 flex items-center justify-between', 'md:mt-4 md:mb-8 md:gap-4', 'lg:mt-10 lg:mb-12')}
      >
        <PageHeader title="노트 모아보기" />
        <NoteListHeader />
      </section>

      {/** 2. GoalItem */}
      <section>
        <GoalItem title={data.title} />
      </section>

      {/** 3. NoteList */}
      <section></section>
    </div>
  );
}
