import { useState } from 'react'
import { useFolders } from '../hooks/useFolders'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface ReduxAddLinkProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    url: string
    title: string
    description?: string
    folderId?: string
  }) => void
}

export const ReduxAddLink = ({ isOpen, onOpenChange, onSubmit }: ReduxAddLinkProps) => {
  const { folders } = useFolders()
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    folderId: ''
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formData.url.trim() || !formData.title.trim()) return

    onSubmit({
      url: formData.url.trim(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      folderId: formData.folderId || undefined,
    })

    // Reset form
    setFormData({
      url: '',
      title: '',
      description: '',
      folderId: ''
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter link title..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="folder">Folder (Optional)</Label>
            <Select 
              value={formData.folderId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, folderId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a folder..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Folder</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full">
            Add Link
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}