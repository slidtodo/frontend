export type DropdownItemType = {
  value: string;
  label: string;
};

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  star: boolean;
};

export interface TagProps {
  string: string;
  onClose?: () => void;
  variant?: 'green' | 'orange' | 'purple';
  className?: string;
}

export interface Note {
  id: number;
  title: string;
  todoId: number;
  createdAt: string;
}

export interface TodoCreateForm {
  title: string;
  goalId: number;
  dueDate: string | null;
  linkUrl: string | null;
  imageUrl: string | null;
  tags: string[];
}

export interface TodoEditForm extends TodoCreateForm {
  done: boolean;
}
