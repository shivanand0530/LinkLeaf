import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../libs/supabase'

export const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken) {
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          })

          if (error) {
            console.error('Auth callback error:', error)
            navigate('/')
          } else if (data.session) {
            // Wait a moment for the auth state to propagate
            setTimeout(() => {
              navigate('/main')
            }, 500)
          } else {
            navigate('/')
          }
        } else {
          navigate('/')
        }
      } catch (error) {
        console.error('Failed to handle auth callback:', error)
        navigate('/')
      }
    }

    // Add a small delay to ensure the component is mounted
    const timer = setTimeout(handleCallback, 100)
    
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Completing sign in...</p>
      </div>
    </div>
  )
}