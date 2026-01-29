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
    // Note doesn't exist, create one
    if (error.code === 'PGRST116') {
      const { data: newNote, error: createError } = await supabase
        .from('notes')
        .insert({ category_id: categoryId, content: '' })
        .select()
        .single()

      if (createError) {
        console.error('Error creating note:', createError)
        return null
      }

      return newNote
    }

    console.error('Error fetching note:', error)
    return null
  }

  return note
}

export async function saveNote(categoryId: string, content: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notes')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('category_id', categoryId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/category/${categoryId}`)
  return { success: true }
}
