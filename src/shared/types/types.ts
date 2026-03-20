import { TodoItem } from '@/shared/types/api';

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
  todo: TodoItem;
  starred?: boolean;
  onClick?: () => void;
  onToggle?: (id: number) => void;
  onStarToggle?: (id: number) => void;
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
