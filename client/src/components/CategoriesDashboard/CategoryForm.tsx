import ICategory from "../../interfaces/ICategory";
import styles from "./CategoriesDashboard.module.css";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";

type CategoryFormProps = {
  refresh: () => void;
  category: ICategory | null;
  clearEdit: () => void;
};

type FormState = {
  title: string;
  description: string;
  arabicTitle: string;
  arabicDescription: string;
  image: File | null;
  [key: string]: string | File | null; // index signature to allow dynamic access
};

const CategoryForm = ({ refresh, category, clearEdit }: CategoryFormProps) => {
  const backend = import.meta.env.VITE_BACKEND;
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    arabicTitle: "",
    arabicDescription: "",
    image: null,
  });

  useEffect(() => {
    if (category) {
      setForm({
        title: category.title,
        description: category.description || "",
        arabicTitle: category.arabicTitle,
        arabicDescription: category.arabicDescription || "",
        image: null,
      });
    }
  }, [category]);

  const handleCancel = () => {
    clearEdit();
    setForm({
      title: "",
      description: "",
      arabicTitle: "",
      arabicDescription: "",
      image: null,
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key] as string | Blob);
    }

    try {
      const url = category
        ? `${backend}/category/update/${category._id}`
        : `${backend}/category/create`;

      const method = category ? "PATCH" : "POST";

      await fetch(url, {
        method,
        body: formData,
      });

      refresh();
      setForm({
        title: "",
        description: "",
        arabicTitle: "",
        arabicDescription: "",
        image: null,
      });
      clearEdit();
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <input
        name="arabicTitle"
        value={form.arabicTitle}
        onChange={handleChange}
        placeholder="Arabic Title"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <textarea
        name="arabicDescription"
        value={form.arabicDescription}
        onChange={handleChange}
        placeholder="Arabic Description"
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
      />
      <button type="submit">{category ? "Update" : "Create"} Category</button>
      {category && (
        <button type="button" onClick={handleCancel}>
          Cancel Edit
        </button>
      )}
    </form>
  );
};

export default CategoryForm;
