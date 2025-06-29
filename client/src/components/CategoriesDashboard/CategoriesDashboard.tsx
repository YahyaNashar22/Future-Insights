import styles from "./CategoriesDashboard.module.css";

import { useEffect, useState } from "react";

import CategoryForm from "./CategoryForm.tsx";
import CategoryItem from "./CategoryItem.tsx";
import ICategory from "../../interfaces/ICategory.ts";

const CategoriesDashboard = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );

  const fetchCategories = async () => {
    try {
      const res = await fetch(backend + "/category/get-all");
      const data = await res.json();
      setCategories(data.payload || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(backend + `/category/delete/${id}`, {
        method: "DELETE",
      });
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>Categories Dashboard</h1>
      <CategoryForm
        refresh={fetchCategories}
        category={editingCategory}
        clearEdit={() => setEditingCategory(null)}
      />
      <div className={styles.categoryList}>
        {categories.map((cat: ICategory) => (
          <CategoryItem
            key={cat._id}
            category={cat}
            onDelete={() => handleDelete(cat._id)}
            onEdit={() => setEditingCategory(cat)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesDashboard;
