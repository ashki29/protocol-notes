'use client'

import { useEffect, useState } from 'react'
import CategoryList from '@/components/CategoryList'
import {
  createCategory,
  deleteCategory,
  getCategories,
  renameCategory,
  type Category,
} from '@/lib/storage/local'

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => {
        if (!active) return
        setCategories(data)
        setLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Failed to load categories')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function handleCreate(name: string) {
    try {
      const category = await createCategory(name)
      setCategories((prev) =>
        [...prev, category].sort((a, b) => a.created_at.localeCompare(b.created_at))
      )
      return {}
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to create category' }
    }
  }

  async function handleRename(categoryId: string, newName: string) {
    try {
      const updated = await renameCategory(categoryId, newName)
      setCategories((prev) =>
        prev.map((category) => (category.id === categoryId ? updated : category))
      )
      return {}
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to rename category' }
    }
  }

  async function handleDelete(categoryId: string) {
    try {
      await deleteCategory(categoryId)
      setCategories((prev) => prev.filter((category) => category.id !== categoryId))
      return {}
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete category' }
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Protocol Notes</h1>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      ) : (
        <CategoryList
          categories={categories}
          onCreate={handleCreate}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}
    </main>
  )
}
