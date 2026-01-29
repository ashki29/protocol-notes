'use client'

import CategoryItem from './CategoryItem'
import CreateCategory from './CreateCategory'
import type { Category } from '@/lib/storage/local'

interface CategoryListProps {
  categories: Category[]
  onCreate: (name: string) => Promise<{ error?: string }>
  onRename: (categoryId: string, newName: string) => Promise<{ error?: string }>
  onDelete: (categoryId: string) => Promise<{ error?: string }>
}

export default function CategoryList({ categories, onCreate, onRename, onDelete }: CategoryListProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
      </div>
      <CreateCategory onCreate={onCreate} />
    </div>
  )
}
