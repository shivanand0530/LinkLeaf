import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React from "react";
import { useState, useMemo } from "react";
import type { Folder, Id } from "../types";
import { FOLDER_COLORS } from "../utils/folderColors";

interface FolderProps {
    folders: Folder[];
    selectedFolder: Id | "all" | "pinned";
    onFoldersChange?: (folders: Folder[]) => void;
    onFolderUpdate?: (folderId: string, folderData: { name: string; color?: string }) => Promise<boolean>;
    onSelectedFolderChange: (id: Id | "all" | "pinned") => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const AddFolder = ({ folders, selectedFolder, onFoldersChange, onFolderUpdate, onSelectedFolderChange, open = false, onOpenChange }: FolderProps) => {
    const [editFolderColor, setEditFolderColor] = useState<string | undefined>(undefined);

    const selectedFolderObj = useMemo(
        () => (selectedFolder !== "all" && selectedFolder !== "pinned" 
            ? folders.find((f) => f.id === selectedFolder) 
            : undefined),
        [selectedFolder, folders]
    );

    const handleEditFolder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFolderObj) return;
        
        const form = new FormData(e.currentTarget);
        const name = (form.get("name") as string)?.trim();
        
        if (!name) return;
        
        const folderData = {
            name,
            color: editFolderColor || undefined
        };

        // Use Redux update function if available, otherwise fall back to localStorage approach
        if (onFolderUpdate) {
            const success = await onFolderUpdate(selectedFolderObj.id, folderData);
            if (success) {
                onOpenChange?.(false);
                onSelectedFolderChange(selectedFolderObj.id);
            }
        } else if (onFoldersChange) {
            // Legacy localStorage approach
            const updatedFolders = folders.map((f) =>
                f.id === selectedFolderObj.id 
                    ? { ...f, ...folderData } 
                    : f
            );
            onFoldersChange(updatedFolders);
            onOpenChange?.(false);
            onSelectedFolderChange(selectedFolderObj.id);
        }
    };

    return (
        <>
            {selectedFolderObj && (
                <Dialog
                    open={open}
                    onOpenChange={(isOpen) => {
                        onOpenChange?.(isOpen);
                        if (isOpen) setEditFolderColor(selectedFolderObj.color || undefined);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Folder</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditFolder} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Folder Name</Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    required
                                    defaultValue={selectedFolderObj.name}
                                />
                            </div>
                            <div>
                                <Label>Color</Label>
                                <div className="mt-2 flex items-center gap-3">
                                    {FOLDER_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            className="h-3 w-3 rounded-full border"
                                            style={{
                                                backgroundColor: c,
                                                boxShadow: editFolderColor === c ? "0 0 0 2px var(--ring)" : undefined,
                                            }}
                                            onClick={() => setEditFolderColor(c)}
                                            aria-label={`Choose color ${c}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" className="w-full">
                                Save Changes
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default AddFolder;
