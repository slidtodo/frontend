import type { components } from '@/shared/types/api/schemas/api.types';

type TodoResponse = components['schemas']['TodoResponse'];

export type TodoItem = Omit<
  TodoResponse,
  'id' | 'title' | 'done' | 'favorite' | 'goal' | 'tags' | 'noteIds' | 'linkUrl' | 'imageUrl' | 'dueDate' | 'source'
> & {
  id: number;
  title: string;
  done: boolean;
  favorite: boolean;
  dueDate: string | null;
  linkUrl: string | null;
  imageUrl?: string | null;
  goal: {
    id: number;
    title: string;
  };
  tags: Array<{
    id: number;
    name: string;
  }>;
  noteIds: number[];
  goalId?: number;
  fileUrl?: string | null;
  source?: TodoResponse['source'] | 'MANUAL' | 'GITHUB_ISSUE' | 'GITHUB_PR' | 'manual' | 'github_issue' | 'github_pr';
};
