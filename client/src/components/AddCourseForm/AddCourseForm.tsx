import { useEffect, useState } from "react";
import styles from "./AddCourseForm.module.css";
import { useUserStore } from "../../store";
import ICategory from "../../interfaces/ICategory";
import axios from "axios";
import { DashboardSections } from "../../pages/Dashboard/Dashboard";

const AddCourseForm = ({
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
    duration: "",
    price: 0,
    discount: 0,
    teacher: user?._id,
    category: "",
    thumbnail: "",
    demo: "",
    videos: [{ title: "", file: null }],
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

  const handleVideoChange = (
    index: number,
    field: "title" | "file",
    value: string | File | null
  ) => {
    const updatedVideos = [...formData.videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      videos: updatedVideos,
    }));
  };

  const addVideoField = () => {
    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, { title: "", file: null }],
    }));
  };

  const removeVideoField = (index: number) => {
    const updatedVideos = formData.videos.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      videos: updatedVideos,
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
      formData.videos.forEach((video) => {
        if (video.file) {
          formDataToSend.append("videos", video.file);
          formDataToSend.append(`videoTitles`, video.title); // Sending titles in a separate array
        }
      });

      const res = await axios.post(`${backend}/course/create`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status == 201) {
        setActiveComponent(DashboardSections.MyCourses);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
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
            className={`${styles.formInput} ${styles.textarea}`}
            name="description"
            placeholder="Course Description"
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
            placeholder="Course Duration"
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
            placeholder="Course Price"
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.formLabel}>
          Discount
          <input
            className={styles.formInput}
            type="number"
            name="discount"
            placeholder="Course Discount"
            onChange={handleChange}
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

        <label className={styles.formLabel}>
          Course Videos
          {formData.videos.map((video, index) => (
            <div key={index} className={styles.videoInputGroup}>
              <input
                type="text"
                placeholder="Video Title"
                value={video.title}
                onChange={(e) =>
                  handleVideoChange(index, "title", e.target.value)
                }
                className={styles.formInput}
                required
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  handleVideoChange(index, "file", e.target.files?.[0] || null)
                }
                className={styles.formInput}
                required
              />
              {formData.videos.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeVideoField(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.addMoreBtn}
            onClick={addVideoField}
          >
            Add More Videos
          </button>
        </label>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;
