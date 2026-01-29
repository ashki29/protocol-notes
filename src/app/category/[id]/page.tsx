'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import NoteEditor from '@/components/NoteEditor'
import { getCategory, getNote, type Category } from '@/lib/storage/local'

export default function CategoryPage() {
  const params = useParams<{ id: string }>()
  const categoryId = params?.id
  const [category, setCategory] = useState<Category | null>(null)
  const [noteContent, setNoteContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categoryId) return
    let active = true
    const load = async () => {
      try {
        const found = await getCategory(categoryId)
        if (!active) return
        if (!found) {
          setCategory(null)
          setLoading(false)
          return
        }
        setCategory(found)
        const note = await getNote(categoryId)
        if (!active) return
        setNoteContent(note?.content ?? '')
        setLoading(false)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Failed to load category')
        setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [categoryId])

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm"
        >
          &larr; Back to categories
        </Link>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      ) : !category ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">Category not found.</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
          <NoteEditor key={categoryId} categoryId={categoryId} initialContent={noteContent} />
        </>
      )}
    </main>
  )
}
