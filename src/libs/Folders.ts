import { supabase } from './supabase'
import type { Database } from '../libs/database.types'

export type Folder = Database['public']['Tables']['folders']['Row']
export type FolderInsert = Database['public']['Tables']['folders']['Insert']
export type FolderUpdate = Database['public']['Tables']['folders']['Update']
export type FolderInput = Omit<FolderInsert, 'id' | 'created_at' | 'updated_at'>
export type FolderDelete = Database['public']['Tables']['folders']['Delete']

export async function createFolder(folder: Omit<FolderInput, 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const folderData = {
        name: folder.name,
        color: folder.color,
        user_id: user.id
    }
    
    const { data, error } = await supabase
        .from('folders')
        .insert([folderData])
        .select()
        .single()
    if (error) {
        throw error
    }
    
    return data
}

export async function getFolders() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export async function getFolderById(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
        .from('folders')
        .select()
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
    if (error) throw error
    return data
}

export async function updateFolder(id: string, updates: Partial<Folder>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
        .from('folders')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteFolder(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
    if (error) throw error
}