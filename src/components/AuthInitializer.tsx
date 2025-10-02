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

    const initializeApp = async () => {
      try {
        // Let Supabase handle any OAuth callback automatically
        const result = await dispatch(initializeAuth())
        
        if (!mounted) return

        // Clean up URL hash if it contains auth tokens
        if (window.location.hash && window.location.hash.includes('access_token')) {
          window.history.replaceState({}, document.title, window.location.pathname)
        }
        
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