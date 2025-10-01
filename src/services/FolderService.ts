import {
    createFolder,
    getFolderById,
    getFolders,
    updateFolder,
    deleteFolder,

 } from '../libs/Folders';

import type { Folder } from '../libs/Folders';

export interface FolderFormData {
    name: string;
    color?: string;
}
/**
 * Service for handling folder operations with database integration
 */
export class FolderService {
    /**
     * Add a new folder to the database
     */
    static async addFolder(folderData: FolderFormData): Promise<Folder> {
        try {
            // Prepare folder data for database
            const folderToCreate = {
                name: folderData.name,
                color: folderData.color,
            };
            const newFolder = await createFolder(folderToCreate);
            return newFolder;
        } catch (error) {
            console.error('Error adding folder:', error);
            throw new Error('Failed to add folder');
        }
    }
    /**
     * Update an existing folder in the database
     *  */

    static async updateFolder(id: string, folderData: Partial<FolderFormData>): Promise<Folder> {
        try {
            const updateData: any = {};
            if (folderData.name !== undefined) {
                updateData.name = folderData.name;
            }
            if (folderData.color !== undefined) {
                updateData.color = folderData.color;
            }
            const updatedFolder = await updateFolder(id, updateData);
            return updatedFolder;
        }
        catch (error) {
            console.error('Error updating folder:', error);
            throw new Error('Failed to update folder');
        }

    }
    /**
     * Delete a folder from the database
     */
    static async deleteFolder(id: string): Promise<void> {
        try {
            await deleteFolder(id);
        } catch (error) {
            console.error('Error deleting folder:', error);
            throw new Error('Failed to delete folder');
        }

    }
    /**
     * Fetch all folders from the database
     */
    static async getAllFolders(): Promise<Folder[]> {
        try {
            const folders = await getFolders();
            return folders;
        } catch (error) {
            console.error('Error fetching folders:', error);
            throw new Error('Failed to fetch folders');
        }
    }
    /**
     * Fetch a folder by its ID
     */
    static async getFolderById(id: string): Promise<Folder> {
        try {
            const folder = await getFolderById(id);
            return folder;
        } catch (error) {
            console.error('Error fetching folder by ID:', error);
            throw new Error('Failed to fetch folder');
        }
    }
}