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

export interface Note {
  id: number;
  title: string;
  todoId: number;
  createdAt: string;
}

export type TodoOptions = 'ALL' | 'TO DO' | 'DONE';
