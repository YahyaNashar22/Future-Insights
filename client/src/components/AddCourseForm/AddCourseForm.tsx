import { useEffect, useState } from "react";
import styles from "./AddCourseForm.module.css";
import { useUserStore } from "../../store";
import ICategory from "../../interfaces/ICategory";
import axios from "axios";

const AddCourseForm = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: 0,
    teacher: user?._id,
    category: "",
    thumbnail: "",
    demo: "",
    videos: [],
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "videos" ? [...prev.videos, ...Array.from(files)] : files[0],
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

      // Append multiple videos (content)
      formData.videos.forEach((file) => formDataToSend.append("videos", file));

      const res = await axios.post(`${backend}/course/create`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("submitting: ", formData);
      console.log("response: ", res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h1 className={styles.formTitle}>Add Course</h1>
        <label className={styles.formLabel}>
          Title
          <input
            className={styles.formInput}
            type="text"
            name="title"
            placeholder="Course Title"
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.formLabel}>
          Description
          <textarea
            className={styles.formInput}
            name="description"
            placeholder="Course Description"
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <label className={styles.formLabel}>
          Price
          <input
            className={styles.formInput}
            type="number"
            name="price"
            placeholder="Course Price"
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.formLabel}>
          Category
          <select name="category" onChange={handleChange} required>
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

        <label className={styles.formLabel}>
          Videos
          <input
            className={styles.formInput}
            type="file"
            name="videos"
            accept="video/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Course"}
        </button>
      </form>
    </main>
  );
};

export default AddCourseForm;
