'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Category } from '@/lib/storage/local'

interface CategoryItemProps {
  category: Category
  onRename: (categoryId: string, newName: string) => Promise<{ error?: string }>
  onDelete: (categoryId: string) => Promise<{ error?: string }>
}

export default function CategoryItem({ category, onRename, onDelete }: CategoryItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [loading, setLoading] = useState(false)

  async function handleRename() {
    if (name.trim() === category.name) {
      setIsEditing(false)
      return
    }

    setLoading(true)
    const result = await onRename(category.id, name)
    setLoading(false)

    if (result.error) {
      alert(result.error)
      setName(category.name)
    }
    setIsEditing(false)
  }

  async function handleDelete() {
    if (!confirm(`Delete "${category.name}" and its note?`)) return

    setLoading(true)
    const result = await onDelete(category.id)
    setLoading(false)

    if (result.error) {
      alert(result.error)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') {
              setName(category.name)
              setIsEditing(false)
            }
          }}
          autoFocus
          className="flex-1 px-2 py-1 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
          disabled={loading}
        />
        <button
          onClick={handleRename}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Save
        </button>
        <button
          onClick={() => {
            setName(category.name)
            setIsEditing(false)
          }}
          disabled={loading}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
      <Link href={`/category/${category.id}`} className="flex-1 font-medium">
        {category.name}
      </Link>
      <button
        onClick={() => setIsEditing(true)}
        disabled={loading}
        className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Rename
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-2 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        Delete
      </button>
    </div>
  )
}
