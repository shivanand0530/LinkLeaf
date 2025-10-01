export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      links: {
        Row: {
          id: string
          user_id: string
          url: string
          title: string
          description: string | null
          folder_id: string | null
          is_pinned: boolean
          created_at: string
          updated_at: string
          favicon_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          title: string
          description?: string | null
          folder_id?: string | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
          favicon_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          title?: string
          description?: string | null
          folder_id?: string | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
          favicon_url?: string | null
        }
        Delete: {
          id: string
          user_id: string
          url: string
          title: string
          description: string | null
          folder_id: string | null
          created_at: string
          updated_at: string
          favicon_url: string | null
        }
      }
      folders: {
        Row: {
          _id: string
          id: string
          user_id: string
          name: string
          color?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Delete: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}