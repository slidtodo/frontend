// TODO: 목데이터는 삭제예정
export const goalMockData = [
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
      { id: 3, title: '할 일 3', isCompleted: false, star: false },
      { id: 4, title: '할 일 4', isCompleted: false, star: false },
      { id: 5, title: '할 일 5', isCompleted: false, star: false },
      { id: 6, title: '할 일 1', isCompleted: false, star: false },
      { id: 7, title: '할 일 2', isCompleted: false, star: false },
      { id: 8, title: '할 일 3', isCompleted: false, star: false },
      { id: 9, title: '할 일 4', isCompleted: false, star: false },
      { id: 10, title: '할 일 5', isCompleted: false, star: false },
    ],
    doneList: [{ id: 1, title: '완료된 일 1', star: true }],
  },
];
