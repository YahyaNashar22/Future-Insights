import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import { useUserStore } from "../../store";
import styles from "./EditClass.module.css";
import IClass from "../../interfaces/IClass";
import ICategory from "../../interfaces/ICategory";

const EditClass = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  //   const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<IClass | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [showModuleForm, setShowModuleForm] = useState<boolean>(false);
  const [moduleName, setModuleName] = useState<string>("");
  const [showCohortForm, setShowCohortForm] = useState<boolean>(false);
  const [cohortName, setCohortName] = useState<string>("");
  const [cohortDefault, setCohortDefault] = useState<boolean>(true);

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

    const category = (form.elements.namedItem("category") as HTMLInputElement)
      .value;
    const duration = (form.elements.namedItem("duration") as HTMLInputElement)
      .value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const discount = (form.elements.namedItem("discount") as HTMLInputElement)
      .value;

    const emailExcelInput = form.elements.namedItem(
      "emailExcel"
    ) as HTMLInputElement;
    const emailExcelFile = emailExcelInput?.files?.[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("arabicTitle", arabicTitle);
    formData.append("arabicDescription", arabicDescription);
    formData.append("category", category);
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

    if (emailExcelFile) {
      formData.append("emailExcel", emailExcelFile);
    }

    try {
      setLoading(true);
      const res = await axios.patch(
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
    if (moduleName === "") {
      alert("please provide a valid module name");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${backend}/module/create`, {
        name: moduleName,
        classId: course?._id,
      });

      if (res.status === 201) {
        alert("Module created successfully!");
        setModuleName("");
        setShowModuleForm(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create module.");
    } finally {
      setLoading(false);
    }
  };

  const handleCohortSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cohortName === "") {
      alert("please provide a valid cohort name");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${backend}/cohort/create`, {
        name: cohortName,
        classId: course?._id,
        isDefault: cohortDefault,
      });

      if (res.status === 201) {
        alert("Cohort created successfully!");
        setCohortName("");
        setShowCohortForm(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create cohort.");
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

  const toggleVisibility = async () => {
    try {
      setSubmitting(true);
      const res = await axios.put(
        `${backend}/class/toggle-visibility/${course?._id}`
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
              Category
              <select
                name="category"
                required
                className={`${styles.inputForm} ${styles.select}`}
              >
                <option value={course?.category._id}>
                  {course?.category.title}
                </option>
                {categories
                  .filter((cat) => cat._id !== course?.category._id)
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
              </select>
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
                defaultValue={course ? course.price : ""}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Discount:
              <input
                className={styles.inputForm}
                type="number"
                name="discount"
                defaultValue={course ? course.discount : ""}
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

            {/* Excel File Input for Emails */}
            <label className={styles.labelForm} htmlFor="emailExcel">
              Upload Excel with Emails:
            </label>
            <input
              className={styles.inputForm}
              type="file"
              name="emailExcel"
              accept=".xlsx, .xls"
            />

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
              onClick={() => setShowCohortForm(true)}
            >
              Add Cohort
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

            <button
              type="button"
              className={styles.addModuleButton}
              onClick={toggleVisibility}
              disabled={submitting}
            >
              {course?.visible ? "Hide Class" : "Show Class"}
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
            <button type="button" onClick={() => setShowModuleForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {showCohortForm && (
        <div className={styles.moduleFormContainer}>
          <h2>Add New Cohort</h2>
          <form onSubmit={handleCohortSubmit}>
            <label>
              Cohort Name:
              <input
                type="text"
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                required
              />
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: 500,
                marginTop: "12px",
                marginBottom: "12px",
              }}
            >
              Default:
              <span
                style={{
                  position: "relative",
                  width: "46px",
                  height: "24px",
                  display: "inline-block",
                }}
              >
                <input
                  type="checkbox"
                  checked={cohortDefault}
                  onChange={(e) => setCohortDefault(e.target.checked)}
                  style={{
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: cohortDefault ? "var(--primary-blue)" : "#ccc",
                    borderRadius: "24px",
                    transition: "0.25s",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    height: "18px",
                    width: "18px",
                    left: cohortDefault ? "25px" : "3px",
                    bottom: "3px",
                    background: "white",
                    borderRadius: "50%",
                    transition: "0.25s",
                  }}
                />
              </span>
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Cohort"}
            </button>
            <button type="button" onClick={() => setShowCohortForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </main>
  );
};

export default EditClass;
