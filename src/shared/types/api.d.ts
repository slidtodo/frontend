export interface TodoItem {
  todos: [
    {
      id: number;
      userId: number;
      goalId: number;
      title: string;
      done: boolean;
      linkUrl: string | null;
      source: 'manual' | 'github_issue' | 'github_pr';
      sourceItemId: number | null;
      createdAt: string;
      updatedAt: string;
      goal: {
        id: number;
        title: string;
      };
      noteIds: number[];
    },
  ];
  nextCursor: number;
  totalCount: number;
}
