import { useEffect } from 'react'
import { useFolders } from '../hooks/useFolders'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { FolderPlus, FolderIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ReduxFolderListProps {
  selectedFolder: string | "all" | "pinned"
  onFolderSelect: (folderId: string | "all" | "pinned") => void
  folderCounts?: Map<string, number>
}

export const ReduxFolderList = ({ selectedFolder, onFolderSelect, folderCounts }: ReduxFolderListProps) => {
  const { folders, loading, error, createFolder, deleteFolder, fetchFolders } = useFolders()
  const [showAddFolder, setShowAddFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  // Fetch folders on mount
  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    const result = await createFolder({ name: newFolderName.trim() })
    if (result.success) {
      setNewFolderName('')
      setShowAddFolder(false)
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (confirm('Are you sure you want to delete this folder? All links in this folder will be moved to "All".')) {
      const result = await deleteFolder(folderId)
      if (result.success && selectedFolder === folderId) {
        onFolderSelect('all')
      }
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading folders...</div>
  }

  if (error) {
    return <div className="text-sm text-red-500">Error loading folders: {error}</div>
  }

  return (
    <div className="space-y-3">
      {/* Create Folder Button */}
      <Dialog open={showAddFolder} onOpenChange={setShowAddFolder}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateFolder} className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name..."
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Folder'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Folder List */}
      <div className="space-y-2">
        {/* Special folders */}
        <Button
          variant={selectedFolder === 'all' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onFolderSelect('all')}
        >
          <FolderIcon className="h-4 w-4 mr-2" />
          All Links
          {folderCounts && (
            <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">
              {Array.from(folderCounts.values()).reduce((a, b) => a + b, 0)}
            </span>
          )}
        </Button>
        
        <Button
          variant={selectedFolder === 'pinned' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onFolderSelect('pinned')}
        >
          <FolderIcon className="h-4 w-4 mr-2" />
          Pinned
          {folderCounts && (
            <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">
              {/* You'll need to pass pinned count separately */}
              0
            </span>
          )}
        </Button>

        {/* User folders */}
        {folders.map((folder) => (
          <div key={folder.id} className="flex items-center gap-1">
            <Button
              variant={selectedFolder === folder.id ? 'default' : 'ghost'}
              className="flex-1 justify-start"
              onClick={() => onFolderSelect(folder.id)}
            >
              <FolderIcon className="h-4 w-4 mr-2" />
              {folder.name}
              {folderCounts && folderCounts.has(folder.id) && (
                <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">
                  {folderCounts.get(folder.id)}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDeleteFolder(folder.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {folders.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4">
            No folders yet. Create one to organize your links!
          </div>
        )}
      </div>
    </div>
  )
}