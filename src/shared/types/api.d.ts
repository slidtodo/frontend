export interface TodoItem {
  id: number;
  userId: number;
  goalId: number;
  title: string;
  done: boolean;
  fileUrl: string | null;
  linkUrl: string | null;
  source: 'manual' | 'github_issue' | 'github_pr';
  sourceItemId: number | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  goal: {
    id: number;
    title: string;
  };
  noteIds: number[];
  tags: [
    {
      id: number;
      name: string;
    },
  ];
}

export interface TodoListRes {
  todos: TodoItem[];
  nextCursor: number;
  totalCount: number;
}
