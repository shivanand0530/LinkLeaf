import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './useRedux'
import type { LinkFormData } from '../services/linkService'
import { 
  fetchLinks,
  createLink,
  updateLink,
  deleteLink,
  fetchLinkById,
  togglePinLink,
  clearError,
  setCurrentLink,
  clearLinks,
  selectAllLinks,
  selectLinksLoading,
  selectLinksError,
  selectCurrentLink,
  selectPinnedLinks,
  selectUnpinnedLinks,
  selectLinksByFolder,
  selectLinksCount,
  selectPinnedLinksCount
} from '../store/slices/linksSlice'

export const useLinks = () => {
  const dispatch = useAppDispatch()
  const links = useAppSelector(selectAllLinks)
  const loading = useAppSelector(selectLinksLoading)
  const error = useAppSelector(selectLinksError)
  const currentLink = useAppSelector(selectCurrentLink)

  const handleFetchLinks = useCallback(async () => {
    try {
      const result = await dispatch(fetchLinks())
      return { success: fetchLinks.fulfilled.match(result), error: null }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const handleCreateLink = useCallback(async (linkData: LinkFormData) => {
    try {
      const result = await dispatch(createLink(linkData))
      if (createLink.fulfilled.match(result)) {
        return { success: true, link: result.payload, error: null }
      } else {
        return { success: false, link: null, error: result.payload }
      }
    } catch (error: any) {
      return { success: false, link: null, error: error.message }
    }
  }, [dispatch])

  const handleUpdateLink = useCallback(async (id: string, linkData: Partial<LinkFormData>) => {
    try {
      const result = await dispatch(updateLink({ id, linkData }))
      if (updateLink.fulfilled.match(result)) {
        return { success: true, link: result.payload, error: null }
      } else {
        return { success: false, link: null, error: result.payload }
      }
    } catch (error: any) {
      return { success: false, link: null, error: error.message }
    }
  }, [dispatch])

  const handleDeleteLink = useCallback(async (linkId: string) => {
    try {
      const result = await dispatch(deleteLink(linkId))
      if (deleteLink.fulfilled.match(result)) {
        return { success: true, error: null }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const handleFetchLinkById = useCallback(async (linkId: string) => {
    try {
      const result = await dispatch(fetchLinkById(linkId))
      if (fetchLinkById.fulfilled.match(result)) {
        return { success: true, link: result.payload, error: null }
      } else {
        return { success: false, link: null, error: result.payload }
      }
    } catch (error: any) {
      return { success: false, link: null, error: error.message }
    }
  }, [dispatch])

  const handleTogglePinLink = useCallback(async (linkId: string) => {
    try {
      const result = await dispatch(togglePinLink(linkId))
      if (togglePinLink.fulfilled.match(result)) {
        return { success: true, link: result.payload, error: null }
      } else {
        return { success: false, link: null, error: result.payload }
      }
    } catch (error: any) {
      return { success: false, link: null, error: error.message }
    }
  }, [dispatch])

  const setCurrentLinkById = useCallback((linkId: string | null) => {
    const link = linkId ? links.find(l => l.id === linkId) : null
    dispatch(setCurrentLink(link || null))
  }, [dispatch, links])

  const clearLinksState = useCallback(() => {
    dispatch(clearLinks())
  }, [dispatch])

  const clearLinksError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const getLinkById = useCallback((linkId: string) => {
    return links.find(link => link.id === linkId) || null
  }, [links])

  // Selector hooks for computed values
  const pinnedLinks = useAppSelector(selectPinnedLinks)
  const unpinnedLinks = useAppSelector(selectUnpinnedLinks)
  const linksCount = useAppSelector(selectLinksCount)
  const pinnedLinksCount = useAppSelector(selectPinnedLinksCount)

  const getLinksByFolder = useCallback((folderId: string) => {
    return useAppSelector(state => selectLinksByFolder(state, folderId))
  }, [])

  return {
    // State
    links,
    loading,
    error,
    currentLink,
    pinnedLinks,
    unpinnedLinks,
    linksCount,
    pinnedLinksCount,
    
    // Actions
    fetchLinks: handleFetchLinks,
    createLink: handleCreateLink,
    updateLink: handleUpdateLink,
    deleteLink: handleDeleteLink,
    fetchLinkById: handleFetchLinkById,
    togglePin: handleTogglePinLink,
    
    // Utilities
    setCurrentLink: setCurrentLinkById,
    clearLinks: clearLinksState,
    clearError: clearLinksError,
    getLinkById,
    getLinksByFolder,
    
    // Computed values
    hasLinks: links.length > 0,
  }
}
