import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";
import { useFolders } from "../hooks/useFolders";
import { useLinks } from "../hooks/useLinks";

interface EditLinkProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    id: string;
    url: string;
    title: string;
    description?: string;
    folderId?: string;
  };
}

export default function EditLink({ open, onOpenChange, initialData }: EditLinkProps) {
 
  // Get folders and links from Redux
  const { folders, fetchFolders } = useFolders();
  const { updateLink } = useLinks();
  
  // Local state for form fields
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  // Fetch folders when dialog opens
  useEffect(() => {
    if (open) {
      fetchFolders();
    }
  }, [open, fetchFolders]);

  // Initialize form with existing data when dialog opens
  useEffect(() => {
    if (open && initialData) {
      // Convert from MainContent format (folderId) to component state
      setSelectedFolderId(initialData.folderId || "no-folder");
    }
  }, [open, initialData]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedFolderId("no-folder");
    }
  }, [open]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialData) return;
    
    const form = new FormData(e.currentTarget);
    const url = (form.get("url") as string)?.trim();
    const title = (form.get("title") as string)?.trim();
    const description = ((form.get("description") as string) || "").trim() || undefined;
    const folder_id = selectedFolderId === "no-folder" ? undefined : selectedFolderId || undefined;

    if (!url || !title) return;

    try {
      const result = await updateLink(initialData.id, {
        url,
        title,
        description,
        folder_id,
      });

      if (result.success) {
        onOpenChange(false);
        setSelectedFolderId("no-folder");
      } else {
        console.error("Failed to update link:", result.error);
      }
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>
        {!initialData ? (
          <div className="space-y-4">
            <p>Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" type="url" required defaultValue={initialData.url} />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={initialData.title} />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" name="description" defaultValue={initialData.description || ""} />
            </div>
            <div>
              <Label htmlFor="folder">Folder (Optional)</Label>
              <Select 
                value={selectedFolderId} 
                onValueChange={(value) => {
                  setSelectedFolderId(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={folders.length === 0 ? "No folders available" : "Select a folder..."} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-folder">No Folder</SelectItem>
                  {folders.length === 0 ? (
                    <SelectItem value="no-folders" disabled>
                      No folders created yet
                    </SelectItem>
                  ) : (
                    folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {/* Debug info */}
              {/* <div className="text-xs text-gray-500 mt-1">
                Debug: {folders.length} folders available, selected: {selectedFolderId || "none"}
              </div> */}
            </div>
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}