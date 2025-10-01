export type Id = string;

export type Folder = {
  _id: Id;
  id: Id;
  user_id: string;
  name: string;
  color?: string | null;
  created_at: string;
  updated_at: string;
};

export type LinkDoc = {
  _id: Id;
  url: string;
  title: string;
  description?: string;
  folderId?: Id;
  isPinned: boolean;
  favicon?: string;
  _creationTime: number;
};

export type SortOption = "newest" | "oldest" | "az" | "za";
export type SelectedFolder = Id | "all" | "pinned";

export const LS_KEYS = {
  folders: "simple.folders",
  links: "simple.links",
} as const;

// State and form related types
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
  isPinned?: boolean;
};

// UI State types
export type UIState = {
  searchQuery: string;
  selectedFolder: SelectedFolder;
  sortBy: SortOption;
};

// Component Props
export type SidebarProps = {
  folders: Folder[];
  selectedFolder: SelectedFolder;
  pinnedCount: number;
  folderCounts: Map<Id, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFolderSelect: (folderId: SelectedFolder) => void;
  onDeleteFolder: (folderId: Id) => void;
  onAddFolder: (folder: Omit<Folder, "_id">) => void;
  onShowAddLink: () => void;
};

export type AddLinkProps = {
  folders: Folder[];
  onSubmit: (data: LinkFormData) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type EditLinkProps = {
  folders: Folder[];
  link: EditLinkFormState;
  onSubmit: (data: LinkFormData) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type LinkListProps = {
  links: LinkDoc[];
  folders: Folder[];
  selectedFolder: SelectedFolder;
  sortBy: SortOption;
  searchQuery: string;
  onEditLink: (link: EditLinkFormState) => void;
  onDeleteLink: (id: Id) => void;
  onTogglePin: (id: Id) => void;
};