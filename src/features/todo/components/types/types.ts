export type ImageType = {
  file: File;
  previewUrl: string;
};

export interface TodoCreateForm {
  title: string;
  goalId: number;
  dueDate: string | undefined;
  linkUrl: string | undefined;
  imageUrl: string | undefined;
  tags: string[];
}

export interface TodoEditForm extends TodoCreateForm {
  id: number;
  done: boolean;
}
