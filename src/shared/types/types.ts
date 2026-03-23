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