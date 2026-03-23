import { mockTodoItems } from '../../allTodo/components/AllTodoContent/mock';

// TODO: 목데이터는 삭제예정
export const goalMockData = [
  {
    id: 1,
    title: '디자인 패턴 공부하기',
    progress: 50,
    todoList: mockTodoItems.filter((item) => !item.done).slice(0, 3),
    doneList: mockTodoItems.filter((item) => item.done).slice(0, 2),
  },
  {
    id: 2,
    title: '자바스크립트로 웹 서비스 만들기',
    progress: 30,
    todoList: mockTodoItems.filter((item) => !item.done).slice(3, 13),
    doneList: mockTodoItems.filter((item) => item.done).slice(2, 3),
  },
];
