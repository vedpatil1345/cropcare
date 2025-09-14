// File: app/community/categories/page.js
import CategoryList from '../../../../components/CategoryList'

export default function CategoriesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Community Categories</h1>
      <CategoryList />
    </div>
  )
}