import type { Id } from '.';

export type EditLinkFormState = {
  id: Id;
  url: string;
  title: string;
  description?: string;
  folderId?: Id;
} | null;

export type FormState = {
  showAddLink: boolean;
  showAddFolder: boolean;
  showEditFolder: boolean;
  newFolderColor?: string;
  editFolderColor?: string;
  editingLink: EditLinkFormState;
};

export type FolderFormData = {
  name: string;
  color?: string;
};

export type LinkFormData = {
  url: string;
  title: string;
  description?: string;
  folderId?: Id;
};
