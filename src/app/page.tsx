import TaskCard from '@/shared/components/TaskCard';

export default function Home() {
  const todos = [
    { id: '1', title: '자바스크립트 강의 듣기', done: false },
    { id: '2', title: '리액트 복습하기', done: true },
    { id: '3', title: 'PR 리뷰 반영하기', done: false },
    { id: '4', title: '타입스크립트 공부하기', done: true },
  ];
  return todos.map((todo) => <TaskCard todo={todo} key={todo.id} />);
}
