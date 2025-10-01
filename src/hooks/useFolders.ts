import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './useRedux'
import { 
  fetchFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  fetchFolderById,
  clearError,
  setCurrentFolder,
  clearFolders,
  selectAllFolders,
  selectFoldersLoading,
  selectFoldersError,
  selectCurrentFolder
} from '../store/slices/foldersSlice'

export const useFolders = () => {
  const dispatch = useAppDispatch()
  const folders = useAppSelector(selectAllFolders)
  const loading = useAppSelector(selectFoldersLoading)
  const error = useAppSelector(selectFoldersError)
  const currentFolder = useAppSelector(selectCurrentFolder)

  const handleFetchFolders = useCallback(async () => {
    try {
      const result = await dispatch(fetchFolders())
      return { success: fetchFolders.fulfilled.match(result), error: null }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const handleCreateFolder = useCallback(async (folderData: { name: string; color?: string }) => {
    try {
      const result = await dispatch(createFolder(folderData))
      if (createFolder.fulfilled.match(result)) {
        return { success: true, folder: result.payload, error: null }
      } else {
        return { success: false, folder: null, error: result.payload }
      }
    } catch (error: any) {
      return { success: false, folder: null, error: error.message }
    }
  }, [dispatch])

  const handleUpdateFolder = useCallback(async (id: string, folderData: { name: string; color?: string }) => {
    try {
      const result = await dispatch(updateFolder({ id, folderData }))
      if (updateFolder.fulfilled.match(result)) {
        return { success: true, folder: result.payload, error: null }
      } else {
        return { success: false, folder: null, error: result.payload }
      }
    } catch (error: any) {
      return { success: false, folder: null, error: error.message }
    }
  }, [dispatch])

  const handleDeleteFolder = useCallback(async (folderId: string) => {
    try {
      const result = await dispatch(deleteFolder(folderId))
      if (deleteFolder.fulfilled.match(result)) {
        return { success: true, error: null }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const handleFetchFolderById = useCallback(async (folderId: string) => {
    try {
      const result = await dispatch(fetchFolderById(folderId))
      if (fetchFolderById.fulfilled.match(result)) {
        return { success: true, folder: result.payload, error: null }
      } else {
        return { success: false, folder: null, error: result.payload }
      }
    } catch (error: any) {
      return { success: false, folder: null, error: error.message }
    }
  }, [dispatch])

  const setCurrentFolderById = useCallback((folderId: string | null) => {
    if (folderId === null) {
      dispatch(setCurrentFolder(null))
    } else {
      const folder = folders.find(f => f.id === folderId)
      if (folder) {
        dispatch(setCurrentFolder(folder))
      }
    }
  }, [dispatch, folders])

  const clearFoldersState = useCallback(() => {
    dispatch(clearFolders())
  }, [dispatch])

  const clearFoldersError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const getFolderById = useCallback((folderId: string) => {
    return folders.find(folder => folder.id === folderId) || null
  }, [folders])

  return {
    // State
    folders,
    loading,
    error,
    currentFolder,
    
    // Actions
    fetchFolders: handleFetchFolders,
    createFolder: handleCreateFolder,
    updateFolder: handleUpdateFolder,
    deleteFolder: handleDeleteFolder,
    fetchFolderById: handleFetchFolderById,
    
    // Utilities
    setCurrentFolder: setCurrentFolderById,
    clearFolders: clearFoldersState,
    clearError: clearFoldersError,
    getFolderById,
    
    // Computed values
    foldersCount: folders.length,
    hasFolders: folders.length > 0,
  }
}
