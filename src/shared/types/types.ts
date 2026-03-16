export type DropdownItemType = {
  value: string;
  label: string;
};

export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

export interface TaskCardProps {
  todo: Todo;
  starred?: boolean;
  hasGithubLink?: boolean;
  hasSetting?: boolean;
  onToggle?: (id: string) => void;
  onMenuOpen?: (id: string) => void;
  onStarToggle?: (id: string) => void;
}

export interface TagProps {
  string: string;
  onClose?: () => void;
  variant?: 'green' | 'orange' | 'purple';
  className?: string;
}
