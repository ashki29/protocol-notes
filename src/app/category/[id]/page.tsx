import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategory } from '@/lib/actions/categories'
import { getNote } from '@/lib/actions/notes'
import NoteEditor from '@/components/NoteEditor'

interface CategoryPageProps {
  params: Promise<{ id: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params
  const category = await getCategory(id)

  if (!category) {
    notFound()
  }

  const note = await getNote(id)

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

      <h1 className="text-2xl font-bold mb-6">{category.name}</h1>

      <NoteEditor categoryId={id} initialContent={note?.content ?? ''} />
    </main>
  )
}
