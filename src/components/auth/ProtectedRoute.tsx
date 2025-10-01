import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useRedux'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAppSelector((state) => state.auth)

  if (loading) {
    // You could return a loading spinner here
    
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}