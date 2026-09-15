import { getCategories } from "@/services/categoryService";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-blush-900">Categories</h1>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
