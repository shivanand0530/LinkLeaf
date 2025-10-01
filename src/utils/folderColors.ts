/**
 * Utility functions for folder colors
 */

export const FOLDER_COLORS = [
  "#ffffff",
  "#3b82f6", 
  "#1aeb66ff",
  "#ff0000ff",
  "#5c01fbff",
  "#fbff00ff",
  "#81e5f6ff",
  "#bf00ffff",
  "#ff6a00ff",
  "#ff0080ff",
  "#81efcbff",
];

/**
 * Generate a consistent color for a folder based on its ID
 * @param folderId - The unique folder ID
 * @returns A color hex string
 */
export function getFolderColor(folderId: string): string {
  // Create a simple hash from the folder ID
  let hash = 0;
  for (let i = 0; i < folderId.length; i++) {
    const char = folderId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color from our palette
  const colorIndex = Math.abs(hash) % FOLDER_COLORS.length;
  return FOLDER_COLORS[colorIndex];
}

/**
 * Get a random color from the folder palette
 * @returns A random color hex string
 */
export function getRandomFolderColor(): string {
  const randomIndex = Math.floor(Math.random() * FOLDER_COLORS.length);
  return FOLDER_COLORS[randomIndex];
}