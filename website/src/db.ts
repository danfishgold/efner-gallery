import { createClient } from '@supabase/supabase-js'
import { env } from './env'

export const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
)

export async function submitArt(
  encodedPixels: string,
  name: string,
  artist: string,
): Promise<any[]> {
  const { data, error } = await supabase
    .from('arts')
    .insert({ pixels: encodedPixels, name, artist }, { returning: 'minimal' })
  if (error) {
    throw error
  }
  return data
}

export type DBArt = {
  id: string
  created_at: string
  pixels: string
  name: string
  artist: string
}

export type DBCurrentArt = {
  id: string
  regular_art_id: string
  new_art_id: string | null
}

export async function fetchAllArt(): Promise<DBArt[]> {
  const { data, error } = await supabase
    .from<DBArt>('arts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    throw error
  }
  return data
}

export async function fetchCurrentArt(): Promise<DBArt | null> {
  const { data, error } = await supabase
    .from<DBArt>('currently_displayed_art')
    .select('*')
    .single()

  if (error) {
    throw error
  }
  return data
}

export function onArtChanges(handler: () => void) {
  return supabase.from<DBArt>('arts').on('*', handler).subscribe()
}

export async function deleteArt(id: string) {
  const { error, ...data } = await supabase
    .from<DBArt>('arts')
    .delete()
    .eq('id', id)
  if (error) {
    throw error
  }
  return data
}

export async function signIn(email: string, password: string) {
  const { error, ...data } = await supabase.auth.signIn({ email, password })
  if (error) {
    throw error
  } else {
    return data
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export async function getSession() {
  const { data: session, error } = await supabase.auth.getSessionFromUrl()
  if (error) {
    throw error
  }
  return session
}
