import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useRedux'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAppSelector((state) => state.auth)
  const [isProcessingAuth, setIsProcessingAuth] = useState(false)

  useEffect(() => {
    // If there's an auth callback in the URL, give it time to process
    if (window.location.hash && window.location.hash.includes('access_token')) {
      setIsProcessingAuth(true)
      // Give AuthInitializer time to process the tokens
      const timer = setTimeout(() => {
        setIsProcessingAuth(false)
      }, 3000) // 3 second grace period

      return () => clearTimeout(timer)
    }
  }, [])

  if (loading || isProcessingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}