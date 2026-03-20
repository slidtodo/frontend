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

export interface TaskCardProps {
  todo: Todo;
  starred?: boolean;
  onToggle?: (id: string) => void;
  onStarToggle?: (id: string) => void;
  variant?: 'default' | 'orange';
}

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