import CategoryItem from './CategoryItem'
import CreateCategory from './CreateCategory'

interface Category {
  id: string
  name: string
  created_at: string
}

interface CategoryListProps {
  categories: Category[]
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
      <CreateCategory />
    </div>
  )
}
