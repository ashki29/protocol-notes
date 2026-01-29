'use client'

import { useState } from 'react'
import { saveNote } from '@/lib/actions/notes'

interface Note {
  id: string
  category_id: string
  content: string
  updated_at: string
}

interface NoteEditorProps {
  note: Note
  categoryId: string
}

export default function NoteEditor({ note, categoryId }: NoteEditorProps) {
  const [content, setContent] = useState(note.content)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    const result = await saveNote(categoryId, content)

    setSaving(false)

    if (result.error) {
      alert(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
      />
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {saved && (
          <span className="text-green-600 dark:text-green-400">Saved!</span>
        )}
      </div>
    </div>
  )
}
