import { TodoItem } from '@/shared/types/api';

//TODO 삭제 예정

export const mockTodoItems: TodoItem[] = Array.from({ length: 30 }, (_, i) => {
  const id = i + 1;

  return {
    id,
    userId: 1,
    goalId: 1,
    title: `할 일 ${id}`,
    done: id % 3 === 0, // 일부 완료 처리
    fileUrl: null,
    linkUrl: `https://example.com/todo/${id}`,
    source: 'github_pr',
    sourceItemId: null,
    dueDate: new Date(Date.now() + id * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorite: id % 5 === 0,
    goal: {
      id: 1,
      title: '자바스크립트로 웹 서비스 만들기',
    },
    noteIds: [id * 10 + 1],
    tags: [
      {
        id: 1,
        name: '중요',
      },
    ],
  };
});
