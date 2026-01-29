'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const DEFAULT_CATEGORIES = ['Exercise', 'Diet', 'Supplements', 'Mobility', 'Other']

export async function getCategories() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  // Auto-create defaults if no categories exist
  if (categories.length === 0) {
    await createDefaultCategories(user.id)
    const { data: newCategories } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
    return newCategories || []
  }

  return categories
}

async function createDefaultCategories(userId: string) {
  const supabase = await createClient()

  for (const name of DEFAULT_CATEGORIES) {
    const { data: category, error: catError } = await supabase
      .from('categories')
      .insert({ user_id: userId, name })
      .select()
      .single()

    if (catError) {
      console.error('Error creating default category:', catError)
      continue
    }

    // Create empty note for each category
    const { error: noteError } = await supabase
      .from('notes')
      .insert({ category_id: category.id, content: '' })

    if (noteError) {
      console.error('Error creating default note:', noteError)
    }
  }
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  if (!name?.trim()) return { error: 'Category name is required' }

  const { data: category, error } = await supabase
    .from('categories')
    .insert({ user_id: user.id, name: name.trim() })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Create empty note for the new category
  await supabase
    .from('notes')
    .insert({ category_id: category.id, content: '' })

  revalidatePath('/')
  return { success: true }
}

export async function renameCategory(categoryId: string, newName: string) {
  const supabase = await createClient()

  if (!newName?.trim()) return { error: 'Category name is required' }

  const { error } = await supabase
    .from('categories')
    .update({ name: newName.trim() })
    .eq('id', categoryId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function getCategory(categoryId: string) {
  const supabase = await createClient()

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single()

  if (error) {
    return null
  }

  return category
}
