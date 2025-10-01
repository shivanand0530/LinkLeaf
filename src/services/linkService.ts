import { 
  createLink, 
  updateLink as dbUpdateLink, 
  deleteLink as dbDeleteLink, 
  getLinks 
} from '../libs/links';
import { computeFavicon } from '../utils/favicon';
import type { Link } from '../libs/links';

export interface LinkFormData {
  url: string;
  title: string;
  description?: string;
  folder_id?: string | null;
  is_pinned?: boolean;
}

/**
 * Service for handling link operations with database integration
 */
export class LinkService {
  /**
   * Add a new link to the database
   */
  static async addLink(linkData: LinkFormData): Promise<Link> {
    try {
      // Generate favicon URL
      const favicon_url = computeFavicon(linkData.url);
      
      // Prepare link data for database
      const linkToCreate = {
        url: linkData.url,
        title: linkData.title,
        description: linkData.description || null,
        folder_id: linkData.folder_id || null,
        is_pinned: linkData.is_pinned || false,
        favicon_url
      };

      // Create link in database
      const newLink = await createLink(linkToCreate);
      
      return newLink;
    } catch (error) {
      console.error('Failed to add link:', error);
      throw new Error(`Failed to add link: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing link in the database
   */
  static async updateLink(id: string, linkData: Partial<LinkFormData>): Promise<Link> {
    try {
      const updateData: any = {};
      
      if (linkData.url !== undefined) {
        updateData.url = linkData.url;
        updateData.favicon_url = computeFavicon(linkData.url);
      }
      
      if (linkData.title !== undefined) {
        updateData.title = linkData.title;
      }
      
      if (linkData.description !== undefined) {
        updateData.description = linkData.description || null;
      }
      
      if (linkData.folder_id !== undefined) {
        updateData.folder_id = linkData.folder_id || null;
      }

      if (linkData.is_pinned !== undefined) {
        updateData.is_pinned = linkData.is_pinned;
      }

      const updatedLink = await dbUpdateLink(id, updateData);
      
      return updatedLink;
    } catch (error) {
      console.error('Failed to update link:', error);
      throw new Error(`Failed to update link: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a link from the database
   */
  static async deleteLink(id: string): Promise<void> {
    try {
      await dbDeleteLink(id);
    } catch (error) {
      console.error('Failed to delete link:', error);
      throw new Error(`Failed to delete link: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch all links from the database
   */
  static async getLinks(): Promise<Link[]> {
    try {
      const links = await getLinks();
      return links;
    } catch (error) {
      console.error('Failed to fetch links:', error);
      throw new Error(`Failed to fetch links: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a single link by ID
   */
  static async getLinkById(id: string): Promise<Link> {
    try {
      const links = await getLinks();
      const link = links.find(l => l.id === id);
      if (!link) {
        throw new Error('Link not found');
      }
      return link;
    } catch (error) {
      console.error('Failed to fetch link by ID:', error);
      throw new Error(`Failed to fetch link: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate link data before submission
   */
  static validateLinkData(linkData: LinkFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate URL
    if (!linkData.url || linkData.url.trim().length === 0) {
      errors.push('URL is required');
    } else {
      try {
        new URL(linkData.url);
      } catch {
        errors.push('Please enter a valid URL');
      }
    }

    // Validate title
    if (!linkData.title || linkData.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (linkData.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    // Validate description length
    if (linkData.description && linkData.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Extract title from URL (fallback when user doesn't provide title)
   */
  static extractTitleFromUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      
      // Remove 'www.' prefix if present
      const cleanHostname = hostname.replace(/^www\./, '');
      
      // Capitalize first letter
      return cleanHostname.charAt(0).toUpperCase() + cleanHostname.slice(1);
    } catch {
      return 'New Link';
    }
  }
}