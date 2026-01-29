'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getNote(categoryId: string) {
  const supabase = await createClient()

  const { data: note, error } = await supabase
    .from('notes')
    .select('*')
    .eq('category_id', categoryId)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching note:', error)
    }
    return null
  }

  return note
}

export async function saveNote(categoryId: string, content: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notes')
    .upsert(
      { category_id: categoryId, content, updated_at: new Date().toISOString() },
      { onConflict: 'category_id' }
    )

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/category/${categoryId}`)
  return { success: true }
}
