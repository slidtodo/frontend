import Image from 'next/image';

import PageSubTitle from '@/shared/components/PageSubTitle';
import GoalBox from '../GoalBox';

const goalMockData = [
  {
    id: 1,
    title: '디자인 패턴 공부하기',
    description: '목표 1에 대한 설명입니다.',
    progress: 50,
    todoList: [
      { id: 1, title: '할 일 1', isCompleted: true, star: true },
      { id: 2, title: '할 일 2', isCompleted: false, star: false },
      { id: 3, title: '할 일 3', isCompleted: false, star: false },
    ],
    doneList: [
      { id: 1, title: '완료된 일 1', star: true },
      { id: 2, title: '완료된 일 2', star: false },
    ],
  },
  {
    id: 2,
    title: '자바스크립트로 웹 서비스 만들기',
    description: '목표 2에 대한 설명입니다.',
    progress: 30,
    todoList: [
      { id: 1, title: '할 일 1', isCompleted: false, star: false },
      { id: 2, title: '할 일 2', isCompleted: false, star: false },
    ],
    doneList: [{ id: 1, title: '완료된 일 1', star: true }],
  },
];
export default function DashboardDetail() {
  return (
    <section>
      <PageSubTitle
        subTitle="최근 등록한 할 일"
        icons={<Image src={'/image/goal-icon.png'} alt="Goal Icon" width={40} height={40} />}
        actions={<span>최신순 필터</span>}
      />
      <div className="flex flex-col gap-[32px] pt-[10px]">
        {goalMockData.map((goal) => (
          <GoalBox key={goal.id} data={goal} />
        ))}
      </div>
    </section>
  );
}
