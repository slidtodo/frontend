import type { components } from '@/shared/types/api/schemas/api.types';

type TodoResponse = components['schemas']['TodoResponse'];
type GoalInfo = NonNullable<TodoResponse['goal']>;
type TagInfo = NonNullable<NonNullable<TodoResponse['tags']>[number]>;

export type TodoItem = Omit<TodoResponse, 'goal' | 'tags' | 'noteIds' | 'source'> & {
  goal: {
    id: GoalInfo['id'];
    title: GoalInfo['title'];
  };
  tags: Array<{
    id: TagInfo['id'];
    name: TagInfo['name'];
  }>;
  noteIds: number[];
  goalId?: number;
  fileUrl?: string | null;
  source?: TodoResponse['source'] | 'MANUAL' | 'GITHUB_ISSUE' | 'GITHUB_PR' | 'manual' | 'github_issue' | 'github_pr';
};
