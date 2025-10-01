
import { LinkIcon, Moon, Sun } from "lucide-react"
import { Button } from "../components/ui/button"
// import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../hooks/useAuth"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ProfileDialog from "./ProfileDialog"
import { useState } from "react"

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  
  return (
   <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LinkIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold tracking-tight">LinkLeaf</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                // onClick={() => useTheme(theme === "dark" ? "light" : "dark")}
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                className="flex items-center gap-2"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {/* <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span> */}
              </Button>

               { user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback>
                            {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                             user.email?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {user.user_metadata?.full_name || user.email?.split("@")[0]?.replace(/[0-9]/g, "").toLocaleUpperCase()}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setShowProfile(true)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ProfileDialog 
                    open={showProfile} 
                    onOpenChange={setShowProfile} 
                  />
                </>
              ) : (
                !loading && (
                  <Button variant="outline" onClick={() => navigate("/signin")}>
                    Sign In
                  </Button>
              ))}
            </div>


          </div>
        </div>
      </header>
  )
}

export default Header;
