import { useEffect, useState } from "react";
import styles from "./AddClassForm.module.css";
import { useUserStore } from "../../store";
import ICategory from "../../interfaces/ICategory";
import axios, { AxiosError } from "axios";
import { DashboardSections } from "../../enums/dashboardSections";

const AddClassForm = ({
  setActiveComponent,
}: {
  setActiveComponent: (e: DashboardSections) => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { user } = useUserStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "TBA",
    price: 0,
    discount: 0,
    teacher: user?._id,
    category: "",
    thumbnail: "",
    demo: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/category/get-all`);
        setCategories(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [backend]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("teacher", formData.teacher || "");
      formDataToSend.append("category", formData.category);

      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }
      if (formData.demo) {
        formDataToSend.append("demo", formData.demo);
      }

      const res = await axios.post(`${backend}/class/create`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 201) {
        setActiveComponent(DashboardSections.MyClasses);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h1 className={styles.formTitle}>Add Class</h1>
        <label className={styles.formLabel}>
          Title
          <input
            className={styles.formInput}
            type="text"
            name="title"
            placeholder="Class Title"
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.formLabel}>
          Description
          <textarea
            className={`${styles.formInput} ${styles.textarea}`}
            name="description"
            placeholder="Class Description"
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <label className={styles.formLabel}>
          Duration
          <input
            className={styles.formInput}
            type="text"
            name="duration"
            placeholder="Class Duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.formLabel}>
          Price
          <input
            className={styles.formInput}
            type="number"
            name="price"
            placeholder="Class Price"
            onChange={handleChange}
            value={formData.price}
            required
          />
        </label>

        <label className={styles.formLabel}>
          Discount
          <input
            className={styles.formInput}
            type="number"
            name="discount"
            placeholder="Class Discount"
            onChange={handleChange}
            value={formData.discount}
            required
          />
        </label>

        <label className={styles.formLabel}>
          Category
          <select
            name="category"
            onChange={handleChange}
            required
            className={`${styles.formInput} ${styles.select}`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option
                className={styles.selectOption}
                key={category._id}
                value={category._id}
              >
                {category.title}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.formLabel}>
          Thumbnail
          <input
            className={styles.formInput}
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>

        <label className={styles.formLabel}>
          Demo
          <input
            className={styles.formInput}
            type="file"
            name="demo"
            accept="video/*"
            onChange={handleFileChange}
          />
        </label>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Class"}
        </button>
      </form>
    </div>
  );
};

export default AddClassForm;
