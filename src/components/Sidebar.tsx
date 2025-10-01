import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FolderPlus, Search, Plus, Star, Trash2, FolderIcon, Inbox } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState, useEffect } from "react";
import { useFolders } from "../hooks/useFolders";
import { getFolderColor, FOLDER_COLORS } from "../utils/folderColors";



type SelectedFolder = string | "all" | "pinned";

interface SidebarProps {
  selectedFolder: SelectedFolder;
  pinnedCount: number;
  linkcount: number;
  folderCounts: Map<string, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFolderSelect: (folder: SelectedFolder) => void;
  onShowAddLink: () => void;
}

export default function Sidebar({
  selectedFolder,
  pinnedCount,
  folderCounts,
  linkcount,
  searchQuery,
  onSearchChange,
  onFolderSelect,
  onShowAddLink,
}: SidebarProps) {
  // Redux hooks
  const { folders, createFolder, deleteFolder: deleteFolderRedux, fetchFolders } = useFolders();
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderColor, setNewFolderColor] = useState<string | undefined>(undefined);
  const [folderToDelete, setFolderToDelete] = useState<{id: string; name: string} | null>(null);

  // Fetch folders on mount
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleAddFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string)?.trim();
    if (!name) return;

    try {
      const result = await createFolder({ 
        name,
        color: newFolderColor
      });
      
     
      
      if (result.success) {
        setNewFolderColor(undefined);
        setShowAddFolder(false);
        (e.target as HTMLFormElement).reset();
      } else {
        console.error('Failed to create folder:', result.error);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleDeleteFolder = (id: string, folderName: string) => {
    setFolderToDelete({ id, name: folderName });
  };

  const confirmDeleteFolder = async () => {
    if (!folderToDelete) return;
    
    try {
      const result = await deleteFolderRedux(folderToDelete.id);
      if (result.success) {
        if (selectedFolder === folderToDelete.id) {
          onFolderSelect("all");
        }
        setFolderToDelete(null);
      } else {
        console.error("Failed to delete folder:", result.error);
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  return (
    <div className="space-y-6">

      {/* Create Folder + Search + Add Link */}
       <div className="pt-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={onShowAddLink}
              aria-label="Add Link"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      <div className="space-y-3">
        <Dialog open={showAddFolder} onOpenChange={setShowAddFolder}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddFolder} className="space-y-4">
              <div>
                <Label htmlFor="name">Folder Name</Label>
                <Input id="name" name="name" required placeholder="Folder name" />
              </div>
              <div>
                <Label>Color</Label>
                <div className="mt-2 flex items-center gap-3">
                  {FOLDER_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="h-3 w-3 rounded-full border"
                      style={{ backgroundColor: c, boxShadow: newFolderColor === c ? "0 0 0 2px var(--ring)" : undefined }}
                      onClick={() => setNewFolderColor(c)}
                      aria-label={`Choose color ${c}`}
                    />
                  ))}
                </div>
                <input type="hidden" name="color" value={newFolderColor || ""} />
              </div>
              <Button type="submit" className="w-full">Create Folder</Button>
            </form>
          </DialogContent>
        </Dialog>

       
      </div>

      {/* Scrollable Folders List */}
      <div className="overflow-y-auto max-h[calc(100vh-280px)] pr-1 scrollbar-hide">
        <nav className="space-y-2">
          <Button
            variant={selectedFolder === "all" ? "secondary" : "ghost"}
            className="w-full justify-between"
            onClick={() => onFolderSelect("all")}
          >
            <span className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              All
            </span>
            <span className="text-xs text-muted-foreground">{linkcount}</span>
          </Button>
          <Button
            variant={selectedFolder === "pinned" ? "secondary" : "ghost"}
            className="w-full justify-between"
            onClick={() => onFolderSelect("pinned")}
          >
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Pinned
            </span>
            <span className="text-xs text-muted-foreground">{pinnedCount}</span>
          </Button>

          {folders.length > 0 && (
            <div className="pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">Folders</h3>
              {folders.map((folder) => (
                <div key={folder.id}>
                  <Button
                    variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                    className="relative group w-full justify-between pr-12"
                    onClick={() => onFolderSelect(folder.id)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        <FolderIcon className="h-4 w-4" style={{ color: folder.color || getFolderColor(folder.id) }} />
                      </span>
                      {folder.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{folderCounts.get(folder.id) || 0}</span>

                    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id, folder.name);
                        }}
                        aria-label="Delete folder"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Delete Folder Confirmation Dialog */}
      <AlertDialog open={!!folderToDelete} onOpenChange={() => setFolderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the folder "{folderToDelete?.name}"? This action cannot be undone.
              All links in this folder will be moved to 'All'.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFolder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
  }