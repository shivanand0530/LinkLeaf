import { supabase } from './supabase'
import type { Database } from '../libs/database.types'

export type Link = Database['public']['Tables']['links']['Row']
export type LinkInsert = Database['public']['Tables']['links']['Insert']
export type LinkUpdate = Database['public']['Tables']['links']['Update']
export type LinkDelete = Database['public']['Tables']['links']['Delete']

export type LinkInput = Omit<LinkInsert, 'id' | 'created_at' | 'updated_at'>

export async function createLink(link: Omit<LinkInput, 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  const { data, error } = await supabase
    .from('links')
    .insert([{ ...link, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateLink(id: string, link: Partial<LinkInput>) {
  const { data, error } = await supabase
    .from('links')
    .update(link)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteLink(id: string) {
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getLinks() {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getLinksByFolder(folderId: string) {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('folder_id', folderId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
