export type DropdownItemType = {
  value: string;
  label: string;
};

export interface TaskCardProps {
  id: string;
  text: string;
  checked?: boolean;
  starred?: boolean;
  hasGithubLink?: boolean;
  hasSetting?: boolean;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onMenuOpen?: (id: string) => void;
  onStarToggle?: (id: string) => void;
}
