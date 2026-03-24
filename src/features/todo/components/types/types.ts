export type ImageType = {
  file: File;
  previewUrl: string;
};

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
