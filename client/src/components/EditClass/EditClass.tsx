import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import { useUserStore } from "../../store";
import styles from "./EditClass.module.css";
import IClass from "../../interfaces/IClass";

const EditClass = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  //   const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<IClass | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch course data for editing
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/class/get-class/${slug}`);
        if (!res.data.payload) {
          navigate("*");
        }
        setCourse(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, backend, navigate]);

  // Handle form submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Get course info values
    const form = event.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const duration = (form.elements.namedItem("duration") as HTMLInputElement)
      .value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const discount = (form.elements.namedItem("discount") as HTMLInputElement)
      .value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("price", price);
    formData.append("discount", discount);

    const thumbnailInput = form.elements.namedItem(
      "thumbnail"
    ) as HTMLInputElement;
    const thumbnailFile = thumbnailInput?.files?.[0];

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${backend}/class/update-class/${slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        navigate(`/dashboard`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Edit Class</h1>
          <form onSubmit={handleSubmit}>
            <label className={styles.labelForm}>
              Title:
              <input
                className={styles.inputForm}
                type="text"
                name="title"
                defaultValue={course?.title || ""}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Description:
              <textarea
                className={styles.textarea}
                name="description"
                defaultValue={course?.description || ""}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Duration:
              <input
                className={styles.inputForm}
                type="text"
                name="duration"
                defaultValue={course?.duration || ""}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Price:
              <input
                className={styles.inputForm}
                type="number"
                name="price"
                defaultValue={course?.price || ""}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Discount:
              <input
                className={styles.inputForm}
                type="number"
                name="discount"
                defaultValue={course?.discount || ""}
                min="0"
                max="100"
              />
            </label>

            {/* Thumbnail  */}
            <label className={styles.labelForm} htmlFor="thumbnail">
              Class Thumbnail
            </label>
            <input
              className={styles.inputForm}
              type="file"
              name="thumbnail"
              accept="image/*"
            />

            <button className={styles.editFormBtn} type="submit">
              Update Class
            </button>
          </form>
        </div>
      )}
    </main>
  );
};

export default EditClass;
