import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './useRedux'
import { 
  signIn, 
  signUp, 
  signOut, 
  signInWithGoogle,
  resetUserPassword, 
  updatePassword, 
  updateProfile,
  clearError 
} from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await dispatch(signIn({ email, password }))
      return { error: signIn.rejected.match(result) ? result.payload : null }
    } catch (error: any) {
      return { error: error.message }
    }
  }, [dispatch])

  const handleSignUp = useCallback(async (email: string, password: string) => {
    try {
      const result = await dispatch(signUp({ email, password }))
      return { error: signUp.rejected.match(result) ? result.payload : null }
    } catch (error: any) {
      return { error: error.message }
    }
  }, [dispatch])

  const handleSignOut = useCallback(async () => {
    try {
      const result = await dispatch(signOut())
      return { error: signOut.rejected.match(result) ? result.payload : null }
    } catch (error: any) {
      return { error: error.message }
    }
  }, [dispatch])

  const handleResetPassword = useCallback(async (email: string) => {
    try {
      const result = await dispatch(resetUserPassword(email))
      return { error: resetUserPassword.rejected.match(result) ? result.payload : null }
    } catch (error: any) {
      return { error: error.message }
    }
  }, [dispatch])

  const handleUpdatePassword = useCallback(async (password: string) => {
    try {
      const result = await dispatch(updatePassword(password))
      return { error: updatePassword.rejected.match(result) ? result.payload : null }
    } catch (error: any) {
      return { error: error.message }
    }
  }, [dispatch])

  const handleUpdateProfile = useCallback(async (data: { full_name?: string; avatar_url?: string }) => {
    try {
      const result = await dispatch(updateProfile(data))
      return { error: updateProfile.rejected.match(result) ? result.payload : null }
    } catch (error: any) {
      return { error: error.message }
    }
  }, [dispatch])

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await dispatch(signInWithGoogle())
      return { error: signInWithGoogle.rejected.match(result) ? result.payload : null }
    } catch (error: any) {
      return { error: error.message }
    }
  }, [dispatch])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleGoogleSignIn,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    updateProfile: handleUpdateProfile,
    clearError: clearAuthError,
  }
}
