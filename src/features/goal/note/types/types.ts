import { TodoResponse } from '@/lib/api/fetchTodos';
import { GoalDetailResponse } from '@/lib/api/fetchGoals';
import { Editor } from '@tiptap/react';

export interface NoteEditorProps {
  editor: Editor | null;
  title: string;
  onTitleChange: (value: string) => void;
  createdAt: string;
  linkUrl?: string | null;
  onLinkUrlChange?: (value: string | null) => void;
  goal?: GoalDetailResponse | null;
  todo?: TodoResponse | null;
}
