import { useState, useEffect } from "react"
import { supabase } from "../libs/supabase"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "../hooks/useAuth"
import { Alert, AlertDescription } from "./ui/alert"
import { Loader2, Camera } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setName(user?.user_metadata?.full_name || "")
      setMessage(null)
    }
  }, [open, user?.user_metadata?.full_name])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update user metadata with new avatar URL
      const { error: updateError } = await updateProfile({ 
        full_name: user?.user_metadata?.full_name,
        avatar_url: publicUrl 
      })

      if (updateError) throw updateError
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const { error } = await updateProfile({ full_name: name.trim() })
      if (error) throw error
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      // Close dialog after success
      onOpenChange(false)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {message && (
            <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="picture"
                className="absolute bottom-0 right-0 p-1 rounded-full bg-primary hover:bg-primary/90 cursor-pointer"
              >
                <Camera className="h-4 w-4 text-primary-foreground" />
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="flex items-center justify-center">
            
            <Button
              onClick={handleUpdateProfile}
              disabled={isLoading || !name.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog