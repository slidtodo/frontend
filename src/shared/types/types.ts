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
