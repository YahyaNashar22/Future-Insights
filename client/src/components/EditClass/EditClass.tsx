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
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [showModuleForm, setShowModuleForm] = useState<boolean>(false);
  const [moduleName, setModuleName] = useState<string>("");

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
    const arabicTitle = (
      form.elements.namedItem("arabicTitle") as HTMLInputElement
    ).value;

    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const arabicDescription = (
      form.elements.namedItem("arabicDescription") as HTMLTextAreaElement
    ).value;

    const duration = (form.elements.namedItem("duration") as HTMLInputElement)
      .value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const discount = (form.elements.namedItem("discount") as HTMLInputElement)
      .value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("arabicTitle", arabicTitle);
    formData.append("arabicDescription", arabicDescription);
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

    const demoInput = form.elements.namedItem("demo") as HTMLInputElement;
    const demoFile = demoInput?.files?.[0];

    if (demoFile) {
      formData.append("demo", demoFile);
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

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${backend}/module/create`, {
        name: moduleName,
        classId: course?._id,
      });

      if (res.status === 201) {
        alert("Module created successfully!");
        setShowModuleForm(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create module.");
    } finally {
      setLoading(false);
    }
  };

  const showCertificate = async () => {
    try {
      setSubmitting(true);
      const res = await axios.put(
        `${backend}/class/show-class-certificate/${course?._id}`
      );

      if (res.data.payload) {
        setCourse(res.data.payload);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
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
              Arabic Title:
              <input
                className={styles.inputForm}
                type="text"
                name="arabicTitle"
                defaultValue={course?.arabicTitle || ""}
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
                rows={10}
              />
            </label>

            <label className={styles.labelForm}>
              Arabic Description:
              <textarea
                className={styles.textarea}
                name="arabicDescription"
                defaultValue={course?.arabicDescription || ""}
                required
                rows={10}
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
                defaultValue={course?.price || "0"}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Discount:
              <input
                className={styles.inputForm}
                type="number"
                name="discount"
                defaultValue={course?.discount || "0"}
                min="0"
                max="100"
                step="0.01"
                required
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

            {/* Demo  */}
            <label className={styles.labelForm} htmlFor="demo">
              Class Demo
            </label>
            <input className={styles.inputForm} type="file" name="demo" />

            <button
              type="button"
              className={styles.addModuleButton}
              onClick={() => setShowModuleForm(true)}
            >
              Add Module
            </button>

            <button
              type="button"
              className={styles.addModuleButton}
              onClick={showCertificate}
              disabled={submitting}
            >
              {course?.showCertificate
                ? "Hide Certificate"
                : "Show Certificate"}
            </button>

            <button className={styles.addModuleButton} type="submit">
              Update Class
            </button>
          </form>
        </div>
      )}

      {showModuleForm && (
        <div className={styles.moduleFormContainer}>
          <h2>Add New Module</h2>
          <form onSubmit={handleModuleSubmit}>
            <label>
              Module Name:
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Module"}
            </button>
            <button type="button">Cancel</button>
          </form>
        </div>
      )}
    </main>
  );
};

export default EditClass;
