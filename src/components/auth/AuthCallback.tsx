import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../libs/supabase'

export const AuthCallback = () => {
  const navigate = useNavigate()

  // Simple log to verify component mounts
  console.log('AuthCallback component mounted!')
  
  // Immediate alert to test if component loads
  if (typeof window !== 'undefined') {
    alert('AuthCallback component loaded!')
  }
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Processing OAuth callback...')
        console.log('Current URL:', window.location.href)
        
        // Get the hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        console.log('Access token present:', !!accessToken)
        console.log('Refresh token present:', !!refreshToken)

        if (accessToken) {
          console.log('Setting session with tokens...')
          
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          })

          if (error) {
            console.error('Auth callback error:', error)
            alert(`Auth error: ${error.message}`)
            navigate('/')
          } else if (data.session) {
            console.log('Authentication successful, session:', data.session)
            console.log('User:', data.session.user)
            
            // Wait a moment for the auth state to propagate
            setTimeout(() => {
              navigate('/main')
            }, 1000)
          } else {
            console.log('No session created')
            navigate('/')
          }
        } else {
          console.log('No access token found, redirecting to home')
          navigate('/')
        }
      } catch (error) {
        console.error('Failed to handle auth callback:', error)
        alert(`Callback error: ${error}`)
        navigate('/')
      }
    }

    // Add a small delay to ensure the component is mounted
    const timer = setTimeout(handleCallback, 100)
    
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg font-bold">AUTH CALLBACK COMPONENT LOADED!</p>
        <p className="mt-2 text-sm">Processing OAuth tokens...</p>
        <p className="mt-2 text-xs text-gray-500">Check console for logs</p>
      </div>
    </div>
  )
}