import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { LinkService, type LinkFormData } from '../../services/linkService'
import type { Link } from '../../libs/links'
import type { RootState } from '../store'

// Define the shape of our links state
interface LinksState {
  links: Link[]
  loading: boolean
  error: string | null
  currentLink: Link | null
}

// Initial state
const initialState: LinksState = {
  links: [],
  loading: false,
  error: null,
  currentLink: null
}

// Async thunks for link operations
export const fetchLinks = createAsyncThunk(
  'links/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const links = await LinkService.getLinks()
      return links
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const createLink = createAsyncThunk(
  'links/create',
  async (linkData: LinkFormData, { rejectWithValue }) => {
    try {
      const newLink = await LinkService.addLink(linkData)
      return newLink
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateLink = createAsyncThunk(
  'links/update',
  async ({ id, linkData }: { id: string; linkData: Partial<LinkFormData> }, { rejectWithValue }) => {
    try {
      const updatedLink = await LinkService.updateLink(id, linkData)
      return updatedLink
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteLink = createAsyncThunk(
  'links/delete',
  async (linkId: string, { rejectWithValue }) => {
    try {
      await LinkService.deleteLink(linkId)
      return linkId
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const togglePinLink = createAsyncThunk(
  'links/togglePin',
  async (linkId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const link = state.links.links.find(l => l.id === linkId)
      if (!link) throw new Error('Link not found')
      
      const updatedLink = await LinkService.updateLink(linkId, { 
        is_pinned: !link.is_pinned 
      })
      return updatedLink
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchLinkById = createAsyncThunk(
  'links/fetchById',
  async (linkId: string, { rejectWithValue }) => {
    try {
      const link = await LinkService.getLinkById(linkId)
      return link
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Create the slice
const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentLink: (state, action) => {
      state.currentLink = action.payload
    },
    clearLinks: (state) => {
      state.links = []
      state.currentLink = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch links
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.loading = false
        state.links = action.payload
        state.error = null
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Create link
      .addCase(createLink.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.loading = false
        state.links.unshift(action.payload) // Add to beginning of array
        state.error = null
      })
      .addCase(createLink.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update link
      .addCase(updateLink.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateLink.fulfilled, (state, action) => {
        state.loading = false
        const index = state.links.findIndex(link => link.id === action.payload.id)
        if (index !== -1) {
          state.links[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateLink.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Delete link
      .addCase(deleteLink.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.loading = false
        state.links = state.links.filter(link => link.id !== action.payload)
        state.error = null
      })
      .addCase(deleteLink.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Fetch link by ID
      .addCase(fetchLinkById.fulfilled, (state, action) => {
        state.currentLink = action.payload
      })
      
      // Toggle pin link
      .addCase(togglePinLink.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(togglePinLink.fulfilled, (state, action) => {
        state.loading = false
        const index = state.links.findIndex(link => link.id === action.payload.id)
        if (index !== -1) {
          state.links[index] = action.payload
        }
        state.error = null
      })
      .addCase(togglePinLink.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

// Export actions
export const { clearError, setCurrentLink, clearLinks } = linksSlice.actions

// Selectors
export const selectAllLinks = (state: RootState) => state.links.links
export const selectLinksLoading = (state: RootState) => state.links.loading
export const selectLinksError = (state: RootState) => state.links.error
export const selectCurrentLink = (state: RootState) => state.links.currentLink

// Memoized selectors
export const selectPinnedLinks = createSelector(
  [selectAllLinks],
  (links: Link[]) => links.filter((link: Link) => link.is_pinned)
)

export const selectUnpinnedLinks = createSelector(
  [selectAllLinks],
  (links: Link[]) => links.filter((link: Link) => !link.is_pinned)
)

export const selectLinksByFolder = createSelector(
  [selectAllLinks, (_: RootState, folderId: string) => folderId],
  (links: Link[], folderId: string) => links.filter((link: Link) => link.folder_id === folderId)
)

export const selectLinksCount = createSelector(
  [selectAllLinks],
  (links) => links.length
)

export const selectPinnedLinksCount = createSelector(
  [selectPinnedLinks],
  (pinnedLinks) => pinnedLinks.length
)

// Export the reducer
export default linksSlice.reducer
