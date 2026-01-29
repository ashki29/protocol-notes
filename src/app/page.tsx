import { getCategories } from '@/lib/actions/categories'
import { logout } from '@/lib/actions/auth'
import CategoryList from '@/components/CategoryList'

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Protocol Notes</h1>
        <form action={logout}>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </form>
      </div>

      <CategoryList categories={categories} />
    </main>
  )
}
