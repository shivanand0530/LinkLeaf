import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useFolders } from "../hooks/useFolders";
import { useLinks } from "../hooks/useLinks";

interface AddLinkProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddLink({ isOpen, onOpenChange }: AddLinkProps) {
  // Get folders and links from Redux
  const { folders, fetchFolders } = useFolders();
  const { createLink } = useLinks();
  
  // Local state for form fields
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  // Fetch folders when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchFolders();
    }
  }, [isOpen, fetchFolders]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFolderId("");
    }
  }, [isOpen]);

 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const url = (form.get("url") as string)?.trim();
    const title = (form.get("title") as string)?.trim();
    const description = ((form.get("description") as string) || "").trim() || undefined;
    const folder_id = selectedFolderId || undefined;

    if (!url || !title) return;

    try {
      const result = await createLink({
        url,
        title,
        description,
        folder_id,
      });

      if (result.success) {
        onOpenChange(false);
        (e.target as HTMLFormElement).reset();
        setSelectedFolderId("");
      } else {
        console.error("Failed to create link:", result.error);
      }
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="gap-2">
            <Label htmlFor="url">URL</Label>
            <Input className= "padding:2px"id="url" name="url" type="url" required placeholder="https://example.com" />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="Link title" />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" name="description" placeholder="Brief description" />
          </div>
          <div>
            <Label htmlFor="folderId">Folder (optional)</Label>
            <Select 
              value={selectedFolderId} 
              onValueChange={(value) => {
                setSelectedFolderId(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={folders.length === 0 ? "No folders available" : "Select folder"} />
              </SelectTrigger>
              <SelectContent>
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
           
          </div>
          <Button type="submit" className="w-full">Add Link</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}