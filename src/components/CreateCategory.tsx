'use client'

import { useState } from 'react'

interface CreateCategoryProps {
  onCreate: (name: string) => Promise<{ error?: string }>
}

export default function CreateCategory({ onCreate }: CreateCategoryProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!name.trim()) return

    setLoading(true)
    const result = await onCreate(name)
    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      setName('')
      setIsCreating(false)
    }
  }

  if (!isCreating) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        + Add Category
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleCreate()
          if (e.key === 'Escape') {
            setName('')
            setIsCreating(false)
          }
        }}
        placeholder="Category name"
        autoFocus
        className="flex-1 px-2 py-1 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
        disabled={loading}
      />
      <button
        onClick={handleCreate}
        disabled={loading || !name.trim()}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Create
      </button>
      <button
        onClick={() => {
          setName('')
          setIsCreating(false)
        }}
        disabled={loading}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
      >
        Cancel
      </button>
    </div>
  )
}
