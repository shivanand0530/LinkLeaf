import Header from "../components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { motion } from "framer-motion";
import { Link as LinkIcon, Edit } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { ThemeProvider } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import AddLink from "../components/AddLink";
import EditLink from "../components/EditLink";
import LinkCard from "../components/LinkCard";
import AddFolder from "./../components/Folder";
// import type { Folder } from "../libs/Folders";
import { useLinks } from "../hooks/useLinks";
import { useFolders } from "../hooks/useFolders";


type Id = string;

const LS_KEYS = {
  folders: "simple.folders",
  links: "simple.links",
  theme: "simple.theme",
} as const;

export default function MainContent() {
  // Theme
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const stored =
      (localStorage.getItem(LS_KEYS.theme) as "light" | "dark" | null) || null;
    if (stored) setTheme(stored);
    else {
      const prefersDark =
        window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(LS_KEYS.theme, theme);
  }, [theme]);

  // Data
  // Get folders and links from Redux
  const { folders, fetchFolders, updateFolder: updateFolderRedux } = useFolders();
  const { links: reduxLinks, fetchLinks, deleteLink, togglePin } = useLinks();

  // Fetch links on mount
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Convert Redux links to LinkDoc format for compatibility
  const links = useMemo(() => {
    return reduxLinks.map(link => ({
      _id: link.id,
      url: link.url,
      title: link.title,
      description: link.description || undefined,
      folderId: link.folder_id || undefined,
      isPinned: link.is_pinned || false,
      favicon: link.favicon_url || undefined,
      _creationTime: new Date(link.created_at).getTime(),
    }));
  }, [reduxLinks]);

  // Fetch folders on mount
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Folder update handler for the AddFolder component
  const handleFolderUpdate = async (folderId: string, folderData: { name: string; color?: string }) => {
    try {
      const result = await updateFolderRedux(folderId, folderData);
      if (result.success) {
        // Folder updated successfully, Redux will handle state update
        return true;
      } else {
        console.error("Failed to update folder:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Error updating folder:", error);
      return false;
    }
  };

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<Id | "all" | "pinned">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">(
    "newest"
  );
  const [showAddLink, setShowAddLink] = useState(false);

  // Edit states
  const [editingLink, setEditingLink] = useState<null | {
    id: Id;
    url: string;
    title: string;
    description?: string;
    folderId?: Id;
  }>(null);

  const [showEditFolder, setShowEditFolder] = useState(false);
  // const [, setEditFolderColor] = useState<string | undefined>(undefined);

  // Derived
  const pinnedLinks = useMemo(() => links.filter((l) => l.isPinned), [links]);
  const selectedFolderObj = useMemo(
    () => {
      const result = selectedFolder !== "all" && selectedFolder !== "pinned"
        ? folders.find((f) => f.id === selectedFolder)
        : undefined;
      return result;
    },
    [selectedFolder, folders]
  );

  const displayLinks = useMemo(() => {
    let list = links.slice();
    if (selectedFolder === "pinned") list = list.filter((l) => l.isPinned);
    if (selectedFolder !== "all" && selectedFolder !== "pinned")
      list = list.filter((l) => l.folderId === selectedFolder);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          (l.description && l.description.toLowerCase().includes(q))
      );
    }
    if (selectedFolder === "all") {
      switch (sortBy) {
        case "newest":
          list.sort((a, b) => b._creationTime - a._creationTime);
          break;
        case "oldest":
          list.sort((a, b) => a._creationTime - b._creationTime);
          break;
        case "az":
          list.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "za":
          list.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
    }
    return list;
  }, [links, selectedFolder, searchQuery, sortBy]);



  const handleDeleteLink = async (id: Id) => {
    try {
      await deleteLink(id);
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const handleTogglePin = async (id: Id) => {
    try {
      await togglePin(id);
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const folderCounts = useMemo(() => {
    const map = new Map<Id, number>();
    for (const f of folders) map.set(f._id, 0);
    for (const l of links) {
      if (l.folderId) map.set(l.folderId, (map.get(l.folderId) || 0) + 1);
    }
    return map;
  }, [folders, links]);

  return (
    <ThemeProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background"
      >
        {/* Header */}
        <Header />

        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 border-r border-border pr-6">
              <div className="space-y-6">
                {/* Create Folder + Search + Add Link */}
                <div className="space-y-3">
                  <Sidebar
                    selectedFolder={selectedFolder}
                    pinnedCount={pinnedLinks.length}
                    linkcount={links.length}
                    folderCounts={folderCounts}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onFolderSelect={setSelectedFolder}
                    onShowAddLink={() => setShowAddLink(true)}
                  />

                </div>
              </div>
            </div>

            {/* Main */}
            <div className="lg:col-span-3 pl-2 lg:pl-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-4">
                    
                      <div className="w-56">
                        <Select
                          value={sortBy}
                          onValueChange={(v) => setSortBy(v as typeof sortBy)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="az">Title A-Z</SelectItem>
                            <SelectItem value="za">Title Z-A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                  </div>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center gap-2">
                  {/* Edit Folder Button - Only shown when a specific folder is selected */}
                  {selectedFolderObj && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditFolder(true)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:highlight"
                    >
                      <Edit className="h-4 w-4 text-muted-foreground hover:highlight" />
                      Edit Folder
                    </Button>
                  )}

                  {/* Add Link Button */}
                  {/* <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowAddLink(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Link
                  </Button> */}
                </div>

                {/* Add new link dialog */}
                <AddLink
                  isOpen={showAddLink}
                  onOpenChange={setShowAddLink}
                />
              </div>

              {/* Links */}
              <div className="overflow-y-auto max-h-[calc(100vh-260px)] pr-1 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LinkCard
                    links={displayLinks}
                    setEditingLink={(link) => {
                      const editData = {
                        id: link._id,
                        url: link.url,
                        title: link.title,
                        description: link.description,
                        folderId: link.folderId,
                      };
                      setEditingLink(editData);
                    }}
                    handleTogglePin={handleTogglePin}
                    handleDeleteLink={handleDeleteLink}
                  />
                </div>

                {displayLinks.length === 0 && (
                  <div className="text-center py-12">
                    <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No links found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "Try adjusting your search"
                        : "Start by adding your first link"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Link Dialog */}
        {editingLink && (
          <EditLink
            open={!!editingLink}
            onOpenChange={(open) => {
              if (!open) setEditingLink(null);
            }}
            initialData={editingLink}
          />
        )}

        {/* Edit Folder Dialog */}
        <AddFolder
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderUpdate={handleFolderUpdate}
          onSelectedFolderChange={setSelectedFolder}
          open={showEditFolder}
          onOpenChange={setShowEditFolder}
        />
      </motion.div>
    </ThemeProvider>
  );
}
