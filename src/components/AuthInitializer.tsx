import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/useRedux'
import { initializeAuth, setUser } from '../store/slices/authSlice'
import { fetchFolders, clearFolders } from '../store/slices/foldersSlice'
import { supabase } from '../libs/supabase'

interface AuthInitializerProps {
  children: React.ReactNode
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    let mounted = true

    const handleOAuthCallback = async () => {
      // Check if we have OAuth tokens in the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      
      if (accessToken) {
        try {
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          })
          
          if (error) {
            console.error('Error setting OAuth session:', error)
          } else if (data.session) {
            console.log('OAuth session set successfully')
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname)
            return true
          }
        } catch (error) {
          console.error('Failed to handle OAuth callback:', error)
        }
      }
      return false
    }

    const initializeApp = async () => {
      try {
        // First handle OAuth callback if present
        await handleOAuthCallback()
        
        if (!mounted) return

        // Then initialize auth state
        const result = await dispatch(initializeAuth())
        
        // If user is authenticated after initialization, fetch their folders
        if (initializeAuth.fulfilled.match(result) && result.payload) {
          dispatch(fetchFolders())
        }
      } catch (error) {
        console.error('Error initializing app:', error)
      }
    }
    
    initializeApp()

    return () => {
      mounted = false
    }
  }, [dispatch])

  useEffect(() => {

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        dispatch(setUser(session?.user ?? null))
        
        // Fetch user folders when authenticated, clear when logged out
        if (session?.user) {
          dispatch(fetchFolders())
        } else {
          dispatch(clearFolders())
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])

  // Show loading spinner while initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}