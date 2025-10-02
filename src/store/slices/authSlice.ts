import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { UserType } from '../../libs/supabase'
import { 
  signInUser, 
  signUpUser, 
  signOutUser, 
  resetPassword,
  supabase
} from '../../libs/supabase'

// Auth state interface
export interface AuthState {
  user: UserType | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
}

// Async thunks for auth operations
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await signInUser(email, password)
      if (error) {
        return rejectWithValue(error.message)
      }
      return data.user
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await signUpUser(email, password)
      if (error) {
        return rejectWithValue(error.message)
      }
      return data.user
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) {
        return rejectWithValue(error.message)
      }
      // Note: OAuth will redirect, so we don't return user data here
      return null
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await signOutUser()
      if (error) {
        return rejectWithValue(error.message)
      }
      return null
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const resetUserPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await resetPassword(email)
      if (error) {
        return rejectWithValue(error.message)
      }
      return email
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (password: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        return rejectWithValue(error.message)
      }
      return true
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: { full_name?: string; avatar_url?: string }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: data
      })
      if (error) {
        return rejectWithValue(error.message)
      }
      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        return rejectWithValue(error.message)
      }
      return session?.user || null
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.error = null
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.isAuthenticated = false
      })

      // Sign in
      .addCase(signIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.isAuthenticated = false
      })

      // Sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.error = null
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Sign in with Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signInWithGoogle.fulfilled, (state) => {
        state.loading = false
        state.error = null
        // User will be set via auth state change listener
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Sign out
      .addCase(signOut.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Reset password
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        if (state.user) {
          state.user.user_metadata = {
            ...state.user.user_metadata,
            ...action.payload
          }
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setUser, setLoading } = authSlice.actions
export default authSlice.reducer
