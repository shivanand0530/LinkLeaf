import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Folder } from '../../libs/Folders'
import { FolderService } from '../../services/FolderService'

// Folder state interface
export interface FoldersState {
  folders: Folder[]
  loading: boolean
  error: string | null
  currentFolder: Folder | null
}

// Initial state
const initialState: FoldersState = {
  folders: [],
  loading: false,
  error: null,
  currentFolder: null,
}

// Async thunks for folder operations
export const fetchFolders = createAsyncThunk(
  'folders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const folders = await FolderService.getAllFolders()
      return folders
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const createFolder = createAsyncThunk(
  'folders/create',
  async (folderData: { name: string; color?: string }, { rejectWithValue }) => {
    try {
      const newFolder = await FolderService.addFolder(folderData)
      return newFolder
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateFolder = createAsyncThunk(
  'folders/update',
  async ({ id, folderData }: { id: string; folderData: { name: string; color?: string } }, { rejectWithValue }) => {
    try {
      const updatedFolder = await FolderService.updateFolder(id, folderData)
      return updatedFolder
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteFolder = createAsyncThunk(
  'folders/delete',
  async (folderId: string, { rejectWithValue }) => {
    try {
      await FolderService.deleteFolder(folderId)
      return folderId
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchFolderById = createAsyncThunk(
  'folders/fetchById',
  async (folderId: string, { rejectWithValue }) => {
    try {
      const folder = await FolderService.getFolderById(folderId)
      return folder
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Folders slice
const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentFolder: (state, action: PayloadAction<Folder | null>) => {
      state.currentFolder = action.payload
    },
    clearFolders: (state) => {
      state.folders = []
      state.currentFolder = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all folders
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.loading = false
        state.folders = action.payload
        state.error = null
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create folder
      .addCase(createFolder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.loading = false
        state.folders.unshift(action.payload) // Add to beginning (newest first)
        state.error = null
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update folder
      .addCase(updateFolder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        state.loading = false
        const index = state.folders.findIndex(folder => folder.id === action.payload.id)
        if (index !== -1) {
          state.folders[index] = action.payload
        }
        // Update current folder if it's the one being updated
        if (state.currentFolder && state.currentFolder.id === action.payload.id) {
          state.currentFolder = action.payload
        }
        state.error = null
      })
      .addCase(updateFolder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete folder
      .addCase(deleteFolder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.loading = false
        state.folders = state.folders.filter(folder => folder.id !== action.payload)
        // Clear current folder if it's the one being deleted
        if (state.currentFolder && state.currentFolder.id === action.payload) {
          state.currentFolder = null
        }
        state.error = null
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch folder by ID
      .addCase(fetchFolderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFolderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentFolder = action.payload
        // Also update in folders array if it exists
        const index = state.folders.findIndex(folder => folder.id === action.payload.id)
        if (index !== -1) {
          state.folders[index] = action.payload
        }
        state.error = null
      })
      .addCase(fetchFolderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentFolder, clearFolders, setLoading } = foldersSlice.actions

// Selectors
export const selectAllFolders = (state: { folders: FoldersState }) => state.folders.folders
export const selectFoldersLoading = (state: { folders: FoldersState }) => state.folders.loading
export const selectFoldersError = (state: { folders: FoldersState }) => state.folders.error
export const selectCurrentFolder = (state: { folders: FoldersState }) => state.folders.currentFolder
export const selectFolderById = (folderId: string) => (state: { folders: FoldersState }) => 
  state.folders.folders.find(folder => folder.id === folderId)

export default foldersSlice.reducer
